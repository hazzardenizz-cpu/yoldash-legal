import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';
import L from 'https://esm.sh/leaflet@1.9.4';

const SUPABASE_URL = 'https://ubqrafuustkyenbbzhtg.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_4rrohZA7Vsu76Fywpqg9Bg_ozmpPHeH';
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

const $ = (q, root = document) => root.querySelector(q);
const $$ = (q, root = document) => [...root.querySelectorAll(q)];
const esc = (value = '') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const uuidLike = v => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v || '');
const localeMap = { fa: 'fa-IR', tr: 'tr-TR', en: 'en-US' };
const canPostTypes = new Set(['CARGO_OWNER', 'TRANSPORT_COMPANY', 'BROKER']);
const canOfferTypes = new Set(['DRIVER', 'TRANSPORT_COMPANY']);

const translations = {
fa:{
roadFreight:'حمل‌ونقل جاده‌ای',home:'خانه',loadBoard:'اعلام بار',myShipments:'حمل‌های من',chat:'گفتگو',drivers:'راننده و ماشین',services:'خدمات',secureTitle:'اتصال امن Yoldash',secureText:'داده‌ها با اپ و Supabase مشترک است',search:'جستجوی بار، شهر یا کاربر...',guest:'کاربر مهمان',login:'ورود / ثبت‌نام',livePlatform:'پلتفرم زنده حمل‌ونقل جاده‌ای',heroTitle:'<em>Yoldash</em> سیستم هوشمند حمل‌ونقل',heroText:'ارتباط مستقیم صاحب بار، راننده و شرکت حمل‌ونقل؛ از اعلام بار و دریافت پیشنهاد تا مدیریت کامل حمل.',createLoad:'اعلام بار جدید',viewLoads:'مشاهده بارها',online:'دسترسی آنلاین',languages:'زبان',sharedAccount:'حساب مشترک وب و اپ',origin:'مبدأ',destination:'مقصد',truckOnRoute:'کامیون در مسیر',activeLoads:'بارهای فعال',onlineDrivers:'رانندگان آنلاین',inTransit:'در حال حمل',today:'امروز',completed:'تحویل موفق',marketplace:'بازار حمل‌ونقل',freshLoads:'بارهای تازه اعلام‌شده',all:'همه',international:'بین‌المللی',domestic:'داخلی',seeAll:'مشاهده همه',quickAccess:'دسترسی سریع',actions:'عملیات',newLoad:'اعلام بار جدید',newLoadHint:'کمتر از ۲ دقیقه',findDriver:'پیدا کردن راننده یا ماشین',findDriverHint:'بازار راننده و خودرو',openChat:'باز کردن گفتگو',chatLoginHint:'پس از ورود',liveRates:'نرخ لحظه‌ای',currency:'ارز',live:'زنده',ratesNote:'نرخ بازار با به‌روزرسانی خودکار هر ۵ دقیقه.',searchLoads:'جستجو بر اساس مبدا، مقصد یا نوع بار',shipmentsDesc:'همه حمل‌های فعال، تحویل‌شده و در انتظار شما اینجا مدیریت می‌شوند.',transportManagement:'مدیریت حمل',refresh:'به‌روزرسانی',loginRequired:'ورود لازم است',loginForShipments:'برای مشاهده حمل‌های خود وارد حساب Yoldash شوید.',communication:'ارتباطات',publicChat:'گفتگوی عمومی Yoldash',sharedCommunity:'جامعه مشترک وب و اپ',shipmentChat:'گفتگوی محموله',shipmentChatHint:'پس از پذیرش پیشنهاد فعال می‌شود',onlineNow:'آنلاین',loginForChat:'برای ورود به گفتگوی Yoldash وارد حساب شوید.',message:'پیام بنویسید...',driversDesc:'پروفایل رانندگان، خودروها و وضعیت دسترسی آن‌ها در همین وب‌اپ به داده‌های مشترک Yoldash متصل می‌شود.',servicesDesc:'بیمه ترکیه، CMR، اسناد، هزینه‌ها و ابزارهای راننده در همین داشبورد یکپارچه خواهند شد.',siteManager:'مدیر سایت',whatsappContact:'واتساپ',privacy:'حریم خصوصی',terms:'شرایط استفاده',cargoDetails:'مشخصات بار',originCountry:'کشور مبدأ',originCity:'شهر مبدا',originCustoms:'گمرک مبدأ',destinationCountry:'کشور مقصد',destinationCity:'شهر مقصد',destinationCustoms:'گمرک مقصد',cargoType:'نوع بار',cargoTypeHint:'مثلاً مواد غذایی',truckType:'نوع خودرو',truckCount:'تعداد کامیون',weight:'وزن (kg)',price:'کرایه پیشنهادی',loadingAt:'زمان بارگیری',validity:'اعتبار آگهی',exitBorder:'مرز خروجی',description:'توضیحات',sharedSupabase:'این فرم مستقیم در همان Supabase اپ Yoldash ذخیره می‌شود.',cancel:'انصراف',publishLoad:'انتشار بار',authSubtitle:'با حساب مشترک اپ وارد شوید',createAccountTitle:'حساب Yoldash خود را بسازید',signInTitle:'با حساب Yoldash خود وارد شوید',email:'ایمیل',password:'رمز عبور',authNote:'حساب وب و اپ یکی است و از Supabase Auth مشترک استفاده می‌کند.',signIn:'ورود',register:'ثبت‌نام',accountType:'نوع حساب',driver:'راننده',cargoOwner:'صاحب بار',transportCompany:'شرکت حمل‌ونقل',broker:'واسطه',forgotPassword:'رمز عبور را فراموش کرده‌ام',notifications:'اعلان‌ها',markAllRead:'همه خوانده شد',noNotifications:'اعلانی ندارید',unreadNotifications:'اعلان خوانده‌نشده',superAdminOnly:'فقط Super Admin',yoldashUsersMap:'نقشه کاربران Yoldash',mapPrivacyNote:'فقط کاربرانی نمایش داده می‌شوند که موقعیت فعال و مجاز در سیستم دارند.',usersWithLocation:'کاربر دارای موقعیت',noLocationUsers:'فعلاً کاربری با موقعیت فعال وجود ندارد.',forgotPasswordTitle:'بازیابی رمز عبور',forgotPasswordText:'ایمیل حساب Yoldash خود را وارد کنید تا لینک انتخاب رمز جدید برای شما ارسال شود.',sendResetLink:'ارسال لینک بازیابی',signedInShared:'شما با حساب مشترک Yoldash وارد شده‌اید.',completeProfile:'تکمیل پروفایل',firstName:'نام',lastName:'نام خانوادگی',phone:'شماره تلفن',countryCode:'کشور',whatsappPhone:'واتساپ',tractorPlate:'پلاک ترانزیت کشنده',containerPlate:'پلاک ترانزیت تریلر/کانتینر',driverCompany:'نام شرکت راننده',saveProfile:'ذخیره پروفایل',signOut:'خروج از حساب',transportRequest:'درخواست حمل',offerPrice:'قیمت پیشنهادی',requestedTruckCount:'تعداد کامیون پیشنهادی',sendRequest:'ارسال درخواست',curtain:'چادری',flatbed:'کفی',tanker:'تانکر',reefer:'یخچالی',lightTruck:'کامیون سبک',sharedData:'مشترک با اپ',details:'جزئیات',tons:'تن',trucks:'کامیون',owner:'اعلام‌کننده',requestTransport:'درخواست حمل',yourLoad:'بار شما',profileNeeded:'برای ادامه ابتدا پروفایل تجاری خود را کامل کنید.',noLoads:'در حال حاضر بار فعالی پیدا نشد.',noShipments:'حمل یا بار فعالی برای حساب شما پیدا نشد.',noMessages:'هنوز پیامی در گفتگو نیست.',authSuccess:'ورود با موفقیت انجام شد.',signupCheckEmail:'ثبت‌نام انجام شد. ایمیل خود را برای تأیید حساب بررسی کنید.',checkEmailTitle:'ایمیل خود را بررسی کنید',checkEmailText:'لینک تأیید برای ایمیل شما ارسال شد. برای ادامه، ایمیل را باز کنید و حساب خود را تأیید کنید.',backToLogin:'بازگشت به ورود',resendVerification:'ارسال مجدد ایمیل',verificationResent:'ایمیل تأیید دوباره ارسال شد.',completeProfileHint:'اطلاعات پایه خود را وارد کنید.',saveAndContinue:'ذخیره و ادامه',passwordResetSent:'لینک بازیابی رمز عبور برای شما ارسال شد.',setNewPassword:'رمز عبور جدید',setNewPasswordHint:'یک رمز عبور جدید و امن برای حساب Yoldash انتخاب کنید.',newPassword:'رمز عبور جدید',confirmPassword:'تکرار رمز عبور',saveNewPassword:'ذخیره رمز عبور جدید',passwordsMismatch:'رمزهای عبور یکسان نیستند.',passwordUpdated:'رمز عبور با موفقیت تغییر کرد.',profileSaved:'پروفایل با موفقیت ذخیره شد.',loadPublished:'بار با موفقیت منتشر شد و در اپ هم قابل مشاهده است.',offerSent:'درخواست حمل با موفقیت ارسال شد.',offerPending:'درخواست حمل شما برای این بار هنوز در انتظار تصمیم است.',offerPendingDetails:'پیشنهاد فعال شما',messageSent:'پیام ارسال شد.',loading:'در حال بارگذاری...',companyName:'نام شرکت',organizationName:'نام سازمان / مجموعه',licenseNumber:'شماره گواهینامه',registrationNumber:'شماره ثبت',optional:'اختیاری',accountInactive:'این حساب غیرفعال است.',driverCannotPost:'حساب راننده نمی‌تواند اعلام بار ایجاد کند. رانندگان می‌توانند برای بارها درخواست حمل بفرستند.',postOnlyBusiness:'فقط صاحب بار، شرکت حمل‌ونقل یا واسطه می‌تواند بار اعلام کند.',offerOnlyProvider:'فقط راننده یا شرکت حمل‌ونقل می‌تواند درخواست حمل بفرستد.',profileIncomplete:'پروفایل تجاری هنوز کامل نیست.',completeProfileRequired:'برای استفاده از امکانات Yoldash ابتدا پروفایل خود را کامل کنید.',invalidPhone:'شماره تلفن باید با فرمت بین‌المللی مثل +905xxxxxxxxx باشد.',requiredFields:'لطفاً فیلدهای ضروری را کامل کنید.',networkError:'ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید.',unexpectedError:'خطایی رخ داد. دوباره تلاش کنید.',verificationRequired:'اگر ایمیل حساب هنوز تأیید نشده، ابتدا لینک تأیید را باز کنید.',onlineLabel:'آنلاین',offlineLabel:'آفلاین',quota:'سهمیه امروز',remaining:'باقی‌مانده',unlimited:'نامحدود',profile:'پروفایل',toman:'تومان',ratesLoading:'در حال دریافت نرخ بازار...',ratesNote:'نرخ بازار با به‌روزرسانی خودکار هر ۵ دقیقه.',ratesUpdated:'آخرین به‌روزرسانی',ratesSource:'منبع',ratesUnavailable:'دریافت نرخ ارز ممکن نشد',ratesStale:'آخرین نرخ معتبر',serviceCenter:'مرکز خدمات Yoldash',serviceSupport:'پشتیبانی خدمات',availableNow:'فعال',turkeyInsurance:'بیمه ترکیه',insuranceServiceDesc:'ثبت و پیگیری درخواست بیمه ترکیه برای رانندگان و ناوگان Yoldash.',requestService:'درخواست خدمت',comingSoon:'به‌زودی',cmrServiceDesc:'مدیریت و دسترسی سریع به اسناد CMR مرتبط با حمل‌های شما.',sharedWithApp:'با همان حساب اپ Yoldash',transportDocuments:'اسناد حمل',documentsServiceDesc:'مرکز یکپارچه مدارک راننده، خودرو و محموله با دسترسی امن.',tripExpenses:'هزینه‌های سفر',expensesServiceDesc:'ثبت و مدیریت هزینه‌های سفر، حمل و عملیات ناوگان در یک محل.',serviceContactHint:'برای خدمات، پشتیبانی و پیگیری درخواست‌ها مستقیم تماس بگیرید.',driverHub:'بازار راننده و خودرو',driverHubDesc:'برای پیدا کردن راننده یا خودرو آگهی ثبت کنید و آگهی‌های فعال کاربران Yoldash را ببینید.',newDriverListing:'ثبت آگهی',activeListings:'آگهی فعال',searchDriverHub:'شهر، عنوان یا نوع خودرو',needDriver:'دنبال راننده هستم',needVehicle:'دنبال ماشین هستم',driverHubLoginHint:'برای مشاهده آگهی‌های راننده و خودرو وارد شوید.',listingType:'نوع آگهی',employmentType:'نوع همکاری',serviceWork:'سرویسی',permanentWork:'دائمی',title:'عنوان',city:'شهر',showIdentity:'نمایش نام من در آگهی',publishListing:'انتشار آگهی',listingPublished:'آگهی با موفقیت منتشر شد.',noDriverListings:'در حال حاضر آگهی فعالی وجود ندارد.',closeListing:'بستن آگهی',call:'تماس',allListings:'همه آگهی‌های فعال',myListings:'آگهی‌های من',editListing:'ویرایش',saveChanges:'ذخیره تغییرات',reopenListing:'فعال‌سازی مجدد',deleteListing:'حذف',deleteListingConfirm:'این آگهی برای همیشه حذف شود؟',activeStatus:'فعال',closedStatus:'بسته',listingUpdated:'آگهی با موفقیت ویرایش شد.',listingClosed:'آگهی بسته شد.',listingReopened:'آگهی دوباره فعال شد.',listingDeleted:'آگهی حذف شد.',listingFormHint:'عنوان حداقل ۳ حرف، شهر حداقل ۲ حرف و توضیحات حداقل ۱۰ حرف باشد.',experienceRoutesPlaceholder:'سابقه و مسیرهای آشنا',residenceCityPlaceholder:'شهر محل سکونت',familiarVehiclesPlaceholder:'نوع ماشین‌هایی که با آن‌ها آشنا هستید',contactPhonePlaceholder:'شماره تماس',phone11Hint:'شماره تماس را دقیقاً با ۱۱ رقم وارد کنید.',showFullName:'نمایش نام و نام خانوادگی من',showFullNameHint:'در صورت فعال بودن، نام و نام خانوادگی از پروفایل Yoldash گرفته می‌شود. برای انتشار ناشناس خاموش بگذارید.',listingTitleError:'عنوان آگهی باید حداقل ۳ حرف باشد.',listingDescriptionError:'توضیحات آگهی باید حداقل ۱۰ حرف باشد.',listingCityError:'نام شهر را کامل وارد کنید.',listingPhoneError:'شماره تماس معتبر وارد کنید.',businessType:'نوع حساب'
},
tr:{
roadFreight:'Karayolu Taşımacılığı',home:'Ana Sayfa',loadBoard:'Yük İlanları',myShipments:'Taşımalarım',chat:'Sohbet',drivers:'Sürücü & Araç',services:'Hizmetler',secureTitle:'Güvenli Yoldash bağlantısı',secureText:'Veriler uygulama ve Supabase ile ortaktır',search:'Yük, şehir veya kullanıcı ara...',guest:'Misafir kullanıcı',login:'Giriş / Kayıt',livePlatform:'Canlı karayolu taşımacılık platformu',heroTitle:'<em>Yoldash</em> Akıllı Taşımacılık Sistemi',heroText:'Yük sahibi, sürücü ve nakliye şirketini doğrudan buluşturur; yük ilanından teklif almaya ve taşımayı tamamen yönetmeye kadar.',createLoad:'Yeni Yük İlanı',viewLoads:'Yükleri Gör',online:'Çevrimiçi erişim',languages:'Dil',sharedAccount:'Web & uygulama ortak hesabı',origin:'Çıkış',destination:'Varış',truckOnRoute:'Araç yolda',activeLoads:'Aktif yükler',onlineDrivers:'Çevrimiçi sürücüler',inTransit:'Yolda',today:'bugün',completed:'Başarılı teslimat',marketplace:'Taşıma pazarı',freshLoads:'Yeni yayınlanan yükler',all:'Tümü',international:'Uluslararası',domestic:'Yurtiçi',seeAll:'Tümünü gör',quickAccess:'Hızlı erişim',actions:'İşlemler',newLoad:'Yeni yük ilanı',newLoadHint:'2 dakikadan kısa',findDriver:'Sürücü veya araç bul',findDriverHint:'Sürücü & araç pazarı',openChat:'Sohbeti aç',chatLoginHint:'Girişten sonra',liveRates:'Canlı kurlar',currency:'Döviz',live:'Canlı',ratesNote:'Döviz kuru bağlantısı sonraki aşamada etkinleştirilecek.',searchLoads:'Çıkış, varış veya yük türüne göre ara',shipmentsDesc:'Aktif, teslim edilmiş ve bekleyen tüm taşımalarınızı buradan yönetin.',transportManagement:'Taşıma yönetimi',refresh:'Yenile',loginRequired:'Giriş gerekli',loginForShipments:'Taşımalarınızı görmek için Yoldash hesabınıza giriş yapın.',communication:'İletişim',publicChat:'Yoldash genel sohbeti',sharedCommunity:'Web ve uygulama ortak topluluğu',shipmentChat:'Sevkiyat sohbeti',shipmentChatHint:'Teklif kabul edilince açılır',onlineNow:'Çevrimiçi',loginForChat:'Yoldash sohbetine katılmak için giriş yapın.',message:'Mesaj yazın...',driversDesc:'Sürücü, araç ve uygunluk verileri bu web uygulamasında ortak Yoldash verilerine bağlanır.',servicesDesc:'Türkiye sigortası, CMR, belgeler, masraflar ve sürücü araçları bu panelde birleşecek.',siteManager:'Site Yöneticisi',whatsappContact:'WhatsApp',privacy:'Gizlilik',terms:'Kullanım Şartları',cargoDetails:'Yük bilgileri',originCountry:'Çıkış ülkesi',originCity:'Çıkış şehri',originCustoms:'Çıkış gümrüğü',destinationCountry:'Varış ülkesi',destinationCity:'Varış şehri',destinationCustoms:'Varış gümrüğü',cargoType:'Yük türü',cargoTypeHint:'Örn. gıda',truckType:'Araç türü',truckCount:'Araç sayısı',weight:'Ağırlık (kg)',price:'Önerilen navlun',loadingAt:'Yükleme zamanı',validity:'İlan geçerliliği',exitBorder:'Çıkış sınırı',description:'Açıklama',sharedSupabase:'Bu form doğrudan Yoldash uygulamasıyla aynı Supabase’e kaydeder.',cancel:'İptal',publishLoad:'Yükü Yayınla',authSubtitle:'Uygulamadaki ortak hesabınızla giriş yapın',createAccountTitle:'Yoldash hesabınızı oluşturun',signInTitle:'Yoldash hesabınızla giriş yapın',email:'E-posta',password:'Şifre',authNote:'Web ve uygulama aynı Supabase Auth hesabını kullanır.',signIn:'Giriş',register:'Kayıt',accountType:'Hesap türü',driver:'Sürücü',cargoOwner:'Yük sahibi',transportCompany:'Nakliye şirketi',broker:'Komisyoncu',forgotPassword:'Şifremi unuttum',notifications:'Bildirimler',markAllRead:'Tümünü okundu yap',noNotifications:'Bildiriminiz yok',unreadNotifications:'okunmamış bildirim',superAdminOnly:'Yalnızca Super Admin',yoldashUsersMap:'Yoldash Kullanıcı Haritası',mapPrivacyNote:'Yalnızca sistemde aktif ve izinli konumu bulunan kullanıcılar gösterilir.',usersWithLocation:'konumu olan kullanıcı',noLocationUsers:'Şu anda aktif konumu olan kullanıcı yok.',forgotPasswordTitle:'Şifre sıfırlama',forgotPasswordText:'Yeni şifre bağlantısını almak için Yoldash hesabınızın e-posta adresini girin.',sendResetLink:'Sıfırlama bağlantısını gönder',signedInShared:'Ortak Yoldash hesabınızla giriş yaptınız.',completeProfile:'Profili tamamla',firstName:'Ad',lastName:'Soyad',phone:'Telefon',countryCode:'Ülke',whatsappPhone:'WhatsApp',tractorPlate:'Çekici transit plakası',containerPlate:'Dorse/konteyner transit plakası',driverCompany:'Sürücü şirketi',saveProfile:'Profili Kaydet',signOut:'Çıkış Yap',transportRequest:'Taşıma talebi',offerPrice:'Teklif fiyatı',requestedTruckCount:'İstenen araç sayısı',sendRequest:'Talebi Gönder',curtain:'Tenteli',flatbed:'Dorse',tanker:'Tanker',reefer:'Frigo',lightTruck:'Hafif kamyon',sharedData:'Uygulamayla ortak',details:'Detaylar',tons:'ton',trucks:'araç',owner:'İlan sahibi',requestTransport:'Taşıma talebi',yourLoad:'Sizin yükünüz',profileNeeded:'Devam etmek için işletme profilinizi tamamlayın.',noLoads:'Şu anda aktif yük bulunamadı.',noShipments:'Hesabınız için aktif taşıma veya yük bulunamadı.',noMessages:'Henüz mesaj yok.',authSuccess:'Giriş başarılı.',signupCheckEmail:'Kayıt tamamlandı. Hesabı doğrulamak için e-postanızı kontrol edin.',checkEmailTitle:'E-postanızı kontrol edin',checkEmailText:'Doğrulama bağlantısı e-posta adresinize gönderildi. Devam etmek için e-postayı açın ve hesabınızı doğrulayın.',backToLogin:'Girişe dön',resendVerification:'E-postayı yeniden gönder',verificationResent:'Doğrulama e-postası yeniden gönderildi.',completeProfileHint:'Temel bilgilerinizi girin.',saveAndContinue:'Kaydet ve devam et',passwordResetSent:'Şifre sıfırlama bağlantısı gönderildi.',profileSaved:'Profil başarıyla kaydedildi.',loadPublished:'Yük başarıyla yayınlandı ve uygulamada da görülebilir.',offerSent:'Taşıma talebi gönderildi.',offerPending:'Bu yük için taşıma talebiniz hâlâ karar bekliyor.',offerPendingDetails:'Aktif teklifiniz',messageSent:'Mesaj gönderildi.',loading:'Yükleniyor...',companyName:'Şirket adı',organizationName:'Kurum / firma adı',licenseNumber:'Ehliyet numarası',registrationNumber:'Sicil numarası',optional:'İsteğe bağlı',accountInactive:'Bu hesap devre dışı.',driverCannotPost:'Sürücü hesabı yük ilanı veremez. Sürücüler yüklere taşıma talebi gönderebilir.',postOnlyBusiness:'Yalnızca yük sahibi, nakliye şirketi veya komisyoncu yük ilanı verebilir.',offerOnlyProvider:'Yalnızca sürücü veya nakliye şirketi taşıma talebi gönderebilir.',profileIncomplete:'İşletme profili henüz tamamlanmadı.',completeProfileRequired:'Yoldash özelliklerini kullanmak için önce profilinizi tamamlayın.',invalidPhone:'Telefon uluslararası formatta olmalı, örn. +905xxxxxxxxx.',requiredFields:'Lütfen zorunlu alanları doldurun.',networkError:'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.',unexpectedError:'Bir hata oluştu. Tekrar deneyin.',verificationRequired:'E-posta henüz doğrulanmadıysa doğrulama bağlantısını açın.',onlineLabel:'Çevrimiçi',offlineLabel:'Çevrimdışı',quota:'Bugünkü kota',remaining:'kalan',unlimited:'Sınırsız',profile:'Profil',toman:'Tümen',ratesLoading:'Piyasa kurları alınıyor...',ratesNote:'Piyasa kurları her 5 dakikada otomatik yenilenir.',ratesUpdated:'Son güncelleme',ratesSource:'Kaynak',ratesUnavailable:'Döviz kurları alınamadı',ratesStale:'Son geçerli kur',experienceRoutesPlaceholder:'Deneyim ve bildiğiniz güzergâhlar',residenceCityPlaceholder:'İkamet ettiğiniz şehir',familiarVehiclesPlaceholder:'Bildiğiniz araç türleri',contactPhonePlaceholder:'Telefon numarası',phone11Hint:'Telefon numarasını tam 11 hane olarak girin.',showFullName:'Adımı ve soyadımı göster',showFullNameHint:'Açık olduğunda ad ve soyad Yoldash profilinizden alınır. Anonim yayın için kapalı bırakın.',businessType:'Hesap türü'
},
en:{
roadFreight:'Road Freight',home:'Home',loadBoard:'Load Board',myShipments:'My Shipments',chat:'Chat',drivers:'Drivers & Trucks',services:'Services',secureTitle:'Secure Yoldash connection',secureText:'Shared data with the app and Supabase',search:'Search loads, cities and users...',guest:'Guest user',login:'Sign in / Register',livePlatform:'Live road-freight platform',heroTitle:'<em>Yoldash</em> Smart Transportation System',heroText:'Directly connecting cargo owners, drivers and transport companies—from posting loads and receiving offers to complete shipment management.',createLoad:'Post New Load',viewLoads:'Browse Loads',online:'Online access',languages:'Languages',sharedAccount:'Shared web & app account',origin:'Origin',destination:'Destination',truckOnRoute:'Truck en route',activeLoads:'Active loads',onlineDrivers:'Drivers online',inTransit:'In transit',today:'today',completed:'Successful deliveries',marketplace:'Freight marketplace',freshLoads:'Recently posted loads',all:'All',international:'International',domestic:'Domestic',seeAll:'See all',quickAccess:'Quick access',actions:'Actions',newLoad:'Post new load',newLoadHint:'Under 2 minutes',findDriver:'Find driver or vehicle',findDriverHint:'Driver & vehicle market',openChat:'Open chat',chatLoginHint:'After sign in',liveRates:'Live rates',currency:'FX',live:'Live',ratesNote:'Live FX connectivity will be enabled in the next phase.',searchLoads:'Search by origin, destination or cargo type',shipmentsDesc:'Manage all active, delivered and pending shipments in one place.',transportManagement:'Transport management',refresh:'Refresh',loginRequired:'Sign in required',loginForShipments:'Sign in to your Yoldash account to see your shipments.',communication:'Communications',publicChat:'Yoldash public chat',sharedCommunity:'Shared web & app community',shipmentChat:'Shipment chat',shipmentChatHint:'Opens after an offer is accepted',onlineNow:'Online',loginForChat:'Sign in to join the Yoldash chat.',message:'Write a message...',driversDesc:'Driver, vehicle and availability data in this web app connects to the shared Yoldash backend.',servicesDesc:'Turkey insurance, CMR, documents, expenses and driver tools will live in this unified dashboard.',siteManager:'Site Manager',whatsappContact:'WhatsApp',privacy:'Privacy',terms:'Terms of Use',cargoDetails:'Cargo details',originCountry:'Origin country',originCity:'Origin city',originCustoms:'Origin customs',destinationCountry:'Destination country',destinationCity:'Destination city',destinationCustoms:'Destination customs',cargoType:'Cargo type',cargoTypeHint:'e.g. food products',truckType:'Truck type',truckCount:'Truck count',weight:'Weight (kg)',price:'Proposed freight',loadingAt:'Loading time',validity:'Listing validity',exitBorder:'Exit border',description:'Description',sharedSupabase:'This form writes directly to the same Supabase used by the Yoldash app.',cancel:'Cancel',publishLoad:'Publish Load',authSubtitle:'Sign in with the same account you use in the app',email:'Email',password:'Password',authNote:'Web and Android use the same Supabase Auth account.',signIn:'Sign In',register:'Register',accountType:'Account type',driver:'Driver',cargoOwner:'Cargo owner',transportCompany:'Transport company',broker:'Broker',forgotPassword:'Forgot password',notifications:'Notifications',markAllRead:'Mark all read',noNotifications:'No notifications',unreadNotifications:'unread notifications',superAdminOnly:'Super Admin only',yoldashUsersMap:'Yoldash User Map',mapPrivacyNote:'Only users with an active, permitted location in the system are shown.',usersWithLocation:'users with location',noLocationUsers:'No users currently have an active location.',forgotPasswordTitle:'Reset password',forgotPasswordText:'Enter the email for your Yoldash account and we will send a link to choose a new password.',sendResetLink:'Send reset link',signedInShared:'You are signed in with your shared Yoldash account.',completeProfile:'Complete profile',firstName:'First name',lastName:'Last name',phone:'Phone',countryCode:'Country',whatsappPhone:'WhatsApp',tractorPlate:'Tractor transit plate',containerPlate:'Trailer/container transit plate',driverCompany:'Driver company',saveProfile:'Save Profile',signOut:'Sign Out',transportRequest:'Transport request',offerPrice:'Proposed price',requestedTruckCount:'Requested trucks',sendRequest:'Send Request',curtain:'Curtain-side',flatbed:'Flatbed',tanker:'Tanker',reefer:'Refrigerated',lightTruck:'Light truck',sharedData:'Shared with app',details:'Details',tons:'tons',trucks:'trucks',owner:'Posted by',requestTransport:'Request transport',yourLoad:'Your load',profileNeeded:'Complete your business profile before continuing.',noLoads:'No active loads were found right now.',noShipments:'No active transport or cargo was found for your account.',noMessages:'There are no messages yet.',authSuccess:'Signed in successfully.',signupCheckEmail:'Registration completed. Check your email to confirm the account.',checkEmailTitle:'Check your email',checkEmailText:'A confirmation link was sent to your email. Open it and verify your account to continue.',backToLogin:'Back to sign in',resendVerification:'Resend email',verificationResent:'Verification email sent again.',completeProfileHint:'Enter your basic information.',saveAndContinue:'Save and continue',passwordResetSent:'Password reset link was sent.',profileSaved:'Profile saved successfully.',loadPublished:'Load published successfully and is now shared with the app.',offerSent:'Transport request sent successfully.',offerPending:'Your transport request for this cargo is still awaiting a decision.',offerPendingDetails:'Your active offer',messageSent:'Message sent.',loading:'Loading...',companyName:'Company name',organizationName:'Organization / business name',licenseNumber:'License number',registrationNumber:'Registration number',optional:'Optional',accountInactive:'This account is inactive.',driverCannotPost:'Driver accounts cannot post loads. Drivers can submit transport requests to available loads.',postOnlyBusiness:'Only cargo owners, transport companies or brokers can post loads.',offerOnlyProvider:'Only drivers or transport companies can send transport requests.',profileIncomplete:'The business profile is not complete yet.',completeProfileRequired:'Complete your profile before using Yoldash features.',invalidPhone:'Phone must use international format, e.g. +905xxxxxxxxx.',requiredFields:'Please complete the required fields.',networkError:'Could not reach the server. Check your internet connection.',unexpectedError:'Something went wrong. Please try again.',verificationRequired:'If the email is not confirmed yet, open the verification link first.',onlineLabel:'Online',offlineLabel:'Offline',quota:'Today quota',remaining:'remaining',unlimited:'Unlimited',profile:'Profile',toman:'Toman',ratesLoading:'Loading market rates...',ratesNote:'Market rates refresh automatically every 5 minutes.',ratesUpdated:'Last updated',ratesSource:'Source',ratesUnavailable:'Exchange rates are unavailable',ratesStale:'Last valid rate',serviceCenter:'Yoldash Service Center',serviceSupport:'Service Support',availableNow:'Active',turkeyInsurance:'Turkey Insurance',insuranceServiceDesc:'Turkey insurance application and tracking for Yoldash drivers and fleets.',requestService:'Request Service',comingSoon:'Coming soon',cmrServiceDesc:'Manage and quickly access CMR documents linked to your shipments.',sharedWithApp:'Same account as the Yoldash app',transportDocuments:'Transport Documents',documentsServiceDesc:'A secure unified center for driver, vehicle and shipment documents.',tripExpenses:'Trip Expenses',expensesServiceDesc:'Manage trip, freight and fleet operating expenses in one place.',serviceContactHint:'Contact us directly for services, support and request tracking.',driverHub:'Driver & Vehicle Market',driverHubDesc:'Post an ad to find a driver or vehicle and browse active Yoldash listings.',newDriverListing:'New Listing',activeListings:'Active listings',searchDriverHub:'City, title or truck type',needDriver:'Need a driver',needVehicle:'Need a vehicle',driverHubLoginHint:'Sign in to browse driver and vehicle listings.',listingType:'Listing type',employmentType:'Engagement',serviceWork:'Per trip',permanentWork:'Permanent',title:'Title',city:'City',showIdentity:'Show my name on the listing',publishListing:'Publish Listing',listingPublished:'Listing published successfully.',noDriverListings:'There are no active listings right now.',closeListing:'Close Listing',call:'Call',experienceRoutesPlaceholder:'Experience and familiar routes',residenceCityPlaceholder:'City of residence',familiarVehiclesPlaceholder:'Vehicle types you are familiar with',contactPhonePlaceholder:'Contact number',phone11Hint:'Enter the contact number as exactly 11 digits.',showFullName:'Show my first and last name',showFullNameHint:'When enabled, your first and last name are taken from your Yoldash profile. Leave it off to publish anonymously.',businessType:'Account type'
}}
;

const state = {
  lang: localStorage.getItem('yoldash_lang') || 'fa',
  session: null,
  profile: null,
  businessProfile: null,
  loads: [],
  loadFilter: 'all',
  authMode: 'signin',
  selectedBusinessType: null,
  pendingSignupEmail: '',
  city: { origin: null, destination: null },
  fxData: null,
  fxTimer: null,
  chatTimer: null,
  driverListings: [],
  driverFilter: 'all',
  driverScope: 'all',
  loadRealtimeChannel: null,
  loadRefreshTimer: null,
  loadRefreshDebounce: null,
  isSuperAdmin: false,
  adminUserMap: null,
  adminUserMapLayer: null,
  adminMapRows: [],
  adminMapRefreshTimer: null,
  adminMapHasInitialFit: false
};

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
  $$('.page').forEach(p=>p.classList.remove('active'));
  if(name==='home') ['page-home','metrics-home','content-home'].forEach(id=>$('#'+id)?.classList.add('active'));
  else $('#page-'+name)?.classList.add('active');
  $$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));
  $('.sidebar')?.classList.remove('open');
  if(name==='shipments') loadShipments();
  if(name==='home'||name==='loads') loadLoads();
  if(name==='chat') loadChat();
  if(name==='drivers') loadDriverHub();
  window.scrollTo({top:0,behavior:'smooth'});
}

function cargoCard(c, shipment=false){
  const from = cityName(c,'origin');
  const to = cityName(c,'destination');
  const tt = truckKey(c.required_truck_type);
  const kg = Number(c.weight_kg || 0);
  const weight = kg ? (kg/1000).toLocaleString(localeMap[state.lang],{maximumFractionDigits:2}) : '—';
  const price = c.freight_price != null ? `${Number(c.freight_price).toLocaleString(localeMap[state.lang])} ${esc(c.currency_code||'')}` : '—';
  const own = state.session?.user?.id && state.session.user.id === c.owner_id;
  let action = `<button class="btn secondary" data-cargo-details="${esc(c.id)}">${t('details')} ↗</button>`;
  if (!shipment && isFullProfileReady() && canOfferTypes.has(state.profile?.business_user_type) && !own) action = `<button class="btn secondary offer-btn" data-offer="${esc(c.id)}">${t('requestTransport')} ↗</button>`;
  else if (!shipment && own) action = `<button class="btn secondary owner-btn" disabled>${t('yourLoad')}</button>`;
  return `<article class="cargo-card" data-cargo-id="${esc(c.id)}">
    <div class="route"><div class="city"><b>${esc(from)}</b><small>${esc(c.origin_country_code||'')}</small></div><span class="route-arrow">→</span><div class="city"><b>${esc(to)}</b><small>${esc(c.destination_country_code||'')}</small></div></div>
    <span class="status-pill">${esc(c.status||'PUBLISHED')}</span>
    <div class="cargo-meta"><div><span>${t('truckType')}</span><b>${tt?t(tt):esc(c.required_truck_type||'—')}</b></div><div><span>${t('weight')}</span><b>${weight} ${kg?t('tons'):''}</b></div><div><span>${t('trucks')}</span><b>${esc(c.remaining_truck_count ?? c.truck_count ?? 1)}</b></div></div>
    <div class="price"><span>${t('price')}</span><b>${price}</b><span>${esc(relativeLabel(c.published_at||c.announced_at||c.created_at))}</span><small class="owner">${t('owner')}: ${esc(c.owner_display_name||'Yoldash')}</small></div>${action}</article>`;
}
function emptyBlock(titleKey, body='') { return `<div class="empty-inline"><b>${t(titleKey)}</b>${body?`<span>${esc(body)}</span>`:''}</div>`; }
function renderLoads(){
  const q = ($('#loadSearch')?.value || '').trim().toLocaleLowerCase();
  const filtered = state.loads.filter(c=>{
    if(state.loadFilter==='international' && c.origin_country_code===c.destination_country_code) return false;
    if(state.loadFilter==='domestic' && c.origin_country_code!==c.destination_country_code) return false;
    if(!q) return true;
    return [cityName(c,'origin'),cityName(c,'destination'),c.cargo_type,c.required_truck_type,c.owner_display_name].some(v=>String(v||'').toLocaleLowerCase().includes(q));
  });
  const home = $('#cargoList'), all = $('#cargoListAll');
  if(home) home.innerHTML = state.loads.length ? state.loads.slice(0,3).map(c=>cargoCard(c)).join('') : emptyBlock('noLoads');
  if(all) all.innerHTML = filtered.length ? filtered.map(c=>cargoCard(c)).join('') : emptyBlock('noLoads');
  $('#loadCountBadge').textContent = state.loads.length ? String(state.loads.length) : '0';
  $('#metricLoads').textContent = state.loads.length ? String(state.loads.length) : '0';
  bindCargoActions();
}
function bindCargoActions(){
  $$('[data-offer]').forEach(btn=>btn.onclick=()=>openOffer(btn.dataset.offer));
  $$('[data-cargo-details]').forEach(btn=>btn.onclick=()=>{
    const c=state.loads.find(x=>x.id===btn.dataset.cargoDetails);
    if(c) toast(`${cityName(c,'origin')} → ${cityName(c,'destination')} · ${c.cargo_type || ''}`,'ok');
  });
}
async function loadLoads(query=''){
  try{
    const {data,error} = await supabase.rpc('get_open_cargo_posts',{p_query:query||'',p_offset:0,p_limit:50});
    if(error) throw error;
    state.loads = Array.isArray(data) ? data : [];
  }catch(err){
    console.warn('get_open_cargo_posts failed, trying public table fallback',err);
    const {data,error} = await supabase.from('cargo_posts').select('*').eq('status','PUBLISHED').is('deleted_at',null).gt('expires_at',new Date().toISOString()).order('published_at',{ascending:false}).limit(50);
    if(error){ state.loads=[]; toast(humanError(error),'error'); }
    else state.loads=data||[];
  }
  renderLoads();
}

function scheduleLoadRefresh(delay=500){
  clearTimeout(state.loadRefreshDebounce);
  state.loadRefreshDebounce=setTimeout(()=>loadLoads(),delay);
}
function startLiveLoads(){
  try{
    if(state.loadRealtimeChannel) supabase.removeChannel(state.loadRealtimeChannel);
    state.loadRealtimeChannel=supabase
      .channel('web-live-cargo-posts')
      .on('postgres_changes',{event:'*',schema:'public',table:'cargo_posts'},()=>scheduleLoadRefresh(350))
      .subscribe();
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
    const {data,error}=await supabase.auth.getSession();
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
  const {data,error}=await supabase.from('profiles').select('id,email,first_name,last_name,phone,is_active,business_user_type,whatsapp_phone,tractor_transit_plate,container_transit_plate,driver_company_name').eq('id',uid).single();
  if(error){ console.error(error); return; }
  state.profile=data;
  state.businessProfile = await fetchBusinessProfile(data.business_user_type,uid);
  populateProfileEditor();
}
async function fetchBusinessProfile(type,uid){
  const tables={DRIVER:'driver_profiles',CARGO_OWNER:'cargo_owner_profiles',TRANSPORT_COMPANY:'transport_companies',BROKER:'broker_profiles'};
  const table=tables[type]; if(!table) return null;
  const {data,error}=await supabase.from(table).select('*').eq('user_id',uid).maybeSingle();
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
      const {error}=await supabase.from('profiles').update(base).eq('id',uid);
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
    let {error}=await supabase.from('profiles').update(base).eq('id',uid); if(error) throw error;
    const payloadMap={
      DRIVER:{user_id:uid,country_code:country,license_number:primary,license_country_code:country},
      CARGO_OWNER:{user_id:uid,country_code:country,organization_name:primary},
      TRANSPORT_COMPANY:{user_id:uid,company_name:primary,country_code:country,registration_number:secondary||null},
      BROKER:{user_id:uid,country_code:country,organization_name:primary}
    };
    ({error}=await supabase.from(({DRIVER:'driver_profiles',CARGO_OWNER:'cargo_owner_profiles',TRANSPORT_COMPANY:'transport_companies',BROKER:'broker_profiles'})[type]).upsert(payloadMap[type],{onConflict:'user_id'})); if(error) throw error;
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
      const redirect = location.protocol.startsWith('http') ? `${location.origin}/` : 'https://www.getyoldash.com/';
      const {data,error}=await supabase.auth.signUp({
        email,password,
        options:{emailRedirectTo:redirect,data:{business_user_type:state.selectedBusinessType}}
      });
      if(error) throw error;
      state.pendingSignupEmail=email;
      if(data.session){
        state.session=data.session; await loadProfile(); renderProfileUI();
        status.className='auth-status ok'; status.textContent=t('authSuccess');
        if(!basicProfileComplete()) $('#authModal')?.showModal();
      }else{
        showVerifyEmail(email);
      }
    }else{
      const {data,error}=await supabase.auth.signInWithPassword({email,password});
      if(error) throw error;
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
  const redirect=location.protocol.startsWith('http')?`${location.origin}/`:'https://www.getyoldash.com/';
  const {error}=await supabase.auth.resend({type:'signup',email,options:{emailRedirectTo:redirect}});
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
    const redirect=location.protocol.startsWith('http')?`${location.origin}/`:'https://www.getyoldash.com/';
    const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:redirect});
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
    const {error}=await supabase.auth.updateUser({password:p1});
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
    const {data,error}=await supabase.from('driver_hub_listings').select('id,user_id,listing_type,title,description,country_code,city,truck_type,contact_phone,status,created_at,updated_at,show_identity,first_name,last_name,employment_type').order('created_at',{ascending:false}).limit(200);
    if(error) throw error;
    state.driverListings=data||[];
  }catch(err){state.driverListings=[];toast(humanError(err),'error');}
  renderDriverHub();
}
function syncDriverListingSegments(){
  const listing=$('#driverListingType')?.value||'NEED_VEHICLE';
  const employment=$('#driverEmploymentType')?.value||'SERVICE';
  $('[data-listing-type]').forEach(b=>b.classList.toggle('active',b.dataset.listingType===listing));
  $('[data-employment-type]').forEach(b=>b.classList.toggle('active',b.dataset.employmentType===employment));
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
    const {data,error}=await supabase.rpc('upsert_driver_hub_listing',{
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
    const {error}=await supabase.from('driver_hub_listings').update({status:next,updated_at:new Date().toISOString()}).eq('id',id).eq('user_id',state.session.user.id);
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
    const {error}=await supabase.from('driver_hub_listings').delete().eq('id',id).eq('user_id',state.session.user.id);
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
    const {data}=await supabase.rpc('get_current_cargo_daily_quota'); const q=Array.isArray(data)?data[0]:data;
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
    const {error}=await supabase.from('cargo_posts').insert(payload).select('id').single(); if(error) throw error;
    $('#loadModal').close(); $('#loadForm').reset(); state.city={origin:null,destination:null}; toast(t('loadPublished')); await loadLoads();
  }catch(err){ toast(humanError(err),'error'); }
  finally{ btn.disabled=false; btn.textContent=t('publishLoad'); }
}

async function setupCitySearch(which){
  const input=$(`#${which}City`), results=$(`#${which}CityResults`), country=$(`#${which}Country`); let timer;
  input.addEventListener('input',()=>{
    state.city[which]=null; clearTimeout(timer); const q=input.value.trim();
    if(q.length<2){results.classList.remove('open');results.innerHTML='';return;}
    timer=setTimeout(async()=>{
      const {data,error}=await supabase.rpc('search_cities_v3',{p_query:q,p_limit:8,p_country_code:country.value});
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
    const {data,error}=await supabase.rpc('get_cargo_offer_snapshot',{p_cargo_id:id});
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
    const {error}=await supabase.rpc('submit_cargo_offer',{p_cargo_id:$('#offerCargoId').value,p_proposed_price:price,p_currency_code:price?$('#offerCurrency').value:null,p_message:$('#offerMessage').value.trim()||null,p_requested_truck_count:Number($('#offerTruckCount').value||1)});
    if(error) throw error; $('#offerModal').close(); $('#offerForm').reset(); toast(t('offerSent'));
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
    const {data,error}=await supabase.rpc('get_my_transport_cargo'); if(error) throw error;
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
    const {data,error}=await supabase.rpc('get_public_chat_messages',{p_limit:60,p_before:null}); if(error) throw error;
    chatCache=(data||[]).slice().reverse(); renderChatFromCache(); $('#chatTime').textContent=chatCache.length?new Date(chatCache.at(-1).created_at).toLocaleTimeString(localeMap[state.lang],{hour:'2-digit',minute:'2-digit'}):'—';
    supabase.rpc('mark_public_chat_read').then(()=>loadUnread());
  }catch(err){if(!silent) toast(humanError(err),'error');}
  clearInterval(state.chatTimer); state.chatTimer=setInterval(()=>{if($('#page-chat').classList.contains('active')&&state.session) loadChat(true);},12000);
}
async function sendChat(){
  const input=$('#chatInput'), body=input.value.trim(); if(!body||!state.session) return;
  if(!requireCompleteProfile()) return;
  const btn=$('#sendChat'); btn.disabled=true;
  try{
    const rid=crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
    const {error}=await supabase.rpc('send_public_chat_message_idempotent',{p_request_id:rid,p_body:body,p_reply_to_id:null}); if(error) throw error;
    input.value=''; await loadChat(true);
  }catch(err){toast(humanError(err),'error');} finally{btn.disabled=false;}
}
async function loadUnread(){
  if(!state.session){$('#chatDot').style.display='none';return;}
  try{const {data,error}=await supabase.rpc('get_public_chat_unread_count'); if(error) throw error; const n=Number(data||0); $('#chatDot').style.display=n>0?'block':'none'; $('#chatHint').textContent=n?`${n} · ${t('publicChat')}`:t('publicChat');}catch{}
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
    const {data,error}=await supabase.rpc('yoldash_is_super_admin',{p_user_id:state.session.user.id});
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
  return `<div class="admin-map-popup"><b>${name}</b><span>${type}</span><small>${esc(freshness)} · ${esc(source)}</small><small>${updated} · ${accuracyText}</small></div>`;
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
      state.adminUserMap.fitBounds([[25.0,24.0],[43.5,63.5]],{padding:[18,18]});
      state.adminMapHasInitialFit=true;
    });
    return;
  }

  if(empty) empty.classList.add('hidden');
  const bounds=[];

  valid.forEach(row=>{
    const lat=Number(row.latitude), lng=Number(row.longitude);
    const ageMs=row.updated_at ? Date.now()-new Date(row.updated_at).getTime() : Infinity;
    const freshnessClass=ageMs>60*60*1000?'stale':ageMs>15*60*1000?'aging':'fresh';
    const label=esc(row.display_name||typeLabel(row.business_user_type)||'Yoldash');

    const marker=L.circleMarker([lat,lng],{
      radius:9,
      weight:3,
      opacity:1,
      fillOpacity:.9,
      className:`yoldash-map-marker ${freshnessClass}`
    });

    marker.bindTooltip(label,{
      permanent:true,
      direction:'right',
      offset:[10,0],
      className:'yoldash-map-label'
    });
    marker.bindPopup(adminMapPopup(row),{className:'yoldash-map-popup'});
    marker.addTo(state.adminUserMapLayer);
    bounds.push([lat,lng]);
  });

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
    const {data,error}=await supabase.rpc('get_super_admin_user_map');
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
  $('[data-notification-id]').forEach(btn=>btn.onclick=()=>openNotification(btn));
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
    const {data,error}=await supabase.from('user_notifications')
      .select('id,type,cargo_id,offer_id,assignment_id,room_id,actor_name,message_preview,origin_city,destination_city,read_at,created_at')
      .eq('user_id',state.session.user.id)
      .order('created_at',{ascending:false})
      .limit(40);
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
  const {error}=await supabase.from('user_notifications')
    .update({read_at:new Date().toISOString()})
    .eq('id',id)
    .eq('user_id',state.session.user.id)
    .is('read_at',null);
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
    const {error}=await supabase.from('user_notifications')
      .update({read_at:new Date().toISOString()})
      .eq('user_id',state.session.user.id)
      .is('read_at',null);
    if(error) throw error;
    await loadNotifications();
  }catch(err){ console.warn('mark all notifications read',err); }
}
function startNotificationRealtime(){
  try{
    if(notificationRealtimeChannel) supabase.removeChannel(notificationRealtimeChannel);
    if(!state.session) return;
    notificationRealtimeChannel=supabase.channel('web-user-notifications')
      .on('postgres_changes',{event:'*',schema:'public',table:'user_notifications',filter:`user_id=eq.${state.session.user.id}`},()=>loadNotifications())
      .subscribe();
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
    const {data,error}=await supabase.functions.invoke('fx-rates',{method:'GET'});
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
  $('#mobileMenu').onclick=()=>$('.sidebar').classList.toggle('open');
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
  try{
    const {error}=await supabase.auth.signOut({scope:'local'});
    if(error) throw error;
    state.session=null;
    state.profile=null;
    state.businessProfile=null;
    chatCache=[];
    clearInterval(state.chatTimer);
    clearInterval(state.adminMapRefreshTimer);
    renderProfileUI();
    loadUnread();
    loadNotifications();
    startNotificationRealtime();
    syncSuperAdminMapAccess();
    if($('#page-chat')?.classList.contains('active')) loadChat(true);
    if($('#page-shipments')?.classList.contains('active')) loadShipments();
    if($('#page-drivers')?.classList.contains('active')) loadDriverHub();
    if($('#authModal')?.open) $('#authModal').close();
    setAuthMode('signin');
    toast(t('signOut'),'ok');
  }catch(err){
    console.error('signOut',err);
    toast(humanError(err),'error');
  }finally{
    if(btn) btn.disabled=false;
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

  try{ bindUI(); }catch(err){ console.error('bindUI init',err); }
  try{ networkUI(); }catch(err){ console.error('networkUI init',err); }
  try{ applyLanguage(state.lang,false); }catch(err){ console.error('language init',err); }
  try{ setAuthMode('signin'); handleAuthCallbackErrors(); }catch(err){ console.error('auth ui init',err); }

  // FX must never depend on auth, profile, cargo or any other module.
  startFxRates();

  try{ setupCitySearch('origin'); setupCitySearch('destination'); }catch(err){ console.error('city init',err); }

  try{
    supabase.auth.onAuthStateChange((event,session)=>setTimeout(async()=>{
      try{
        if(event==='INITIAL_SESSION' && !session){
          const current=await supabase.auth.getSession();
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
