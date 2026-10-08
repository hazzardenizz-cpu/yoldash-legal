(() => {
  const labels={fa:'درباره ما',tr:'Hakkımızda',en:'About Us'};
  function currentLang(){
    const active=document.querySelector('.lang-switch button.active')?.dataset.lang;
    if(['fa','tr','en'].includes(active))return active;
    const saved=localStorage.getItem('yoldash_lang');
    if(['fa','tr','en'].includes(saved))return saved;
    const l=(document.documentElement.lang||'fa').toLowerCase();
    return l.startsWith('tr')?'tr':l.startsWith('en')?'en':'fa';
  }
  function updateLabel(){
    const el=document.querySelector('#aboutNavItem [data-about-nav-label]');
    if(el)el.textContent=labels[currentLang()];
  }
  function mount(){
    const services=document.querySelector('.sidebar nav [data-page="services"]');
    if(!services)return;
    let item=document.getElementById('aboutNavItem');
    if(!item){
      item=document.createElement('button');
      item.type='button';
      item.id='aboutNavItem';
      item.className='nav-item';
      item.innerHTML='<span class="ico">ⓘ</span><span data-about-nav-label></span>';
      item.addEventListener('click',()=>{window.location.href=({fa:'/fa/about',tr:'/tr/hakkimizda',en:'/en/about'})[currentLang()];});
      services.insertAdjacentElement('afterend',item);
    }
    updateLabel();
    document.querySelectorAll('.lang-switch button[data-lang]').forEach(btn=>{
      btn.addEventListener('click',()=>setTimeout(updateLabel,0));
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();