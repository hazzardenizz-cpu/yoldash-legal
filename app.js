import { transportStatusLabel } from './src/features/transport/status.js';
import { normalizeSearch,matchesSearch } from './src/features/loads/search.js';
import { readStored } from './src/core/storage.js';
import { mapLimited } from './src/features/transport/dashboard.js';
import {distanceKm,sortBoardLoads} from './src/features/loads/board-sort.js';
// Only Super Admin maps need Leaflet; keep it out of the public startup graph.
let L=null;
let leafletLoading=null;
async function ensureLeaflet(){
  if(L) return L;
  if(!leafletLoading){
    leafletLoading=import('https://esm.sh/leaflet@1.9.4')
      .then(module=>{L=module.default;return L;})
      .catch(error=>{leafletLoading=null;throw error;});
  }
  return leafletLoading;
}
import { $, $$, esc, uuidLike } from './src/core/dom.js';
import { localeMap, canPostTypes, canOfferTypes } from './src/core/config.js';
import { state } from './src/core/state.js';
import { translations } from './src/i18n/translations.js';
import {
  signUpWithEmail,
  signInWithEmail,
  resendSignupVerification,
  sendPasswordReset,
  updatePassword,
  signOutLocal,
  onAuthStateChange
} from './src/features/auth/auth-service.js';
import {
  fetchOpenLoads,
  publishLoad,
  updateOwnLoad,
  deleteOwnLoad,
  subscribeToOpenLoads,
  unsubscribeFromOpenLoads,
  getCurrentCargoDailyQuota,
  searchCities
} from './src/features/loads/load-service.js';
import {
  getCurrentSession,
  getProfile,
  getBusinessProfile,
  updateBaseProfile,
  upsertBusinessProfile
} from './src/features/profile/profile-service.js';
import {
  getCargoOfferSnapshot,
  submitCargoOffer,
  getMyTransportCargo,
  setCargoOfferStatus,
  getMyShipmentRooms,
  getShipmentRoomForOffer,
  getShipmentMessages,
  sendShipmentText,
  subscribeToShipmentRoom,
  unsubscribeFromShipmentRoom
} from './src/features/transport/transport-service.js';
import {
  listDriverHubListings,
  upsertDriverHubListing,
  setDriverHubListingStatus,
  deleteDriverHubListing as removeDriverHubListing
} from './src/features/drivers/driver-service.js';
import {
  getPublicChatMessages,
  markPublicChatRead,
  sendPublicChatMessage,
  getPublicChatUnreadCount
} from './src/features/chat/chat-service.js';
import {
  listUserNotifications,
  getCargoNotificationPreference,setCargoNotificationMode,updateNotificationLocation,
  markUserNotificationRead,
  markAllUserNotificationsRead,
  subscribeToUserNotifications,
  unsubscribeFromUserNotifications
} from './src/features/notifications/notification-service.js';
import {
  isSuperAdmin,
  getSuperAdminUserMap
} from './src/features/admin/admin-service.js';
import { fetchFxRates } from './src/features/fx/fx-service.js';



function t(key){ return translations[state.lang]?.[key] ?? translations.en[key] ?? key; }
function toast(message, type='ok'){
  const node = document.createElement('div');
  node.className = `toast ${type}`;
  node.textContent = message;
  $('#toastWrap').appendChild(node);
  setTimeout(()=>node.remove(), 4200);
}
function humanError(error){
  const msg = String(error?.message || error || '').toLowerCase();
  if (!navigator.onLine || msg.includes('failed to fetch') || msg.includes('network')) return t('networkError');
  if (msg.includes('email not confirmed')) return t('verificationRequired');
  if (msg.includes('invalid login credentials')) return state.lang==='fa'?'ایمیل یا رمز عبور صحیح نیست.':state.lang==='tr'?'E-posta veya şifre hatalı.':'Incorrect email or password.';
  if (msg.includes('user already registered')) return state.lang==='fa'?'این ایمیل قبلاً ثبت شده است. وارد حساب شوید.':state.lang==='tr'?'Bu e-posta zaten kayıtlı. Giriş yapın.':'This email is already registered. Please sign in.';
  if (msg.includes('rate limit') || msg.includes('email rate limit')) return state.lang==='fa'?'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.':state.lang==='tr'?'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.':'Too many requests. Please try again shortly.';
  if (msg.includes('business profile name is required')) return t('profileNeeded');
  if (msg.includes('daily cargo') || msg.includes('quota')) return `${t('quota')}: ${error?.message || ''}`;
  if (msg.includes('invalid_listing_title')) return t('listingTitleError');
  if (msg.includes('invalid_listing_description')) return t('listingDescriptionError');
  if (msg.includes('invalid_city')) return t('listingCityError');
  if (msg.includes('invalid_contact_phone')) return t('listingPhoneError');
  if (msg.includes('account_inactive')) return t('accountInactive');
  if (msg.includes('login_required')) return t('loginRequired');
  if (msg.includes('row-level security') || msg.includes('permission denied') || msg.includes('not allowed')) return error?.message || t('unexpectedError');
  return error?.message || t('unexpectedError');
}
function initials(text='YD'){
  const parts = String(text).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'YD';
  return parts.slice(0,2).map(v=>v[0]).join('').toUpperCase();
}
function dateLabel(value){
  if (!value) return '—';
  try { return new Intl.DateTimeFormat(localeMap[state.lang], {dateStyle:'medium', timeStyle:'short'}).format(new Date(value)); }
  catch { return String(value); }
}
function relativeLabel(value){
  if (!value) return '—';
  const delta = Math.round((new Date(value).getTime()-Date.now())/60000);
  const rtf = new Intl.RelativeTimeFormat(localeMap[state.lang], {numeric:'auto'});
  if (Math.abs(delta) < 60) return rtf.format(delta, 'minute');
  const h = Math.round(delta/60); if (Math.abs(h)<24) return rtf.format(h,'hour');
  return rtf.format(Math.round(h/24),'day');
}
function truckKey(value){
  return ({CURTAIN:'curtain',FLATBED:'flatbed',TANKER:'tanker',REFRIGERATED:'reefer',LIGHT_TRUCK:'lightTruck'})[String(value||'').toUpperCase()] || null;
}
function cityName(row,prefix){
  const localized = row?.[`${prefix}_city_name_${state.lang}`];
  return localized || row?.[`${prefix}_city`] || '—';
}
function typeLabel(type){
  return ({DRIVER:'driver',CARGO_OWNER:'cargoOwner',TRANSPORT_COMPANY:'transportCompany',BROKER:'broker'})[type] ? t(({DRIVER:'driver',CARGO_OWNER:'cargoOwner',TRANSPORT_COMPANY:'transportCompany',BROKER:'broker'})[type]) : (type || '—');
}
function businessPrimaryLabel(type){
  if (type==='DRIVER') return t('licenseNumber');
  if (type==='TRANSPORT_COMPANY') return t('companyName');
  return t('organizationName');
}
function businessSecondaryLabel(type){ return type==='TRANSPORT_COMPANY' ? `${t('registrationNumber')} · ${t('optional')}` : t('optional'); }

function applyLanguage(next, persist=true){
  state.lang = ['fa','tr','en'].includes(next) ? next : 'fa';
  if(persist){
    try{localStorage.setItem('yoldash_lang',state.lang);}catch(_){}
    const languageUrl=new URL(location.href);
    if(languageUrl.searchParams.has('lang')){languageUrl.searchParams.set('lang',state.lang);history.replaceState(history.state,'',languageUrl);}
  }
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  document.dispatchEvent(new CustomEvent('yoldash:language-change'));
  $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $$('.lang-switch button').forEach(b=>{
    b.classList.toggle('active',b.dataset.lang===state.lang);
    b.setAttribute('aria-pressed',String(b.dataset.lang===state.lang));
  });
  $('#mobileMenu')?.setAttribute('aria-label',t('menuLabel'));
  $('#themeToggle')?.setAttribute('aria-label',t('themeLabel'));
  $('#notificationBtn')?.setAttribute('aria-label',t('notifications'));
  $('#refreshFx')?.setAttribute('aria-label',t('refresh'));
  $$('.close[data-close]').forEach(button=>button.setAttribute('aria-label',t('closeDialog')));
  $$('dialog').forEach(dialog=>{
    const heading=dialog.querySelector('h2,h1');
    if(heading){if(!heading.id) heading.id=dialog.id+'Title';dialog.setAttribute('aria-labelledby',heading.id);}
  });
  $('#globalSearch')?.setAttribute('aria-label',t('searchLoads'));
  $('#chatInput')?.setAttribute('aria-label',t('message'));$('#sendChat')?.setAttribute('aria-label',t('sendChatMessage'));
  $('#loadSearch')?.setAttribute('aria-label',t('searchLoads'));
  renderLoads();
  renderProfileUI();
  renderFxRates();
  renderDriverHub();
  if(state.isSuperAdmin && state.adminMapRows?.length) renderAdminUserMap(state.adminMapRows);
  syncDriverListingSegments?.();
  if (state.session) renderChatFromCache?.();
}
function page(name, updateHistory=true){
  if(!document.getElementById('page-'+name))name='home';

  // Chat is available only after sign-in.  Opening the sign-in dialog here gives
  // guest users a clear next step instead of displaying an inactive chat screen.
  if(name==='chat' && !state.session){
    $('#authModal')?.showModal();
    return;
  }

  const target=$('#page-'+name);
  if(updateHistory){
    const url=new URL(location.href);
    if(name==='home') url.searchParams.delete('page');
    else url.searchParams.set('page',name);
    if(url.href!==location.href) history.pushState({page:name},'',url);
  }


  $$('.page').forEach(p=>{
    const active=p===target;
    p.classList.toggle('active',active);
    p.hidden=!active;
    p.style.display=active?'grid':'none';
  });

  $$('[data-page]').forEach(b=>{
    const active=b.dataset.page===name;
    b.classList.toggle('active',active);
    if(active) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  if(updateHistory){const heading=target.querySelector('h1,h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}window.scrollTo({top:0,behavior:'instant'});}
  $('#mobileMenu')?.setAttribute('aria-expanded','false');

  const sidebar=$('.sidebar');
  if(window.matchMedia('(max-width: 900px)').matches && sidebar){
    sidebar.classList.remove('open');
    sidebar.style.display='none';
    sidebar.style.visibility='hidden';
    sidebar.style.opacity='0';
    sidebar.style.pointerEvents='none';
    sidebar.style.transform='';
  }else{
    sidebar?.classList.remove('open');
  }

  if(name==='shipments') loadShipments();
  if(name==='loads') markLoadBoardSeen();
  if(name==='home'||name==='loads') loadLoads();
  if(name==='chat') loadChat();
  if(name==='drivers') loadDriverHub();

  requestAnimationFrame(()=>{
    const main=$('.main');
    if(main){
      main.style.display='block';
      main.style.width='100%';
      main.style.maxWidth='100%';
      main.scrollIntoView({block:'start',inline:'nearest'});
    }else{
      window.scrollTo({top:0,left:0,behavior:'auto'});
    }
  });
}


function publicCargoUrl(id){
  return `${window.location.origin}/load/${encodeURIComponent(id)}`;
}
function shareCargoLabel(){
  return state.lang==='fa' ? 'اشتراک‌گذاری' : state.lang==='tr' ? 'Paylaş' : 'Share';
}
function shareCopiedMessage(){
  return state.lang==='fa' ? 'لینک بار کپی شد.' : state.lang==='tr' ? 'Yük bağlantısı kopyalandı.' : 'Load link copied.';
}
async function shareCargo(id){
  const cargo=state.loads.find(x=>x.id===id);
  const url=publicCargoUrl(id);
  const route=cargo ? `${cityName(cargo,'origin')} → ${cityName(cargo,'destination')}` : 'Yoldash';
  const title=`Yoldash · ${route}`;
  try{
    if(navigator.share){
      await navigator.share({title,text:route,url});
      window.yoldashTrack?.('share',{method:'web_share',content_type:'cargo',item_id:id});
      return;
    }
    await navigator.clipboard.writeText(url);
    window.yoldashTrack?.('share',{method:'copy_link',content_type:'cargo',item_id:id});
    toast(shareCopiedMessage(),'ok');
  }catch(err){
    if(err?.name!=='AbortError') {
      try{ await navigator.clipboard.writeText(url); toast(shareCopiedMessage(),'ok'); }catch{}
    }
  }
}

const ownLoadLabels={fa:{edit:"ویرایش بار",delete:"حذف بار",save:"ذخیره تغییرات",confirm:"آیا مطمئن هستید که می‌خواهید این آگهی را حذف کنید؟",done:"بار با موفقیت حذف شد.",saved:"بار ویرایش شد."},tr:{edit:"Yükü düzenle",delete:"Yükü sil",save:"Değişiklikleri kaydet",confirm:"Bu yük ilanını silmek istiyor musunuz?",done:"Yük silindi.",saved:"Yük güncellendi."},en:{edit:"Edit load",delete:"Delete load",save:"Save changes",confirm:"Delete this load listing?",done:"Load deleted.",saved:"Load updated."}};
function ownLoadText(key){return (ownLoadLabels[state.lang]||ownLoadLabels.fa)[key];}
let editingOwnLoadId=null;
function resetOwnLoadEditor(){
 editingOwnLoadId=null;
 $('#loadForm').reset();
 state.city={origin:null,destination:null};
 $('#publishLoadBtn').textContent=t('publishLoad');
}
function datetimeLocalValue(value){
 const date=new Date(value),offset=date.getTimezoneOffset()*60000;
 return Number.isFinite(date.getTime())?new Date(date.getTime()-offset).toISOString().slice(0,16):'';
}
function editOwnCargo(id){
 const c=state.loads.find(x=>x.id===id)||shipmentCargoCache.find(x=>x.id===id);
 if(!c||c.owner_id!==state.session?.user?.id||c.status!=='PUBLISHED')return;
 resetOwnLoadEditor();editingOwnLoadId=id;
 const mapping={originCountry:c.origin_country_code,originCity:c.origin_city,originCustoms:c.origin_customs,destinationCountry:c.destination_country_code,destinationCity:c.destination_city,destinationCustoms:c.destination_customs,cargoType:c.cargo_type,truckType:c.required_truck_type,truckCount:c.truck_count,weightKg:c.weight_kg,freightPrice:c.freight_price,currencyCode:c.currency_code,loadingAt:c.loading_at?datetimeLocalValue(c.loading_at):'',exitBorder:c.exit_border,cargoDescription:c.description,validityDays:c.validity_days};
 for(const [key,value] of Object.entries(mapping)){const field=document.getElementById(key);if(field&&value!=null)field.value=String(value);}
 $('#loadFormStatus').textContent='';
 $('#publishLoadBtn').textContent=ownLoadText('save');
 $('#loadModal').showModal();
}
async function removeOwnCargo(id){
 const c=state.loads.find(x=>x.id===id)||shipmentCargoCache.find(x=>x.id===id),uid=state.session?.user?.id;
 if(!c||c.owner_id!==uid||c.status!=='PUBLISHED'||!window.confirm(ownLoadText('confirm')))return;
 try{
 const {data,error}=await deleteOwnLoad(id,uid);
 if(error)throw error;
 if(!data?.length)throw new Error('This load cannot be deleted; it may have active transport requests.');
 state.loads=state.loads.filter(x=>x.id!==id);
 renderLoads();toast(ownLoadText('done'));await loadLoads();if($('#page-shipments').classList.contains('active'))await loadShipments();
 }catch(err){toast(humanError(err),'error');}
}
function cargoCard(c, shipment=false){
  const from = cityName(c,'origin');
  const to = cityName(c,'destination');
  const truckTranslationKey = truckKey(c.required_truck_type);
  const truck = truckTranslationKey ? t(truckTranslationKey) : (c.required_truck_type || '—');
  const kg = Number(c.weight_kg || 0);
  const weight = kg ? `${(kg/1000).toLocaleString(localeMap[state.lang],{maximumFractionDigits:2})} ${t('tons')}` : '—';
  const trucks = c.remaining_truck_count ?? c.truck_count ?? 1;
  const price = c.freight_price != null
    ? `${Number(c.freight_price).toLocaleString(localeMap[state.lang])} ${esc(c.currency_code||'')}`
    : '—';
  const owner = c.owner_display_name || 'Yoldash';
  const cargoType = c.cargo_type || '—';
  const published = relativeLabel(c.published_at || c.announced_at || c.created_at);
  const loading = c.loading_at ? dateLabel(c.loading_at) : '—';
  const own = state.session?.user?.id && state.session.user.id === c.owner_id;
  const international = c.origin_country_code && c.destination_country_code && c.origin_country_code !== c.destination_country_code;
  const scopeLabel = international ? t('international') : t('domestic');

  let primaryAction = '';
  if (!shipment && isFullProfileReady() && canOfferTypes.has(state.profile?.business_user_type) && !own) {
    primaryAction = `<button class="btn primary cargo-primary-action" data-offer="${esc(c.id)}">${t('requestTransport')}</button>`;
  } else if (own && c.status==='PUBLISHED') {
    primaryAction = `<button type="button" class="btn secondary" data-edit-own-load="${esc(c.id)}">${ownLoadText("edit")}</button><button type="button" class="btn secondary" data-delete-own-load="${esc(c.id)}">${ownLoadText("delete")}</button>`;
  }

  return `<article class="cargo-card marketplace-card" data-cargo-id="${esc(c.id)}">
    <div class="cargo-card-top">
      <div class="cargo-route-block">
        <div class="cargo-route-city">
          <span>${t('origin')}</span>
          <b>${esc(from)}</b>
          <small>${esc(c.origin_country_code||'—')}</small>
        </div>
        <div class="cargo-route-line">
          <span></span><i>→</i><span></span>
        </div>
        <div class="cargo-route-city">
          <span>${t('destination')}</span>
          <b>${esc(to)}</b>
          <small>${esc(c.destination_country_code||'—')}</small>
        </div>
      </div>
      <div class="cargo-card-badges">
        <span class="cargo-scope-pill">${esc(scopeLabel)}</span>
        ${!shipment&&$('#boardSort')?.value==='nearest'&&boardPosition?`<span class="cargo-scope-pill">${distanceKm(boardPosition,c)!=null?`${distanceKm(boardPosition,c).toLocaleString(localeMap[state.lang],{maximumFractionDigits:1})} ${t('kmAway')}`:t('distanceUnknown')}</span>`:''}
        <span class="status-pill">${esc(transportStatusLabel(c.status||'PUBLISHED',state.lang))}</span>
      </div>
    </div>

    <div class="cargo-card-core">
      <div class="cargo-core-item cargo-core-main"><span>${t('cargoType')}</span><b>${esc(cargoType)}</b></div>
      <div class="cargo-core-item"><span>${t('truckType')}</span><b>${esc(truck)}</b></div>
      <div class="cargo-core-item"><span>${t('weight')}</span><b>${esc(weight)}</b></div>
      <div class="cargo-core-item"><span>${t('trucks')}</span><b>${esc(trucks)}</b></div>
      <div class="cargo-core-item"><span>${t('loadingAt')}</span><b>${esc(loading)}</b></div>
      <div class="cargo-core-item cargo-price-item"><span>${t('price')}</span><b>${esc(price)}</b></div>
    </div>

    <div class="cargo-card-foot">
      <div class="cargo-publisher">
        <span class="cargo-publisher-avatar">${esc(initials(owner))}</span>
        <div><span>${t('owner')}</span><b>${esc(owner)}</b></div>
      </div>
      <div class="cargo-published-time"><span>◷</span><b>${esc(published)}</b></div>
      <div class="cargo-actions">
        ${primaryAction}
        <a class="btn secondary cargo-detail-action" href="/load/${encodeURIComponent(c.id)}" data-cargo-details="${esc(c.id)}">${t('details')} ↗</a>
        <button class="btn secondary cargo-share-btn" data-share-cargo="${esc(c.id)}" aria-label="${shareCargoLabel()}">↗</button>
      </div>
    </div>
  </article>`;
}
function cargoDetailValue(value){
  return value === null || value === undefined || value === '' ? '—' : esc(value);
}
function openCargoDetails(id){
  const cargo=state.loads.find(item=>item.id===id);
  const dialog=$('#cargoDetailsModal');
  const content=$('#cargoDetailsContent');
  if(!cargo || !dialog || !content) return;

  const from=cityName(cargo,'origin');
  const to=cityName(cargo,'destination');
  const truckKeyName=truckKey(cargo.required_truck_type);
  const truck=truckKeyName ? t(truckKeyName) : (cargo.required_truck_type||'—');
  const weight=Number(cargo.weight_kg||0)
    ? `${(Number(cargo.weight_kg)/1000).toLocaleString(localeMap[state.lang],{maximumFractionDigits:2})} ${t('tons')}`
    : '—';
  const trucks=cargo.remaining_truck_count ?? cargo.truck_count ?? '—';
  const price=cargo.freight_price != null
    ? `${Number(cargo.freight_price).toLocaleString(localeMap[state.lang])} ${cargo.currency_code||''}`.trim()
    : '—';
  const loading=cargo.loading_at ? dateLabel(cargo.loading_at) : '—';
  const customs=[cargo.origin_customs,cargo.destination_customs].filter(Boolean).join(' · ');
  const owner=cargo.owner_display_name||'Yoldash';
  const announced=relativeLabel(cargo.published_at||cargo.announced_at||cargo.created_at);
  const expires=cargo.expires_at ? dateLabel(cargo.expires_at) : '—';
  const contactPhone=String(cargo.contact_phone||cargo.owner_contact_phone||cargo.phone||'').trim();
  const whatsappPhone=String(cargo.whatsapp_phone||cargo.owner_whatsapp_phone||contactPhone).replace(/\D/g,'');
  const row=(label,value,accent=false)=>`<div class="cargo-detail-row"><span>${label}</span><b class="${accent?'accent':''}">${cargoDetailValue(value)}</b></div>`;
  const contactActions=contactPhone ? `<div class="cargo-detail-actions">
    <a class="btn secondary" href="tel:${esc(contactPhone)}">${t('call')}</a>
    ${whatsappPhone ? `<a class="btn primary" href="https://wa.me/${esc(whatsappPhone)}" target="_blank" rel="noopener noreferrer">${t('whatsappContact')}</a>` : ''}
  </div>` : '';

  content.innerHTML=`
    <section class="cargo-detail-card">
      <div class="cargo-detail-route">
        <div><span>${t('origin')}</span><b>${esc(from)}, ${cargoDetailValue(cargo.origin_country_code)}</b></div>
        <i>→</i>
        <div><span>${t('destination')}</span><b>${esc(to)}, ${cargoDetailValue(cargo.destination_country_code)}</b></div>
      </div>
      <div class="cargo-detail-status"><span>${esc(cargo.status||'PUBLISHED')}</span><small>◷ ${esc(announced)}</small></div>
      <div class="cargo-detail-rows">
        ${row(t('owner'),owner)}
        ${row(t('truckType'),truck,true)}
        ${row(t('truckCount'),trucks)}
        ${row(t('weight'),weight)}
        ${row(t('origin'),`${from}, ${cargo.origin_country_code||'—'}`)}
        ${cargo.origin_customs ? row(t('originCustoms'),cargo.origin_customs) : ''}
        ${cargo.exit_border ? row(t('exitBorder'),cargo.exit_border) : ''}
        ${row(t('destination'),`${to}, ${cargo.destination_country_code||'—'}`)}
        ${cargo.destination_customs ? row(t('destinationCustoms'),cargo.destination_customs) : ''}
        ${row(t('price'),price,true)}
        ${row(t('loadingAt'),loading)}
        ${row(t('validity'),expires)}
      </div>
      ${cargo.description ? `<div class="cargo-detail-description"><span>${t('description')}</span><p>${esc(cargo.description)}</p></div>` : ''}
      ${contactActions}
    </section>`;
  dialog.showModal();
}
function emptyBlock(titleKey, body='') { return `<div class="empty-inline"><b>${t(titleKey)}</b>${body?`<span>${esc(body)}</span>`:''}</div>`; }

const LOAD_BOARD_SEEN_PREFIX='yoldash_load_board_seen_v1';
function loadBoardSeenStorageKey(){
  return `${LOAD_BOARD_SEEN_PREFIX}:${state.session?.user?.id || 'guest'}`;
}
function loadPublishedAtMs(load){
  const value=load?.published_at || load?.created_at || '';
  const ms=Date.parse(value);
  return Number.isFinite(ms)?ms:0;
}
function getLoadBoardSeenAt(){
  const raw=Number(readStored(loadBoardSeenStorageKey(),'0'));
  return Number.isFinite(raw) && raw>0 ? raw : 0;
}
function isLoadBoardActive(){
  return $('#page-loads')?.classList.contains('active') === true;
}
function setLoadUnreadBadge(count){
  const badge=$('#loadCountBadge');
  if(!badge) return;
  const n=Math.max(0,Number(count)||0);
  badge.textContent=n>99?'99+':String(n);
  badge.style.display=n>0?'inline-flex':'none';
  badge.setAttribute('aria-label',n>0?`${n} new loads`:'No new loads');
}
function markLoadBoardSeen(){
  const newest=state.loads.reduce((max,load)=>Math.max(max,loadPublishedAtMs(load)),0);
  const seenAt=Math.max(Date.now(),newest);
  try{ localStorage.setItem(loadBoardSeenStorageKey(),String(seenAt)); }catch{}
  setLoadUnreadBadge(0);
}
function renderLoadUnreadBadge(){
  if(isLoadBoardActive()){
    markLoadBoardSeen();
    return;
  }
  const seenAt=getLoadBoardSeenAt();
  const unread=state.loads.reduce((count,load)=>count+(loadPublishedAtMs(load)>seenAt?1:0),0);
  setLoadUnreadBadge(unread);
}

let boardPosition=null;
let boardLocationRequest=0;
let boardLocationMessage='';
function requestBoardLocation(){
  const request=++boardLocationRequest;
  boardLocationMessage='locationLoading'; renderLoads();
  const fail=()=>{
    if(request!==boardLocationRequest) return;
    boardLocationMessage='locationUnavailable';
    if($('#boardSort').value==='nearest') $('#boardSort').value='latest';
    renderLoads();
  };
  if(!navigator.geolocation){fail();return;}
  navigator.geolocation.getCurrentPosition(result=>{
    if(request!==boardLocationRequest) return;
    boardPosition={latitude:result.coords.latitude,longitude:result.coords.longitude};
    boardLocationMessage='locationReady'; $('#boardSort').value='nearest'; renderLoads();
  },fail,{enableHighAccuracy:false,timeout:12000,maximumAge:60000});
}
let loadsLoading=true;
let loadsLoadError=false;
function renderLoads(){
  const more=$('#loadMoreCargo');if(more){more.hidden=!loadsHaveMore;if(more.parentElement)more.parentElement.hidden=!loadsHaveMore;more.textContent=t('loadMoreCargo');more.disabled=loadsLoading;}
  const q=normalizeSearch($('#loadSearch')?.value);
  const origin=$('#boardOrigin')?.value||'';
  const destination=$('#boardDestination')?.value||'';
  const truck=$('#boardTruck')?.value||'';
  const originCity=($('#boardOriginCity')?.value||'').trim().toLocaleLowerCase();
  const destinationCity=($('#boardDestinationCity')?.value||'').trim().toLocaleLowerCase();
  const count=Number($('#boardTruckCount')?.value||0);
  const mode=$('#boardSort')?.value||'latest';
  const currency=$('#boardCurrency')?.value||'';
  const cityMatches=(c,which,q)=>!q||[cityName(c,which),c[which+'_city'],c[which+'_city_name_fa'],c[which+'_city_name_tr'],c[which+'_city_name_en']].some(v=>normalizeSearch(v).includes(normalizeSearch(q)));
  const filtered = sortBoardLoads(state.loads.filter(c=>{
    if(!cityMatches(c,'origin',originCity)||!cityMatches(c,'destination',destinationCity)) return false;
    const available=Number(c.remaining_truck_count??c.truck_count??1);
    if(count && (count===5?available<5:available!==count)) return false;
    if(currency && c.currency_code!==currency) return false;
    if(origin && c.origin_country_code!==origin) return false;
    if(destination && c.destination_country_code!==destination) return false;
    if(truck && String(c.required_truck_type||'').toUpperCase()!==truck) return false;
    if(state.loadFilter==='international' && c.origin_country_code===c.destination_country_code) return false;
    if(state.loadFilter==='domestic' && c.origin_country_code!==c.destination_country_code) return false;
    if(!q) return true;
    return matchesSearch([
      cityName(c,'origin'),
      cityName(c,'destination'),
      c.cargo_type,
      c.required_truck_type,
      c.owner_display_name,
      c.origin_country_code,
      c.destination_country_code
    ],q);
  }),mode,boardPosition);
  const activeFilterCount=[origin,destination,truck,originCity,destinationCity,count,currency,mode!=='latest',state.loadFilter!=='all'].filter(Boolean).length;
  const filterCount=$('#boardFilterCount');
  if(filterCount){filterCount.hidden=!activeFilterCount;filterCount.textContent=String(activeFilterCount);}
  if($('#boardLocationStatus')) $('#boardLocationStatus').textContent=boardLocationMessage?t(boardLocationMessage):'';
  if($('#boardFilterHint')) $('#boardFilterHint').textContent=t(mode==='price'?'priceSortHint':mode==='nearest'?'distanceHint':'boardFilterHint');

  const internationalCount = state.loads.filter(c=>c.origin_country_code!==c.destination_country_code).length;
  const domesticCount = state.loads.length - internationalCount;
  const home = $('#cargoList');
  const all = $('#cargoListAll');

  const feedback=$('#boardDataStatus');if(feedback){feedback.hidden=!(loadsLoadError&&state.loads.length);feedback.textContent=t('staleCargoData');}
  const pending=loadsLoading&&!state.loads.length;
  const failed=loadsLoadError&&!state.loads.length;
  const loadFeedback=pending?`<div class="board-feedback" role="status"><span class="loading-card" aria-hidden="true"></span><p>${esc(t('loadsLoading'))}</p></div>`:failed?`<div class="board-feedback" role="status"><p>${esc(t('loadsLoadFailed'))}</p><button type="button" class="btn secondary" data-retry-loads>${esc(t('retryLoads'))}</button></div>`:null;
  if(home) home.innerHTML = loadFeedback || (state.loads.length
    ? state.loads.slice(0,3).map(c=>cargoCard(c)).join('')
    : emptyBlock('noLoads'));

  if(all) all.innerHTML = loadFeedback || (filtered.length
    ? filtered.map(c=>cargoCard(c)).join('')
    : emptyBlock(state.loads.length?'noMatchingLoads':'noLoads')+(state.loads.length?`<button type="button" class="btn secondary" data-clear-load-search>${esc(t('clearFilters'))}</button>`:''));

  renderLoadUnreadBadge();
  if($('#metricLoads')) $('#metricLoads').textContent = pending||failed?'—':String(state.loads.length);
  if($('#loadBoardTotal')) $('#loadBoardTotal').textContent = pending||failed?'—':String(state.loads.length);
  if($('#loadBoardInternational')) $('#loadBoardInternational').textContent = pending||failed?'—':String(internationalCount);
  if($('#loadBoardDomestic')) $('#loadBoardDomestic').textContent = pending||failed?'—':String(domesticCount);
  if($('#loadBoardResultCount')) $('#loadBoardResultCount').textContent = pending?t('loadsLoading'):failed?t('loadsLoadFailed'):`${filtered.length.toLocaleString(localeMap[state.lang])} / ${state.loads.length.toLocaleString(localeMap[state.lang])}`;

  bindCargoActions();
}
function bindCargoActions(){
  $$('[data-retry-loads]').forEach(btn=>btn.onclick=()=>loadLoads());
  $$('[data-clear-load-search]').forEach(btn=>btn.onclick=()=>$('#clearBoardFilters')?.click());
  $$('[data-offer]').forEach(btn=>btn.onclick=()=>openOffer(btn.dataset.offer));
  $$('[data-edit-own-load]').forEach(btn=>btn.onclick=()=>editOwnCargo(btn.dataset.editOwnLoad));
  $$('[data-delete-own-load]').forEach(btn=>btn.onclick=()=>removeOwnCargo(btn.dataset.deleteOwnLoad));
  $$('[data-cargo-details]').forEach(btn=>btn.onclick=event=>{
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||event.button!==0) return;
    event.preventDefault();
    const id=btn.dataset.cargoDetails;
    if(id) openCargoDetails(id);
  });
  $$('[data-share-cargo]').forEach(btn=>btn.onclick=()=>shareCargo(btn.dataset.shareCargo));
}
let loadFlight=null;
let loadsHaveMore=false;
const loadPageSize=50;
function loadLoads(query='',append=false){
  if(loadFlight)return loadFlight;
  loadsLoading=true;loadsLoadError=false;
  if(!state.loads.length)renderLoads();
  const more=$('#loadMoreCargo');if(more)more.disabled=true;
  loadFlight=(async()=>{
    try{
      let offset=append?state.loads.length:0,rows=[],hasMore=false;
      const target=append?loadPageSize:Math.max(loadPageSize,state.loads.length);
      do{
        const result=await fetchOpenLoads(query,loadPageSize,offset);
        if(result.error)throw result.error;
        const page=result.data||[];rows.push(...page);offset+=page.length;
        hasMore=page.length===loadPageSize;
      }while(!append&&hasMore&&rows.length<target);
      state.loads=[...new Map((append?[...state.loads,...rows]:rows).map(c=>[c.id,c])).values()];
      loadsHaveMore=hasMore;
    }catch(error){loadsLoadError=true;if(state.loads.length)toast(humanError(error),'error');}
    finally{loadsLoading=false;loadFlight=null;renderLoads();if(more)more.disabled=false;}
  })();
  return loadFlight;
}

function scheduleLoadRefresh(delay=500){
  clearTimeout(state.loadRefreshDebounce);
  state.loadRefreshDebounce=setTimeout(()=>loadLoads(),delay);
}
function startLiveLoads(){
  try{
    if(state.loadRealtimeChannel) unsubscribeFromOpenLoads(state.loadRealtimeChannel);
    state.loadRealtimeChannel=subscribeToOpenLoads(()=>scheduleLoadRefresh(350));
  }catch(err){
    console.warn('cargo realtime unavailable',err);
  }

  clearInterval(state.loadRefreshTimer);
  state.loadRefreshTimer=setInterval(()=>{
    if(document.visibilityState==='visible') loadLoads();
  },30000);

  if(!window.__yoldashLoadVisibilityBound){
    window.__yoldashLoadVisibilityBound=true;
    document.addEventListener('visibilitychange',()=>{
      if(document.visibilityState==='visible') loadLoads();
    });
  }
}

async function ensureSession(){
  try{
    const {data,error}=await getCurrentSession();
    if(error) throw error;
    const session=data?.session||null;
    if(session){
      const changed=!state.session || state.session.user?.id!==session.user?.id || state.session.access_token!==session.access_token;
      state.session=session;
      if(changed || !state.profile || state.profile.id!==session.user.id) await loadProfile();
      renderProfileUI();
      return session;
    }
    state.session=null;
    state.profile=null;
    state.businessProfile=null;
    renderProfileUI();
    return null;
  }catch(err){
    console.warn('ensureSession',err);
    return state.session||null;
  }
}

async function refreshSession(){
  const session=await ensureSession();
  if(session) loadUnread();
}
async function loadProfile(){
  if(!state.session) return;
  const uid=state.session.user.id;
  const {data,error}=await getProfile(uid);
  if(error){ console.error(error); return; }
  state.profile=data;
  state.businessProfile = await fetchBusinessProfile(data.business_user_type,uid);
  populateProfileEditor();
}
async function fetchBusinessProfile(type,uid){
  const {data,error}=await getBusinessProfile(type,uid);
  return error ? null : data;
}
function displayName(){
  const p=state.profile,b=state.businessProfile;
  if(!p) return state.session?.user?.email || t('guest');
  const personal=[p.first_name,p.last_name].filter(Boolean).join(' ').trim();
  if(personal) return personal;
  if(p.business_user_type==='TRANSPORT_COMPANY' && b?.company_name) return b.company_name;
  if(['CARGO_OWNER','BROKER'].includes(p.business_user_type) && b?.organization_name) return b.organization_name;
  if(p.business_user_type==='DRIVER' && p.driver_company_name) return p.driver_company_name;
  return p.email || state.session?.user?.email || 'Yoldash';
}
function basicProfileComplete(){
  const p=state.profile;
  return !!(p?.first_name?.trim() && p?.last_name?.trim() && p?.phone?.trim());
}
function showVerifyEmail(email){
  state.pendingSignupEmail=email||state.pendingSignupEmail||'';
  $('#authEntryPanel')?.classList.add('hidden');
  $('#verifyEmailPanel')?.classList.remove('hidden');
  if($('#verifyEmailAddress')) $('#verifyEmailAddress').textContent=state.pendingSignupEmail;
  if($('#verifyEmailStatus')) { $('#verifyEmailStatus').className='auth-status'; $('#verifyEmailStatus').textContent=''; }
}
function showAuthEntry(){
  $('#verifyEmailPanel')?.classList.add('hidden');
  $('#forgotPasswordPanel')?.classList.add('hidden');
  $('#authEntryPanel')?.classList.remove('hidden');
}
function showForgotPassword(){
  const email=$('#authEmail')?.value.trim()||'';
  $('#authEntryPanel')?.classList.add('hidden');
  $('#verifyEmailPanel')?.classList.add('hidden');
  $('#forgotPasswordPanel')?.classList.remove('hidden');
  if($('#forgotEmail')) $('#forgotEmail').value=email;
  if($('#forgotStatus')) { $('#forgotStatus').className='auth-status'; $('#forgotStatus').textContent=''; }
}
function renderProfileUI(){
  const logged=!!state.session;
  $('#loggedOutAuth')?.classList.toggle('hidden',logged);
  $('#loggedInAuth')?.classList.toggle('hidden',!logged);
  if(logged){
    showAuthEntry();
    const name=displayName();
    const fallbackEmail=state.profile?.email||state.session.user.email||'Yoldash';
    const visibleName=(name && name!=='Yoldash') ? name : fallbackEmail;
    $('#profileName').textContent=visibleName;
    $('#profileMeta').textContent=`${state.lang==='fa'?'وارد شده':state.lang==='tr'?'Giriş yapıldı':'Signed in'} · ${typeLabel(state.profile?.business_user_type)}`;
    $('#profileAvatar').textContent=initials(visibleName);
    if($('#profileModalAvatar')) $('#profileModalAvatar').textContent=initials(visibleName);
    if($('#profileModalName')) $('#profileModalName').textContent=visibleName;
    if($('#profileModalType')) $('#profileModalType').textContent=typeLabel(state.profile?.business_user_type);
    $('#authBtn')?.classList.add('is-signed-in');
    $('#authBtn')?.setAttribute('title', visibleName);
    const items=[
      [t('profile'),name], [t('email'),state.profile?.email||state.session.user.email||'—'],
      [t('businessType'),typeLabel(state.profile?.business_user_type)], [t('phone'),state.profile?.phone||'—']
    ];
    $('#profileGrid').innerHTML=items.map(([a,b])=>`<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('');
    $('#chatHint').textContent=t('publicChat');
    const basicDone=basicProfileComplete();
    $('#businessProfileFields')?.classList.toggle('hidden',!basicDone);
    if($('#profileStepHint')) $('#profileStepHint').textContent=basicDone?t('profileNeeded'):t('completeProfileHint');
    if($('#saveProfileBtn')) $('#saveProfileBtn').textContent=basicDone?t('saveProfile'):t('saveAndContinue');
  }else{
    $('#profileName').textContent=t('guest'); $('#profileMeta').textContent=t('login'); $('#profileAvatar').textContent='YD'; if($('#profileModalAvatar')) $('#profileModalAvatar').textContent='YD'; if($('#profileModalName')) $('#profileModalName').textContent='Yoldash'; if($('#profileModalType')) $('#profileModalType').textContent='—'; $('#authBtn')?.classList.remove('is-signed-in'); $('#authBtn')?.removeAttribute('title'); $('#chatHint').textContent=t('chatLoginHint');
  }
}
function populateProfileEditor(){
  const p=state.profile||{}, b=state.businessProfile||{}, type=p.business_user_type;
  $('#profileFirstName').value=p.first_name||''; $('#profileLastName').value=p.last_name||''; $('#profilePhone').value=p.phone||'';
  $('#profileCountry').value=b.country_code||'TR';
  $('#businessPrimaryLabel').textContent=businessPrimaryLabel(type); $('#businessSecondaryLabel').textContent=businessSecondaryLabel(type);
  $('#businessSecondaryLabelWrap').classList.toggle('hidden',type!=='TRANSPORT_COMPANY');
  $('#driverExtra').classList.toggle('hidden',type!=='DRIVER');
  if(type==='DRIVER') $('#businessPrimary').value=b.license_number||'';
  else if(type==='TRANSPORT_COMPANY'){ $('#businessPrimary').value=b.company_name||''; $('#businessSecondary').value=b.registration_number||''; }
  else $('#businessPrimary').value=b.organization_name||'';
  $('#driverWhatsapp').value=p.whatsapp_phone||''; $('#tractorPlate').value=p.tractor_transit_plate||''; $('#containerPlate').value=p.container_transit_plate||''; $('#driverCompany').value=p.driver_company_name||'';
}
async function saveProfile(){
  if(!state.session||!state.profile) return;
  const status=$('#profileStatus'); status.className='auth-status'; status.textContent=t('loading');
  const first=$('#profileFirstName').value.trim(), last=$('#profileLastName').value.trim(), phone=$('#profilePhone').value.trim();
  if(!first||!last||!phone){ status.className='auth-status error'; status.textContent=t('requiredFields'); return; }
  if(!/^\+[1-9]\d{7,14}$/.test(phone)){ status.className='auth-status error'; status.textContent=t('invalidPhone'); return; }
  const completingBasic=!basicProfileComplete();
  try{
    const uid=state.session.user.id, type=state.profile.business_user_type;
    const base={first_name:first,last_name:last,phone};

    if(completingBasic){
      const {error}=await updateBaseProfile(uid,base);
      if(error) throw error;
      await loadProfile(); renderProfileUI();
      status.className='auth-status ok'; status.textContent=t('profileSaved'); toast(t('profileSaved'));
      $('#businessProfileFields')?.classList.remove('hidden');
      $('#businessPrimary')?.focus();
      return;
    }

    const primary=$('#businessPrimary').value.trim(), secondary=$('#businessSecondary').value.trim(), country=$('#profileCountry').value;
    if(!primary){ status.className='auth-status error'; status.textContent=t('requiredFields'); return; }
    if(type==='DRIVER'){
      const whatsapp=$('#driverWhatsapp').value.trim(), tractor=$('#tractorPlate').value.trim().toUpperCase(), container=$('#containerPlate').value.trim().toUpperCase(), company=$('#driverCompany').value.trim();
      if(!/^\+[1-9]\d{7,14}$/.test(whatsapp)||!tractor||!container||!company){ throw new Error(t('requiredFields')); }
      Object.assign(base,{whatsapp_phone:whatsapp,tractor_transit_plate:tractor,container_transit_plate:container,driver_company_name:company});
    }
    let {error}=await updateBaseProfile(uid,base); if(error) throw error;
    const payloadMap={
      DRIVER:{user_id:uid,country_code:country,license_number:primary,license_country_code:country},
      CARGO_OWNER:{user_id:uid,country_code:country,organization_name:primary},
      TRANSPORT_COMPANY:{user_id:uid,company_name:primary,country_code:country,registration_number:secondary||null},
      BROKER:{user_id:uid,country_code:country,organization_name:primary}
    };
    ({error}=await upsertBusinessProfile(type,payloadMap[type])); if(error) throw error;
    await loadProfile(); renderProfileUI(); status.className='auth-status ok'; status.textContent=t('profileSaved'); toast(t('profileSaved')); if(isFullProfileReady()) setTimeout(()=>$('#authModal')?.close(),650);
  }catch(err){ status.className='auth-status error'; status.textContent=humanError(err); }
}

function setAuthMode(mode){
  state.authMode=mode;
  showAuthEntry();
  $$('[data-auth-mode]').forEach(b=>b.classList.toggle('active',b.dataset.authMode===mode));
  $('#accountTypeBlock').classList.toggle('hidden',mode!=='signup');
  $('#authSubmit').textContent=mode==='signup'?t('register'):t('signIn');
  if($('#authSubtitle')) $('#authSubtitle').textContent=mode==='signup'?t('createAccountTitle'):t('signInTitle');
  $('#authPassword').autocomplete=mode==='signup'?'new-password':'current-password';
  $('#forgotPassword')?.classList.toggle('hidden',mode==='signup');
  $('#authStatus').className='auth-status';
  $('#authStatus').textContent='';
  if(mode==='signin'){
    state.selectedBusinessType=null;
    $$('[data-business-type]').forEach(x=>x.classList.remove('active'));
  }
}
async function submitAuth(ev){
  ev.preventDefault();
  const email=$('#authEmail').value.trim().toLowerCase(), password=$('#authPassword').value;
  const status=$('#authStatus'), btn=$('#authSubmit');
  status.className='auth-status'; status.textContent=t('loading'); btn.disabled=true;
  try{
    if(!email || !email.includes('@')) throw new Error(t('email'));
    if(password.length<8) throw new Error(state.lang==='fa'?'رمز عبور باید حداقل ۸ کاراکتر باشد.':state.lang==='tr'?'Şifre en az 8 karakter olmalıdır.':'Password must be at least 8 characters.');

    if(state.authMode==='signup'){
      if(!state.selectedBusinessType) throw new Error(t('accountType'));
      const {data,error}=await signUpWithEmail({
        email,
        password,
        businessUserType: state.selectedBusinessType
      });
      if(error) throw error;
      window.yoldashTrack?.('sign_up',{method:'email',business_user_type:state.selectedBusinessType||'unknown'});
      state.pendingSignupEmail=email;
      if(data.session){
        state.session=data.session; await loadProfile(); renderProfileUI();
        status.className='auth-status ok'; status.textContent=t('authSuccess');
        if(!basicProfileComplete()) $('#authModal')?.showModal();
      }else{
        showVerifyEmail(email);
      }
    }else{
      const {data,error}=await signInWithEmail({email,password});
      if(error) throw error;
      window.yoldashTrack?.('login',{method:'email'});
      state.session=data.session; await loadProfile(); renderProfileUI();
      status.className='auth-status ok'; status.textContent=t('authSuccess');
      if(isFullProfileReady()) setTimeout(()=>$('#authModal').close(),500);
    }
  }catch(err){
    const raw=String(err?.message||err||'').toLowerCase();
    if(state.authMode==='signin' && raw.includes('email not confirmed')){
      state.pendingSignupEmail=email;
      showVerifyEmail(email);
      if($('#verifyEmailStatus')){
        $('#verifyEmailStatus').className='auth-status error';
        $('#verifyEmailStatus').textContent=t('verificationRequired');
      }
    }else{
      status.className='auth-status error'; status.textContent=humanError(err);
    }
  }finally{
    btn.disabled=false;
  }
}
async function resendVerification(){
  const email=state.pendingSignupEmail||$('#authEmail')?.value.trim().toLowerCase();
  const status=$('#verifyEmailStatus');
  if(!email){ showAuthEntry(); setAuthMode('signup'); return; }
  status.className='auth-status'; status.textContent=t('loading');
  const {error}=await resendSignupVerification(email);
  if(error){ status.className='auth-status error'; status.textContent=humanError(error); }
  else { status.className='auth-status ok'; status.textContent=t('verificationResent'); }
}

async function forgotPassword(){
  const email=$('#forgotEmail')?.value.trim().toLowerCase()||'';
  const status=$('#forgotStatus');
  if(!email || !email.includes('@')){
    status.className='auth-status error';
    status.textContent=t('email');
    return;
  }
  const btn=$('#sendResetLink');
  btn.disabled=true;
  status.className='auth-status';
  status.textContent=t('loading');
  try{
    const {error}=await sendPasswordReset(email);
    if(error) throw error;
    status.className='auth-status ok';
    status.textContent=t('passwordResetSent');
  }catch(error){
    status.className='auth-status error';
    status.textContent=humanError(error);
  }finally{
    btn.disabled=false;
  }
}

async function submitRecovery(ev){
  ev.preventDefault();
  const p1=$('#recoveryPassword').value;
  const p2=$('#recoveryPasswordConfirm').value;
  const status=$('#recoveryStatus');
  const btn=$('#recoverySubmit');
  status.className='auth-status';
  status.textContent=t('loading');
  btn.disabled=true;
  try{
    if(p1.length<8) throw new Error('Password must be at least 8 characters.');
    if(p1!==p2) throw new Error(t('passwordsMismatch'));
    const {error}=await updatePassword(p1);
    if(error) throw error;
    status.className='auth-status ok';
    status.textContent=t('passwordUpdated');
    $('#recoveryForm').reset();
    toast(t('passwordUpdated'),'ok');
    setTimeout(()=>$('#recoveryModal')?.close(),900);
  }catch(err){
    status.className='auth-status error';
    status.textContent=humanError(err);
  }finally{
    btn.disabled=false;
  }
}

function renderDriverHub(){
  const el=$('#driverHubList'); if(!el) return;
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('driverHubLoginHint'));if($('#driverListingCount'))$('#driverListingCount').textContent='—';return;}
  const uid=state.session.user.id;
  const q=($('#driverHubSearch')?.value||'').trim().toLocaleLowerCase();
  const rows=(state.driverListings||[]).filter(r=>{
    if(state.driverScope==='all'&&r.status!=='ACTIVE') return false;
    if(state.driverScope==='mine'&&r.user_id!==uid) return false;
    if(state.driverFilter!=='all'&&r.listing_type!==state.driverFilter) return false;
    if(!q) return true;
    return [r.title,r.description,r.city,r.country_code,r.truck_type,r.first_name,r.last_name].some(v=>normalizeSearch(v).includes(normalizeSearch(q)));
  });
  if($('#driverListingCount')) $('#driverListingCount').textContent=String((state.driverListings||[]).filter(r=>r.status==='ACTIVE').length);
  if(!rows.length){el.innerHTML=emptyBlock('noDriverListings');return;}
  el.innerHTML=rows.map(r=>{
    const name=r.show_identity?[r.first_name,r.last_name].filter(Boolean).join(' ').trim():'';
    const own=r.user_id===uid;
    return `<article class="driver-listing-card ${r.status==='CLOSED'?'closed':''}">
      <div class="driver-listing-head"><span class="status-pill">${r.listing_type==='NEED_DRIVER'?t('needDriver'):t('needVehicle')}</span><span class="driver-listing-state ${r.status==='ACTIVE'?'active':'closed'}">${r.status==='ACTIVE'?t('activeStatus'):t('closedStatus')}</span><time>${esc(relativeLabel(r.created_at))}</time></div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.description)}</p>
      <div class="driver-listing-meta"><span><small>${t('city')}</small><b>${esc(r.city)} · ${esc(r.country_code)}</b></span><span><small>${t('truckType')}</small><b>${esc(r.truck_type||'—')}</b></span><span><small>${t('employmentType')}</small><b>${r.employment_type==='PERMANENT'?t('permanentWork'):t('serviceWork')}</b></span></div>
      ${name?`<div class="driver-identity"><span class="mini-avatar">${esc(initials(name))}</span><b>${esc(name)}</b></div>`:''}
      <div class="driver-listing-actions">${r.status==='ACTIVE'?`<a class="btn secondary" href="tel:${esc(r.contact_phone)}">${t('call')} · <span dir="ltr">${esc(r.contact_phone)}</span></a>`:''}${own?`<button class="btn secondary edit-driver-listing" data-edit-driver-listing="${esc(r.id)}">${t('editListing')}</button><button class="btn secondary toggle-driver-listing" data-toggle-driver-listing="${esc(r.id)}" data-current-status="${esc(r.status)}">${r.status==='ACTIVE'?t('closeListing'):t('reopenListing')}</button><button class="btn delete-driver-listing" data-delete-driver-listing="${esc(r.id)}">${t('deleteListing')}</button>`:''}</div>
    </article>`;
  }).join('');
  $$('[data-edit-driver-listing]').forEach(b=>b.onclick=()=>openDriverListing(b.dataset.editDriverListing));
  $$('[data-toggle-driver-listing]').forEach(b=>b.onclick=()=>toggleDriverListing(b.dataset.toggleDriverListing,b.dataset.currentStatus));
  $$('[data-delete-driver-listing]').forEach(b=>b.onclick=()=>deleteDriverListing(b.dataset.deleteDriverListing));
}
async function loadDriverHub(){
  const session=state.session||await ensureSession();
  if(!session){state.driverListings=[];renderDriverHub();return;}
  if(!isFullProfileReady()){state.driverListings=[]; const el=$('#driverHubList'); if(el) el.innerHTML=emptyBlock('profileIncomplete',t('completeProfileRequired')); if($('#driverListingCount')) $('#driverListingCount').textContent='—'; return;}
  try{
    const {data,error}=await listDriverHubListings(200);
    if(error) throw error;
    state.driverListings=data||[];
  }catch(err){state.driverListings=[];toast(humanError(err),'error');}
  renderDriverHub();
}
function syncDriverListingSegments(){
  const listing=$('#driverListingType')?.value||'NEED_VEHICLE';
  const employment=$('#driverEmploymentType')?.value||'SERVICE';
  $$('[data-listing-type]').forEach(b=>b.classList.toggle('active',b.dataset.listingType===listing));
  $$('[data-employment-type]').forEach(b=>b.classList.toggle('active',b.dataset.employmentType===employment));
}
function generatedDriverListingTitle(){
  const type=$('#driverListingType')?.value||'NEED_VEHICLE';
  const city=$('#driverListingCity')?.value.trim()||'';
  const base=type==='NEED_DRIVER'?t('needDriver'):t('needVehicle');
  return city?`${base} · ${city}`:base;
}

async function openDriverListing(id=null){
  const session=state.session||await ensureSession();
  if(!session){$('#authModal').showModal();toast(t('loginRequired'),'error');return;}
  if(!state.profile) await loadProfile();
  if(!requireCompleteProfile()) return;
  $('#driverListingForm').reset();
  $('#driverListingStatus').className='auth-status'; $('#driverListingStatus').textContent='';
  $('#driverListingId').value=id||'';
  const row=id?state.driverListings.find(r=>r.id===id&&r.user_id===state.session.user.id):null;
  if(id&&!row){toast(t('unexpectedError'),'error');return;}
  if(row){
    $('#driverListingType').value=row.listing_type; $('#driverEmploymentType').value=row.employment_type;
    $('#driverListingTitle').value=row.title||''; $('#driverListingCountry').value=row.country_code; $('#driverListingCity').value=row.city;
    $('#driverListingTruck').value=row.truck_type||''; $('#driverListingPhone').value=String(row.contact_phone||'').replace(/\D/g,'').slice(-11);
    $('#driverListingIdentity').checked=!!row.show_identity; $('#driverListingDescription').value=row.description;
  }else{
    $('#driverListingType').value='NEED_VEHICLE'; $('#driverEmploymentType').value='SERVICE';
    $('#driverListingPhone').value=String(state.profile?.whatsapp_phone||state.profile?.phone||'').replace(/\D/g,'').slice(-11);
    const c=state.businessProfile?.country_code; $('#driverListingCountry').value=['TR','IR'].includes(c)?c:'IR';
  }
  $('#driverListingModalTitle').textContent=row?t('editListing'):t('newDriverListing');
  $('#submitDriverListing').textContent=row?t('saveChanges'):t('publishListing');
  syncDriverListingSegments();
  $('#driverListingModal').showModal();
}
async function submitDriverListing(ev){
  ev.preventDefault();
  const session=state.session||await ensureSession();
  if(!session){$('#authModal').showModal();toast(t('loginRequired'),'error');return;}
  if(!requireCompleteProfile()) return;

  const btn=$('#submitDriverListing'),status=$('#driverListingStatus');
  const id=$('#driverListingId').value||null;
  const description=$('#driverListingDescription').value.trim();
  const title=generatedDriverListingTitle();
  $('#driverListingTitle').value=title;
  const city=$('#driverListingCity').value.trim();
  const phone=$('#driverListingPhone').value.trim();

  status.className='auth-status';
  status.textContent='';

  if(city.length<2){status.className='auth-status error';status.textContent=t('listingCityError');$('#driverListingCity').focus();return;}
  if(!/^\d{11}$/.test(phone)){status.className='auth-status error';status.textContent=t('phone11Hint');$('#driverListingPhone').focus();return;}
  if(description.length<3){status.className='auth-status error';status.textContent=t('listingDescriptionError');$('#driverListingDescription').focus();return;}

  btn.disabled=true;
  btn.textContent=t('loading');
  try{
    const {data,error}=await upsertDriverHubListing({
      p_id:id,
      p_listing_type:$('#driverListingType').value,
      p_title:title,
      p_description:description,
      p_country_code:$('#driverListingCountry').value,
      p_city:city,
      p_truck_type:$('#driverListingTruck').value.trim()||null,
      p_contact_phone:phone,
      p_show_identity:$('#driverListingIdentity').checked,
      p_employment_type:$('#driverEmploymentType').value
    });
    if(error) throw error;

    status.className='auth-status ok';
    status.textContent=id?t('listingUpdated'):t('listingPublished');
    toast(id?t('listingUpdated'):t('listingPublished'),'ok');

    $('#driverListingForm').reset();
    $('#driverListingId').value='';
    await loadDriverHub();
    setTimeout(()=>$('#driverListingModal')?.close(),800);
  }catch(err){
    console.error('driver listing submit',err);
    status.className='auth-status error';
    status.textContent=humanError(err);
  }finally{
    btn.disabled=false;
    btn.textContent=t('publishListing');
  }
}
async function toggleDriverListing(id,currentStatus){
  const session=state.session||await ensureSession();
  if(!session){$('#authModal').showModal();return;}
  if(!requireCompleteProfile()) return;
  const next=currentStatus==='ACTIVE'?'CLOSED':'ACTIVE';
  try{
    const {error}=await setDriverHubListingStatus({id,userId:state.session.user.id,status:next});
    if(error) throw error;
    toast(next==='ACTIVE'?t('listingReopened'):t('listingClosed'));
    await loadDriverHub();
  }catch(err){toast(humanError(err),'error');}
}
async function deleteDriverListing(id){
  const session=state.session||await ensureSession();
  if(!session){$('#authModal').showModal();return;}
  if(!requireCompleteProfile()) return;
  if(!confirm(t('deleteListingConfirm'))) return;
  try{
    const {error}=await removeDriverHubListing({id,userId:state.session.user.id});
    if(error) throw error;
    toast(t('listingDeleted'));
    await loadDriverHub();
  }catch(err){toast(humanError(err),'error');}
}

function isFullProfileReady(){
  return !!(state.session && state.profile?.is_active && basicProfileComplete() && isBusinessProfileReady());
}
function requireCompleteProfile(){
  if(!state.session){
    $('#authModal')?.showModal();
    toast(t('loginRequired'),'error');
    return false;
  }
  if(!state.profile?.is_active){
    toast(t('accountInactive'),'error');
    return false;
  }
  if(!isFullProfileReady()){
    if(!$('#authModal')?.open) $('#authModal')?.showModal();
    if($('#profileStatus')){
      $('#profileStatus').className='auth-status error';
      $('#profileStatus').textContent=t('completeProfileRequired');
    }
    toast(t('completeProfileRequired'),'error');
    return false;
  }
  return true;
}

function isBusinessProfileReady(){
  const type=state.profile?.business_user_type,b=state.businessProfile,p=state.profile;
  if(!type||!b) return false;
  if(type==='DRIVER') return !!(p.first_name && p.last_name && p.phone && p.whatsapp_phone && p.tractor_transit_plate && p.container_transit_plate);
  if(type==='TRANSPORT_COMPANY') return !!b.company_name;
  return !!b.organization_name;
}
async function openLoadModal(){
  if(!requireCompleteProfile()) return;
  resetOwnLoadEditor();
  if(!canPostTypes.has(state.profile?.business_user_type)){ toast(state.profile?.business_user_type==='DRIVER'?t('driverCannotPost'):t('postOnlyBusiness'),'error'); return; }
  $('#loadFormStatus').textContent='';
  $('#loadModal').showModal();
  try{
    const {data}=await getCurrentCargoDailyQuota(); const q=Array.isArray(data)?data[0]:data;
    if(q){ $('#quotaNote').innerHTML=`<span>✓</span><span>${t('quota')}: ${esc(q.used_count)} / ${esc(q.daily_limit)} · ${t('remaining')}: ${esc(q.remaining_count)}</span>`; }
  }catch{}
}
function normalizeLoadingDateToday(){
  const input=$('#loadingAt');
  if(!input?.value) return;
  const selected=new Date(input.value);
  if(!Number.isFinite(selected.getTime())) return;
  const now=new Date();
  const sameDay=selected.getFullYear()===now.getFullYear()&&selected.getMonth()===now.getMonth()&&selected.getDate()===now.getDate();
  if(sameDay && selected.getTime()<now.getTime()){
    const later=new Date(now.getTime()+5*60000);
    if(later.getDate()===now.getDate()&&later.getMonth()===now.getMonth()&&later.getFullYear()===now.getFullYear()){
      input.value=datetimeLocalValue(later);
    }
  }
}
async function submitLoad(ev){
  ev.preventDefault();if($('#publishLoadBtn').disabled)return;
  const status=$('#loadFormStatus'); status.textContent='';
  const count=Number($('#truckCount').value);
  normalizeLoadingDateToday();
  const loading=$('#loadingAt').value;
  if(!Number.isInteger(count)||count<1){status.textContent=t('invalidTruckCount');$('#truckCount').focus();return;}
  if(loading && (!Number.isFinite(new Date(loading).getTime())||new Date(loading).getTime()<Date.now())){
    status.textContent=t('invalidLoadingDate');$('#loadingAt').focus();return;
  }
  const btn=$('#publishLoadBtn'); btn.disabled=true; btn.textContent=t('loading');
  try{
    if(!state.session) throw new Error(t('loginRequired'));
    const price=$('#freightPrice').value ? Number($('#freightPrice').value) : null;
    const payload={
      status:'PUBLISHED',cargo_type:$('#cargoType').value.trim(),required_truck_type:$('#truckType').value,
      origin_country_code:$('#originCountry').value,origin_city:$('#originCity').value.trim(),destination_country_code:$('#destinationCountry').value,destination_city:$('#destinationCity').value.trim(),
      origin_customs:$('#originCustoms').value.trim()||null,destination_customs:$('#destinationCustoms').value.trim()||null,exit_border:$('#exitBorder').value.trim()||null,
      weight_kg:$('#weightKg').value?Number($('#weightKg').value):null,truck_count:Number($('#truckCount').value||1),loading_at:$('#loadingAt').value?new Date($('#loadingAt').value).toISOString():null,
      freight_price:price,currency_code:price?$('#currencyCode').value:null,description:$('#cargoDescription').value.trim()||null,validity_days:Number($('#validityDays').value||3)
    };
    for(const which of ['origin','destination']){
      const c=state.city[which]; if(!c) continue;
      if(uuidLike(c.city_id)) payload[`${which}_city_id`]=c.city_id;
      if(c.geoname_id!=null) payload[`${which}_geoname_id`]=Number(c.geoname_id);
      if(c.latitude!=null) payload[`${which}_lat`]=Number(c.latitude);
      if(c.longitude!=null) payload[`${which}_lng`]=Number(c.longitude);
      for(const l of ['en','fa','tr']) if(c[`name_${l}`]) payload[`${which}_city_name_${l}`]=c[`name_${l}`];
    }
    if(!payload.cargo_type||!payload.origin_city||!payload.destination_city) throw new Error(t('requiredFields'));
    const isEditing=!!editingOwnLoadId;
    let result;
    if(isEditing){
      delete payload.status;
      delete payload.validity_days;
      result=await updateOwnLoad(editingOwnLoadId,state.session.user.id,payload);
    }else result=await publishLoad(payload);
    const {data:created,error}=result;
    if(error)throw error;
    if(isEditing&&!created?.length)throw new Error('This load cannot be edited in its current state.');
    $('#loadModal').close(); resetOwnLoadEditor(); toast(isEditing?ownLoadText('saved'):t('loadPublished')); await loadLoads();if($('#page-shipments').classList.contains('active'))await loadShipments();
    if(!isEditing&&created?.id){
      const url=publicCargoUrl(created.id);
      window.yoldashTrack?.('publish_load',{
        item_id:created.id,
        origin_country:payload.origin_country_code||'',
        destination_country:payload.destination_country_code||'',
        truck_type:payload.required_truck_type||'',
        truck_count:payload.truck_count||1,
        value:payload.freight_price||0,
        currency:payload.currency_code||undefined
      });
      console.info('Public cargo URL:',url);
    }
  }catch(err){ status.className='auth-status error'; status.textContent=humanError(err); status.focus(); }
  finally{ btn.disabled=false; btn.textContent=editingOwnLoadId?ownLoadText('save'):t('publishLoad'); }
}

async function setupCitySearch(which){
  const input=$(`#${which}City`), results=$(`#${which}CityResults`), country=$(`#${which}Country`); let timer,version=0;
  input.addEventListener('input',()=>{
    state.city[which]=null;clearTimeout(timer);const request=++version,q=input.value.trim(),countryCode=country.value;
    if(q.length<2){results.classList.remove('open');results.innerHTML='';return;}
    timer=setTimeout(async()=>{
      const {data,error}=await searchCities({query:q,limit:8,countryCode});
      if(request!==version||input.value.trim()!==q||country.value!==countryCode)return;
      if(error||!data?.length){results.classList.remove('open');return;}
      results.innerHTML=data.map((c,i)=>`<button type="button" data-city-index="${i}"><b>${esc(c.matched_name||c.name_en||'')}</b><small>${esc(c.country_code||'')} · ${esc(c.region_name||'')}</small></button>`).join('');
      results.classList.add('open');
      $$('[data-city-index]',results).forEach(b=>b.onclick=()=>{const c=data[Number(b.dataset.cityIndex)];state.city[which]=c;input.value=c[`name_${state.lang}`]||c.matched_name||c.name_en||'';results.classList.remove('open');});
    },300);
  });
  country.addEventListener('change',()=>{++version;clearTimeout(timer);state.city[which]=null;input.value='';results.classList.remove('open');});
}

async function openOffer(id){
  const cargo=state.loads.find(x=>x.id===id); if(!cargo) return;
  if(!requireCompleteProfile()) return;
  if(!canOfferTypes.has(state.profile?.business_user_type)){ toast(t('offerOnlyProvider'),'error'); return; }

  try{
    const {data,error}=await getCargoOfferSnapshot(id);
    if(error) throw error;
    const rows=Array.isArray(data)?data:[];
    if(!rows[0]?.can_submit){toast(shipmentCopy('offerUnavailable'),'error');return;}
    const pending=rows.find(r=>r.offer_id && r.offer_status==='PENDING');
    if(pending){
      const price=pending.proposed_price!=null?`${Number(pending.proposed_price).toLocaleString(localeMap[state.lang])} ${pending.currency_code||''}`:'—';
      const trucks=pending.requested_truck_count||1;
      toast(`${t('offerPending')} · ${t('offerPendingDetails')}: ${price} · ${trucks} ${t('trucks')}`,'error');
      return;
    }
  }catch(err){
    toast(humanError(err),'error');return;
  }

  $('#offerForm').reset();
  $('#offerPrice').value=cargo.freight_price??'';
  if(cargo.currency_code&&[...$('#offerCurrency').options].some(o=>o.value===cargo.currency_code))$('#offerCurrency').value=cargo.currency_code;
  $('#offerCargoId').value=id;
  $('#offerRoute').textContent=`${cityName(cargo,'origin')} → ${cityName(cargo,'destination')}`;
  $('#offerTruckCount').max=cargo.remaining_truck_count||cargo.truck_count||1;
  $('#offerModal').showModal();
}
async function submitOffer(ev){
  ev.preventDefault(); const btn=$('#submitOffer');if(btn.disabled)return;btn.disabled=true;btn.textContent=t('loading');
  try{
    const price=$('#offerPrice').value?Number($('#offerPrice').value):null;
    const count=Number($('#offerTruckCount').value),maximum=Number($('#offerTruckCount').max);
    if(!Number.isFinite(price)||price<=0)throw new Error(shipmentCopy('positivePrice'));
    if(!Number.isInteger(count)||count<1||count>maximum)throw new Error(t('invalidTruckCount'));
    const {error}=await submitCargoOffer({
      cargoId: $('#offerCargoId').value,
      proposedPrice: price,
      currencyCode: price!==null ? $('#offerCurrency').value : null,
      message: $('#offerMessage').value.trim() || null,
      requestedTruckCount: Number($('#offerTruckCount').value || 1)
    });
    if(error) throw error;
    window.yoldashTrack?.('submit_transport_offer',{
      cargo_id:$('#offerCargoId').value,
      requested_truck_count:Number($('#offerTruckCount').value||1),
      value:price||0,
      currency:price?$('#offerCurrency').value:undefined
    });
    window.yoldashTrack?.('generate_lead',{lead_source:'cargo_offer'});
    $('#offerModal').close(); $('#offerForm').reset(); toast(t('offerSent')); page('shipments');
  }catch(err){
    const msg=humanError(err);
    toast(msg,'error');
    if(String(err?.message||'').toLowerCase().includes('previous price request is still awaiting a decision')){
      $('#offerModal')?.close();
    }
  }
  finally{btn.disabled=false;btn.textContent=t('sendRequest');}
}

let shipmentRequest=0;
let shipmentCargoCache=[];
async function loadShipments(){
  const request=++shipmentRequest,uid=state.session?.user?.id;
  const el=$('#shipmentList');
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForShipments'));$('#metricShipments').textContent='—';return;}
  if(!isFullProfileReady()){el.innerHTML=emptyBlock('profileIncomplete',t('completeProfileRequired'));$('#metricShipments').textContent='—';return;}
  el.innerHTML='<div class="loading-card"></div><div class="loading-card"></div>';
  try{
    const {data,error}=await getMyTransportCargo(uid); if(error) throw error;
    const rows=Array.isArray(data)?data:[];
    const cards=await mapLimited(rows,4,async cargo=>{
      const snapshot=await getCargoOfferSnapshot(cargo.id);
      const offers=snapshot.error ? [] : (snapshot.data||[]);
      return `<div class="shipment-group">${cargoCard(cargo,true)}${snapshot.error?`<div class="board-feedback" role="status">${esc(shipmentCopy('offersFailed'))}</div>`:shipmentOfferPanel(cargo,offers)}</div>`;
    });
    if(request!==shipmentRequest||uid!==state.session?.user?.id)return;
    shipmentCargoCache=rows;
    el.innerHTML=rows.length?cards.join(''):emptyBlock('noShipments');
    $('#metricShipments').textContent=String(rows.length);
    bindCargoActions();
    bindShipmentOfferActions();
  }catch(err){if(request===shipmentRequest&&uid===state.session?.user?.id)el.innerHTML=emptyBlock('unexpectedError',humanError(err));}
}

function shipmentCopy(key){
  const copy={
    fa:{openAcceptedChat:'گفت‌وگوی این حمل',offerUnavailable:'این بار در حال حاضر درخواست جدید نمی‌پذیرد.',decisionChanged:'وضعیت این پیشنهاد قبلاً تغییر کرده است؛ فهرست به‌روز شد.',offersFailed:'دریافت پیشنهادها انجام نشد؛ به‌روزرسانی را بزنید.',positivePrice:'کرایه‌ای بیشتر از صفر وارد کنید.',acceptedChatRetry:'پیشنهاد پذیرفته شد؛ برای ورود به گفتگو، بخش گفتگو را باز کنید.',priceOffer:'پیشنهاد کرایه',pending:'در انتظار بررسی',confirmAccept:'آیا این پیشنهاد کرایه را تأیید می‌کنید؟ پس از تأیید، گفت‌وگوی خصوصی فعال می‌شود.',confirmReject:'آیا این درخواست حمل را رد می‌کنید؟',requests:'درخواست‌های حمل',noRequests:'درخواستی برای این بار ثبت نشده است.',driver:'راننده',trucks:'تعداد کامیون',message:'پیام',accept:'قبول درخواست',reject:'رد درخواست',accepted:'پذیرفته شد',rejected:'رد شد',requestAccepted:'درخواست پذیرفته شد و گفت‌وگوی خصوصی باز شد.',requestRejected:'درخواست رد شد.',privateChats:'گفتگوهای خصوصی حمل',route:'مسیر حمل',privateChat:'گفتگوی خصوصی حمل',chatReady:'پس از تأیید درخواست، گفت‌وگوی خصوصی فعال می‌شود.',sending:'در حال ارسال…'},
    tr:{openAcceptedChat:'Bu taşımanın sohbeti',offerUnavailable:'Bu yük şu anda yeni talep kabul etmiyor.',decisionChanged:'Bu teklifin durumu zaten değişti. Liste yenilendi.',offersFailed:'Teklifler alınamadı. Yenileyin.',positivePrice:'Sıfırdan büyük bir navlun girin.',acceptedChatRetry:'Teklif kabul edildi. Sohbet bölümünden devam edin.',priceOffer:'Navlun teklifi',pending:'Değerlendiriliyor',confirmAccept:'Bu navlun teklifini kabul ediyor musunuz? Kabulden sonra özel sohbet açılır.',confirmReject:'Bu taşıma talebini reddetmek istiyor musunuz?',requests:'Taşıma talepleri',noRequests:'Bu yük için henüz talep yok.',driver:'Sürücü',trucks:'Kamyon sayısı',message:'Mesaj',accept:'Talebi kabul et',reject:'Talebi reddet',accepted:'Kabul edildi',rejected:'Reddedildi',requestAccepted:'Talep kabul edildi; özel sohbet açıldı.',requestRejected:'Talep reddedildi.',privateChats:'Özel taşıma sohbetleri',route:'Taşıma rotası',privateChat:'Özel taşıma sohbeti',chatReady:'Talep onaylandığında özel sohbet etkinleşir.',sending:'Gönderiliyor…'},
    en:{openAcceptedChat:'Open shipment chat',offerUnavailable:'This cargo is not currently accepting new requests.',decisionChanged:'This offer has already changed. The list was refreshed.',offersFailed:'Could not load offers. Please refresh.',positivePrice:'Enter a freight price greater than zero.',acceptedChatRetry:'Offer accepted. Open Chats to continue.',priceOffer:'Freight offer',pending:'Pending review',confirmAccept:'Accept this freight offer? A private chat will become available.',confirmReject:'Reject this transport request?',requests:'Transport requests',noRequests:'No request has been sent for this load yet.',driver:'Driver',trucks:'Trucks',message:'Message',accept:'Accept request',reject:'Reject request',accepted:'Accepted',rejected:'Rejected',requestAccepted:'Request accepted and private chat opened.',requestRejected:'Request rejected.',privateChats:'Private shipment chats',route:'Shipment route',privateChat:'Private shipment chat',chatReady:'Private chat becomes available after a request is accepted.',sending:'Sending…'}
  };
  return copy[state.lang]?.[key]||copy.en[key]||key;
}
function shipmentOfferPanel(cargo, rows){
  const canManage=rows.some(row=>row.can_manage===true);
  const offers=rows.filter(row=>row.offer_id);
  const offerRow=offer=>{
    const price=offer.proposed_price==null?'—':`${Number(offer.proposed_price).toLocaleString(localeMap[state.lang])} ${offer.currency_code||''}`;
    const isPending=offer.offer_status==='PENDING';
    return `<div class="shipment-offer-row"><div><b>${esc(offer.provider_display_name||'Yoldash')}</b><small>${shipmentCopy('driver')} · ${shipmentCopy('trucks')}: ${esc(offer.requested_truck_count||1)} · ${shipmentCopy('priceOffer')}: ${esc(price)}</small>${offer.message?`<p>${esc(offer.message)}</p>`:''}</div><div class="shipment-offer-actions"><span class="shipment-offer-status ${String(offer.offer_status||'').toLowerCase()}">${esc(offer.offer_status==='ACCEPTED'?shipmentCopy('accepted'):offer.offer_status==='REJECTED'?shipmentCopy('rejected'):offer.offer_status==='PENDING'?shipmentCopy('pending'):offer.offer_status||'—')}</span>${offer.offer_status==='ACCEPTED'?`<button type="button" class="btn secondary" data-offer-room="${esc(offer.offer_id)}">${shipmentCopy('openAcceptedChat')}</button>`:''}${isPending&&canManage?`<button class="btn primary" data-offer-decision="ACCEPTED" data-offer-id="${esc(offer.offer_id)}">${shipmentCopy('accept')}</button><button class="btn secondary" data-offer-decision="REJECTED" data-offer-id="${esc(offer.offer_id)}">${shipmentCopy('reject')}</button>`:''}</div></div>`;
  };
  return `<section class="shipment-offers" data-cargo-offers="${esc(cargo.id)}"><div class="shipment-offers-head"><b>${shipmentCopy('requests')}</b><small>${offers.length}</small></div>${offers.length?offers.map(offerRow).join(''):`<p class="shipment-empty">${shipmentCopy('noRequests')}</p>`}</section>`;
}
const decidingOffers=new Set();
function bindShipmentOfferActions(){
  $$('[data-offer-room]').forEach(button=>button.onclick=async()=>{if(button.disabled)return;button.disabled=true;try{const {data,error}=await getShipmentRoomForOffer(button.dataset.offerRoom);if(error)throw error;const room=Array.isArray(data)?data[0]:data;if(!room)throw new Error(shipmentCopy('acceptedChatRetry'));await openShipmentRoom(room);page('chat');}catch(error){toast(humanError(error),'error');}finally{button.disabled=false;}});
  $$('[data-offer-decision]').forEach(button=>button.onclick=async()=>{
    const offerId=button.dataset.offerId, status=button.dataset.offerDecision;
    if(!offerId||!status||decidingOffers.has(offerId)) return;
    if(!window.confirm(shipmentCopy(status==='ACCEPTED'?'confirmAccept':'confirmReject')))return;
    decidingOffers.add(offerId);const controls=$$('[data-offer-id]').filter(b=>b.dataset.offerId===offerId);controls.forEach(b=>b.disabled=true);
    try{
      const {data,error}=await setCargoOfferStatus(offerId,status);
      if(error) throw error;
      const decided=Array.isArray(data)?data[0]:data;
      if(decided?.status!==status){toast(shipmentCopy('decisionChanged'),'error');await loadShipments();return;}
      if(status==='ACCEPTED'){
        const roomResult=await getShipmentRoomForOffer(offerId);
        if(roomResult.error){toast(shipmentCopy('acceptedChatRetry'));await loadShipments();return;}
        const room=(roomResult.data||[])[0];
        toast(shipmentCopy('requestAccepted'));
        await loadShipments();
        if(room){ await openShipmentRoom(room);page('chat'); }
      }else{
        toast(shipmentCopy('requestRejected'));
        await loadShipments();
      }
    }catch(err){ toast(humanError(err),'error'); }finally{decidingOffers.delete(offerId);controls.forEach(b=>b.disabled=false);}
  });
}

let chatCache=[];
let shipmentRooms=[];
let shipmentMessages=[];
let activeShipmentRoom=null;
let shipmentRealtimeChannel=null;
let notificationRealtimeChannel=null;
let chatSending=false;
let chatRequest=0;
let publicChatRequest=0;
function renderChatFromCache(){
  const el=$('#chatMessages'); if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForChat'));return;}
  if(!isFullProfileReady()){el.innerHTML=emptyBlock('profileIncomplete',t('completeProfileRequired'));return;}
  if(!chatCache.length){el.innerHTML=emptyBlock('noMessages');return;}
  const uid=state.session.user.id;
  const keepBottom=el.scrollHeight-el.scrollTop-el.clientHeight<80;
  el.innerHTML=chatCache.map(m=>`<div class="bubble ${m.sender_id===uid?'me':''}"><span class="sender">${esc(m.sender_name||'Yoldash')}</span><span>${m.deleted_at?'—':esc(m.body||'')}</span><time>${esc(dateLabel(m.created_at))}</time></div>`).join('');
  if(keepBottom)el.scrollTop=el.scrollHeight;
}
async function loadChat(silent=false){
  const input=$('#chatInput'),send=$('#sendChat');
  if(!state.session){input.disabled=true;send.disabled=true;renderChatFromCache();return;}
  if(!isFullProfileReady()){input.disabled=true;send.disabled=true;renderChatFromCache();return;}
  input.disabled=false;send.disabled=chatSending;
  const uid=state.session.user.id,roomId=activeShipmentRoom?.id;
  await loadShipmentRooms(silent);
  if(uid!==state.session?.user?.id||roomId!==activeShipmentRoom?.id)return;
  clearInterval(state.chatTimer);
  state.chatTimer=setInterval(()=>{if(document.visibilityState==='visible'&&$('#page-chat').classList.contains('active')&&state.session) loadChat(true);},activeShipmentRoom?3000:12000);
  if(activeShipmentRoom) return loadShipmentMessages(activeShipmentRoom,silent);
  setChatRoomHeader(null);
  const request=++publicChatRequest;
  try{
    const {data,error}=await getPublicChatMessages(60); if(error) throw error;
    if(request!==publicChatRequest||activeShipmentRoom||uid!==state.session?.user?.id)return;
    chatCache=(data||[]).slice().reverse(); renderChatFromCache(); $('#chatTime').textContent=chatCache.length?new Date(chatCache.at(-1).created_at).toLocaleTimeString(localeMap[state.lang],{hour:'2-digit',minute:'2-digit'}):'—';
    markPublicChatRead().then(()=>loadUnread());
  }catch(err){if(!silent) toast(humanError(err),'error');}
}
async function sendChat(){
  if(chatSending)return;
  if(activeShipmentRoom) return sendShipmentChat();
  const input=$('#chatInput'), body=input.value.trim(); if(!body||!state.session) return;
  if(!requireCompleteProfile()) return;
  const btn=$('#sendChat');chatSending=true; btn.disabled=true;
  try{
    const rid=crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const {error}=await sendPublicChatMessage({requestId:rid,body}); if(error) throw error;
    window.yoldashTrack?.('send_chat_message',{chat_type:'public'});
    if(!activeShipmentRoom&&input.value.trim()===body)input.value=''; await loadChat(true);
  }catch(err){toast(humanError(err),'error');} finally{chatSending=false;btn.disabled=!state.session;}
}
function setChatRoomHeader(room){
  const title=$('#chatRoomTitle'),avatar=$('#chatRoomAvatar'),online=$('#chatOnlineLabel');
  if(!title||!avatar||!online) return;
  if(room){
    const other=room.owner_id===state.session?.user?.id ? room.provider_display_name : room.owner_display_name;
    title.textContent=other || shipmentCopy('privateChat');
    avatar.textContent=initials(other||'YD');
    online.textContent=`${shipmentCopy('route')}: ${room.origin_city||'—'} → ${room.destination_city||'—'}`;
  }else{
    title.textContent=t('publicChat'); avatar.textContent='YG'; online.textContent=t('onlineNow');
  }
}
function renderShipmentRooms(){
  const el=$('#shipmentChatRooms'); if(!el) return;
  if(!shipmentRooms.length){el.innerHTML=`<div class="chat-person placeholder"><span class="avatar">⇄</span><div><b>${t('shipmentChat')}</b><small>${shipmentCopy('chatReady')}</small></div></div>`;return;}
  el.innerHTML=`<b class="shipment-chat-list-title">${shipmentCopy('privateChats')}</b>`+shipmentRooms.map(room=>{
    const other=room.owner_id===state.session?.user?.id?room.provider_display_name:room.owner_display_name;
    return `<button class="chat-person chat-room-choice ${activeShipmentRoom?.id===room.id?'active':''}" type="button" data-shipment-room="${esc(room.id)}"><span class="avatar">${esc(initials(other||'YD'))}</span><span><b>${esc(other||shipmentCopy('privateChat'))}</b><small>${esc(`${room.origin_city||'—'} → ${room.destination_city||'—'}`)}</small></span><time>${esc(relativeLabel(room.updated_at))}</time></button>`;
  }).join('');
  $$('[data-shipment-room]').forEach(button=>button.onclick=()=>{const room=shipmentRooms.find(item=>item.id===button.dataset.shipmentRoom);if(room) openShipmentRoom(room);});
}
async function loadShipmentRooms(silent=false){
  if(!state.session) return;
  const uid=state.session.user.id;
  try{const {data,error}=await getMyShipmentRooms();if(error) throw error;if(uid!==state.session?.user?.id)return;shipmentRooms=data||[];renderShipmentRooms();}
  catch(err){if(!silent) console.warn('shipment rooms',err);}
}
function renderShipmentMessages(){
  const el=$('#chatMessages'); if(!activeShipmentRoom) return;
  if(!shipmentMessages.length){el.innerHTML=emptyBlock('shipmentChat',shipmentCopy('chatReady'));return;}
  const uid=state.session?.user?.id;
  const keepBottom=el.scrollHeight-el.scrollTop-el.clientHeight<80;
  el.innerHTML=shipmentMessages.map(message=>`<div class="bubble ${message.sender_id===uid?'me':''}"><span class="sender">${esc(message.sender_display_name||'Yoldash')}</span><span>${esc(message.body||'')}</span><time>${esc(dateLabel(message.created_at))}</time></div>`).join('');
  if(keepBottom)el.scrollTop=el.scrollHeight;
}
async function openShipmentRoom(room){
  if(shipmentRealtimeChannel){
    unsubscribeFromShipmentRoom(shipmentRealtimeChannel);
    shipmentRealtimeChannel=null;
  }
  ++chatRequest;++publicChatRequest;
  activeShipmentRoom=room;shipmentMessages=[];
  $('#chatInput').value='';$('#publicChatRoom')?.classList.remove('active');
  $('#chatMessages').innerHTML='<div class="loading-card"></div>';
  renderShipmentRooms();
  setChatRoomHeader(room);
  try{shipmentRealtimeChannel=subscribeToShipmentRoom(room.id,()=>loadShipmentMessages(room,true));}catch(err){console.warn('shipment realtime',err);}
  await loadShipmentMessages(room,false);
}
function openPublicChat(){
  if(shipmentRealtimeChannel){unsubscribeFromShipmentRoom(shipmentRealtimeChannel);shipmentRealtimeChannel=null;}
  ++chatRequest;++publicChatRequest;
  activeShipmentRoom=null;
  $('#chatInput').value='';
  shipmentMessages=[];renderChatFromCache();
  renderShipmentRooms();
  $('#publicChatRoom')?.classList.add('active');
  loadChat(true);
}
async function loadShipmentMessages(room=activeShipmentRoom,silent=false){
  if(!room||room.id!==activeShipmentRoom?.id||!state.session)return;
  const request=++chatRequest,uid=state.session.user.id;
  try{const {data,error}=await getShipmentMessages(room.id);if(error) throw error;if(request!==chatRequest||room.id!==activeShipmentRoom?.id||uid!==state.session?.user?.id)return;shipmentMessages=(data||[]).slice().reverse();renderShipmentMessages();}
  catch(err){if(request===chatRequest&&room.id===activeShipmentRoom?.id&&!silent){$('#chatMessages').innerHTML=emptyBlock('unexpectedError',humanError(err));}}
}
async function sendShipmentChat(){
  const input=$('#chatInput'),body=input.value.trim(),room=activeShipmentRoom;if(!body||!room||chatSending||!requireCompleteProfile())return;
  const button=$('#sendChat');chatSending=true;button.disabled=true;
  try{const {error}=await sendShipmentText(room.id,body);if(error)throw error;if(activeShipmentRoom?.id===room.id){if(input.value.trim()===body)input.value='';await loadShipmentMessages(room,true);}}
  catch(err){toast(humanError(err),'error');}finally{chatSending=false;button.disabled=!state.session;}
}
async function loadUnread(){
  if(!state.session){$('#chatDot').style.display='none';return;}
  try{const {data,error}=await getPublicChatUnreadCount(); if(error) throw error; const n=Number(data||0); $('#chatDot').style.display=n>0?'block':'none'; $('#chatHint').textContent=n?`${n} · ${t('publicChat')}`:t('publicChat');}catch{}
}


async function syncSuperAdminMapAccess(){
  const panel=$('#adminUserMapPanel');
  if(!panel) return;
  state.isSuperAdmin=false;
  if(!state.session){
    panel.classList.add('hidden');
    return;
  }
  try{
    const {data,error}=await isSuperAdmin(state.session.user.id);
    if(error) throw error;
    state.isSuperAdmin=data===true;
  }catch(err){
    console.warn('super admin check',err);
    state.isSuperAdmin=false;
  }
  panel.classList.toggle('hidden',!state.isSuperAdmin);
  clearInterval(state.adminMapRefreshTimer);
  if(state.isSuperAdmin){
    requestAnimationFrame(()=>loadAdminUserMap(true));
    state.adminMapRefreshTimer=setInterval(()=>loadAdminUserMap(true),15*1000);
  }
}
function adminMapPopup(row){
  const name=esc(row.display_name||t('guest'));
  const type=esc(typeLabel(row.business_user_type));
  const updated=row.updated_at?esc(dateLabel(row.updated_at)):'—';
  const accuracy=Number(row.accuracy_meters);
  const accuracyText=Number.isFinite(accuracy)?`±${Math.round(accuracy)} m`:'—';
  const ageMs=row.updated_at ? Date.now()-new Date(row.updated_at).getTime() : Infinity;
  const freshness=ageMs<=15*60*1000
    ? (state.lang==='fa'?'کمتر از ۱۵ دقیقه':state.lang==='tr'?'15 dakikadan yeni':'Under 15 minutes')
    : ageMs<=60*60*1000
      ? (state.lang==='fa'?'۱۵ تا ۶۰ دقیقه':state.lang==='tr'?'15–60 dakika':'15–60 minutes')
      : (state.lang==='fa'?'بیشتر از ۱ ساعت':state.lang==='tr'?'1 saatten eski':'Over 1 hour');
  const source=row.source==='SHIPMENT_LIVE'
    ? (state.lang==='fa'?'حمل زنده':state.lang==='tr'?'Canlı taşıma':'Live shipment')
    : (state.lang==='fa'?'موقعیت راننده':state.lang==='tr'?'Sürücü konumu':'Driver location');
  const company=row.company_name||row.organization_name||row.driver_company_name||'';
  const active=row.is_active===false
    ? (state.lang==='fa'?'غیرفعال':state.lang==='tr'?'Pasif':'Inactive')
    : (state.lang==='fa'?'فعال':state.lang==='tr'?'Aktif':'Active');
  const field=(label,value)=>value?`<div class="admin-profile-row"><span>${esc(label)}</span><b>${esc(value)}</b></div>`:'';
  return `<div class="admin-map-popup admin-profile-popup">
    <div class="admin-profile-head">
      <div><b class="admin-profile-name">${name}</b><span>${type}</span></div>
      <em class="${row.is_active===false?'is-off':'is-on'}">${esc(active)}</em>
    </div>
    <div class="admin-profile-grid">
      ${field(state.lang==='fa'?'ایمیل':state.lang==='tr'?'E-posta':'Email',row.email)}
      ${field(state.lang==='fa'?'تلفن':state.lang==='tr'?'Telefon':'Phone',row.phone)}
      ${field('WhatsApp',row.whatsapp_phone)}
      ${field(state.lang==='fa'?'شرکت / مجموعه':state.lang==='tr'?'Şirket / kurum':'Company / organization',company)}
      ${field(state.lang==='fa'?'کشور':state.lang==='tr'?'Ülke':'Country',row.country_code)}
      ${field(state.lang==='fa'?'پلاک کشنده':state.lang==='tr'?'Çekici plakası':'Tractor plate',row.tractor_transit_plate)}
      ${field(state.lang==='fa'?'پلاک تریلر':state.lang==='tr'?'Dorse plakası':'Trailer plate',row.container_transit_plate)}
      ${field(state.lang==='fa'?'شماره ثبت':state.lang==='tr'?'Sicil no':'Registration no.',row.registration_number)}
      ${field(state.lang==='fa'?'شماره گواهینامه':state.lang==='tr'?'Ehliyet no':'License no.',row.license_number)}
    </div>
    <div class="admin-profile-location">
      <small>${esc(freshness)} · ${esc(source)}</small>
      <small>${updated} · ${accuracyText}</small>
    </div>
  </div>`;
}

// Separate overlapping markers in screen pixels; never change stored coordinates.
function separateAdminMapMarkers(items,map){
  // Keep geographic positions in the overview; separate only in close views.
  if(map.getZoom()<12){
    for(const item of items){
      item.displayLatlng=item.latlng;
      item.displaced=false;
    }
    return items;
  }
  const gap=24; // 18px marker + 3px stroke on each side.
  const cells=new Map();
  const key=p=>`${Math.floor(p.x/gap)},${Math.floor(p.y/gap)}`;
  const available=p=>{
    const x=Math.floor(p.x/gap), y=Math.floor(p.y/gap);
    for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++){
      for(const other of cells.get(`${x+dx},${y+dy}`)||[]){
        if(Math.hypot(p.x-other.x,p.y-other.y)<gap-.01) return false;
      }
    }
    return true;
  };
  const identity=item=>String(item.row.user_id||item.row.id||
    `${item.latlng.lat},${item.latlng.lng}:${item.row.display_name||''}:${item.row.location_source||''}`);
  const ordered=[...items].sort((a,b)=>identity(a).localeCompare(identity(b)));
  for(const item of ordered){
    const origin=map.latLngToLayerPoint(item.latlng);
    let point=origin;
    // Compact concentric rings keep the displacement close to the real point.
    for(let ring=1;!available(point);ring++){
      const radius=gap*ring, slots=6*ring;
      for(let slot=0;slot<slots;slot++){
        const angle=2*Math.PI*slot/slots;
        const candidate=L.point(origin.x+radius*Math.cos(angle),origin.y+radius*Math.sin(angle));
        if(available(candidate)){ point=candidate; break; }
      }
    }
    const bucket=key(point);
    if(!cells.has(bucket)) cells.set(bucket,[]);
    cells.get(bucket).push(point);
    item.displayLatlng=map.layerPointToLatLng(point);
    item.displaced=Math.hypot(point.x-origin.x,point.y-origin.y)>1;
  }
  return items;
}

function renderAdminUserMap(rows=[]){
  state.adminMapRows=rows;
  const mapEl=$('#adminUserMap');
  const empty=$('#adminMapEmpty');
  const count=$('#adminMapUserCount');
  if(count) count.textContent=String(rows.length);
  if(!mapEl || !state.isSuperAdmin || !L) return;

  if(!state.adminUserMap){
    state.adminUserMap=L.map(mapEl,{
      zoomControl:true,
      attributionControl:true,
      worldCopyJump:true,
      preferCanvas:true
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:18,
      attribution:'&copy; OpenStreetMap contributors'
    }).addTo(state.adminUserMap);
    state.adminUserMapLayer=L.layerGroup().addTo(state.adminUserMap);
    state.adminUserMap.fitBounds([[25.0,24.0],[43.5,63.5]],{padding:[18,18]});

    let redrawTimer=null;
    const redraw=()=>{
      clearTimeout(redrawTimer);
      redrawTimer=setTimeout(()=>{
        if(state.adminMapRows?.length) renderAdminUserMap(state.adminMapRows);
      },80);
    };
    state.adminUserMap.on('zoomend',redraw);
  }

  state.adminUserMapLayer.clearLayers();

  const valid=rows.filter(row=>{
    const lat=Number(row.latitude), lng=Number(row.longitude);
    return Number.isFinite(lat)&&Number.isFinite(lng)&&lat>=-90&&lat<=90&&lng>=-180&&lng<=180;
  });

  if(!valid.length){
    if(empty) empty.classList.remove('hidden');
    requestAnimationFrame(()=>{
      state.adminUserMap.invalidateSize();
      if(!state.adminMapHasInitialFit){
        state.adminUserMap.fitBounds([[25.0,24.0],[43.5,63.5]],{padding:[18,18]});
        state.adminMapHasInitialFit=true;
      }
    });
    return;
  }

  if(empty) empty.classList.add('hidden');

  const items=valid.map(row=>({
    row,
    latlng:L.latLng(Number(row.latitude),Number(row.longitude))
  }));

  separateAdminMapMarkers(items,state.adminUserMap);

  items.forEach(item=>{

    const row=item.row;
    const ageMs=row.updated_at ? Date.now()-new Date(row.updated_at).getTime() : Infinity;
    const freshnessClass=ageMs>60*60*1000?'stale':ageMs>15*60*1000?'aging':'fresh';
    const markerColor=freshnessClass==='fresh'?'#f6b817':freshnessClass==='aging'?'#2f80ed':'#ef4444';
    const label=esc(row.display_name||typeLabel(row.business_user_type)||'Yoldash');

    if(item.displaced){
      L.polyline([item.latlng,item.displayLatlng],{
        color:markerColor,weight:1,opacity:.45,interactive:false
      }).addTo(state.adminUserMapLayer);
    }
    const marker=L.circleMarker(item.displayLatlng,{
      radius:9,
      weight:3,
      color:'#ffffff',
      fillColor:markerColor,
      opacity:1,
      fillOpacity:.95,
      className:`yoldash-map-marker ${freshnessClass}`
    });

    marker.bindTooltip(label,{
      permanent:false,
      sticky:true,
      direction:'top',
      offset:[0,-10],
      opacity:0.96,
      className:'yoldash-map-label'
    });

    marker.bindPopup(adminMapPopup(row),{
      className:'yoldash-map-popup',
      maxWidth:360,
      minWidth:280
    });

    marker.addTo(state.adminUserMapLayer);
  });

  const bounds=items.map(x=>x.latlng);
  requestAnimationFrame(()=>{
    state.adminUserMap.invalidateSize();
    if(!state.adminMapHasInitialFit){
      if(bounds.length===1) state.adminUserMap.setView(bounds[0],10);
      else state.adminUserMap.fitBounds(bounds,{padding:[45,45],maxZoom:10});
      state.adminMapHasInitialFit=true;
    }
  });
}

async function loadAdminUserMap(silent=false){
  if(!state.session||!state.isSuperAdmin) return;
  const btn=$('#refreshAdminUserMap');
  if(btn) btn.disabled=true;
  try{
    await ensureLeaflet();
    // Sign-out or a role change may occur while the library is downloading.
    if(!state.session||!state.isSuperAdmin) return;
    const {data,error}=await getSuperAdminUserMap();
    if(error) throw error;
    renderAdminUserMap(Array.isArray(data)?data:[]);
    const sync=$('#adminMapLastSync');
    if(sync) sync.textContent=new Date().toLocaleTimeString(localeMap[state.lang],{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  }catch(err){
    console.warn('admin user map',err);
    if(!silent) toast(humanError(err),'error');
  }finally{
    if(btn) btn.disabled=false;
  }
}

function notificationText(n){
  const type=String(n?.type||'');
  const route=[n?.origin_city,n?.destination_city].filter(Boolean).join(' → ');
  const actor=n?.actor_name ? String(n.actor_name) : '';
  const preview=n?.message_preview ? String(n.message_preview) : '';
  const fa={
    TRANSPORT_REQUEST:'درخواست حمل جدید',
    REQUEST_SENT:'درخواست حمل شما ارسال شد',
    REQUEST_ACCEPTED:'درخواست حمل شما پذیرفته شد',
    SHIPMENT_MESSAGE:'پیام جدید مربوط به حمل',
    NEARBY_CARGO:'بار جدید نزدیک شما',
    SHIPMENT_CANCELLED:'حمل لغو شد',
    SHIPMENT_STATUS:'وضعیت حمل تغییر کرد'
  };
  const tr={
    TRANSPORT_REQUEST:'Yeni taşıma talebi',
    REQUEST_SENT:'Taşıma talebiniz gönderildi',
    REQUEST_ACCEPTED:'Taşıma talebiniz kabul edildi',
    SHIPMENT_MESSAGE:'Taşıma için yeni mesaj',
    NEARBY_CARGO:'Yakınınızda yeni yük',
    SHIPMENT_CANCELLED:'Taşıma iptal edildi',
    SHIPMENT_STATUS:'Taşıma durumu değişti'
  };
  const en={
    TRANSPORT_REQUEST:'New transport request',
    REQUEST_SENT:'Your transport request was sent',
    REQUEST_ACCEPTED:'Your transport request was accepted',
    SHIPMENT_MESSAGE:'New shipment message',
    NEARBY_CARGO:'New cargo near you',
    SHIPMENT_CANCELLED:'Shipment cancelled',
    SHIPMENT_STATUS:'Shipment status changed'
  };
  const title=(state.lang==='fa'?fa:state.lang==='tr'?tr:en)[type] || type.replaceAll('_',' ');
  const detail=preview || route || actor || '';
  return {title,detail};
}
function renderNotifications(rows=[]){
  const list=$('#notificationList');
  if(!list) return;
  if(!rows.length){
    list.innerHTML=`<div class="notification-empty">${esc(t('noNotifications'))}</div>`;
    return;
  }
  list.innerHTML=rows.map(n=>{
    const tx=notificationText(n);
    const unread=!n.read_at;
    return `<button type="button" class="notification-item ${unread?'unread':''}" data-notification-id="${esc(n.id)}" data-notification-cargo="${esc(n.cargo_id||'')}" data-notification-room="${esc(n.room_id||'')}" data-notification-offer="${esc(n.offer_id||'')}">
      <span class="notification-dot"></span>
      <span class="notification-copy"><b>${esc(tx.title)}</b><small>${esc(tx.detail)}</small><time>${esc(dateLabel(n.created_at))}</time></span>
    </button>`;
  }).join('');
  $$('[data-notification-id]').forEach(btn=>btn.onclick=()=>openNotification(btn));
}
async function loadNotifications(){
  const count=$('#notificationCount');
  const label=$('#notificationUnreadLabel');
  if(!state.session){
    if(count){count.textContent='0';count.classList.add('hidden');}
    if(label) label.textContent='';
    renderNotifications([]);
    return;
  }
  try{
    const {data,error}=await listUserNotifications(state.session.user.id,40);
    if(error) throw error;
    const rows=data||[];
    const unread=rows.filter(n=>!n.read_at).length;
    if(count){
      count.textContent=unread>99?'99+':String(unread);
      count.classList.toggle('hidden',unread===0);
    }
    if(label) label.textContent=unread?`${unread} ${t('unreadNotifications')}`:t('noNotifications');
    renderNotifications(rows);
  }catch(err){
    console.warn('notifications',err);
  }
}
async function markNotificationRead(id){
  if(!state.session||!id) return;
  const {error}=await markUserNotificationRead({userId:state.session.user.id,id});
  if(error) console.warn('mark notification read',error);
}
async function openNotification(btn){
  const id=btn.dataset.notificationId;
  const cargoId=btn.dataset.notificationCargo;
  const roomId=btn.dataset.notificationRoom;
  const offerId=btn.dataset.notificationOffer;
  await markNotificationRead(id);
  await loadNotifications();
  $('#notificationPanel')?.classList.add('hidden');
  if(roomId || offerId){
    await loadShipmentRooms(true);
    let room=shipmentRooms.find(item=>item.id===roomId);
    if(!room && offerId){
      const result=await getShipmentRoomForOffer(offerId);
      room=(result.data||[])[0];
    }
    if(room){page('chat');await openShipmentRoom(room);return;}
  }
  if(cargoId){
    page('loads');
    const card=document.querySelector(`[data-cargo-id="${CSS.escape(cargoId)}"]`);
    card?.scrollIntoView({behavior:'smooth',block:'center'});
  }
}
async function markAllNotificationsRead(){
  if(!state.session) return;
  try{
    const {error}=await markAllUserNotificationsRead(state.session.user.id);
    if(error) throw error;
    await loadNotifications();
  }catch(err){ console.warn('mark all notifications read',err); }
}
function nearbyCopy(key){
 const copy={fa:{title:'اعلان بارهای نزدیک',mode:'شعاع دریافت بار',off:'خاموش',all:'همه بارها',locate:'ارسال موقعیت فعلی برای اعلان بار',hint:'برای شعاع ۲۰۰ یا ۴۰۰ کیلومتر، موقعیت دقیق با عمر کمتر از ۱۵ دقیقه لازم است. این دکمه موقعیت شما را برای یولداش ارسال می‌کند. دریافت در پس‌زمینه به اپ و مجوزهای دستگاه وابسته است.',saved:'تنظیم اعلان ذخیره شد.',ready:'موقعیت ثبت شد؛ برای ۱۵ دقیقه آینده قابل استفاده است.',failed:'موقعیت دریافت نشد؛ مجوز مکان دستگاه را بررسی و دوباره تلاش کنید.',working:'در حال انجام…'},tr:{title:'Yakındaki yük bildirimleri',mode:'Bildirim alanı',off:'Kapalı',all:'Tüm yükler',locate:'Bildirimler için konumumu paylaş',hint:'200/400 km için 15 dakikadan yeni, doğru bir konum gerekir. Bu düğme konumunuzu Yoldash ile paylaşır. Arka plan bildirimleri uygulamaya ve cihaz izinlerine bağlıdır.',saved:'Tercih kaydedildi.',ready:'Konum kaydedildi; 15 dakika geçerlidir.',failed:'Konum alınamadı. Konum iznini kontrol edin.',working:'İşleniyor…'},en:{title:'Nearby cargo alerts',mode:'Alert radius',off:'Off',all:'All cargo',locate:'Share current location for cargo alerts',hint:'200/400 km alerts require an accurate location less than 15 minutes old. This button shares your location with Yoldash. Background delivery depends on the app and device permissions.',saved:'Preference saved.',ready:'Location saved; usable for the next 15 minutes.',failed:'Could not get location. Check location permission and retry.',working:'Working…'}};
 return (copy[state.lang]||copy.en)[key];
}
async function loadNearbySettings(){
 const panel=$('#nearbySettings'),uid=state.session?.user?.id;
 panel.hidden=state.profile?.business_user_type!=='DRIVER';if(panel.hidden)return;
 $('#nearbyTitle').textContent=nearbyCopy('title');$('#nearbyModeLabel').textContent=nearbyCopy('mode');$('#nearbyHint').textContent=nearbyCopy('hint');$('#nearbyLocation').textContent=nearbyCopy('locate');
 $('#nearbyMode').options[0].textContent=nearbyCopy('off');$('#nearbyMode').options[3].textContent=nearbyCopy('all');
 $('#nearbyMode').disabled=true;
 try{const {data,error}=await getCargoNotificationPreference();if(error)throw error;if(uid!==state.session?.user?.id)return;const row=Array.isArray(data)?data[0]:data;$('#nearbyMode').value=row?.notification_mode||'OFF';$('#nearbyStatus').textContent='';}
 catch(error){$('#nearbyStatus').textContent=humanError(error);return;}
 finally{if(uid===state.session?.user?.id)$('#nearbyMode').disabled=false;}
}
async function saveNearbyMode(){
 const input=$('#nearbyMode'),uid=state.session?.user?.id;if(!uid||input.disabled)return;input.disabled=true;
 try{const {error}=await setCargoNotificationMode(input.value);if(error)throw error;if(uid===state.session?.user?.id)$('#nearbyStatus').textContent=nearbyCopy('saved');}
 catch(error){if(uid===state.session?.user?.id)$('#nearbyStatus').textContent=humanError(error);}
 finally{input.disabled=false;}
}
async function shareNearbyLocation(){
 const button=$('#nearbyLocation'),uid=state.session?.user?.id;if(button.disabled||!uid)return;button.disabled=true;$('#nearbyStatus').textContent=nearbyCopy('working');
 try{
  if(!navigator.geolocation)throw new Error(nearbyCopy('failed'));
  const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:15000,maximumAge:0}));
  if(uid!==state.session?.user?.id)return;
  const {error}=await updateNotificationLocation(position.coords);if(error)throw error;$('#nearbyStatus').textContent=nearbyCopy('ready');
 }catch(error){if(uid===state.session?.user?.id)$('#nearbyStatus').textContent=error?.code===1||error?.code===2||error?.code===3?nearbyCopy('failed'):humanError(error);}
 finally{button.disabled=false;}
}
function startNotificationRealtime(){
  try{
    if(notificationRealtimeChannel) unsubscribeFromUserNotifications(notificationRealtimeChannel);
    if(!state.session) return;
    notificationRealtimeChannel=subscribeToUserNotifications(state.session.user.id,()=>loadNotifications());
  }catch(err){console.warn('notification realtime',err);}
}
function startNotificationPolling(){
  clearInterval(state.notificationTimer);
  if(!state.session) return;
  state.notificationTimer=setInterval(()=>{
    if(document.visibilityState==='visible' && state.session) loadNotifications();
  },10000);
}

function fxNumber(value){
  const n=Number(value);
  if(!Number.isFinite(n)||n<=0) return '—';
  return new Intl.NumberFormat(localeMap[state.lang],{maximumFractionDigits:0}).format(n);
}
function renderFxRates(){
  const d=state.fxData;
  if(!$('#fxUsd')) return;
  $('#fxUsd').textContent=d?fxNumber(d.rates?.usd_to_toman):'—';
  $('#fxEur').textContent=d?fxNumber(d.rates?.eur_to_toman):'—';
  $('#fxTry').textContent=d?fxNumber(d.rates?.try_to_toman):'—';

  const status=$('#fxStatus');
  const statusText=$('#fxStatusText');
  const updated=$('#fxUpdated');
  if(!d){
    status?.classList.add('fx-offline');
    if(statusText) statusText.textContent=t('ratesUnavailable');
    if(updated) updated.textContent=t('ratesUnavailable');
    return;
  }
  status?.classList.remove('fx-offline');
  status?.classList.toggle('fx-stale',!!d.stale);
  if(statusText) statusText.textContent=d.stale?t('ratesStale'):t('live');
  if(updated){
    const when=d.fetched_at?dateLabel(d.fetched_at):'—';
    updated.textContent=`${t('ratesUpdated')}: ${when}`;
  }
}
async function loadFxRates(silent=false){
  const refresh=$('#refreshFx');
  if(refresh) refresh.classList.add('spinning');
  try{
    const {data,error}=await fetchFxRates();
    if(error) throw error;
    if(!data?.success||!data?.rates) throw new Error('fx_invalid_response');
    state.fxData=data;
    renderFxRates();
  }catch(err){
    console.warn('fx-rates',err);
    if(!state.fxData) renderFxRates();
    if(!silent) toast(t('ratesUnavailable'),'error');
  }finally{
    if(refresh) refresh.classList.remove('spinning');
  }
}
function startFxRates(){
  clearInterval(state.fxTimer);
  loadFxRates(true);
  state.fxTimer=setInterval(()=>loadFxRates(true),5*60*1000);
}

function networkUI(){
  const online=navigator.onLine,node=$('#networkStatus');node.classList.toggle('offline',!online);node.querySelector('span').textContent=online?t('onlineLabel'):t('offlineLabel');
}
function canonicalFallback(){
  const host=location.hostname.toLowerCase();
  if(host==='getyoldash.com'||(host.endsWith('.getyoldash.com')&&host!=='www.getyoldash.com')||(host==='www.getyoldash.com'&&location.protocol==='http:')){
    location.replace(`https://www.getyoldash.com${location.pathname}${location.search}${location.hash}`);
  }
}

function bindUI(){
  window.addEventListener('popstate',()=>page(new URL(location.href).searchParams.get('page')||'home',false));
  $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.lang)));
  $$('[data-page]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close)?.close()));
  $('#mobileMenu').onclick=()=>{
    const sidebar=$('.sidebar');
    if(!sidebar) return;
    const opening=!sidebar.classList.contains('open');
    sidebar.classList.toggle('open',opening);
    $('#mobileMenu').setAttribute('aria-expanded',String(opening));
    if(window.matchMedia('(max-width: 900px)').matches){
      sidebar.style.display=opening?'flex':'none';
      sidebar.style.visibility=opening?'visible':'hidden';
      sidebar.style.opacity=opening?'1':'0';
      sidebar.style.pointerEvents=opening?'auto':'none';
      sidebar.style.transform=opening?'translateX(0)':'';
    }
  };
  ['createLoadBtn','createLoadBtn2','quickLoad'].forEach(id=>$('#'+id)?.addEventListener('click',openLoadModal));
  $('#authBtn').onclick=()=>$('#authModal').showModal(); $('#openBoardBtn').onclick=()=>page('loads'); $('#seeAll').onclick=()=>page('loads');
  $('#quickBrowse').onclick=()=>page('drivers'); $('#quickChat').onclick=()=>page('chat'); $('#driverBrowseLoads').onclick=()=>page('loads');
  $('#refreshShipments').onclick=loadShipments;$('#loadMoreCargo').onclick=()=>loadLoads('',true);
  $('#nearbyMode').onchange=saveNearbyMode;$('#nearbyLocation').onclick=shareNearbyLocation;
  $('#notificationBtn')?.addEventListener('click',async(e)=>{e.stopPropagation();if(!state.session){$('#authModal')?.showModal();return;}const panel=$('#notificationPanel');panel?.classList.toggle('hidden');if(panel&&!panel.classList.contains('hidden'))await Promise.all([loadNotifications(),loadNearbySettings()]);});
  $('#markAllNotificationsRead')?.addEventListener('click',markAllNotificationsRead);
  $('#refreshAdminUserMap')?.addEventListener('click',()=>loadAdminUserMap(false));
  document.addEventListener('click',e=>{const p=$('#notificationPanel');if(p&&!p.classList.contains('hidden')&&!p.contains(e.target)&&!$('#notificationBtn')?.contains(e.target))p.classList.add('hidden');});
  $('#refreshFx')?.addEventListener('click',()=>loadFxRates(false));
  $('#createDriverListing').onclick=()=>openDriverListing(); $('#driverListingForm').addEventListener('submit',submitDriverListing); $('#driverHubSearch').addEventListener('input',renderDriverHub); $$('[data-listing-type]').forEach(b=>b.onclick=()=>{$('#driverListingType').value=b.dataset.listingType;syncDriverListingSegments();}); $$('[data-employment-type]').forEach(b=>b.onclick=()=>{$('#driverEmploymentType').value=b.dataset.employmentType;syncDriverListingSegments();}); $$('[data-driver-filter]').forEach(b=>b.onclick=()=>{state.driverFilter=b.dataset.driverFilter;$$('[data-driver-filter]').forEach(x=>x.classList.toggle('active',x===b));renderDriverHub();});
  $('#loadingAt')?.addEventListener('change',normalizeLoadingDateToday);
  $('#loadForm').addEventListener('submit',submitLoad); $('#offerForm').addEventListener('submit',submitOffer); $('#authForm').addEventListener('submit',submitAuth); $('#recoveryForm')?.addEventListener('submit',submitRecovery);
  $('#saveProfileBtn').onclick=saveProfile; $('#forgotPassword').onclick=showForgotPassword; $('#sendResetLink').onclick=forgotPassword; $('#backFromForgot').onclick=()=>{showAuthEntry();setAuthMode('signin');}; $('#resendVerification').onclick=resendVerification; $('#backToSignIn').onclick=()=>{showAuthEntry();setAuthMode('signin');}; $('#authPasswordToggle').onclick=()=>{const input=$('#authPassword');const show=input.type==='password';input.type=show?'text':'password';$('#authPasswordToggle').textContent=show?'◌':'◉';}; $('#signOutBtn').onclick=signOutUser;
  $$('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
  $$('[data-business-type]').forEach(b=>b.onclick=()=>{state.selectedBusinessType=b.dataset.businessType;$$('[data-business-type]').forEach(x=>x.classList.toggle('active',x===b));});
  $('#loadSearch').addEventListener('input',renderLoads);
  $('#boardFilterToggle')?.addEventListener('click',()=>{
    const panel=$('#boardFilterPanel');
    panel.hidden=!panel.hidden;
    $('#boardFilterToggle').setAttribute('aria-expanded',String(!panel.hidden));
  });
  $('#boardFilterPanel')?.addEventListener('keydown',event=>{
    if(event.key==='Escape'){
      $('#boardFilterPanel').hidden=true;
      $('#boardFilterToggle').setAttribute('aria-expanded','false');
      $('#boardFilterToggle').focus();
    }
  });
  ['boardOrigin','boardDestination','boardTruck','boardTruckCount','boardCurrency'].forEach(id=>$('#'+id)?.addEventListener('change',renderLoads));
  ['boardOriginCity','boardDestinationCity'].forEach(id=>$('#'+id)?.addEventListener('input',renderLoads));
  $('#boardSort')?.addEventListener('change',()=>{
    if($('#boardSort').value==='price'&&!$('#boardCurrency').value) $('#boardCurrency').value='USD';
    if($('#boardSort').value==='nearest'&&!boardPosition) requestBoardLocation();
    else renderLoads();
  });
  $('#boardCurrency')?.addEventListener('change',()=>{
    if($('#boardSort').value==='price'&&!$('#boardCurrency').value) $('#boardSort').value='latest';
    renderLoads();
  });
  $('#locateForLoads')?.addEventListener('click',requestBoardLocation);
  $('#clearBoardFilters')?.addEventListener('click',()=>{
    ['boardOrigin','boardDestination','boardTruck','boardTruckCount','boardCurrency','boardOriginCity','boardDestinationCity','loadSearch','globalSearch'].forEach(id=>{if($('#'+id)) $('#'+id).value='';});
    $('#boardSort').value='latest'; boardLocationRequest++; boardPosition=null; boardLocationMessage='';
    state.loadFilter='all';
    $$('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter==='all'));
    renderLoads(); $('#loadSearch')?.focus();
  });
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){page('loads');$('#loadSearch').value=e.target.value;renderLoads();}});
  $$('[data-filter]').forEach(b=>b.onclick=()=>{state.loadFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderLoads();});
  $('#publicChatRoom')?.addEventListener('click',openPublicChat);
  $('#sendChat').onclick=sendChat; $('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  window.addEventListener('online',networkUI);window.addEventListener('offline',networkUI);
  window.addEventListener('focus',()=>{if(state.session) loadNotifications();});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&state.session) loadNotifications();});
}

async function signOutUser(){
  const btn=$('#signOutBtn');
  if(btn) btn.disabled=true;

  // Make logout deterministic on this device even if the network or Supabase
  // sign-out request is slow/unavailable. The app will reload with no saved session.
  try{
    const projectRef='ubqrafuustkyenbbzhtg';
    const exactKey=`sb-${projectRef}-auth-token`;
    const removeAuthKeys=(storage)=>{
      if(!storage) return;
      const keys=[];
      for(let i=0;i<storage.length;i++){
        const key=storage.key(i);
        if(key && (key===exactKey || key.startsWith(exactKey+'.') || key.startsWith(exactKey+'-'))) keys.push(key);
      }
      keys.forEach(key=>storage.removeItem(key));
    };
    try{ removeAuthKeys(window.localStorage); }catch{}
    try{ removeAuthKeys(window.sessionStorage); }catch{}

    state.session=null;
    state.profile=null;
    state.businessProfile=null;
    state.isSuperAdmin=false;
    shipmentCargoCache=[];++shipmentRequest;
    chatCache=[];
    shipmentRooms=[];
    shipmentMessages=[];
    activeShipmentRoom=null;
    if(shipmentRealtimeChannel){unsubscribeFromShipmentRoom(shipmentRealtimeChannel);shipmentRealtimeChannel=null;}

    clearInterval(state.chatTimer);
    clearInterval(state.notificationTimer);
    clearInterval(state.adminMapRefreshTimer);

    try{
      if(notificationRealtimeChannel){
        unsubscribeFromUserNotifications(notificationRealtimeChannel);
        notificationRealtimeChannel=null;
      }
    }catch{}

    renderProfileUI();
    if($('#authModal')?.open) $('#authModal').close();
    setAuthMode('signin');

    // Best-effort SDK cleanup. Local storage is already cleared, so failure here
    // must never keep the user signed in on this device.
    try{ await Promise.race([
      signOutLocal(),
      new Promise(resolve=>setTimeout(()=>resolve({error:null}),1200))
    ]); }catch(err){ console.warn('supabase signOut cleanup',err); }

    location.replace('/');
  }catch(err){
    console.error('signOut',err);
    if(btn) btn.disabled=false;
    toast(humanError(err),'error');
  }
}

function handleAuthCallbackErrors(){
  try{
    const query=new URLSearchParams(location.search||'');
    const hash=new URLSearchParams((location.hash||'').replace(/^#/,''));
    const code=query.get('error_code')||hash.get('error_code')||query.get('error')||hash.get('error');
    const description=query.get('error_description')||hash.get('error_description');
    if(!code&&!description) return;
    const msg=(description||code||t('unexpectedError')).replace(/\+/g,' ');
    setTimeout(()=>{
      if(!$('#authModal')?.open) $('#authModal')?.showModal();
      showAuthEntry();
      const status=$('#authStatus');
      if(status){status.className='auth-status error';status.textContent=decodeURIComponent(msg);}
    },0);
    const clean=`${location.pathname}`;
    history.replaceState({},document.title,clean);
  }catch(err){console.warn('auth callback parse',err);}
}

async function init(){
  canonicalFallback();

  // Keep narrow layouts deterministic even while older cached CSS is still present.
  if(window.matchMedia('(max-width: 900px)').matches){
    const sidebar=$('.sidebar');
    if(sidebar){
      sidebar.classList.remove('open');
      sidebar.style.display='none';
      sidebar.style.visibility='hidden';
      sidebar.style.opacity='0';
      sidebar.style.pointerEvents='none';
    }
    const main=$('.main');
    if(main){
      main.style.display='block';
      main.style.width='100%';
      main.style.maxWidth='100%';
    }
  }

  try{ bindUI(); }catch(err){ console.error('bindUI init',err); }
  try{ networkUI(); }catch(err){ console.error('networkUI init',err); }
  try{ const incomingLang=new URL(location.href).searchParams.get('lang');applyLanguage(['fa','tr','en'].includes(incomingLang)?incomingLang:state.lang,['fa','tr','en'].includes(incomingLang)); }catch(err){ console.error('language init',err); }
  try{ setAuthMode('signin'); handleAuthCallbackErrors(); }catch(err){ console.error('auth ui init',err); }

  // FX must never depend on auth, profile, cargo or any other module.
  startFxRates();

  try{ setupCitySearch('origin'); setupCitySearch('destination'); }catch(err){ console.error('city init',err); }

  try{
    onAuthStateChange((event,session)=>setTimeout(async()=>{
      try{
        if(event==='INITIAL_SESSION' && !session){
          const current=await getCurrentSession();
          session=current.data?.session||null;
        }
        state.session=session;
        if(session) await loadProfile();
        else {state.profile=null;state.businessProfile=null;shipmentCargoCache=[];++shipmentRequest;chatCache=[];shipmentRooms=[];shipmentMessages=[];activeShipmentRoom=null;if(shipmentRealtimeChannel){unsubscribeFromShipmentRoom(shipmentRealtimeChannel);shipmentRealtimeChannel=null;}}
        renderProfileUI();
        loadUnread();
        startNotificationRealtime();
        startNotificationPolling();
        await loadNotifications();
        if(session && !isFullProfileReady() && event!=='PASSWORD_RECOVERY'){
          if(!$('#authModal')?.open) $('#authModal')?.showModal();
        }
        if(event==='PASSWORD_RECOVERY'){
          $('#recoveryStatus').textContent='';
          $('#recoveryModal')?.showModal();
        }
        if($('#page-chat')?.classList.contains('active')) loadChat(true);
        if($('#page-drivers')?.classList.contains('active')) loadDriverHub();
      }catch(err){ console.error('auth state change',err); }
    },0));
  }catch(err){ console.error('auth listener init',err); }

  const initialPage=new URL(location.href).searchParams.get('page')||'home';
  if(initialPage!=='chat') page(initialPage,false);
  await Promise.allSettled([refreshSession(),loadLoads()]);
  try{ await syncSuperAdminMapAccess(); }catch(err){ console.error('admin map access init',err); }
  page(new URL(location.href).searchParams.get('page')||'home',false);
  try{ startLiveLoads(); }catch(err){ console.error('live loads init',err); }
}
init();


// Yoldash uses a single dark appearance across the application.
document.documentElement.dataset.theme='dark';
const v2ThemeButton = document.getElementById('themeToggle');
const syncV2ThemeButton = () => {
  if (!v2ThemeButton) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  v2ThemeButton.textContent = isDark ? '☀' : '◐';
  v2ThemeButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
};
syncV2ThemeButton();

if(v2ThemeButton)v2ThemeButton.hidden=true;

document.querySelectorAll('[data-v2-action="services"]').forEach((el) => {
  el.addEventListener('click', () => {
    document.querySelector('.nav-item[data-page="services"]')?.click();
  });
});

document.querySelectorAll('[data-v2-action="refresh-fx"]').forEach((el) => {
  el.addEventListener('click', () => {
    document.getElementById('refreshFx')?.click();
    document.getElementById('content-home')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// production-sync: navfix6

// production-sync: js-nav-hardfix7
