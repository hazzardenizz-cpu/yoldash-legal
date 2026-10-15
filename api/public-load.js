const SUPABASE_URL='https://ubqrafuustkyenbbzhtg.supabase.co';
const SUPABASE_KEY='sb_publishable_4rrohZA7Vsu76Fywpqg9Bg_ozmpPHeH';

function esc(v=''){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function json(v){return JSON.stringify(v).replace(/</g,'\\u003c');}
function city(c,prefix){
  return c[prefix+'_city_name_en']||c[prefix+'_city_name_tr']||c[prefix+'_city_name_fa']||c[prefix+'_city']||'—';
}
function truck(v){
  return ({CURTAIN:'Curtainsider',FLATBED:'Flatbed',TANKER:'Tanker',REFRIGERATED:'Refrigerated',LIGHT_TRUCK:'Light truck'})[v]||v||'—';
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method&& !['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');res.status(405).send('Method not allowed');return;}
  const id=String(req.query?.id||'').trim();
  res.setHeader('X-Robots-Tag','noindex, follow');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)){res.status(404).send('Not found');return;}
  const select=[
    'id','status','cargo_type','required_truck_type','origin_country_code','origin_city',
    'destination_country_code','destination_city','origin_city_name_en','origin_city_name_fa','origin_city_name_tr',
    'destination_city_name_en','destination_city_name_fa','destination_city_name_tr','weight_kg','truck_count',
    'remaining_truck_count','accepting_requests','loading_at','freight_price','currency_code','description','published_at','expires_at'
  ].join(',');
  const url=SUPABASE_URL+'/rest/v1/cargo_posts?select='+encodeURIComponent(select)+'&id=eq.'+encodeURIComponent(id)+'&status=eq.PUBLISHED&deleted_at=is.null&limit=1';
  let r,rows;
  try{r=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY},signal:AbortSignal.timeout(10000)});if(r.ok){rows=await r.json();if(!Array.isArray(rows))throw new Error('Invalid upstream response');}}catch(error){res.setHeader('Cache-Control','no-store');res.setHeader('Retry-After','60');res.status(503).send('Load information is temporarily unavailable. Please try again.');return;}
  if(!r.ok){res.status(502).send('Unable to load cargo');return;}
  const c=rows?.[0];
  if(!c||c.accepting_requests===false||(c.remaining_truck_count!=null&&Number(c.remaining_truck_count)<=0) || (c.expires_at && new Date(c.expires_at)<=new Date())){res.status(404).send('This load is no longer active.');return;}
  const from=city(c,'origin'),to=city(c,'destination'),cargo=c.cargo_type||'Road freight';
  const title=from+' → '+to+' · '+cargo+' | Yoldash Load';
  const description='Active Yoldash road-freight load from '+from+' to '+to+'. Cargo: '+cargo+'. View vehicle, weight, loading and freight details.';
  const canonical='https://www.getyoldash.com/load/'+encodeURIComponent(c.id);
  const weight=c.weight_kg?Number(c.weight_kg).toLocaleString('en-US')+' kg':'—';
  const price=c.freight_price!=null?Number(c.freight_price).toLocaleString('en-US')+' '+(c.currency_code||''):'—';
  const trucks=c.remaining_truck_count??c.truck_count??1;
  const loading=c.loading_at?new Date(c.loading_at).toLocaleString('en-GB',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'})+' UTC':'—';
  const schema={"@context":"https://schema.org","@type":"ItemPage","name":title,"description":description,"url":canonical,"isPartOf":{"@type":"WebSite","name":"Yoldash","url":"https://www.getyoldash.com/"},"about":{"@type":"Service","name":cargo+' road-freight transport',"serviceType":"Road freight"}};
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
  res.setHeader('X-Robots-Tag','index, follow');
  res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="Yoldash"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<link rel="icon" type="image/webp" sizes="128x128" href="/brand/yoldash.webp"><meta property="og:locale" content="en_GB"><meta property="og:image" content="https://www.getyoldash.com/brand/yoldash-social.png"><meta property="og:image:alt" content="Yoldash road freight platform"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="https://www.getyoldash.com/brand/yoldash-social.png"><link rel="stylesheet" href="/seo.css"><script type="application/ld+json">${json(schema)}</script></head><body><div class="wrap">
<header class="top"><a class="brand" href="/"><b>Y</b>oldash</a><nav class="nav"><a href="/en/load-board">Load Board</a><a href="/">Open Yoldash</a></nav></header>
<main><section class="hero"><span class="eyebrow">Active Yoldash Load</span><h1>${esc(from)} → ${esc(to)}</h1><p>${esc(cargo)} · ${esc(c.origin_country_code||'')} → ${esc(c.destination_country_code||'')}</p><div class="actions"><a class="btn primary" href="/?page=loads">Open load board</a><a class="btn" href="/en/load-board">Browse more loads</a></div></section>
<section class="grid"><article class="card"><h2>Cargo</h2><p>${esc(cargo)}</p></article><article class="card"><h2>Vehicle</h2><p>${esc(truck(c.required_truck_type))}</p></article><article class="card"><h2>Weight</h2><p>${esc(weight)}</p></article></section>
<section class="section"><h2>Transport details</h2><div class="two"><div><h3>Trucks required</h3><p>${esc(trucks)}</p><h3>Loading</h3><p>${esc(loading)}</p></div><div><h3>Freight indication</h3><p>${esc(price)}</p><h3>Listing status</h3><p>Published · active</p></div></div></section>
${c.description?`<section class="section"><h2>Cargo notes</h2><p>${esc(c.description)}</p></section>`:''}
<section class="section"><h2>About this listing</h2><p>This page represents a live load listing published by a Yoldash user. Availability and commercial terms can change. Open Yoldash to review current details and, where eligible, submit a transport request.</p></section>
</main><footer>© 2026 Yoldash · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></footer></div></body></html>`);
}