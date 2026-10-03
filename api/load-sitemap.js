const SUPABASE_URL='https://ubqrafuustkyenbbzhtg.supabase.co';
const SUPABASE_KEY='sb_publishable_4rrohZA7Vsu76Fywpqg9Bg_ozmpPHeH';
function escXml(v=''){return String(v).replace(/[<>&'"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));}
export default async function handler(req,res){
  const select='id,published_at,updated_at';
  const url=SUPABASE_URL+'/rest/v1/cargo_posts?select='+encodeURIComponent(select)+'&status=eq.PUBLISHED&deleted_at=is.null&expires_at=gt.'+encodeURIComponent(new Date().toISOString())+'&order=published_at.desc&limit=1000';
  const r=await fetch(url,{headers:{apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY}});
  if(!r.ok){res.status(502).send('Unable to build sitemap');return;}
  const rows=await r.json();
  const body=rows.map(c=>'<url><loc>https://www.getyoldash.com/load/'+escXml(c.id)+'</loc><lastmod>'+escXml(new Date(c.updated_at||c.published_at||Date.now()).toISOString())+'</lastmod><changefreq>hourly</changefreq><priority>0.8</priority></url>').join('');
  res.setHeader('Content-Type','application/xml; charset=utf-8');
  res.setHeader('Cache-Control','public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+body+'</urlset>');
}