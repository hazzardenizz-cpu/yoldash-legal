const YOLDASH_GA_ID='G-H2D0WMPC84';
const CONSENT_KEY='yoldash_analytics_consent';

window.dataLayer=window.dataLayer||[];
window.gtag=function(){window.dataLayer.push(arguments);};

let savedConsent=null;
try{savedConsent=localStorage.getItem(CONSENT_KEY);}catch{}

window.gtag('consent','default',{
  analytics_storage:savedConsent==='granted'?'granted':'denied',
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  wait_for_update:500
});
window.gtag('js',new Date());
window.gtag('config',YOLDASH_GA_ID,{
  send_page_view:true,
  anonymize_ip:true
});

(function loadGoogleTag(){
  if(window.__yoldashGaLoaded)return;
  window.__yoldashGaLoaded=true;
  const s=document.createElement('script');
  s.async=true;
  s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(YOLDASH_GA_ID);
  document.head.appendChild(s);
})();

function setConsent(v){
  try{localStorage.setItem(CONSENT_KEY,v);}catch{}
  window.gtag('consent','update',{
    analytics_storage:v==='granted'?'granted':'denied',
    ad_storage:'denied',
    ad_user_data:'denied',
    ad_personalization:'denied'
  });
  document.getElementById('yoldashAnalyticsConsent')?.remove();
}

function mountConsent(){
  if(savedConsent==='granted'||savedConsent==='denied')return;
  const l=(document.documentElement.lang||'en').toLowerCase();
  const t=l.startsWith('fa')
    ?['برای بهبود Yoldash از آمار ناشناس بازدید سایت استفاده می‌کنیم.','اجازه می‌دهم','فعلاً نه']
    :l.startsWith('tr')
    ?['Yoldash’ı geliştirmek için anonim site kullanım istatistikleri kullanıyoruz.','İzin ver','Şimdilik hayır']
    :['We use anonymous site analytics to improve Yoldash.','Allow','Not now'];
  const b=document.createElement('div');
  b.id='yoldashAnalyticsConsent';
  b.setAttribute('role','dialog');
  b.style.cssText='position:fixed;z-index:2147483647;left:16px;right:16px;bottom:16px;max-width:720px;margin:auto;padding:14px 16px;border-radius:16px;background:#0b1628;color:#fff;box-shadow:0 12px 44px rgba(0,0,0,.35);font:14px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;display:flex;gap:12px;align-items:center;flex-wrap:wrap;border:1px solid rgba(255,255,255,.16)';
  const p=document.createElement('span');
  p.textContent=t[0];
  p.style.cssText='flex:1;min-width:220px';
  const y=document.createElement('button');
  y.type='button';
  y.textContent=t[1];
  y.style.cssText='border:0;border-radius:10px;padding:9px 14px;background:#f4b63d;color:#101722;font-weight:700;cursor:pointer';
  const n=document.createElement('button');
  n.type='button';
  n.textContent=t[2];
  n.style.cssText='border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:9px 14px;background:transparent;color:#fff;cursor:pointer';
  y.onclick=()=>setConsent('granted');
  n.onclick=()=>setConsent('denied');
  b.append(p,y,n);
  document.body.appendChild(b);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mountConsent,{once:true});
else mountConsent();


window.yoldashTrack=function(eventName,params={}){
  try{
    if(!eventName||typeof window.gtag!=='function')return;
    window.gtag('event',eventName,{
      ...params,
      app_name:'Yoldash Web',
      language:document.documentElement.lang||'en'
    });
  }catch(e){console.warn('analytics event',e);}
};
