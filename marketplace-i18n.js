(() => {
  const supported = new Set(["fa", "tr", "en"]);
  const copy = {
    "رفتن به آگهی‌ها": ["İlanlara geç", "Skip to listings"],
    "منوی اصلی": ["Ana menü", "Main menu"],
    "بازار یولداش": ["Yoldash Pazarı", "Yoldash Marketplace"],
    "حمل‌ونقل جاده‌ای": ["Karayolu taşımacılığı", "Road transport"],
    "خانه": ["Ana sayfa", "Home"],
    "اعلام بار": ["Yük ilanı", "Load board"],
    "حمل‌های من": ["Gönderilerim", "My shipments"],
    "گفتگو": ["Sohbet", "Chat"],
    "خدمات": ["Hizmetler", "Services"],
    "دانشنامه": ["Bilgi merkezi", "Knowledge base"],
    "حساب مشترک وب و اپ": ["Web ve uygulamada ortak hesap", "Shared web and app account"],
    "آگهی‌ها": ["İlanlar", "Listings"],
    "خودرو و تجهیزات مناسب پیدا کن، یا همکار بعدی‌ات را انتخاب کن.": ["Size uygun araç ve ekipmanları bulun veya bir sonraki iş ortağınızı seçin.", "Find the right vehicles and equipment, or choose your next business partner."],
    "ثبت آگهی جدید": ["Yeni ilan ver", "Post an ad"],
    "نوع آگهی": ["İlan türü", "Listing type"],
    "خودرو و تجهیزات": ["Araç ve ekipman", "Vehicles & equipment"],
    "خرید و فروش وسایل حمل‌ونقل": ["Taşıma araçlarının alım satımı", "Buy and sell transport vehicles"],
    "راننده و ماشین": ["Sürücü ve araç", "Drivers & vehicles"],
    "فرصت‌های همکاری و استخدام": ["İş birliği ve işe alım fırsatları", "Work and hiring opportunities"],
    "جست‌وجو و فیلتر": ["Ara ve filtrele", "Search and filters"],
    "جست‌وجو": ["Ara", "Search"],
    "نام خودرو، برند یا شهر را جست‌وجو کن…": ["Araç adı, marka veya şehir ara…", "Search vehicle, brand, or city…"],
    "کشور": ["Ülke", "Country"],
    "همه کشورها": ["Tüm ülkeler", "All countries"],
    "ایران": ["İran", "Iran"],
    "ترکیه": ["Türkiye", "Türkiye"],
    "دسته‌بندی": ["Kategori", "Category"],
    "همه دسته‌ها": ["Tüm kategoriler", "All categories"],
    "پاک کردن": ["Temizle", "Clear"],
    "آگهی‌های من": ["İlanlarım", "My ads"],
    "به‌روزرسانی": ["Yenile", "Refresh"],
    "فهرست آگهی‌ها": ["İlan listesi", "Listings"],
    "آگهی‌های بیشتر": ["Daha fazla ilan", "Load more"],
    "یک آگهی، در وب و اپ": ["Tek ilan, web ve uygulamada", "One listing, on web and app"],
    "آگهی‌ها پس از تأیید مدیریت در یولداش نمایش داده می‌شوند.": ["İlanlar yönetim onayından sonra Yoldash'ta yayınlanır.", "Ads appear on Yoldash after admin approval."],
    "بازگشت به یولداش": ["Yoldash'a dön", "Back to Yoldash"],
    "بازار خودرو و فرصت‌های همکاری": ["Araç pazarı ve iş fırsatları", "Vehicle marketplace & work opportunities"],
    "ورود از صفحه اصلی یولداش": ["Yoldash ana sayfasından giriş yapın", "Sign in from the Yoldash home page"],
    "کشنده": ["Çekici", "Tractor unit"],
    "تریلر": ["Dorse", "Trailer"],
    "کامیون": ["Kamyon", "Truck"],
    "کامیونت": ["Kamyonet", "Light truck"],
    "کانتینر": ["Konteyner", "Container"],
    "تانکر": ["Tanker", "Tanker"],
    "یخچالی": ["Frigorifik", "Refrigerated"],
    "کفی": ["Platform dorse", "Flatbed"],
    "چادری": ["Tenteli dorse", "Curtain-side"],
    "سایر": ["Diğer", "Other"],
    "نیاز به راننده": ["Sürücü aranıyor", "Driver wanted"],
    "نیاز به ماشین": ["Araç aranıyor", "Vehicle wanted"],
    "نو": ["Yeni", "New"],
    "کارکرده": ["Kullanılmış", "Used"],
    "نیازمند تعمیر": ["Onarım gerekli", "Needs repair"],
    "آگهی": ["İlan", "Ad"],
    "در انتظار تأیید": ["Onay bekliyor", "Pending approval"],
    "فعال": ["Aktif", "Active"],
    "ردشده": ["Reddedildi", "Rejected"],
    "بسته‌شده": ["Kapatıldı", "Closed"],
    "منقضی‌شده": ["Süresi doldu", "Expired"],
    "همکاری دائمی": ["Sürekli çalışma", "Permanent position"],
    "همکاری سرویسی": ["Hizmet bazlı çalışma", "Service-based work"],
    "تصویر در دسترس نیست": ["Görsel mevcut değil", "Image unavailable"],
    "آگهی فعالی مطابق این فیلترها پیدا نشد. جست‌وجو را تغییر دهید یا فیلترها را پاک کنید.": ["Bu filtrelerle eşleşen aktif ilan bulunamadı. Aramanızı değiştirin veya filtreleri temizleyin.", "No active listings match these filters. Change your search or clear the filters."],
    "در حال دریافت آگهی‌های اپ…": ["Uygulama ilanları yükleniyor…", "Loading app listings…"],
    "دریافت آگهی‌ها انجام نشد. لطفاً دکمه «به‌روزرسانی» را بزنید.": ["İlanlar yüklenemedi. Lütfen “Yenile” düğmesine basın.", "Could not load listings. Please press “Refresh”."],
    "ارتباط برقرار نشد؛ دوباره تلاش کنید.": ["Bağlantı kurulamadı; lütfen tekrar deneyin.", "Connection failed; please try again."],
    "برای مشاهده راه‌های تماس با آگهی‌دهنده وارد حساب یولداش شوید.": ["İlan sahibinin iletişim bilgilerini görmek için Yoldash hesabınıza giriş yapın.", "Sign in to your Yoldash account to view the advertiser's contact options."],
    "این آگهی متعلق به شماست.": ["Bu ilan size ait.", "This is your listing."],
    "در حال دریافت راه‌های تماس…": ["İletişim bilgileri alınıyor…", "Loading contact options…"],
    "تماس": ["Ara", "Call"],
    "واتساپ": ["WhatsApp", "WhatsApp"],
    "راه تماس برای این آگهی در دسترس نیست.": ["Bu ilan için iletişim bilgisi mevcut değil.", "No contact option is available for this listing."],
    "دریافت راه‌های تماس انجام نشد. جزئیات آگهی را دوباره باز کنید.": ["İletişim bilgileri alınamadı. Lütfen ilanı yeniden açın.", "Could not load contact options. Please reopen the listing details."],
    "نوع": ["Tür", "Type"],
    "برند": ["Marka", "Brand"],
    "مدل": ["Model", "Model"],
    "سال ساخت": ["Model yılı", "Year"],
    "کارکرد": ["Kilometre", "Mileage"],
    "کیلومتر": ["km", "km"],
    "نوع ماشین": ["Araç türü", "Vehicle type"],
    " کیلومتر": [" km", " km"],
    "رنگ": ["Renk", "Color"],
    "وضعیت": ["Durum", "Condition"],
    "دائمی": ["Sürekli", "Permanent"],
    "سرویسی": ["Hizmet bazlı", "Service-based"],
    "برای پیگیری این آگهی، به بخش آگهی‌های اپ یولداش مراجعه کنید.": ["Bu ilanla ilgili devam etmek için Yoldash uygulamasındaki ilanlar bölümünü ziyaret edin.", "To follow up on this listing, open the listings section in the Yoldash app."],
    "آیا این آگهی حذف شود؟ این کار قابل بازگشت نیست.": ["Bu ilan silinsin mi? Bu işlem geri alınamaz.", "Delete this listing? This action cannot be undone."],
    "آگهی حذف شد.": ["İlan silindi.", "Listing deleted."],
    "حذف انجام نشد؛ دسترسی حساب و اتصال اینترنت را بررسی کنید.": ["Silme işlemi başarısız. Hesap izinlerinizi ve internet bağlantınızı kontrol edin.", "Could not delete the listing. Check account access and your internet connection."],
    "سفید": ["Beyaz", "White"],
    "مشکی": ["Siyah", "Black"],
    "نقره‌ای": ["Gümüş", "Silver"],
    "خاکستری": ["Gri", "Gray"],
    "آبی": ["Mavi", "Blue"],
    "قرمز": ["Kırmızı", "Red"],
    "زرد": ["Sarı", "Yellow"],
    "سبز": ["Yeşil", "Green"],
    "قهوه‌ای": ["Kahverengi", "Brown"],
    "کرم": ["Krem", "Cream"],
    "نارنجی": ["Turuncu", "Orange"],
    "بستن": ["Kapat", "Close"],
    "آگهی پس از تأیید مدیریت در سایت و اپ نمایش داده می‌شود.": ["İlanınız yönetim onayından sonra web sitesinde ve uygulamada yayınlanır.", "Your ad will appear on the website and app after admin approval."],
    "برای ثبت آگهی با حساب یولداش وارد شوید.": ["İlan vermek için Yoldash hesabınızla giriş yapın.", "Sign in to your Yoldash account to post an ad."],
    "ایمیل": ["E-posta", "Email"],
    "رمز عبور": ["Şifre", "Password"],
    "ورود و ادامه ثبت آگهی": ["Giriş yap ve ilan vermeye devam et", "Sign in and continue posting"],
    "ساخت حساب یا بازیابی رمز در صفحه اصلی": ["Ana sayfadan hesap oluşturun veya şifrenizi yenileyin", "Create an account or reset your password on the home page"],
    "مشخصات خودرو و تجهیزات": ["Araç ve ekipman bilgileri", "Vehicle and equipment details"],
    "نوع خودرو یا تجهیزات": ["Araç veya ekipman türü", "Vehicle or equipment type"],
    "انتخاب نوع خودرو یا تجهیزات": ["Araç veya ekipman türünü seçin", "Select a vehicle or equipment type"],
    "کارکرد (کیلومتر)": ["Kilometre", "Mileage (km)"],
    "انتخاب رنگ": ["Renk seçin", "Select a color"],
    "قیمت": ["Fiyat", "Price"],
    "شهر": ["Şehir", "City"],
    "توضیحات": ["Açıklama", "Description"],
    "اعتبار آگهی": ["İlan süresi", "Listing duration"],
    "۱ ماه": ["1 ay", "1 month"],
    "۳ ماه": ["3 ay", "3 months"],
    "۶ ماه": ["6 ay", "6 months"],
    "تصاویر خودرو": ["Araç fotoğrafları", "Vehicle photos"],
    "۱ تا ۴ عکس؛ هر عکس حداکثر ۵ مگابایت": ["1–4 fotoğraf; her biri en fazla 5 MB", "1–4 photos; up to 5 MB each"],
    "نوع درخواست": ["Talep türü", "Request type"],
    "نوع همکاری": ["Çalışma türü", "Employment type"],
    "سابقه و مسیرهای آشنا": ["Deneyim ve bilinen güzergâhlar", "Experience and familiar routes"],
    "شهر محل سکونت": ["Yaşadığınız şehir", "City of residence"],
    "نوع ماشین‌هایی که با آن‌ها آشنا هستید": ["Aşina olduğunuz araç türleri", "Truck types you are familiar with"],
    "شماره تماس": ["Telefon numarası", "Contact phone"],
    "شماره تماس باید ۱۱ رقم باشد.": ["Telefon numarası 11 haneli olmalıdır.", "The phone number must contain 11 digits."],
    "نام و نام خانوادگی من نمایش داده شود": ["Adım ve soyadım gösterilsin", "Show my first and last name"],
    "پس از بررسی مدیریت، آگهی شما نمایش داده می‌شود.": ["Yönetim incelemesinden sonra ilanınız yayınlanır.", "Your ad will be published after admin review."],
    "ارسال برای تأیید": ["Onaya gönder", "Submit for approval"],
    "نشست شما پایان یافته است؛ دوباره وارد حساب شوید.": ["Oturumunuz sona erdi; lütfen tekrar giriş yapın.", "Your session has expired; please sign in again."],
    "اجازه ثبت آگهی صادر نشد. ورود و تکمیل حساب خود را در صفحه اصلی بررسی کنید.": ["İlan verme izniniz yok. Ana sayfadan giriş yaptığınızı ve hesabınızı tamamladığınızı kontrol edin.", "You are not allowed to post this ad. Check that you are signed in and have completed your account on the home page."],
    "این درخواست قبلاً ثبت شده است؛ آگهی‌های حساب خود را در اپ بررسی کنید.": ["Bu talep zaten gönderildi. Lütfen uygulamada hesabınızın ilanlarını kontrol edin.", "This request was already submitted. Check your account's listings in the app."],
    "تعداد آگهی‌های فعال شما به سقف مجاز رسیده است.": ["Aktif ilan sayınız izin verilen sınıra ulaştı.", "You have reached the maximum number of active listings."],
    "ثبت آگهی کامل نشد. اتصال اینترنت و اطلاعات فرم را بررسی کنید و دوباره تلاش کنید.": ["İlan gönderilemedi. İnternet bağlantınızı ve form bilgilerini kontrol edip tekrar deneyin.", "Ad submission failed. Check your internet connection and form details, then try again."],
    "۱ تا ۴ عکس مجاز انتخاب کنید؛ حجم هر عکس حداکثر ۵ مگابایت.": ["1–4 fotoğraf seçin; her fotoğraf en fazla 5 MB olabilir.", "Choose 1–4 photos; each photo must be no larger than 5 MB."],
    "پیش‌نمایش تصویر انتخاب‌شده": ["Seçilen görselin önizlemesi", "Selected image preview"],
    "در حال ورود…": ["Giriş yapılıyor…", "Signing in…"],
    "ورود انجام نشد؛ ایمیل و رمز عبور را بررسی کنید.": ["Giriş başarısız. E-posta ve şifrenizi kontrol edin.", "Sign-in failed. Check your email and password."],
    "در حال ثبت آگهی…": ["İlan gönderiliyor…", "Submitting ad…"],
    "نیاز به راننده دارم": ["Sürücü arıyorum", "Driver wanted"],
    "نیاز به ماشین دارم": ["Araç arıyorum", "Vehicle wanted"],
    "آگهی شما با موفقیت ثبت شد و در انتظار تأیید مدیریت است. پس از تأیید در سایت و اپ نمایش داده می‌شود.": ["İlanınız başarıyla gönderildi ve yönetim onayı bekliyor. Onaylandıktan sonra web sitesinde ve uygulamada yayınlanacaktır.", "Your ad was submitted successfully and is awaiting admin approval. It will appear on the website and app once approved."],
    "آگهی ذخیره شد، اما ارسال تصاویر کامل نشد. دکمه «تکمیل ارسال تصاویر» را بزنید؛ آگهی تکراری ساخته نمی‌شود.": ["İlan kaydedildi ancak fotoğraf yüklemesi tamamlanmadı. Yinelenen ilan oluşturulmaz; “Fotoğraf yüklemeyi tamamla” düğmesine basın.", "Your ad was saved, but photo uploads are incomplete. No duplicate ad will be created; press “Complete photo upload”."],
    "تکمیل ارسال تصاویر": ["Fotoğraf yüklemeyi tamamla", "Complete photo upload"]
  };
  const reverse = new Map();
  for (const [fa, pair] of Object.entries(copy)) {
    reverse.set(fa, fa);
    reverse.set(pair[0], fa);
    reverse.set(pair[1], fa);
  }
  const textState = new WeakMap();
  const attrState = new WeakMap();
  const locale = () => document.documentElement.lang || "fa";
  const translate = (source, lang) => {
    const row = copy[source];
    if (row) return lang === "fa" ? source : row[lang === "tr" ? 0 : 1];
    const count = source.match(/^([\d۰-۹٠-٩,٬.]+)\s+آگهی از\s+([\d۰-۹٠-٩,٬.]+)\s+آگهی دریافت‌شده$/);
    if (count) {
      if (lang === "tr") return count[1] + " eşleşme · " + count[2] + " ilan yüklendi";
      if (lang === "en") return count[1] + " matches · " + count[2] + " listings loaded";
    }
    return source;
  };
  const translateTextNode = node => {
    const current = node.nodeValue;
    const state = textState.get(node);
    const source = state && current === state.rendered ? state.source : (reverse.get(current.trim()) || current.trim());
    const leading = current.match(/^\s*/)?.[0] || "";
    const trailing = current.match(/\s*$/)?.[0] || "";
    const rendered = leading + translate(source, locale()) + trailing;
    textState.set(node, { source, rendered });
    if (current !== rendered) node.nodeValue = rendered;
  };
  const translateAttributes = root => {
    const nodes = [];
    if (root.nodeType === 1) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll("*"));
    for (const el of nodes) {
      let state = attrState.get(el);
      if (!state) { state = {}; attrState.set(el, state); }
      for (const attr of ["placeholder", "aria-label", "title", "alt"]) {
        if (!el.hasAttribute?.(attr)) continue;
        const current = el.getAttribute(attr);
        const previous = state[attr];
        const source = previous && current === previous.rendered ? previous.source : (reverse.get(current) || current);
        const rendered = translate(source, locale());
        state[attr] = { source, rendered };
        if (current !== rendered) el.setAttribute(attr, rendered);
      }
    }
  };
  const translateTree = root => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.parentElement?.closest("script,style,textarea,input,select")) nodes.push(node);
    }
    nodes.forEach(translateTextNode);
    translateAttributes(root);
  };
  const syncDashboardMarketplaceLabel = lang => {
    const label = document.querySelector('#mainNavigation a[href="/marketplace"] span:last-child');
    if (!label) return;
    label.textContent = ({
      fa: "آگهی‌ها",
      tr: "İlanlar",
      en: "Listings"
    })[supported.has(lang) ? lang : "fa"];
  };
  const setLanguage = (lang, persist = true) => {
    if (!supported.has(lang)) lang = "fa";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    syncDashboardMarketplaceLabel(lang);
    if (persist) {
      try { localStorage.setItem("yoldash_lang", lang); } catch {}
    }
    const url = new URL(location.href);
    if (url.searchParams.has("lang") || document.getElementById("marketMain")) {
      url.searchParams.set("lang", lang);
      history.replaceState(history.state, "", url);
    }
    document.querySelectorAll("[data-market-lang]").forEach(button => {
      const active = button.dataset.marketLang === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (document.getElementById('marketMain')) translateTree(document.body);
    const cta = document.querySelector('a[href="/marketplace"].home-marketplace-link');
    if (cta) cta.textContent = ({
      fa: "مشاهده آگهی‌های خودرو و رانندگان",
      tr: "Araç ve sürücü ilanlarını görüntüle",
      en: "Browse vehicle & driver listings"
    })[lang];
    if (document.getElementById("marketMain")) {
      document.title = ({fa:"آگهی‌ها | Yoldash",tr:"İlanlar | Yoldash",en:"Listings | Yoldash"})[lang];
      const description = document.querySelector('meta[name="description"]');
      if (description) description.content = ({
        fa:"آگهی‌های خریدوفروش کامیون، کشنده و تجهیزات و نیاز به راننده و ماشین در یولداش",
        tr:"Yoldash'ta kamyon, çekici ve ekipman alım satım ilanları ile sürücü ve araç arayanlar.",
        en:"Truck, tractor unit and equipment listings, plus driver and vehicle opportunities on Yoldash."
      })[lang];
    }
  };
  const initial = () => {
    const requested = new URL(location.href).searchParams.get("lang");
    let saved = "fa";
    try { saved = localStorage.getItem("yoldash_lang") || "fa"; } catch {}
    setLanguage(supported.has(requested) ? requested : saved, supported.has(requested));
  };
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-market-lang]");
    if (button) setLanguage(button.dataset.marketLang);
  });
  document.addEventListener("yoldash:language-change", () => {
    let lang = "fa";
    try { lang = localStorage.getItem("yoldash_lang") || "fa"; } catch {}
    setLanguage(lang, false);
  });
  window.addEventListener("storage", event => {
    if (event.key === "yoldash_lang") setLanguage(event.newValue || "fa", false);
  });
  const observer = new MutationObserver(records => {
    if (!document.getElementById('marketMain')) return;
    for (const record of records) {
      if (record.type === "characterData") translateTextNode(record.target);
      else for (const node of record.addedNodes) if (node.nodeType === 1) translateTree(node); else if (node.nodeType === 3) translateTextNode(node);
    }
  });
  if (document.body) {
    initial();
    observer.observe(document.body, {subtree:true,childList:true,characterData:true});
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      initial();
      observer.observe(document.body, {subtree:true,childList:true,characterData:true});
    }, {once:true});
  }
  window.YoldashI18n = {
    get language() { return locale(); },
    t(key) { return translate(key, locale()); },
    setLanguage
  };
})();