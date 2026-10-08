(() => {
 const supported = ['fa','tr','en'];
 const params = new URLSearchParams(location.search);
 let lang = params.get('lang');
 if (!supported.includes(lang)) {
   const browser = (navigator.language || '').toLowerCase();
   lang = browser.startsWith('fa') ? 'fa' : browser.startsWith('tr') ? 'tr' : 'en';
 }
 const apply = (next) => {
   lang = supported.includes(next) ? next : 'en';
   document.documentElement.lang = lang;
   document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
   document.querySelectorAll('.localized').forEach(el => el.hidden = el.dataset.lang !== lang);
   document.querySelectorAll('[data-switch]').forEach(btn => btn.classList.toggle('active', btn.dataset.switch === lang));
   const labels = {"fa":{"privacy":"حریم خصوصی","terms":"قوانین استفاده","deletion":"حذف حساب"},"tr":{"privacy":"Gizlilik","terms":"Kullanım koşulları","deletion":"Hesap silme"},"en":{"privacy":"Privacy","terms":"Terms","deletion":"Delete account"}}[lang];
   const files = {privacy:'privacy.html',terms:'terms.html',deletion:'delete-account.html'};
   document.querySelectorAll('[data-nav]').forEach(a => {
      const r = a.dataset.nav; a.textContent = labels[r]; a.href = files[r] + '?lang=' + encodeURIComponent(lang);
   });
   const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null,'',u);
 };
 document.querySelectorAll('[data-switch]').forEach(btn => btn.addEventListener('click', () => apply(btn.dataset.switch)));
 apply(lang);
})();
