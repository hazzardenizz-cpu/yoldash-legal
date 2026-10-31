import { submitSharedLocation } from './src/features/location/location-service.js';

const copy = {
  fa: {
    sharedLocations: 'موقعیت‌ها',
    sharedLocationsDesc: 'موقعیت یک مکان را با نام و لینک Google Maps ثبت کنید تا پس از بررسی در اپ و وب قابل استفاده باشد.',
    addLocation: 'افزودن موقعیت',
    locationSubmitIntro: 'این موقعیت پس از تأیید مدیر، در اپ و وب Yoldash قابل استفاده می‌شود.',
    locationName: 'نام موقعیت',
    locationNameHint: 'مثلاً گمرک بازرگان',
    locationMapLink: 'لینک Google Maps',
    locationPrivacyNote: 'فقط مکان‌های عمومی یا تجاری را ثبت کنید؛ آدرس منزل، اطلاعات خصوصی یا موقعیت زندهٔ افراد را وارد نکنید.',
    submitLocation: 'ارسال برای بررسی',
    signIn: 'برای افزودن موقعیت، ابتدا وارد حساب Yoldash شوید.',
    invalidName: 'نام موقعیت باید بین ۳ تا ۱۲۰ کاراکتر باشد.',
    invalidLink: 'یک لینک معتبر و امن Google Maps وارد کنید.',
    submitted: 'موقعیت برای بررسی مدیر ارسال شد.',
    duplicate: 'این موقعیت قبلاً ثبت شده است.',
    failed: 'ثبت موقعیت انجام نشد. دوباره تلاش کنید.'
  },
  tr: {
    sharedLocations: 'Konumlar',
    sharedLocationsDesc: 'Bir yeri adı ve Google Maps bağlantısıyla ekleyin; incelemeden sonra uygulama ve webde kullanılabilir.',
    addLocation: 'Konum ekle',
    locationSubmitIntro: 'Bu konum, yönetici onayından sonra Yoldash uygulamasında ve webde kullanılabilir.',
    locationName: 'Konum adı',
    locationNameHint: 'Örn. Bazargan Gümrüğü',
    locationMapLink: 'Google Maps bağlantısı',
    locationPrivacyNote: 'Yalnızca herkese açık veya ticari yerleri ekleyin; ev adresi, özel bilgi ya da kişilerin canlı konumunu girmeyin.',
    submitLocation: 'İncelemeye gönder',
    signIn: 'Konum eklemek için önce Yoldash hesabınıza giriş yapın.',
    invalidName: 'Konum adı 3 ile 120 karakter arasında olmalıdır.',
    invalidLink: 'Geçerli ve güvenli bir Google Maps bağlantısı girin.',
    submitted: 'Konum yönetici incelemesine gönderildi.',
    duplicate: 'Bu konum zaten eklenmiş.',
    failed: 'Konum kaydedilemedi. Lütfen tekrar deneyin.'
  },
  en: {
    sharedLocations: 'Locations',
    sharedLocationsDesc: 'Add a place with its name and Google Maps link; it will be available in the app and web after review.',
    addLocation: 'Add location',
    locationSubmitIntro: 'This location will be available in the Yoldash app and web after administrator approval.',
    locationName: 'Location name',
    locationNameHint: 'For example, Bazargan Customs',
    locationMapLink: 'Google Maps link',
    locationPrivacyNote: 'Only submit public or commercial places. Do not enter a home address, private information, or a person’s live location.',
    submitLocation: 'Submit for review',
    signIn: 'Sign in to your Yoldash account before adding a location.',
    invalidName: 'Location name must be between 3 and 120 characters.',
    invalidLink: 'Enter a valid, secure Google Maps link.',
    submitted: 'Location submitted for administrator review.',
    duplicate: 'This location has already been submitted.',
    failed: 'Could not submit the location. Please try again.'
  }
};

function lang() { return copy[document.documentElement.lang] ? document.documentElement.lang : 'en'; }
function text(key) { return copy[lang()][key]; }
function setText(selector, key) { document.querySelectorAll(selector).forEach(node => { node.textContent = text(key); }); }
function applyCopy() {
  setText('[data-i18n="sharedLocations"]', 'sharedLocations');
  setText('[data-i18n="sharedLocationsDesc"]', 'sharedLocationsDesc');
  setText('[data-i18n="addLocation"]', 'addLocation');
  setText('[data-i18n="locationSubmitIntro"]', 'locationSubmitIntro');
  setText('[data-i18n="locationName"]', 'locationName');
  setText('[data-i18n="locationMapLink"]', 'locationMapLink');
  setText('[data-i18n="locationPrivacyNote"]', 'locationPrivacyNote');
  setText('[data-i18n="submitLocation"]', 'submitLocation');
  document.querySelectorAll('[data-i18n-placeholder="locationNameHint"]').forEach(node => { node.placeholder = text('locationNameHint'); });
}
function toast(message, error = false) {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) { window.alert(message); return; }
  const node = document.createElement('div');
  node.className = 'toast ' + (error ? 'error' : 'ok');
  node.textContent = message;
  wrap.appendChild(node);
  window.setTimeout(() => node.remove(), 4200);
}
function validMapUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === 'https:' && (host === 'google.com' || host.endsWith('.google.com') || host === 'goo.gl' || host === 'maps.app.goo.gl');
  } catch { return false; }
}
async function signedIn() {
  const { supabase } = await import('./src/core/supabase.js');
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}
document.getElementById('openLocationSubmit')?.addEventListener('click', async () => {
  if (!await signedIn()) {
    document.getElementById('authModal')?.showModal();
    toast(text('signIn'), true);
    return;
  }
  document.getElementById('locationSubmitForm')?.reset();
  document.getElementById('locationSubmitModal')?.showModal();
});
document.getElementById('locationSubmitForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const name = document.getElementById('locationName')?.value.trim() || '';
  const gpsUrl = document.getElementById('locationGpsUrl')?.value.trim() || '';
  if (name.length < 3 || name.length > 120) { toast(text('invalidName'), true); return; }
  if (!validMapUrl(gpsUrl)) { toast(text('invalidLink'), true); return; }
  if (!await signedIn()) { document.getElementById('authModal')?.showModal(); toast(text('signIn'), true); return; }
  const button = document.getElementById('submitLocationButton');
  if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = '…'; }
  try {
    const { error } = await submitSharedLocation(name, gpsUrl);
    if (error) throw error;
    document.getElementById('locationSubmitModal')?.close();
    event.currentTarget.reset();
    toast(text('submitted'));
  } catch (error) {
    toast(String(error?.message || '').toLowerCase().includes('duplicate') ? text('duplicate') : text('failed'), true);
  } finally {
    if (button) { button.disabled = false; button.textContent = button.dataset.label || text('submitLocation'); }
  }
});
document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => window.setTimeout(applyCopy, 0)));
applyCopy();
