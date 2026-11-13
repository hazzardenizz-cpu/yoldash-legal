(() => {
  const labels={fa:'درباره ما',tr:'Hakkımızda',en:'About Us'};
  function currentLang(){
    // The dashboard language switch is authoritative. The document lang can
    // remain Persian because it is also used for the site's base/SEO markup.
    const active=document.querySelector('.lang-switch button.active')?.dataset.lang;
    if(['fa','tr','en'].includes(active))return active;
    const root=(document.documentElement.lang||'').toLowerCase();
    if(root.startsWith('tr'))return 'tr';
    if(root.startsWith('en'))return 'en';
    if(root.startsWith('fa'))return 'fa';
    let saved='fa';
    try{saved=localStorage.getItem('yoldash_lang')||'fa';}catch{}
    return ['fa','tr','en'].includes(saved)?saved:'fa';
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
      btn.addEventListener('click',()=>{updateLabel();requestAnimationFrame(updateLabel);setTimeout(updateLabel,80);});
    });
    window.addEventListener('storage',event=>{if(event.key==='yoldash_lang')updateLabel();});
    const languageObserver=new MutationObserver(updateLabel);
    languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
    const switcher=document.querySelector('.lang-switch');
    if(switcher){
      const activeObserver=new MutationObserver(updateLabel);
      activeObserver.observe(switcher,{subtree:true,attributes:true,attributeFilter:['class','aria-pressed']});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();