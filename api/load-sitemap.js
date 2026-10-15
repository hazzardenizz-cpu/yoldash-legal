const SUPABASE_URL='https://ubqrafuustkyenbbzhtg.supabase.co';
const SUPABASE_KEY='sb_publishable_4rrohZA7Vsu76Fywpqg9Bg_ozmpPHeH';
function escXml(v=''){return String(v).replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));}
function lastModified(c){const value=c.updated_at||c.published_at;if(!value)return '';const date=new Date(value);return Number.isFinite(date.getTime())?'<lastmod>'+date.toISOString()+'</lastmod>':'';}
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method&& !['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');res.status(405).send('Method not allowed');return;}
  const select='id,published_at,updated_at';
  const url=SUPABASE_URL+'/rest/v1/cargo_posts?select='+encodeURIComponent(select)+'&status=eq.PUBLISHED&deleted_at=is.null&expires_at=gt.'+encodeURIComponent(new Date().toISOString())+'&order=published_at.desc&limit=1000';
  let r,rows;
  try{r=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY},signal:AbortSignal.timeout(10000)});if(r.ok){rows=await r.json();if(!Array.isArray(rows))throw new Error('Invalid upstream response');}}catch(error){res.setHeader('Cache-Control','no-store');res.setHeader('Retry-After','60');res.status(503).send('Sitemap temporarily unavailable');return;}
  if(!r.ok){res.status(502).send('Unable to build sitemap');return;}
  const body=rows.filter(c=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(c.id)).map(c=>'<url><loc>https://www.getyoldash.com/load/'+escXml(c.id)+'</loc>'+lastModified(c)+'</url>').join('');
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+body+'</urlset>');
}