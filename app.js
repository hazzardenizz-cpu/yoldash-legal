import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.117.2';

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
roadFreight:'حمل‌ونقل جاده‌ای',home:'خانه',loadBoard:'اعلام بار',myShipments:'حمل‌های من',chat:'گفتگو',drivers:'راننده و ماشین',services:'خدمات',secureTitle:'اتصال امن Yoldash',secureText:'داده‌ها با اپ و Supabase مشترک است',search:'جستجوی بار، شهر یا کاربر...',guest:'کاربر مهمان',login:'ورود / ثبت‌نام',livePlatform:'پلتفرم زنده حمل‌ونقل جاده‌ای',heroTitle:'بار، راننده و مسیر؛<br><em>همه در یک Yoldash.</em>',heroText:'بار خود را اعلام کنید، پیشنهاد دریافت کنید و حمل خود را از یک داشبورد سریع و یکپارچه مدیریت کنید.',createLoad:'اعلام بار جدید',viewLoads:'مشاهده بارها',online:'دسترسی آنلاین',languages:'زبان',sharedAccount:'حساب مشترک وب و اپ',origin:'مبدأ',destination:'مقصد',truckOnRoute:'کامیون در مسیر',activeLoads:'بارهای فعال',onlineDrivers:'رانندگان آنلاین',inTransit:'در حال حمل',today:'امروز',completed:'تحویل موفق',marketplace:'بازار حمل‌ونقل',freshLoads:'بارهای تازه اعلام‌شده',all:'همه',international:'بین‌المللی',domestic:'داخلی',seeAll:'مشاهده همه',quickAccess:'دسترسی سریع',actions:'عملیات',newLoad:'اعلام بار جدید',newLoadHint:'کمتر از ۲ دقیقه',findDriver:'مشاهده بارها',findDriverHint:'برای راننده و شرکت حمل',openChat:'باز کردن گفتگو',chatLoginHint:'پس از ورود',liveRates:'نرخ لحظه‌ای',currency:'ارز',live:'زنده',ratesNote:'اتصال نرخ ارز در فاز بعدی فعال می‌شود.',searchLoads:'جستجو بر اساس مبدا، مقصد یا نوع بار',shipmentsDesc:'همه حمل‌های فعال، تحویل‌شده و در انتظار شما اینجا مدیریت می‌شوند.',transportManagement:'مدیریت حمل',refresh:'به‌روزرسانی',loginRequired:'ورود لازم است',loginForShipments:'برای مشاهده حمل‌های خود وارد حساب Yoldash شوید.',communication:'ارتباطات',publicChat:'گفتگوی عمومی Yoldash',sharedCommunity:'جامعه مشترک وب و اپ',shipmentChat:'گفتگوی محموله',shipmentChatHint:'پس از پذیرش پیشنهاد فعال می‌شود',onlineNow:'آنلاین',loginForChat:'برای ورود به گفتگوی Yoldash وارد حساب شوید.',message:'پیام بنویسید...',driversDesc:'پروفایل رانندگان، خودروها و وضعیت دسترسی آن‌ها در همین وب‌اپ به داده‌های مشترک Yoldash متصل می‌شود.',servicesDesc:'بیمه ترکیه، CMR، اسناد، هزینه‌ها و ابزارهای راننده در همین داشبورد یکپارچه خواهند شد.',siteManager:'مدیر سایت',whatsappContact:'واتساپ',privacy:'حریم خصوصی',terms:'شرایط استفاده',cargoDetails:'مشخصات بار',originCountry:'کشور مبدأ',originCity:'شهر مبدا',originCustoms:'گمرک مبدأ',destinationCountry:'کشور مقصد',destinationCity:'شهر مقصد',destinationCustoms:'گمرک مقصد',cargoType:'نوع بار',cargoTypeHint:'مثلاً مواد غذایی',truckType:'نوع خودرو',truckCount:'تعداد کامیون',weight:'وزن (kg)',price:'کرایه پیشنهادی',loadingAt:'زمان بارگیری',validity:'اعتبار آگهی',exitBorder:'مرز خروجی',description:'توضیحات',sharedSupabase:'این فرم مستقیم در همان Supabase اپ Yoldash ذخیره می‌شود.',cancel:'انصراف',publishLoad:'انتشار بار',authSubtitle:'با حساب مشترک اپ وارد شوید',email:'ایمیل',password:'رمز عبور',authNote:'حساب وب و اپ یکی است و از Supabase Auth مشترک استفاده می‌کند.',signIn:'ورود',register:'ثبت‌نام',accountType:'نوع حساب',driver:'راننده',cargoOwner:'صاحب بار',transportCompany:'شرکت حمل‌ونقل',broker:'واسطه',forgotPassword:'رمز عبور را فراموش کرده‌ام',signedInShared:'شما با حساب مشترک Yoldash وارد شده‌اید.',completeProfile:'تکمیل پروفایل',firstName:'نام',lastName:'نام خانوادگی',phone:'شماره تلفن',countryCode:'کشور',whatsappPhone:'واتساپ',tractorPlate:'پلاک ترانزیت کشنده',containerPlate:'پلاک ترانزیت تریلر/کانتینر',driverCompany:'نام شرکت راننده',saveProfile:'ذخیره پروفایل',signOut:'خروج از حساب',transportRequest:'درخواست حمل',offerPrice:'قیمت پیشنهادی',requestedTruckCount:'تعداد کامیون پیشنهادی',sendRequest:'ارسال درخواست',curtain:'چادری',flatbed:'کفی',tanker:'تانکر',reefer:'یخچالی',lightTruck:'کامیون سبک',sharedData:'مشترک با اپ',details:'جزئیات',tons:'تن',trucks:'کامیون',owner:'اعلام‌کننده',requestTransport:'درخواست حمل',yourLoad:'بار شما',profileNeeded:'برای ادامه ابتدا پروفایل تجاری خود را کامل کنید.',noLoads:'در حال حاضر بار فعالی پیدا نشد.',noShipments:'حمل یا بار فعالی برای حساب شما پیدا نشد.',noMessages:'هنوز پیامی در گفتگو نیست.',authSuccess:'ورود با موفقیت انجام شد.',signupCheckEmail:'ثبت‌نام انجام شد. ایمیل خود را برای تأیید حساب بررسی کنید.',passwordResetSent:'لینک بازیابی رمز عبور برای شما ارسال شد.',setNewPassword:'رمز عبور جدید',setNewPasswordHint:'یک رمز عبور جدید و امن برای حساب Yoldash انتخاب کنید.',newPassword:'رمز عبور جدید',confirmPassword:'تکرار رمز عبور',saveNewPassword:'ذخیره رمز عبور جدید',passwordsMismatch:'رمزهای عبور یکسان نیستند.',passwordUpdated:'رمز عبور با موفقیت تغییر کرد.',profileSaved:'پروفایل با موفقیت ذخیره شد.',loadPublished:'بار با موفقیت منتشر شد و در اپ هم قابل مشاهده است.',offerSent:'درخواست حمل با موفقیت ارسال شد.',messageSent:'پیام ارسال شد.',loading:'در حال بارگذاری...',companyName:'نام شرکت',organizationName:'نام سازمان / مجموعه',licenseNumber:'شماره گواهینامه',registrationNumber:'شماره ثبت',optional:'اختیاری',accountInactive:'این حساب غیرفعال است.',driverCannotPost:'حساب راننده نمی‌تواند اعلام بار ایجاد کند. رانندگان می‌توانند برای بارها درخواست حمل بفرستند.',postOnlyBusiness:'فقط صاحب بار، شرکت حمل‌ونقل یا واسطه می‌تواند بار اعلام کند.',offerOnlyProvider:'فقط راننده یا شرکت حمل‌ونقل می‌تواند درخواست حمل بفرستد.',profileIncomplete:'پروفایل تجاری هنوز کامل نیست.',invalidPhone:'شماره تلفن باید با فرمت بین‌المللی مثل +905xxxxxxxxx باشد.',requiredFields:'لطفاً فیلدهای ضروری را کامل کنید.',networkError:'ارتباط با سرور برقرار نشد. اینترنت را بررسی کنید.',unexpectedError:'خطایی رخ داد. دوباره تلاش کنید.',verificationRequired:'اگر ایمیل حساب هنوز تأیید نشده، ابتدا لینک تأیید را باز کنید.',onlineLabel:'آنلاین',offlineLabel:'آفلاین',quota:'سهمیه امروز',remaining:'باقی‌مانده',unlimited:'نامحدود',profile:'پروفایل',liveFreight:'بازار زنده حمل جاده‌ای',boardSubtitle:'بارهای فعال Yoldash را در یک نمای سریع ببینید، مسیرها را مقایسه کنید و مستقیم برای حمل درخواست بفرستید.',secureMarket:'اطلاعات مشترک و امن با اپ Yoldash',openLoads:'بار باز',crossBorder:'بین‌المللی',domesticLoads:'داخلی',freshToday:'امروز',liveFeed:'زنده',availableLoads:'بار قابل حمل',syncedWithApp:'همگام با اپ',capacity:'ظرفیت',loadingDate:'بارگیری',openStatus:'باز',close:'بستن',postedAt:'زمان انتشار',remainingCapacity:'ظرفیت باقی‌مانده',noDescription:'توضیحی ثبت نشده',activeRooms:'فعال',noShipmentChats:'هنوز گفتگوی فعال محموله‌ای ندارید.',shipmentRoom:'گفتگوی حمل',imageMessage:'📷 تصویر',documentMessage:'📎 سند',locationMessage:'📍 موقعیت',serviceCenter:'مرکز خدمات Yoldash',servicesLiveDesc:'بیمه ترکیه، اسناد حمل و ابزارهای عملیاتی را از همان حساب مشترک اپ مدیریت کنید.',startInsurance:'ثبت بیمه ترکیه',turkeyInsurance:'بیمه ترکیه',threeMonthPlan:'پلن ۳ ماهه',availableNow:'فعال',insuranceDesc:'ثبت درخواست، بارگذاری مدارک، رسید پرداخت و پیگیری صدور بیمه‌نامه.',cmrDesc:'مدیریت اسناد CMR و دسترسی سریع به پرونده‌های حمل.',documents:'اسناد',documentsDesc:'مرکز امن مدارک راننده و حمل با Storage خصوصی Yoldash.',expenses:'هزینه‌ها',expensesDesc:'ثبت و مشاهده هزینه‌های مرتبط با سفر و محموله.',nextPhase:'مرحله بعد',myInsuranceRequests:'درخواست‌های من',insuranceLoginHint:'برای مشاهده یا ثبت بیمه وارد حساب Yoldash شوید.',insuranceApplication:'درخواست بیمه ۳ ماهه',paymentInfo:'اطلاعات پرداخت پس از ورود نمایش داده می‌شود.',applicantName:'نام متقاضی',plan:'پلن',passport:'پاسپورت',tractorTriptyque:'کاپتاژ کشنده',containerTriptyque:'کاپتاژ تریلر / کانتینر',paymentReceipt:'رسید پرداخت',allowedInsuranceFiles:'PDF / JPG / PNG / WEBP · حداکثر 15MB',submitInsurance:'ارسال درخواست بیمه',insuranceNotEligible:'بیمه ترکیه برای حساب راننده، شرکت حمل‌ونقل یا واسطه قابل ثبت است.',insuranceRequestSent:'درخواست بیمه ثبت شد',trackingCode:'کد پیگیری',issuedPolicy:'بیمه‌نامه صادرشده',openPolicy:'مشاهده بیمه‌نامه',noInsuranceRequests:'هنوز درخواست بیمه‌ای ثبت نشده است.',bankName:'بانک',accountHolder:'صاحب حساب',expires:'انقضا',driverHub:'بازار راننده و خودرو',driverHubDesc:'برای پیدا کردن راننده یا خودرو آگهی ثبت کنید و آگهی‌های فعال کاربران Yoldash را ببینید.',newDriverListing:'آگهی جدید',activeListings:'آگهی فعال',searchDriverHub:'شهر، عنوان یا نوع خودرو',needDriver:'راننده می‌خواهم',needVehicle:'خودرو می‌خواهم',driverHubLoginHint:'برای مشاهده آگهی‌های راننده و خودرو وارد شوید.',listingType:'نوع آگهی',employmentType:'نوع همکاری',serviceWork:'سرویسی',permanentWork:'دائمی',title:'عنوان',city:'شهر',showIdentity:'نمایش نام من در آگهی',publishListing:'انتشار آگهی',listingPublished:'آگهی با موفقیت منتشر شد.',noDriverListings:'در حال حاضر آگهی فعالی وجود ندارد.',closeListing:'بستن آگهی',call:'تماس',businessType:'نوع حساب'
},
tr:{
roadFreight:'Karayolu Taşımacılığı',home:'Ana Sayfa',loadBoard:'Yük İlanları',myShipments:'Taşımalarım',chat:'Sohbet',drivers:'Sürücü & Araç',services:'Hizmetler',secureTitle:'Güvenli Yoldash bağlantısı',secureText:'Veriler uygulama ve Supabase ile ortaktır',search:'Yük, şehir veya kullanıcı ara...',guest:'Misafir kullanıcı',login:'Giriş / Kayıt',livePlatform:'Canlı karayolu taşımacılık platformu',heroTitle:'Yük, sürücü ve rota;<br><em>hepsi tek Yoldash’ta.</em>',heroText:'Yük ilanı verin, teklifler alın ve taşımalarınızı hızlı, birleşik bir panelden yönetin.',createLoad:'Yeni Yük İlanı',viewLoads:'Yükleri Gör',online:'Çevrimiçi erişim',languages:'Dil',sharedAccount:'Web & uygulama ortak hesabı',origin:'Çıkış',destination:'Varış',truckOnRoute:'Araç yolda',activeLoads:'Aktif yükler',onlineDrivers:'Çevrimiçi sürücüler',inTransit:'Yolda',today:'bugün',completed:'Başarılı teslimat',marketplace:'Taşıma pazarı',freshLoads:'Yeni yayınlanan yükler',all:'Tümü',international:'Uluslararası',domestic:'Yurtiçi',seeAll:'Tümünü gör',quickAccess:'Hızlı erişim',actions:'İşlemler',newLoad:'Yeni yük ilanı',newLoadHint:'2 dakikadan kısa',findDriver:'Yükleri görüntüle',findDriverHint:'Sürücü ve taşıyıcı için',openChat:'Sohbeti aç',chatLoginHint:'Girişten sonra',liveRates:'Canlı kurlar',currency:'Döviz',live:'Canlı',ratesNote:'Döviz kuru bağlantısı sonraki aşamada etkinleştirilecek.',searchLoads:'Çıkış, varış veya yük türüne göre ara',shipmentsDesc:'Aktif, teslim edilmiş ve bekleyen tüm taşımalarınızı buradan yönetin.',transportManagement:'Taşıma yönetimi',refresh:'Yenile',loginRequired:'Giriş gerekli',loginForShipments:'Taşımalarınızı görmek için Yoldash hesabınıza giriş yapın.',communication:'İletişim',publicChat:'Yoldash genel sohbeti',sharedCommunity:'Web ve uygulama ortak topluluğu',shipmentChat:'Sevkiyat sohbeti',shipmentChatHint:'Teklif kabul edilince açılır',onlineNow:'Çevrimiçi',loginForChat:'Yoldash sohbetine katılmak için giriş yapın.',message:'Mesaj yazın...',driversDesc:'Sürücü, araç ve uygunluk verileri bu web uygulamasında ortak Yoldash verilerine bağlanır.',servicesDesc:'Türkiye sigortası, CMR, belgeler, masraflar ve sürücü araçları bu panelde birleşecek.',siteManager:'Site Yöneticisi',whatsappContact:'WhatsApp',privacy:'Gizlilik',terms:'Kullanım Şartları',cargoDetails:'Yük bilgileri',originCountry:'Çıkış ülkesi',originCity:'Çıkış şehri',originCustoms:'Çıkış gümrüğü',destinationCountry:'Varış ülkesi',destinationCity:'Varış şehri',destinationCustoms:'Varış gümrüğü',cargoType:'Yük türü',cargoTypeHint:'Örn. gıda',truckType:'Araç türü',truckCount:'Araç sayısı',weight:'Ağırlık (kg)',price:'Önerilen navlun',loadingAt:'Yükleme zamanı',validity:'İlan geçerliliği',exitBorder:'Çıkış sınırı',description:'Açıklama',sharedSupabase:'Bu form doğrudan Yoldash uygulamasıyla aynı Supabase’e kaydeder.',cancel:'İptal',publishLoad:'Yükü Yayınla',authSubtitle:'Uygulamadaki ortak hesabınızla giriş yapın',email:'E-posta',password:'Şifre',authNote:'Web ve uygulama aynı Supabase Auth hesabını kullanır.',signIn:'Giriş',register:'Kayıt',accountType:'Hesap türü',driver:'Sürücü',cargoOwner:'Yük sahibi',transportCompany:'Nakliye şirketi',broker:'Komisyoncu',forgotPassword:'Şifremi unuttum',signedInShared:'Ortak Yoldash hesabınızla giriş yaptınız.',completeProfile:'Profili tamamla',firstName:'Ad',lastName:'Soyad',phone:'Telefon',countryCode:'Ülke',whatsappPhone:'WhatsApp',tractorPlate:'Çekici transit plakası',containerPlate:'Dorse/konteyner transit plakası',driverCompany:'Sürücü şirketi',saveProfile:'Profili Kaydet',signOut:'Çıkış Yap',transportRequest:'Taşıma talebi',offerPrice:'Teklif fiyatı',requestedTruckCount:'İstenen araç sayısı',sendRequest:'Talebi Gönder',curtain:'Tenteli',flatbed:'Dorse',tanker:'Tanker',reefer:'Frigo',lightTruck:'Hafif kamyon',sharedData:'Uygulamayla ortak',details:'Detaylar',tons:'ton',trucks:'araç',owner:'İlan sahibi',requestTransport:'Taşıma talebi',yourLoad:'Sizin yükünüz',profileNeeded:'Devam etmek için işletme profilinizi tamamlayın.',noLoads:'Şu anda aktif yük bulunamadı.',noShipments:'Hesabınız için aktif taşıma veya yük bulunamadı.',noMessages:'Henüz mesaj yok.',authSuccess:'Giriş başarılı.',signupCheckEmail:'Kayıt tamamlandı. Hesabı doğrulamak için e-postanızı kontrol edin.',passwordResetSent:'Şifre sıfırlama bağlantısı gönderildi.',profileSaved:'Profil başarıyla kaydedildi.',loadPublished:'Yük başarıyla yayınlandı ve uygulamada da görülebilir.',offerSent:'Taşıma talebi gönderildi.',messageSent:'Mesaj gönderildi.',loading:'Yükleniyor...',companyName:'Şirket adı',organizationName:'Kurum / firma adı',licenseNumber:'Ehliyet numarası',registrationNumber:'Sicil numarası',optional:'İsteğe bağlı',accountInactive:'Bu hesap devre dışı.',driverCannotPost:'Sürücü hesabı yük ilanı veremez. Sürücüler yüklere taşıma talebi gönderebilir.',postOnlyBusiness:'Yalnızca yük sahibi, nakliye şirketi veya komisyoncu yük ilanı verebilir.',offerOnlyProvider:'Yalnızca sürücü veya nakliye şirketi taşıma talebi gönderebilir.',profileIncomplete:'İşletme profili henüz tamamlanmadı.',invalidPhone:'Telefon uluslararası formatta olmalı, örn. +905xxxxxxxxx.',requiredFields:'Lütfen zorunlu alanları doldurun.',networkError:'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.',unexpectedError:'Bir hata oluştu. Tekrar deneyin.',verificationRequired:'E-posta henüz doğrulanmadıysa doğrulama bağlantısını açın.',onlineLabel:'Çevrimiçi',offlineLabel:'Çevrimdışı',quota:'Bugünkü kota',remaining:'kalan',unlimited:'Sınırsız',profile:'Profil',setNewPassword:'Yeni şifre',setNewPasswordHint:'Yoldash hesabınız için yeni ve güvenli bir şifre seçin.',newPassword:'Yeni şifre',confirmPassword:'Şifreyi tekrar girin',saveNewPassword:'Yeni şifreyi kaydet',passwordsMismatch:'Şifreler eşleşmiyor.',passwordUpdated:'Şifreniz başarıyla değiştirildi.',liveFreight:'Canlı karayolu yük pazarı',boardSubtitle:'Aktif Yoldash yüklerini hızlıca görün, rotaları karşılaştırın ve doğrudan taşıma talebi gönderin.',secureMarket:'Yoldash uygulamasıyla güvenli ve ortak veri',openLoads:'Açık yük',crossBorder:'Uluslararası',domesticLoads:'Yurtiçi',freshToday:'Bugün',liveFeed:'Canlı',availableLoads:'taşınabilir yük',syncedWithApp:'Uygulamayla senkron',capacity:'Kapasite',loadingDate:'Yükleme',openStatus:'Açık',businessType:'Hesap türü'
},
en:{
roadFreight:'Road Freight',home:'Home',loadBoard:'Load Board',myShipments:'My Shipments',chat:'Chat',drivers:'Drivers & Trucks',services:'Services',secureTitle:'Secure Yoldash connection',secureText:'Shared data with the app and Supabase',search:'Search loads, cities and users...',guest:'Guest user',login:'Sign in / Register',livePlatform:'Live road-freight platform',heroTitle:'Loads, drivers & routes;<br><em>all in one Yoldash.</em>',heroText:'Post loads, receive offers and manage freight from one fast, unified dashboard.',createLoad:'Post New Load',viewLoads:'Browse Loads',online:'Online access',languages:'Languages',sharedAccount:'Shared web & app account',origin:'Origin',destination:'Destination',truckOnRoute:'Truck en route',activeLoads:'Active loads',onlineDrivers:'Drivers online',inTransit:'In transit',today:'today',completed:'Successful deliveries',marketplace:'Freight marketplace',freshLoads:'Recently posted loads',all:'All',international:'International',domestic:'Domestic',seeAll:'See all',quickAccess:'Quick access',actions:'Actions',newLoad:'Post new load',newLoadHint:'Under 2 minutes',findDriver:'Browse loads',findDriverHint:'For drivers & carriers',openChat:'Open chat',chatLoginHint:'After sign in',liveRates:'Live rates',currency:'FX',live:'Live',ratesNote:'Live FX connectivity will be enabled in the next phase.',searchLoads:'Search by origin, destination or cargo type',shipmentsDesc:'Manage all active, delivered and pending shipments in one place.',transportManagement:'Transport management',refresh:'Refresh',loginRequired:'Sign in required',loginForShipments:'Sign in to your Yoldash account to see your shipments.',communication:'Communications',publicChat:'Yoldash public chat',sharedCommunity:'Shared web & app community',shipmentChat:'Shipment chat',shipmentChatHint:'Opens after an offer is accepted',onlineNow:'Online',loginForChat:'Sign in to join the Yoldash chat.',message:'Write a message...',driversDesc:'Driver, vehicle and availability data in this web app connects to the shared Yoldash backend.',servicesDesc:'Turkey insurance, CMR, documents, expenses and driver tools will live in this unified dashboard.',siteManager:'Site Manager',whatsappContact:'WhatsApp',privacy:'Privacy',terms:'Terms of Use',cargoDetails:'Cargo details',originCountry:'Origin country',originCity:'Origin city',originCustoms:'Origin customs',destinationCountry:'Destination country',destinationCity:'Destination city',destinationCustoms:'Destination customs',cargoType:'Cargo type',cargoTypeHint:'e.g. food products',truckType:'Truck type',truckCount:'Truck count',weight:'Weight (kg)',price:'Proposed freight',loadingAt:'Loading time',validity:'Listing validity',exitBorder:'Exit border',description:'Description',sharedSupabase:'This form writes directly to the same Supabase used by the Yoldash app.',cancel:'Cancel',publishLoad:'Publish Load',authSubtitle:'Sign in with the same account you use in the app',email:'Email',password:'Password',authNote:'Web and Android use the same Supabase Auth account.',signIn:'Sign In',register:'Register',accountType:'Account type',driver:'Driver',cargoOwner:'Cargo owner',transportCompany:'Transport company',broker:'Broker',forgotPassword:'Forgot password',signedInShared:'You are signed in with your shared Yoldash account.',completeProfile:'Complete profile',firstName:'First name',lastName:'Last name',phone:'Phone',countryCode:'Country',whatsappPhone:'WhatsApp',tractorPlate:'Tractor transit plate',containerPlate:'Trailer/container transit plate',driverCompany:'Driver company',saveProfile:'Save Profile',signOut:'Sign Out',transportRequest:'Transport request',offerPrice:'Proposed price',requestedTruckCount:'Requested trucks',sendRequest:'Send Request',curtain:'Curtain-side',flatbed:'Flatbed',tanker:'Tanker',reefer:'Refrigerated',lightTruck:'Light truck',sharedData:'Shared with app',details:'Details',tons:'tons',trucks:'trucks',owner:'Posted by',requestTransport:'Request transport',yourLoad:'Your load',profileNeeded:'Complete your business profile before continuing.',noLoads:'No active loads were found right now.',noShipments:'No active transport or cargo was found for your account.',noMessages:'There are no messages yet.',authSuccess:'Signed in successfully.',signupCheckEmail:'Registration completed. Check your email to confirm the account.',passwordResetSent:'Password reset link was sent.',profileSaved:'Profile saved successfully.',loadPublished:'Load published successfully and is now shared with the app.',offerSent:'Transport request sent successfully.',messageSent:'Message sent.',loading:'Loading...',companyName:'Company name',organizationName:'Organization / business name',licenseNumber:'License number',registrationNumber:'Registration number',optional:'Optional',accountInactive:'This account is inactive.',driverCannotPost:'Driver accounts cannot post loads. Drivers can submit transport requests to available loads.',postOnlyBusiness:'Only cargo owners, transport companies or brokers can post loads.',offerOnlyProvider:'Only drivers or transport companies can send transport requests.',profileIncomplete:'The business profile is not complete yet.',invalidPhone:'Phone must use international format, e.g. +905xxxxxxxxx.',requiredFields:'Please complete the required fields.',networkError:'Could not reach the server. Check your internet connection.',unexpectedError:'Something went wrong. Please try again.',verificationRequired:'If the email is not confirmed yet, open the verification link first.',onlineLabel:'Online',offlineLabel:'Offline',quota:'Today quota',remaining:'remaining',unlimited:'Unlimited',profile:'Profile',setNewPassword:'New password',setNewPasswordHint:'Choose a new secure password for your Yoldash account.',newPassword:'New password',confirmPassword:'Confirm password',saveNewPassword:'Save new password',passwordsMismatch:'Passwords do not match.',passwordUpdated:'Password updated successfully.',liveFreight:'Live road-freight exchange',boardSubtitle:'Scan active Yoldash loads, compare routes and send a transport request from one fast workspace.',secureMarket:'Secure shared data with the Yoldash app',openLoads:'Open loads',crossBorder:'Cross-border',domesticLoads:'Domestic',freshToday:'Today',liveFeed:'Live',availableLoads:'available loads',syncedWithApp:'Synced with app',capacity:'Capacity',loadingDate:'Loading',openStatus:'Open',businessType:'Account type'
}}
;

const state = {
  lang: localStorage.getItem('yoldash_lang') || 'fa',
  session: null,
  profile: null,
  businessProfile: null,
  loads: [],
  shipments: [],
  loadFilter: 'all',
  authMode: 'signin',
  selectedBusinessType: null,
  city: { origin: null, destination: null },
  chatTimer: null,
  chatMode: 'public',
  shipmentRooms: [],
  activeRoomId: null,
  sigortaSettings: null,
  sigortaRequests: [],
  driverListings: [],
  driverFilter: 'all'
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
  if (msg.includes('business profile name is required')) return t('profileNeeded');
  if (msg.includes('daily cargo') || msg.includes('quota')) return `${t('quota')}: ${error?.message || ''}`;
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
  if (state.session) renderChatFromCache?.();
  renderSigortaSettings?.(); renderSigortaRequests?.(); renderDriverHub?.();
}
function page(name){
  $$('.page').forEach(p=>p.classList.remove('active'));
  if(name==='home') ['page-home','metrics-home','content-home'].forEach(id=>$('#'+id)?.classList.add('active'));
  else $('#page-'+name)?.classList.add('active');
  $$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===name));
  $('.sidebar')?.classList.remove('open');
  if(name==='shipments') loadShipments();
  if(name==='services') loadServices();
  if(name==='drivers') loadDriverHub();
  if(name==='chat'){ loadShipmentRooms(); loadChat(); }
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
  const remaining = Number(c.remaining_truck_count ?? c.truck_count ?? 1);
  const total = Math.max(Number(c.truck_count || remaining || 1),1);
  const capacityPct = Math.max(0,Math.min(100,(remaining/total)*100));
  const posted = relativeLabel(c.published_at||c.announced_at||c.created_at);
  const loading = c.loading_at ? dateLabel(c.loading_at) : '—';
  const cargoType = esc(c.cargo_type || 'Cargo');
  const statusText = shipment ? esc(c.status||'—') : t('openStatus');

  let action = `<button class="btn secondary freight-action" data-cargo-details="${esc(c.id)}">${t('details')} ↗</button>`;
  if (!shipment && state.session && canOfferTypes.has(state.profile?.business_user_type) && !own) {
    action = `<button class="btn primary freight-action offer-btn" data-offer="${esc(c.id)}">${t('requestTransport')} <span>↗</span></button>`;
  } else if (!shipment && own) {
    action = `<button class="btn secondary freight-action owner-btn" disabled>${t('yourLoad')}</button>`;
  }

  return `<article class="cargo-card freight-card" data-cargo-id="${esc(c.id)}">
    <header class="freight-card-head">
      <div class="freight-tags">
        <span class="status-pill live-status"><i></i>${statusText}</span>
        <span class="cargo-type-tag">${cargoType}</span>
      </div>
      <time class="posted-time">${esc(posted)}</time>
    </header>

    <div class="freight-route">
      <div class="route-point route-origin">
        <span class="country-badge">${esc(c.origin_country_code||'—')}</span>
        <div><small>${t('origin')}</small><b>${esc(from)}</b></div>
      </div>
      <div class="route-track" aria-hidden="true"><span></span><i>➜</i><span></span></div>
      <div class="route-point route-destination">
        <span class="country-badge">${esc(c.destination_country_code||'—')}</span>
        <div><small>${t('destination')}</small><b>${esc(to)}</b></div>
      </div>
    </div>

    <div class="freight-facts">
      <div><span class="fact-icon">▣</span><span><small>${t('truckType')}</small><b>${tt?t(tt):esc(c.required_truck_type||'—')}</b></span></div>
      <div><span class="fact-icon">◒</span><span><small>${t('weight')}</small><b>${weight} ${kg?t('tons'):''}</b></span></div>
      <div><span class="fact-icon">◫</span><span><small>${t('loadingDate')}</small><b>${esc(loading)}</b></span></div>
      <div class="capacity-fact"><span class="fact-icon">⇄</span><span><small>${t('capacity')}</small><b>${esc(remaining)} / ${esc(total)} ${t('trucks')}</b><em><i style="width:${capacityPct}%"></i></em></span></div>
    </div>

    <footer class="freight-card-foot">
      <div class="freight-owner"><span class="mini-avatar">${esc(initials(c.owner_display_name||'Yoldash'))}</span><span><small>${t('owner')}</small><b>${esc(c.owner_display_name||'Yoldash')}</b></span></div>
      <div class="freight-price"><small>${t('price')}</small><b>${price}</b></div>
      ${action}
    </footer>
  </article>`;
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

  const international = state.loads.filter(c=>c.origin_country_code && c.destination_country_code && c.origin_country_code!==c.destination_country_code).length;
  const domestic = state.loads.filter(c=>c.origin_country_code && c.origin_country_code===c.destination_country_code).length;
  const now=Date.now();
  const today = state.loads.filter(c=>{
    const raw=c.published_at||c.announced_at||c.created_at;
    const ms=raw?new Date(raw).getTime():0;
    return ms && (now-ms)>=0 && (now-ms)<=86400000;
  }).length;

  $('#loadCountBadge').textContent = state.loads.length ? String(state.loads.length) : '0';
  $('#metricLoads').textContent = state.loads.length ? String(state.loads.length) : '0';
  if($('#boardOpen')) $('#boardOpen').textContent=String(state.loads.length);
  if($('#boardInternational')) $('#boardInternational').textContent=String(international);
  if($('#boardDomestic')) $('#boardDomestic').textContent=String(domestic);
  if($('#boardToday')) $('#boardToday').textContent=String(today);
  if($('#boardResultCount')) $('#boardResultCount').textContent=String(filtered.length);

  const featured=state.loads[0];
  if(featured){
    if($('#heroOriginCity')) $('#heroOriginCity').textContent=cityName(featured,'origin');
    if($('#heroDestinationCity')) $('#heroDestinationCity').textContent=cityName(featured,'destination');
    if($('#heroOriginMeta')) $('#heroOriginMeta').textContent=[featured.origin_country_code, featured.origin_customs].filter(Boolean).join(' · ') || 'Yoldash';
    if($('#heroDestinationMeta')) $('#heroDestinationMeta').textContent=[featured.destination_country_code, featured.destination_customs].filter(Boolean).join(' · ') || 'Yoldash';
    if($('#heroCargoType')) $('#heroCargoType').textContent=featured.cargo_type || '';
  }

  bindCargoActions();
}
function openCargoDetailsCard(c){
  if(!c) return;
  const from=cityName(c,'origin'), to=cityName(c,'destination');
  const tt=truckKey(c.required_truck_type);
  const kg=Number(c.weight_kg||0);
  const weight=kg ? `${(kg/1000).toLocaleString(localeMap[state.lang],{maximumFractionDigits:2})} ${t('tons')}` : '—';
  const price=c.freight_price!=null ? `${Number(c.freight_price).toLocaleString(localeMap[state.lang])} ${esc(c.currency_code||'')}` : '—';
  const remaining=Number(c.remaining_truck_count ?? c.truck_count ?? 1);
  const total=Number(c.truck_count ?? remaining ?? 1);
  const customsFrom=c.origin_customs||'—', customsTo=c.destination_customs||'—';
  const desc=c.description?.trim() || t('noDescription');
  $('#cargoDetailsRoute').textContent=`${from} → ${to}`;
  $('#cargoDetailsBody').innerHTML=`
    <div class="details-route-panel">
      <div class="details-city"><span>${esc(c.origin_country_code||'—')}</span><small>${t('origin')}</small><b>${esc(from)}</b></div>
      <div class="details-route-line"><i></i><strong>➜</strong><i></i></div>
      <div class="details-city destination"><span>${esc(c.destination_country_code||'—')}</span><small>${t('destination')}</small><b>${esc(to)}</b></div>
    </div>
    <div class="details-grid">
      <div><small>${t('cargoType')}</small><b>${esc(c.cargo_type||'—')}</b></div>
      <div><small>${t('truckType')}</small><b>${tt?t(tt):esc(c.required_truck_type||'—')}</b></div>
      <div><small>${t('weight')}</small><b>${weight}</b></div>
      <div><small>${t('remainingCapacity')}</small><b>${remaining} / ${total} ${t('trucks')}</b></div>
      <div><small>${t('loadingDate')}</small><b>${esc(c.loading_at?dateLabel(c.loading_at):'—')}</b></div>
      <div><small>${t('price')}</small><b class="detail-price">${price}</b></div>
      <div><small>${t('originCustoms')}</small><b>${esc(customsFrom)}</b></div>
      <div><small>${t('destinationCustoms')}</small><b>${esc(customsTo)}</b></div>
      <div><small>${t('exitBorder')}</small><b>${esc(c.exit_border||'—')}</b></div>
      <div><small>${t('postedAt')}</small><b>${esc(dateLabel(c.published_at||c.announced_at||c.created_at))}</b></div>
    </div>
    <div class="details-owner-row"><span class="mini-avatar">${esc(initials(c.owner_display_name||'Yoldash'))}</span><div><small>${t('owner')}</small><b>${esc(c.owner_display_name||'Yoldash')}</b></div></div>
    <div class="details-description"><small>${t('description')}</small><p>${esc(desc)}</p></div>
  `;
  $('#cargoDetailsModal')?.showModal();
}

function bindCargoActions(){
  $('[data-offer]').forEach(btn=>btn.onclick=()=>openOffer(btn.dataset.offer));
  $('[data-cargo-details]').forEach(btn=>btn.onclick=()=>{
    const id=btn.dataset.cargoDetails;
    const c=[...(state.loads||[]),...(state.shipments||[])].find(x=>x.id===id);
    if(c) openCargoDetailsCard(c);
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

async function refreshSession(){
  const {data:{session}} = await supabase.auth.getSession();
  state.session = session;
  if(session) await loadProfile(); else { state.profile=null; state.businessProfile=null; }
  renderProfileUI();
  if(session){ loadUnread(); }
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
  if(p.business_user_type==='TRANSPORT_COMPANY' && b?.company_name) return b.company_name;
  if(['CARGO_OWNER','BROKER'].includes(p.business_user_type) && b?.organization_name) return b.organization_name;
  if(p.business_user_type==='DRIVER' && p.driver_company_name) return p.driver_company_name;
  const n=[p.first_name,p.last_name].filter(Boolean).join(' ').trim();
  return n || p.email || state.session?.user?.email || 'Yoldash';
}
function renderProfileUI(){
  const logged=!!state.session;
  $('#loggedOutAuth')?.classList.toggle('hidden',logged);
  $('#loggedInAuth')?.classList.toggle('hidden',!logged);
  if(logged){
    const name=displayName();
    $('#profileName').textContent=name;
    $('#profileMeta').textContent=typeLabel(state.profile?.business_user_type);
    $('#profileAvatar').textContent=initials(name);
    const items=[
      [t('profile'),name], [t('email'),state.profile?.email||state.session.user.email||'—'],
      [t('businessType'),typeLabel(state.profile?.business_user_type)], [t('phone'),state.profile?.phone||'—']
    ];
    $('#profileGrid').innerHTML=items.map(([a,b])=>`<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('');
    $('#chatHint').textContent=t('publicChat');
  }else{
    $('#profileName').textContent=t('guest'); $('#profileMeta').textContent=t('login'); $('#profileAvatar').textContent='YD'; $('#chatHint').textContent=t('chatLoginHint');
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
  const primary=$('#businessPrimary').value.trim(), secondary=$('#businessSecondary').value.trim(), country=$('#profileCountry').value;
  if(!first||!last||!phone||!primary){ status.className='auth-status error'; status.textContent=t('requiredFields'); return; }
  if(!/^\+[1-9]\d{7,14}$/.test(phone)){ status.className='auth-status error'; status.textContent=t('invalidPhone'); return; }
  try{
    const uid=state.session.user.id, type=state.profile.business_user_type;
    const base={first_name:first,last_name:last,phone};
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
    await loadProfile(); renderProfileUI(); status.className='auth-status ok'; status.textContent=t('profileSaved'); toast(t('profileSaved'));
  }catch(err){ status.className='auth-status error'; status.textContent=humanError(err); }
}

function setAuthMode(mode){
  state.authMode=mode;
  $$('[data-auth-mode]').forEach(b=>b.classList.toggle('active',b.dataset.authMode===mode));
  $('#accountTypeBlock').classList.toggle('hidden',mode!=='signup');
  $('#authSubmit').textContent=mode==='signup'?t('register'):t('signIn');
  $('#authPassword').autocomplete=mode==='signup'?'new-password':'current-password';
  $('#authStatus').textContent='';
}
async function submitAuth(ev){
  ev.preventDefault();
  const email=$('#authEmail').value.trim(), password=$('#authPassword').value;
  const status=$('#authStatus'); status.className='auth-status'; status.textContent=t('loading');
  try{
    if(state.authMode==='signup'){
      if(!state.selectedBusinessType) throw new Error(t('accountType'));
      if(password.length<8) throw new Error('Password must be at least 8 characters.');
      const redirect = location.protocol.startsWith('http') ? `${location.origin}/` : 'https://www.getyoldash.com/';
      const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:redirect,data:{business_user_type:state.selectedBusinessType}}});
      if(error) throw error;
      if(data.session){ state.session=data.session; await loadProfile(); renderProfileUI(); status.className='auth-status ok'; status.textContent=t('authSuccess'); }
      else { status.className='auth-status ok'; status.textContent=t('signupCheckEmail'); }
    }else{
      const {data,error}=await supabase.auth.signInWithPassword({email,password}); if(error) throw error;
      state.session=data.session; await loadProfile(); renderProfileUI(); status.className='auth-status ok'; status.textContent=t('authSuccess'); setTimeout(()=>$('#authModal').close(),700);
    }
  }catch(err){ status.className='auth-status error'; status.textContent=humanError(err); }
}
async function forgotPassword(){
  const email=$('#authEmail').value.trim(); if(!email){ $('#authStatus').textContent=t('email'); return; }
  const redirect=location.protocol.startsWith('http')?`${location.origin}/`:'https://www.getyoldash.com/';
  const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:redirect});
  if(error){ $('#authStatus').className='auth-status error'; $('#authStatus').textContent=humanError(error); }
  else { $('#authStatus').className='auth-status ok'; $('#authStatus').textContent=t('passwordResetSent'); }
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

function isBusinessProfileReady(){
  const type=state.profile?.business_user_type,b=state.businessProfile,p=state.profile;
  if(!type||!b) return false;
  if(type==='DRIVER') return !!(b.license_number && p.whatsapp_phone && p.tractor_transit_plate && p.container_transit_plate && p.driver_company_name);
  if(type==='TRANSPORT_COMPANY') return !!b.company_name;
  return !!b.organization_name;
}
async function openLoadModal(){
  if(!state.session){ $('#authModal').showModal(); toast(t('loginRequired'),'error'); return; }
  if(!state.profile?.is_active){ toast(t('accountInactive'),'error'); return; }
  if(!canPostTypes.has(state.profile?.business_user_type)){ toast(state.profile?.business_user_type==='DRIVER'?t('driverCannotPost'):t('postOnlyBusiness'),'error'); return; }
  if(!isBusinessProfileReady()){ $('#authModal').showModal(); $('#profileStatus').className='auth-status error'; $('#profileStatus').textContent=t('profileNeeded'); return; }
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

function openOffer(id){
  const cargo=state.loads.find(x=>x.id===id); if(!cargo) return;
  if(!state.session){ $('#authModal').showModal(); toast(t('loginRequired'),'error'); return; }
  if(!canOfferTypes.has(state.profile?.business_user_type)){ toast(t('offerOnlyProvider'),'error'); return; }
  if(!isBusinessProfileReady()){ $('#authModal').showModal(); $('#profileStatus').className='auth-status error'; $('#profileStatus').textContent=t('profileNeeded'); return; }
  $('#offerCargoId').value=id; $('#offerRoute').textContent=`${cityName(cargo,'origin')} → ${cityName(cargo,'destination')}`; $('#offerTruckCount').max=cargo.remaining_truck_count||cargo.truck_count||1; $('#offerModal').showModal();
}
async function submitOffer(ev){
  ev.preventDefault(); const btn=$('#submitOffer');btn.disabled=true;btn.textContent=t('loading');
  try{
    const price=$('#offerPrice').value?Number($('#offerPrice').value):null;
    const {error}=await supabase.rpc('submit_cargo_offer',{p_cargo_id:$('#offerCargoId').value,p_proposed_price:price,p_currency_code:price?$('#offerCurrency').value:null,p_message:$('#offerMessage').value.trim()||null,p_requested_truck_count:Number($('#offerTruckCount').value||1)});
    if(error) throw error; $('#offerModal').close(); $('#offerForm').reset(); toast(t('offerSent'));
  }catch(err){toast(humanError(err),'error');}
  finally{btn.disabled=false;btn.textContent=t('sendRequest');}
}

async function loadShipments(){
  const el=$('#shipmentList');
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForShipments'));$('#metricShipments').textContent='—';return;}
  el.innerHTML='<div class="loading-card"></div><div class="loading-card"></div>';
  try{
    const {data,error}=await supabase.rpc('get_my_transport_cargo'); if(error) throw error;
    const rows=Array.isArray(data)?data:[]; state.shipments=rows; el.innerHTML=rows.length?rows.map(c=>cargoCard(c,true)).join(''):emptyBlock('noShipments'); $('#metricShipments').textContent=String(rows.length); bindCargoActions();
  }catch(err){el.innerHTML=emptyBlock('unexpectedError',humanError(err));}
}

let chatCache=[];

function shipmentMessageText(m){
  const type=String(m.message_type||'TEXT').toUpperCase();
  if(type==='IMAGE') return t('imageMessage');
  if(type==='DOCUMENT') return m.attachment_name ? `📎 ${m.attachment_name}` : t('documentMessage');
  if(type==='LOCATION') return `${t('locationMessage')} · ${Number(m.latitude||0).toFixed(4)}, ${Number(m.longitude||0).toFixed(4)}`;
  return m.body || '';
}

function renderChatFromCache(){
  const el=$('#chatMessages');
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('loginForChat'));return;}
  if(!chatCache.length){el.innerHTML=emptyBlock('noMessages');return;}
  const uid=state.session.user.id;
  el.innerHTML=chatCache.map(m=>{
    const sender=m.sender_name||m.sender_display_name||'Yoldash';
    const body=state.chatMode==='shipment' ? shipmentMessageText(m) : (m.deleted_at?'—':(m.body||''));
    return `<div class="bubble ${m.sender_id===uid?'me':''}"><span class="sender">${esc(sender)}</span><span>${esc(body)}</span><time>${esc(dateLabel(m.created_at))}</time></div>`;
  }).join('');
  el.scrollTop=el.scrollHeight;
}

function setPublicChatHeader(){
  $('#chatRoomAvatar').textContent='YG';
  $('#chatRoomAvatar').classList.add('green');
  $('#chatRoomTitle').textContent=t('publicChat');
  $('#chatOnlineLabel').textContent=t('onlineNow');
  $('#publicChatPerson')?.classList.add('active');
  $$('[data-shipment-room]').forEach(x=>x.classList.remove('active'));
}

function setShipmentChatHeader(room){
  $('#chatRoomAvatar').textContent='⇄';
  $('#chatRoomAvatar').classList.remove('green');
  $('#chatRoomTitle').textContent=`${room.origin_city||'—'} → ${room.destination_city||'—'}`;
  $('#chatOnlineLabel').textContent=room.assignment_status||t('shipmentRoom');
  $('#publicChatPerson')?.classList.remove('active');
  $$('[data-shipment-room]').forEach(x=>x.classList.toggle('active',x.dataset.shipmentRoom===room.id));
}

function renderShipmentRooms(){
  const el=$('#shipmentRoomList');
  if(!el) return;
  if(!state.session){
    el.innerHTML=`<div class="chat-person placeholder"><span class="avatar">⇄</span><div><b>${t('shipmentChat')}</b><small>${t('loginRequired')}</small></div></div>`;
    return;
  }
  if(!state.shipmentRooms.length){
    el.innerHTML=`<div class="shipment-empty">${t('noShipmentChats')}</div>`;
    return;
  }
  const uid=state.session.user.id;
  el.innerHTML=state.shipmentRooms.map(r=>{
    const other=r.owner_id===uid ? (r.provider_display_name||'Yoldash') : (r.owner_display_name||'Yoldash');
    return `<button type="button" class="chat-person chat-person-btn shipment-person ${state.activeRoomId===r.id&&state.chatMode==='shipment'?'active':''}" data-shipment-room="${esc(r.id)}"><span class="avatar">⇄</span><span><b>${esc(r.origin_city||'—')} → ${esc(r.destination_city||'—')}</b><small>${esc(other)} · ${esc(r.assignment_status||'')}</small></span><time>${esc(relativeLabel(r.updated_at||r.created_at))}</time></button>`;
  }).join('');
  $$('[data-shipment-room]').forEach(btn=>btn.onclick=()=>openShipmentRoom(btn.dataset.shipmentRoom));
}

async function loadShipmentRooms(){
  if(!state.session){state.shipmentRooms=[];renderShipmentRooms();return;}
  try{
    const {data,error}=await supabase.rpc('get_my_shipment_rooms',{p_completed:false,p_limit:50});
    if(error) throw error;
    state.shipmentRooms=Array.isArray(data)?data:[];
    renderShipmentRooms();
  }catch(err){
    console.warn('shipment rooms',err);
    state.shipmentRooms=[];
    renderShipmentRooms();
  }
}

async function openShipmentRoom(roomId){
  const room=state.shipmentRooms.find(r=>r.id===roomId);
  if(!room) return;
  state.chatMode='shipment';
  state.activeRoomId=roomId;
  renderShipmentRooms();
  setShipmentChatHeader(room);
  await loadShipmentChat(roomId);
}

async function loadShipmentChat(roomId,silent=false){
  if(!state.session||!roomId) return;
  const room=state.shipmentRooms.find(r=>r.id===roomId);
  if(room) setShipmentChatHeader(room);
  const input=$('#chatInput'),send=$('#sendChat'); input.disabled=false;send.disabled=false;
  try{
    const {data,error}=await supabase.rpc('get_shipment_messages',{p_room_id:roomId,p_limit:120});
    if(error) throw error;
    chatCache=(data||[]).slice().reverse();
    renderChatFromCache();
    await supabase.rpc('mark_shipment_room_read',{p_room_id:roomId});
  }catch(err){if(!silent) toast(humanError(err),'error');}
  clearInterval(state.chatTimer);
  state.chatTimer=setInterval(()=>{if($('#page-chat').classList.contains('active')&&state.session&&state.chatMode==='shipment'&&state.activeRoomId) loadShipmentChat(state.activeRoomId,true);},12000);
}

async function loadChat(silent=false){
  if(state.chatMode==='shipment'&&state.activeRoomId) return loadShipmentChat(state.activeRoomId,silent);
  state.chatMode='public';
  state.activeRoomId=null;
  setPublicChatHeader();
  renderShipmentRooms();
  const input=$('#chatInput'),send=$('#sendChat');
  if(!state.session){input.disabled=true;send.disabled=true;chatCache=[];renderChatFromCache();return;}
  input.disabled=false;send.disabled=false;
  try{
    const {data,error}=await supabase.rpc('get_public_chat_messages',{p_limit:60,p_before:null}); if(error) throw error;
    chatCache=(data||[]).slice().reverse(); renderChatFromCache(); $('#chatTime').textContent=chatCache.length?new Date(chatCache.at(-1).created_at).toLocaleTimeString(localeMap[state.lang],{hour:'2-digit',minute:'2-digit'}):'—';
    supabase.rpc('mark_public_chat_read').then(()=>loadUnread());
  }catch(err){if(!silent) toast(humanError(err),'error');}
  clearInterval(state.chatTimer); state.chatTimer=setInterval(()=>{if($('#page-chat').classList.contains('active')&&state.session&&state.chatMode==='public') loadChat(true);},12000);
}

async function sendChat(){
  const input=$('#chatInput'), body=input.value.trim(); if(!body||!state.session) return;
  const btn=$('#sendChat'); btn.disabled=true;
  try{
    if(state.chatMode==='shipment'&&state.activeRoomId){
      const {error}=await supabase.rpc('send_shipment_message',{
        p_room_id:state.activeRoomId,p_message_type:'TEXT',p_body:body,
        p_attachment_path:null,p_attachment_mime:null,p_attachment_name:null,p_attachment_size:null,
        p_latitude:null,p_longitude:null
      });
      if(error) throw error;
      input.value='';
      await loadShipmentChat(state.activeRoomId,true);
      await loadShipmentRooms();
    }else{
      const rid=crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`;
      const {error}=await supabase.rpc('send_public_chat_message_idempotent',{p_request_id:rid,p_body:body,p_reply_to_id:null}); if(error) throw error;
      input.value=''; await loadChat(true);
    }
  }catch(err){toast(humanError(err),'error');} finally{btn.disabled=false;}
}

async function loadUnread(){
  if(!state.session){$('#chatDot').style.display='none';return;}
  try{const {data,error}=await supabase.rpc('get_public_chat_unread_count'); if(error) throw error; const n=Number(data||0); $('#chatDot').style.display=n>0?'block':'none'; $('#chatHint').textContent=n?`${n} · ${t('publicChat')}`:t('publicChat');}catch{}
}



function renderDriverHub(){
  const el=$('#driverHubList'); if(!el) return;
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('driverHubLoginHint'));if($('#driverListingCount'))$('#driverListingCount').textContent='—';return;}
  const q=($('#driverHubSearch')?.value||'').trim().toLocaleLowerCase();
  const rows=(state.driverListings||[]).filter(r=>{
    if(state.driverFilter!=='all'&&r.listing_type!==state.driverFilter) return false;
    if(!q) return true;
    return [r.title,r.description,r.city,r.country_code,r.truck_type,r.first_name,r.last_name].some(v=>String(v||'').toLocaleLowerCase().includes(q));
  });
  if($('#driverListingCount')) $('#driverListingCount').textContent=String((state.driverListings||[]).length);
  if(!rows.length){el.innerHTML=emptyBlock('noDriverListings');return;}
  const uid=state.session.user.id;
  el.innerHTML=rows.map(r=>{
    const name=r.show_identity?[r.first_name,r.last_name].filter(Boolean).join(' ').trim():'';
    const own=r.user_id===uid;
    return `<article class="driver-listing-card">
      <div class="driver-listing-head"><span class="status-pill">${r.listing_type==='NEED_DRIVER'?t('needDriver'):t('needVehicle')}</span><time>${esc(relativeLabel(r.created_at))}</time></div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.description)}</p>
      <div class="driver-listing-meta"><span><small>${t('city')}</small><b>${esc(r.city)} · ${esc(r.country_code)}</b></span><span><small>${t('truckType')}</small><b>${esc(r.truck_type||'—')}</b></span><span><small>${t('employmentType')}</small><b>${r.employment_type==='PERMANENT'?t('permanentWork'):t('serviceWork')}</b></span></div>
      ${name?`<div class="driver-identity"><span class="mini-avatar">${esc(initials(name))}</span><b>${esc(name)}</b></div>`:''}
      <div class="driver-listing-actions"><a class="btn secondary" href="tel:${esc(r.contact_phone)}">${t('call')} · <span dir="ltr">${esc(r.contact_phone)}</span></a>${own?`<button class="btn secondary close-driver-listing" data-close-driver-listing="${esc(r.id)}">${t('closeListing')}</button>`:''}</div>
    </article>`;
  }).join('');
  $$('[data-close-driver-listing]').forEach(b=>b.onclick=()=>closeDriverListing(b.dataset.closeDriverListing));
}
async function loadDriverHub(){
  if(!state.session){state.driverListings=[];renderDriverHub();return;}
  try{
    const {data,error}=await supabase.from('driver_hub_listings').select('id,user_id,listing_type,title,description,country_code,city,truck_type,contact_phone,status,created_at,updated_at,show_identity,first_name,last_name,employment_type').eq('status','ACTIVE').order('created_at',{ascending:false}).limit(100);
    if(error) throw error;
    state.driverListings=data||[];
  }catch(err){state.driverListings=[];toast(humanError(err),'error');}
  renderDriverHub();
}
function openDriverListing(){
  if(!state.session){$('#authModal').showModal();toast(t('loginRequired'),'error');return;}
  $('#driverListingStatus').textContent='';
  $('#driverListingPhone').value=state.profile?.phone||'';
  $('#driverListingModal').showModal();
}
async function submitDriverListing(ev){
  ev.preventDefault();
  if(!state.session) return;
  const btn=$('#submitDriverListing'),status=$('#driverListingStatus');
  const payload={
    user_id:state.session.user.id,
    listing_type:$('#driverListingType').value,
    title:$('#driverListingTitle').value.trim(),
    description:$('#driverListingDescription').value.trim(),
    country_code:$('#driverListingCountry').value,
    city:$('#driverListingCity').value.trim(),
    truck_type:$('#driverListingTruck').value.trim()||null,
    contact_phone:$('#driverListingPhone').value.trim(),
    status:'ACTIVE',
    show_identity:$('#driverListingIdentity').checked,
    employment_type:$('#driverEmploymentType').value
  };
  if(payload.title.length<3||payload.description.length<10||payload.city.length<2||payload.contact_phone.length<7){status.className='auth-status error';status.textContent=t('requiredFields');return;}
  btn.disabled=true;btn.textContent=t('loading');
  try{
    const {error}=await supabase.from('driver_hub_listings').insert(payload);if(error)throw error;
    status.className='auth-status ok';status.textContent=t('listingPublished');toast(t('listingPublished'),'ok');
    $('#driverListingForm').reset();await loadDriverHub();setTimeout(()=>$('#driverListingModal')?.close(),800);
  }catch(err){status.className='auth-status error';status.textContent=humanError(err);}
  finally{btn.disabled=false;btn.textContent=t('publishListing');}
}
async function closeDriverListing(id){
  if(!state.session) return;
  try{
    const {error}=await supabase.from('driver_hub_listings').update({status:'CLOSED'}).eq('id',id).eq('user_id',state.session.user.id);
    if(error) throw error;
    await loadDriverHub();
  }catch(err){toast(humanError(err),'error');}
}

function sigortaEligible(){
  return !!state.session && ['DRIVER','TRANSPORT_COMPANY','BROKER'].includes(state.profile?.business_user_type);
}
function renderSigortaSettings(){
  const s=state.sigortaSettings;
  const price=s ? `${Number(s.price_3_months||0).toLocaleString(localeMap[state.lang])} ${esc(s.currency||'')}` : '—';
  if($('#sigortaPrice')) $('#sigortaPrice').textContent=price;
  if($('#sigortaModalPrice')) $('#sigortaModalPrice').textContent=price;
  if($('#sigortaAvailability')) $('#sigortaAvailability').textContent=!state.session?t('loginRequired'):(sigortaEligible()?t('availableNow'):t('insuranceNotEligible'));
  if($('#sigortaPaymentDetails')){
    if(!state.session||!s){
      $('#sigortaPaymentDetails').innerHTML=`<span>${t('paymentInfo')}</span>`;
    }else{
      const rows=[];
      if(s.bank_name) rows.push(`<span><small>${t('bankName')}</small><b>${esc(s.bank_name)}</b></span>`);
      if(s.account_holder) rows.push(`<span><small>${t('accountHolder')}</small><b>${esc(s.account_holder)}</b></span>`);
      if(s.iban) rows.push(`<span><small>IBAN</small><b dir="ltr">${esc(s.iban)}</b></span>`);
      if(s.card_number) rows.push(`<span><small>Card</small><b dir="ltr">${esc(s.card_number)}</b></span>`);
      if(s.payment_note) rows.push(`<p>${esc(s.payment_note)}</p>`);
      $('#sigortaPaymentDetails').innerHTML=rows.join('')||`<span>${t('paymentInfo')}</span>`;
    }
  }
}
function renderSigortaRequests(){
  const el=$('#insuranceRequestList'); if(!el) return;
  if(!state.session){el.innerHTML=emptyBlock('loginRequired',t('insuranceLoginHint'));return;}
  if(!state.sigortaRequests.length){el.innerHTML=emptyBlock('noInsuranceRequests');return;}
  el.innerHTML=`<div class="insurance-request-grid">${state.sigortaRequests.map(r=>`
    <article class="insurance-request-card">
      <div class="insurance-request-head"><span class="status-pill">${esc(r.status||'PENDING')}</span><time>${esc(relativeLabel(r.created_at))}</time></div>
      <div><small>${t('trackingCode')}</small><b class="tracking-code">${esc(r.tracking_code||'—')}</b></div>
      <div class="insurance-request-meta"><span><small>${t('price')}</small><b>${Number(r.quoted_amount||0).toLocaleString(localeMap[state.lang])} ${esc(r.quoted_currency||'')}</b></span><span><small>${t('plan')}</small><b>${esc(r.period_months||3)} months</b></span></div>
      ${r.expires_at?`<div class="insurance-expiry"><small>${t('expires')}</small><b>${esc(String(r.expires_at))}</b></div>`:''}
      ${r.admin_note?`<p class="insurance-note">${esc(r.admin_note)}</p>`:''}
      ${r.status==='ISSUED'&&r.final_policy_path?`<button class="btn secondary wide policy-btn" data-policy-request="${esc(r.id)}">${t('openPolicy')} ↗</button>`:''}
    </article>`).join('')}</div>`;
  $$('[data-policy-request]').forEach(b=>b.onclick=()=>openInsurancePolicy(b.dataset.policyRequest));
}
async function loadServices(){
  if(!state.session){
    state.sigortaSettings=null; state.sigortaRequests=[];
    renderSigortaSettings(); renderSigortaRequests(); return;
  }
  try{
    const [{data:settings,error:se},{data:reqs,error:re}]=await Promise.all([
      supabase.from('sigorta_settings').select('price_3_months,currency,account_holder,bank_name,iban,card_number,payment_note,whatsapp_number').eq('id','default').maybeSingle(),
      supabase.from('sigorta_requests').select('id,tracking_code,status,quoted_amount,quoted_currency,period_months,final_policy_path,expires_at,admin_note,created_at').order('created_at',{ascending:false}).limit(20)
    ]);
    if(se) throw se;
    if(re) throw re;
    state.sigortaSettings=settings||null;
    state.sigortaRequests=reqs||[];
  }catch(err){
    console.warn('sigorta services',err);
  }
  renderSigortaSettings(); renderSigortaRequests();
}
async function openInsuranceModal(){
  if(!state.session){$('#authModal').showModal();toast(t('loginRequired'),'error');return;}
  if(!sigortaEligible()){toast(t('insuranceNotEligible'),'error');return;}
  if(!state.sigortaSettings) await loadServices();
  const p=state.profile||{};
  $('#sigortaApplicant').value=[p.first_name,p.last_name].filter(Boolean).join(' ').trim();
  $('#sigortaPhone').value=p.phone||'';
  $('#sigortaWhatsapp').value=p.whatsapp_phone||p.phone||'';
  $('#sigortaStatus').textContent='';
  renderSigortaSettings();
  $('#sigortaModal').showModal();
}
function insuranceFileOkay(file){
  if(!file||file.size<=0||file.size>15728640) return false;
  return ['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type);
}
function safeExt(file){
  const byMime={'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  return byMime[file.type]||'bin';
}
async function uploadInsuranceFile(requestId,kind,file,uploaded){
  if(!insuranceFileOkay(file)) throw new Error(t('allowedInsuranceFiles'));
  const uid=state.session.user.id;
  const path=`${uid}/application/${requestId}/${kind}.${safeExt(file)}`;
  const {error}=await supabase.storage.from('yoldash-sigorta').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
  if(error) throw error;
  uploaded.push(path);
  return path;
}
async function submitSigorta(ev){
  ev.preventDefault();
  if(!state.session||!sigortaEligible()){toast(t('insuranceNotEligible'),'error');return;}
  const btn=$('#submitSigorta'), status=$('#sigortaStatus');
  const applicant=$('#sigortaApplicant').value.trim(), phone=$('#sigortaPhone').value.trim(), whatsapp=$('#sigortaWhatsapp').value.trim();
  if(!applicant||!/^\+[1-9]\d{7,14}$/.test(phone)||!/^\+[1-9]\d{7,14}$/.test(whatsapp)){status.className='auth-status error';status.textContent=t('requiredFields');return;}
  const files={
    passport:$('#sigortaPassport').files[0],
    tractor:$('#sigortaTractor').files[0],
    container:$('#sigortaContainer').files[0],
    receipt:$('#sigortaReceipt').files[0]
  };
  if(Object.values(files).some(f=>!insuranceFileOkay(f))){status.className='auth-status error';status.textContent=t('allowedInsuranceFiles');return;}
  const requestId=crypto.randomUUID();
  const uploaded=[];
  btn.disabled=true; btn.textContent=t('loading'); status.className='auth-status';status.textContent=t('loading');
  try{
    const passportPath=await uploadInsuranceFile(requestId,'passport',files.passport,uploaded);
    const tractorPath=await uploadInsuranceFile(requestId,'tractor-triptyque',files.tractor,uploaded);
    const containerPath=await uploadInsuranceFile(requestId,'container-triptyque',files.container,uploaded);
    const receiptPath=await uploadInsuranceFile(requestId,'payment-receipt',files.receipt,uploaded);
    const {data,error}=await supabase.rpc('create_sigorta_request',{
      p_request_id:requestId,p_applicant_name:applicant,p_phone:phone,p_whatsapp:whatsapp,p_period_months:3,
      p_passport_path:passportPath,p_tractor_triptyque_path:tractorPath,p_container_triptyque_path:containerPath,p_payment_receipt_path:receiptPath
    });
    if(error) throw error;
    const row=Array.isArray(data)?data[0]:data;
    status.className='auth-status ok';
    status.textContent=`${t('insuranceRequestSent')} · ${t('trackingCode')}: ${row?.tracking_code||requestId}`;
    toast(t('insuranceRequestSent'),'ok');
    $('#sigortaForm').reset();
    await loadServices();
    setTimeout(()=>$('#sigortaModal')?.close(),1400);
  }catch(err){
    status.className='auth-status error'; status.textContent=humanError(err);
    if(uploaded.length) supabase.storage.from('yoldash-sigorta').remove(uploaded).catch(()=>{});
  }finally{
    btn.disabled=false; btn.textContent=t('submitInsurance');
  }
}
async function openInsurancePolicy(requestId){
  const row=state.sigortaRequests.find(r=>r.id===requestId);
  if(!row?.final_policy_path) return;
  try{
    const {data,error}=await supabase.storage.from('yoldash-sigorta').createSignedUrl(row.final_policy_path,300);
    if(error) throw error;
    window.open(data.signedUrl,'_blank','noopener,noreferrer');
  }catch(err){toast(humanError(err),'error');}
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
  $('#quickBrowse').onclick=()=>page('loads'); $('#quickChat').onclick=()=>page('chat'); $('#driverBrowseLoads').onclick=()=>page('loads'); $('#createDriverListing').onclick=openDriverListing; $('#driverListingForm').addEventListener('submit',submitDriverListing); $('#driverHubSearch').addEventListener('input',renderDriverHub); $('[data-driver-filter]').forEach(b=>b.onclick=()=>{state.driverFilter=b.dataset.driverFilter;$('[data-driver-filter]').forEach(x=>x.classList.toggle('active',x===b));renderDriverHub();});
  $('#refreshShipments').onclick=loadShipments; $('#openInsuranceBtn').onclick=openInsuranceModal; $('#openInsuranceBtn2').onclick=openInsuranceModal; $('#refreshInsurance').onclick=loadServices; $('#sigortaForm').addEventListener('submit',submitSigorta);
  $('#loadForm').addEventListener('submit',submitLoad); $('#offerForm').addEventListener('submit',submitOffer); $('#authForm').addEventListener('submit',submitAuth); $('#recoveryForm')?.addEventListener('submit',submitRecovery);
  $('#saveProfileBtn').onclick=saveProfile; $('#forgotPassword').onclick=forgotPassword; $('#signOutBtn').onclick=async()=>{await supabase.auth.signOut();$('#authModal').close();toast(t('signOut'));};
  $$('[data-auth-mode]').forEach(b=>b.onclick=()=>setAuthMode(b.dataset.authMode));
  $$('[data-business-type]').forEach(b=>b.onclick=()=>{state.selectedBusinessType=b.dataset.businessType;$$('[data-business-type]').forEach(x=>x.classList.toggle('active',x===b));});
  $('#loadSearch').addEventListener('input',renderLoads);
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){page('loads');$('#loadSearch').value=e.target.value;renderLoads();}});
  $$('[data-filter]').forEach(b=>b.onclick=()=>{state.loadFilter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderLoads();});
  $('#publicChatPerson').onclick=()=>{state.chatMode='public';state.activeRoomId=null;loadChat();}; $('#sendChat').onclick=sendChat; $('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat();}});
  window.addEventListener('online',networkUI);window.addEventListener('offline',networkUI);
}

async function init(){
  canonicalFallback(); bindUI(); networkUI(); applyLanguage(state.lang,false); setAuthMode('signin');
  setupCitySearch('origin'); setupCitySearch('destination');

  supabase.auth.onAuthStateChange((event,session)=>setTimeout(async()=>{
    state.session=session;
    if(session) await loadProfile();
    else {state.profile=null;state.businessProfile=null;chatCache=[];}
    renderProfileUI();
    loadUnread();
    if(event==='PASSWORD_RECOVERY'){
      $('#recoveryStatus').textContent='';
      $('#recoveryModal')?.showModal();
    }
    if($('#page-chat').classList.contains('active')){loadShipmentRooms();loadChat(true);}if($('#page-services').classList.contains('active')) loadServices();if($('#page-drivers').classList.contains('active')) loadDriverHub();
  },0));

  await Promise.all([refreshSession(),loadLoads()]);
}
init();
