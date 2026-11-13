const copy={
fa:{title:'شرایط استفاده Yoldash',meta:'آخرین به‌روزرسانی: 1 اکتبر 2026',back:'← بازگشت به Yoldash',body:`<p>با استفاده از Yoldash، شما می‌پذیرید که اطلاعات حساب و اعلام‌های حمل‌ونقل را صحیح و قانونی وارد کنید.</p><h2>ماهیت سرویس</h2><p>Yoldash ابزار ارتباط و مدیریت فرآیند حمل‌ونقل جاده‌ای است. کاربران مسئول بررسی شرایط معامله، اسناد، مجوزها، بیمه و الزامات قانونی مرتبط با حمل خود هستند.</p><h2>حساب کاربری</h2><p>شما مسئول حفظ امنیت حساب و اطلاعات ورود خود هستید و نباید از حساب دیگران استفاده کنید.</p><h2>اعلام بار و درخواست حمل</h2><p>اطلاعات بار، قیمت، مسیر و ظرفیت باید تا حد ممکن دقیق باشد. استفاده فریبکارانه، محتوای غیرقانونی یا سوءاستفاده از کاربران مجاز نیست.</p><h2>تغییرات</h2><p>Yoldash ممکن است برای امنیت، کیفیت یا الزامات قانونی این شرایط و قابلیت‌های سرویس را به‌روزرسانی کند.</p>`},
tr:{title:'Yoldash Kullanım Şartları',meta:'Son güncelleme: 1 Ekim 2026',back:'← Yoldash’a dön',body:`<p>Yoldash’ı kullanarak hesap ve taşıma bilgilerini doğru ve hukuka uygun şekilde girmeyi kabul edersiniz.</p><h2>Hizmetin niteliği</h2><p>Yoldash, karayolu taşımacılığı süreçleri için iletişim ve yönetim araçları sunar. Kullanıcılar kendi taşımalarıyla ilgili işlem koşullarını, belgeleri, izinleri, sigortayı ve geçerli yasal gereklilikleri kontrol etmekten sorumludur.</p><h2>Kullanıcı hesabı</h2><p>Hesabınızın ve giriş bilgilerinizin güvenliğinden siz sorumlusunuz. Başka bir kişinin hesabını kullanamazsınız.</p><h2>Yük ilanları ve taşıma talepleri</h2><p>Yük, fiyat, güzergâh ve kapasite bilgileri mümkün olduğunca doğru olmalıdır. Dolandırıcılık, yasa dışı içerik ve diğer kullanıcıların kötüye kullanılması yasaktır.</p><h2>Değişiklikler</h2><p>Yoldash, güvenlik, hizmet kalitesi veya yasal gereklilikler nedeniyle bu şartları ve hizmet özelliklerini güncelleyebilir.</p>`},
en:{title:'Yoldash Terms of Use',meta:'Last updated: October 1, 2026',back:'← Back to Yoldash',body:`<p>By using Yoldash, you agree to enter accurate and lawful account and transportation information.</p><h2>Nature of the service</h2><p>Yoldash provides communication and workflow-management tools for road transportation. Users are responsible for checking the transaction terms, documents, permits, insurance and legal requirements applicable to their shipments.</p><h2>User account</h2><p>You are responsible for keeping your account and sign-in information secure. You must not use another person’s account.</p><h2>Load postings and transport requests</h2><p>Load, price, route and capacity details should be as accurate as possible. Fraudulent activity, unlawful content and misuse of other users are prohibited.</p><h2>Changes</h2><p>Yoldash may update these terms and service features for security, quality or legal-compliance reasons.</p>`}
};
function setLanguage(language, updateUrl=true){
 const lang=Object.hasOwn(copy,language)?language:'fa';
 const c=copy[lang];
 document.documentElement.lang=lang;
 document.documentElement.dir=lang==='fa'?'rtl':'ltr';
 document.getElementById('title').textContent=c.title;
 document.getElementById('meta').textContent=c.meta;
 document.getElementById('body').innerHTML=c.body;
 document.getElementById('back').textContent=c.back;
 document.querySelectorAll('[data-l]').forEach(button=>{
  const active=button.dataset.l===lang;
  button.classList.toggle('on',active);
  button.setAttribute('aria-pressed',String(active));
 });
 try{localStorage.setItem('yoldash_legal_lang',lang);}catch{}
 if(updateUrl){
  const url=new URL(window.location.href);
  url.searchParams.set('lang',lang);
  window.history.replaceState({},'',url);
 }
}
document.addEventListener('DOMContentLoaded',()=>{
 document.querySelectorAll('[data-l]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.l)));
 const requested=new URLSearchParams(window.location.search).get('lang');
 let saved='fa';try{saved=localStorage.getItem('yoldash_legal_lang')||'fa';}catch{}
 setLanguage(['fa','tr','en'].includes(requested)?requested:(['fa','tr','en'].includes(saved)?saved:'fa'),false);
});
