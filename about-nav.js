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
    let a=document.getElementById('aboutNavItem');
    if(!a){
      a=document.createElement('a');
      a.id='aboutNavItem';
      a.className='nav-item';
      a.href='/about';
      a.style.textDecoration='none';
      a.innerHTML='<span class="ico">ⓘ</span><span data-about-nav-label></span>';
      services.insertAdjacentElement('afterend',a);
    }
    updateLabel();
    document.querySelectorAll('.lang-switch button[data-lang]').forEach(btn=>{
      btn.addEventListener('click',()=>setTimeout(updateLabel,0));
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();