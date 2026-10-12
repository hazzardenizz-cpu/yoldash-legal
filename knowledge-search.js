(() => {
  const search=document.getElementById('knowledgeSearch');
  if(!search) return;
  const cards=[...document.querySelectorAll('[data-knowledge-category]')];
  const buttons=[...document.querySelectorAll('[data-knowledge-filter]')];
  let category='all';
  const normalize=text=>text.normalize('NFKC').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[\u200c\u200d]/g,' ').toLocaleLowerCase().trim();
  const entries=cards.map(card=>({card,text:normalize(card.textContent)}));
  function update(){
    const terms=normalize(search.value).split(/\s+/).filter(Boolean);
    let count=0;
    for(const {card,text} of entries){
      const match=(category==='all'||card.dataset.knowledgeCategory===category)&&terms.every(term=>text.includes(term));
      card.hidden=!match;if(match)count++;
    }
    document.getElementById('knowledgeCount').textContent=`${count.toLocaleString('fa-IR')} راهنما از ${cards.length.toLocaleString('fa-IR')} مطلب`;
    document.getElementById('knowledgeEmpty').hidden=count!==0;
    buttons.forEach(button=>{const selected=button.dataset.knowledgeFilter===category;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));});
  }
  search.addEventListener('input',update);
  buttons.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.knowledgeFilter;update();}));
  update();
})();
