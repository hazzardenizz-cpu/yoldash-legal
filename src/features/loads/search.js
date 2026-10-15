export const normalizeSearch=value=>String(value??'').normalize('NFKC').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/\u200c/g,' ').toLocaleLowerCase().trim();
export function matchesSearch(values,query){const text=normalizeSearch(values.join(' '));return normalizeSearch(query).split(/\s+/).filter(Boolean).every(term=>text.includes(term));}
