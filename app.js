import L from 'https://esm.sh/leaflet@1.9.4';
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
  getMyTransportCargo
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
  if (persist) localStorage.setItem('yoldash_lang', state.lang);
  document.documentElement.lang = state.lang;
  document.documentElement.dir = state.lang === 'fa' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  $$('.lang-switch button').forEach(b=>b.classList.toggle('active',b.dataset.lang===state.lang));
  renderLoads();
  renderProfileUI();
  renderFxRates();
  renderDriverHub();
  if(state.isSuperAdmin && state.adminMapRows?.length) renderAdminUserMap(state.adminMapRows);
  syncDriverListingSegments?.();
  if (state.session) renderChatFromCache?.();
}
function page(name){
  // Chat is available only after sign-in.  Opening the sign-in dialog here gives
  // guest users a clear next step instead of displaying an inactive chat screen.
  if(name==='chat' && !state.session){
    $('#authModal')?.showModal();
    return;
  }

  const target=$('#page-'+name);

  $$('.page').forEach(p=>{
    const active=p===target;
    p.classList.toggle('active',active);
    p.hidden=!active;
    p.style.display=active?'grid':'none';
  });

  $$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));

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
  } else if (!shipment && own) {
    primaryAction = `<button class="btn secondary owner-btn" disabled>${t('yourLoad')}</button>`;
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
        <span class="status-pill">${esc(c.status||'PUBLISHED')}</span>
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
        <button class="btn secondary cargo-detail-action" data-cargo-details="${esc(c.id)}">${t('details')} ↗</button>
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

  content.innerHTML=`
    <div class="cargo-detail-route">
      <div><span>${t('origin')}</span><b>${esc(from)}</b><small>${cargoDetailValue(cargo.origin_country_code)}</small></div>
      <i>→</i>
      <div><span>${t('destination')}</span><b>${esc(to)}</b><small>${cargoDetailValue(cargo.destination_country_code)}</small></div>
    </div>
    <div class="cargo-detail-grid">
      <div><span>${t('cargoType')}</span><b>${cargoDetailValue(cargo.cargo_type)}</b></div>
      <div><span>${t('truckType')}</span><b>${cargoDetailValue(truck)}</b></div>
      <div><span>${t('weight')}</span><b>${cargoDetailValue(weight)}</b></div>
      <div><span>${t('trucks')}</span><b>${cargoDetailValue(trucks)}</b></div>
      <div><span>${t('loadingAt')}</span><b>${cargoDetailValue(loading)}</b></div>
      <div class="cargo-detail-price"><span>${t('price')}</span><b>${cargoDetailValue(price)}</b></div>
    </div>
    ${customs ? `<div class="cargo-detail-note"><span>${t('originCustoms')} / ${t('destinationCustoms')}</span><b>${esc(customs)}</b></div>` : ''}
    ${cargo.description ? `<div class="cargo-detail-description"><span>${t('description')}</span><p>${esc(cargo.description)}</p></div>` : ''}`;
  dialog.showModal();
}
function emptyBlock(titleKey, body='') { return `<div class="empty-inline"><b>${t(titleKey)}</b>${body?`<span>${esc(body)}</span>`:''}</div>`; }
function renderLoads(){
  const q = ($('#loadSearch')?.value || '').trim().toLocaleLowerCase();
  const filtered = state.loads.filter(c=>{
    if(state.loadFilter==='international' && c.origin_country_code===c.destination_country_code) return false;
    if(state.loadFilter==='domestic' && c.origin_country_code!==c.destination_country_code) return false;
    if(!q) return true;
    return [
      cityName(c,'origin'),
      cityName(c,'destination'),
      c.cargo_type,
      c.required_truck_type,
      c.owner_display_name,
      c.origin_country_code,
      c.destination_country_code
    ].some(v=>String(v||'').toLocaleLowerCase().includes(q));
  });

  const internationalCount = state.loads.filter(c=>c.origin_country_code!==c.destination_country_code).length;
  const domesticCount = state.loads.length - internationalCount;
  const home = $('#cargoList');
  const all = $('#cargoListAll');

  if(home) home.innerHTML = state.loads.length
    ? state.loads.slice(0,3).map(c=>cargoCard(c)).join('')
    : emptyBlock('noLoads');

  if(all) all.innerHTML = filtered.length
    ? filtered.map(c=>cargoCard(c)).join('')
    : emptyBlock('noLoads');

  if($('#loadCountBadge')) $('#loadCountBadge').textContent = String(state.loads.length);
  if($('#metricLoads')) $('#metricLoads').textContent = String(state.loads.length);
  if($('#loadBoardTotal')) $('#loadBoardTotal').textContent = String(state.loads.length);
  if($('#loadBoardInternational')) $('#loadBoardInternational').textContent = String(internationalCount);
  if($('#loadBoardDomestic')) $('#loadBoardDomestic').textContent = String(domesticCount);
  if($('#loadBoardResultCount')) $('#loadBoardResultCount').textContent = `${filtered.length} / ${state.loads.length}`;

  bindCargoActions();
}
function bindCargoActions(){
  $$('[data-offer]').forEach(btn=>btn.onclick=()=>openOffer(btn.dataset.offer));
  $$('[data-cargo-details]').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.cargoDetails;
    if(id) openCargoDetails(id);
  });
  $$('[data-share-cargo]').forEach(btn=>btn.onclick=()=>shareCargo(btn.dataset.shareCargo));
}
async function loadLoads(query=''){
  const result = await fetchOpenLoads(query, 50);
  if(result.rpcError) console.warn('get_open_cargo_posts failed, using public table fallback', result.rpcError);
  if(result.error){
    state.loads=[];
    toast(humanError(result.error),'error');
  }else{
    state.loads=result.data;
  }
  renderLoads();
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
    return [r.title,r.description,r.city,r.country_code,r.truck_type,r.first_name,r.last_name].some(v=>String(v||'').toLocaleLowerCase().includes(q));
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
  if(!canPostTypes.has(state.profile?.business_user_type)){ toast(state.profile?.business_user_type==='DRIVER'?t('driverCannotPost'):t('postOnlyBusiness'),'error'); return; }
  $('#loadModal').showModal();
  try{
    const {data}=await getCurrentCargoDailyQuota(); const q=Array.isArray(data)?data[0]:data;
    if(q){ $('#quotaNote').innerHTML=`<span>✓</span><span>${t('quota')}: ${esc(q.used_count)} / ${esc(q.daily_limit)} · ${t('remaining')}: ${esc(q.remaining_count)}</span>`; }
  }catch{}
}
async function submitLoad(ev){
  ev.preventDefault();
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
    const {data:created,error}=await publishLoad(payload); if(error) throw error;
    $('#loadModal').close(); $('#loadForm').reset(); state.city={origin:null,destination:null}; toast(t('loadPublished')); await loadLoads();
    if(created?.id){
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
  }catch(err){ toast(humanError(err),'error'); }
  finally{ btn.disabled=false; btn.textContent=t('publishLoad'); }
}

async function setupCitySearch(which){
  const input=$(`#${which}City`), results=$(`#${which}CityResults`), country=$(`#${which}Country`); let timer;
  input.addEventListener('input',()=>{
    state.city[which]=null; clearTimeout(timer); const q=input.value.trim();
    if(q.length<2){results.classList.remove('open');results.innerHTML='';return;}
    timer=setTimeout(async()=>{
      const {data,error}=await searchCities({query:q,limit:8,countryCode:country.value});
      if(error||!data?.length){results.classList.remove('open');return;}
      results.innerHTML=data.map((c,i)=>`<button type="button" data-city-index="${i}"><b>${esc(c.matched_name||c.name_en||'')}</b><small>${esc(c.country_code||'')} · ${esc(c.region_name||'')}</small></button>`).join('');
      results.classList.add('open');
      $$('[data-city-index]',results).forEach(b=>b.onclick=()=>{const c=data[Number(b.dataset.cityIndex)];state.city[which]=c;input.value=c[`name_${state.lang}`]||c.matched_name||c.name_en||'';results.classList.remove('open');});
    },300);
  });
  country.addEventListener('change',()=>{state.city[which]=null;input.value='';results.classList.remove('open');});
}

async function openOffer(id){
  const cargo=state.loads.find(x=>x.id===id); if(!cargo) return;
  if(!requireCompleteProfile()) return;
  if(!canOfferTypes.has(state.profile?.business_user_type)){ toast(t('offerOnlyProvider'),'error'); return; }

  try{
    const {data,error}=await getCargoOfferSnapshot(id);
    if(error) throw error;
    const rows=Array.isArray(data)?data:[];
    const pending=rows.find(r=>r.offer_id && r.offer_status==='PENDING');
    if(pending){
      const price=pending.proposed_price!=null?`${Number(pending.proposed_price).toLocaleString(localeMap[state.lang])} ${pending.currency_code||''}`:'—';
      const trucks=pending.requested_truck_count||1;
      toast(`${t('offerPending')} · ${t('offerPendingDetails')}: ${price} · ${trucks} ${t('trucks')}`,'error');
      return;
    }
  }catch(err){
    console.warn('offer snapshot',err);
  }

  $('#offerCargoId').value=id;
  $('#offerRoute').textContent=`${cityName(cargo,'origin')} → ${cityName(cargo,'destination')}`;
  $('#offerTruckCount').max=cargo.remaining_truck_count||cargo.truck_count||1;
  $('#offerModal').showModal();
}
async function submitOffer(ev){
  ev.preventDefault(); const btn=$('#submitOffer');btn.disabled=true;btn.textContent=t('loading');
  try{
    const price=$('#offerPrice').value?Number($('#offerPrice').value):null;
    const {error}=await submitCargoOffer({
      cargoId: $('#offerCargoId').value,
      proposedPrice: price,
      currencyCode: price ? $('#offerCurrency').value : null,
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
    $('#offerModal').close(); $('#offerForm').reset(); toast(t('offerSent'));
  }catch(err){
    const msg=humanError(err);
    toast(msg,'error');
    if(String(err?.message||'').toLowerCase().includes('previous price request is still awaiting a decision')){
      $('#offerModal')?.close();
    }
  }
  finally{btn.disabled=false;btn.textContent=t('sendRequest');}
}

async function loadShipments(){
  const el=$('#shipmentList');
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForShipments'));$('#metricShipments').textContent='—';return;}
  if(!isFullProfileReady()){el.innerHTML=emptyBlock('profileIncomplete',t('completeProfileRequired'));$('#metricShipments').textContent='—';return;}
  el.innerHTML='<div class="loading-card"></div><div class="loading-card"></div>';
  try{
    const {data,error}=await getMyTransportCargo(); if(error) throw error;
    const rows=Array.isArray(data)?data:[]; el.innerHTML=rows.length?rows.map(c=>cargoCard(c,true)).join(''):emptyBlock('noShipments'); $('#metricShipments').textContent=String(rows.length); bindCargoActions();
  }catch(err){el.innerHTML=emptyBlock('unexpectedError',humanError(err));}
}

let chatCache=[];
let notificationRealtimeChannel=null;
function renderChatFromCache(){
  const el=$('#chatMessages'); if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForChat'));return;}
  if(!isFullProfileReady()){el.innerHTML=emptyBlock('profileIncomplete',t('completeProfileRequired'));return;}
  if(!chatCache.length){el.innerHTML=emptyBlock('noMessages');return;}
  const uid=state.session.user.id;
  el.innerHTML=chatCache.map(m=>`<div class="bubble ${m.sender_id===uid?'me':''}"><span class="sender">${esc(m.sender_name||'Yoldash')}</span><span>${m.deleted_at?'—':esc(m.body||'')}</span><time>${esc(dateLabel(m.created_at))}</time></div>`).join('');
  el.scrollTop=el.scrollHeight;
}
async function loadChat(silent=false){
  const input=$('#chatInput'),send=$('#sendChat');
  if(!state.session){input.disabled=true;send.disabled=true;renderChatFromCache();return;}
  if(!isFullProfileReady()){input.disabled=true;send.disabled=true;renderChatFromCache();return;}
  input.disabled=false;send.disabled=false;
  try{
    const {data,error}=await getPublicChatMessages(60); if(error) throw error;
    chatCache=(data||[]).slice().reverse(); renderChatFromCache(); $('#chatTime').textContent=chatCache.length?new Date(chatCache.at(-1).created_at).toLocaleTimeString(localeMap[state.lang],{hour:'2-digit',minute:'2-digit'}):'—';
    markPublicChatRead().then(()=>loadUnread());
  }catch(err){if(!silent) toast(humanError(err),'error');}
  clearInterval(state.chatTimer); state.chatTimer=setInterval(()=>{if($('#page-chat').classList.contains('active')&&state.session) loadChat(true);},12000);
}
async function sendChat(){
  const input=$('#chatInput'), body=input.value.trim(); if(!body||!state.session) return;
  if(!requireCompleteProfile()) return;
  const btn=$('#sendChat'); btn.disabled=true;
  try{
    const rid=crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const {error}=await sendPublicChatMessage({requestId:rid,body}); if(error) throw error;
    window.yoldashTrack?.('send_chat_message',{chat_type:'public'});
    input.value=''; await loadChat(true);
  }catch(err){toast(humanError(err),'error');} finally{btn.disabled=false;}
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

function renderAdminUserMap(rows=[]){
  state.adminMapRows=rows;
  const mapEl=$('#adminUserMap');
  const empty=$('#adminMapEmpty');
  const count=$('#adminMapUserCount');
  if(count) count.textContent=String(rows.length);
  if(!mapEl || !state.isSuperAdmin) return;

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

  items.forEach(item=>{

    const row=item.row;
    const ageMs=row.updated_at ? Date.now()-new Date(row.updated_at).getTime() : Infinity;
    const freshnessClass=ageMs>60*60*1000?'stale':ageMs>15*60*1000?'aging':'fresh';
    const markerColor=freshnessClass==='fresh'?'#f6b817':freshnessClass==='aging'?'#2f80ed':'#ef4444';
    const label=esc(row.display_name||typeLabel(row.business_user_type)||'Yoldash');

    const marker=L.circleMarker(item.latlng,{
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
    return `<button type="button" class="notification-item ${unread?'unread':''}" data-notification-id="${esc(n.id)}" data-notification-cargo="${esc(n.cargo_id||'')}">
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
  await markNotificationRead(id);
  await loadNotifications();
  $('#notificationPanel')?.classList.add('hidden');
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
function startNotificationRealtime(){
  try{
    if(notificationRealtimeChannel) unsubscribeFromUserNotifications(notificationRealtimeChannel);
    if(!state.session) return;
    notificationRealtimeChannel=subscribeToUserNotifications(state.session.user.id,()=>loadNotifications());
  }catch(err){console.warn('notification realtime',err);}
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
  $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>applyLanguage(b.dataset.lang)));
  $$('[data-page]').forEach(b=>b.addEventListener('click',()=>page(b.dataset.page)));
  $$('[data-close]').forEach(b=>b.addEventListener('click',()=>$('#'+b.dataset.close)?.close()));
  $('#mobileMenu').onclick=()=>{
    const sidebar=$('.sidebar');
    if(!sidebar) return;
    const opening=!sidebar.classList.contains('open');
    sidebar.classList.toggle('open',opening);
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
  $('#refreshShipments').onclick=loadShipments;
  $('#notificationBtn')?.addEventListener('click',async(e)=>{e.stopPropagation();if(!state.session){$('#authModal')?.showModal();return;}const panel=$('#notificationPanel');panel?.classList.toggle('hidden');if(panel&&!panel.classList.contains('hidden')) await loadNotifications();});
  $('#markAllNotificationsRead')?.addEventListener('click',markAllNotificationsRead);
  $('#refreshAdminUserMap')?.addEventListener('click',()=>loadAdminUserMap(false));
  document.addEventListener('click',e=>{const p=$('#notificationPanel');if(p&&!p.classList.contains('hidden')&&!p.contains(e.target)&&!$('#notificationBtn')?.contains(e.target))p.classList.add('hidden');});
  $('#refreshFx')?.addEventListener('click',()=>loadFxRates(false));
  $('#createDriverListing').onclick=()=>openDriverListing(); $('#driverListingForm').addEventListener('submit',submitDriverListing); $('#driverHubSearch').addEventListener('input',renderDriverHub); $$('[data-listing-type]').forEach(b=>b.onclick=()=>{$('#driverListingType').value=b.dataset.listingType;syncDriverListingSegments();}); $$('[data-employment-type]').forEach(b=>b.onclick=()=>{$('#driverEmploymentType').value=b.dataset.employmentType;syncDriverListingSegments();}); $$('[data-driver-filter]').forEach(b=>b.onclick=()=>{state.driverFilter=b.dataset.driverFilter;$$('[data-driver-filter]').forEach(x=>x.classList.toggle('active',x===b));renderDriverHub();});
  $('#loadForm').addEventListener('submit',submitLoad); $('#offerForm').addEventListener('submit',submitOffer); $('#authForm').addEventListener('submit',submitAuth); $('#recoveryForm')?.addEventListener('submit',submitRecovery);
  $('#saveProfileBtn').onclick=saveProfile; $('#forgotPassword').onclick=showForgotPassword; $('#sendResetLink').onclick=forgotPassword; $('#backFromForgot').onclick=()=>{showAuthEntry();setAuthMode('signin');}; $('#resendVerification').onclick=resendVerification; $('#backToSignIn').onclick=()=>{showAuthEntry();setAuthMode('signin');}; $('#authPasswordToggle').onclick=()=>{const input=$('#authPassword');const show=input.type==='password';input.type=show?'text':'password';$('#authPasswordToggle').textContent=show?'◌':'◉';}; $('#signOutBtn').onclick=signOutUser;
  $$('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
  $$('[data-business-type]').forEach(b=>b.onclick=()=>{state.selectedBusinessType=b.dataset.businessType;$$('[data-business-type]').forEach(x=>x.classList.toggle('active',x===b));});
  $('#loadSearch').addEventListener('input',renderLoads);
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){page('loads');$('#loadSearch').value=e.target.value;renderLoads();}});
  $$('[data-filter]').forEach(b=>b.onclick=()=>{state.loadFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderLoads();});
  $('#sendChat').onclick=sendChat; $('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  window.addEventListener('online',networkUI);window.addEventListener('offline',networkUI);
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
    chatCache=[];

    clearInterval(state.chatTimer);
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
  try{ applyLanguage(state.lang,false); }catch(err){ console.error('language init',err); }
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
        else {state.profile=null;state.businessProfile=null;chatCache=[];}
        renderProfileUI();
        loadUnread();
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

  await Promise.allSettled([refreshSession(),loadLoads()]);
  try{ await syncSuperAdminMapAccess(); }catch(err){ console.error('admin map access init',err); }
  try{ startLiveLoads(); }catch(err){ console.error('live loads init',err); }
}
init();


// === YOLDASH WEB APP V2.1 PRODUCTION CONTROLS ===
try {
  const savedTheme = localStorage.getItem('yoldash-web-theme');
  document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
} catch (_) {
  document.documentElement.dataset.theme = 'light';
}

const v2ThemeButton = document.getElementById('themeToggle');
const syncV2ThemeButton = () => {
  if (!v2ThemeButton) return;
  const isDark = document.documentElement.dataset.theme === 'dark';
  v2ThemeButton.textContent = isDark ? '☀' : '◐';
  v2ThemeButton.setAttribute('aria-pressed', isDark ? 'true' : 'false');
};
syncV2ThemeButton();

v2ThemeButton?.addEventListener('click', () => {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('yoldash-web-theme', next); } catch (_) {}
  syncV2ThemeButton();
});

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
