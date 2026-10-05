(function(){
  const labels={fa:'درباره ما',tr:'Hakkımızda',en:'About Us'};
  function lang(){
    const l=(document.documentElement.lang||'').toLowerCase();
    if(l.startsWith('fa'))return 'fa';
    if(l.startsWith('tr'))return 'tr';
    return 'en';
  }
  function mount(){
    const l=lang();
    const navs=[...document.querySelectorAll('nav,.nav,.top-nav,.navbar,.header-actions,.desktop-nav')];
    if(!navs.length)return;
    for(const nav of navs){
      if(nav.querySelector('a[href="/about"],a[href="/about.html"]'))continue;
      const a=document.createElement('a');
      a.href='/about';
      a.textContent=labels[l];
      a.className='about-nav-link';
      nav.appendChild(a);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
