"""Check crawlable links, canonical URLs, hreflang reciprocity and sitemap consistency."""
from pathlib import Path
from urllib.parse import urlparse
from collections import Counter
import json,re,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parents[1];base='https://www.getyoldash.com';pages={};errors=[];titles=[];schemas=0
for p in root.rglob('*.html'):
 if any(x in p.parts for x in ('web','vercel-preview')):continue
 path='/'+p.relative_to(root).as_posix().removesuffix('.html');path=path.removesuffix('/index')or'/'
 pages[path]=p.read_text()
for path,content in pages.items():
 if path.startswith('/google') or path=='/about':continue
 canonical=re.findall(r'<link rel="canonical" href="([^"]+)"',content)
 if canonical!=[base+path]:errors.append(f'{path}: incorrect canonical {canonical}')
 titles+=re.findall(r'<title>(.*?)</title>',content,re.S)
 for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>',content,re.S):json.loads(s);schemas+=1
 for link in re.findall(r'<a\b[^>]*href="([^"]+)"',content):
  p=urlparse(link).path
  if link.startswith('/')and p not in pages and not(root/p.lstrip('/')).is_file()and not p.startswith('/load/'):errors.append(f'{path}: broken link {link}')
 alts=dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"',content))
 for url in alts.values():
  target=urlparse(url).path
  targetalts=dict(re.findall(r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"',pages.get(target,'')))
  if alts!=targetalts:errors.append(f'{path}: hreflang is not reciprocal with {target}')
for title,count in Counter(titles).items():
 if count>1:errors.append(f'duplicate title ({count}): {title}')
locs=[x.text for x in ET.parse(root/'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
if len(locs)!=len(set(locs)):errors.append('duplicate sitemap URLs')
for loc in locs:
 path=urlparse(loc).path
 if not loc.startswith(base+'/')or path not in pages or path=='/about':errors.append(f'sitemap URL is missing or noncanonical: {loc}')
for name in ['privacy','terms']:
 s=pages['/'+name]
 if '<div class="text" id="body"></div>'in s:errors.append(f'{name}: legal text requires JavaScript')
 if re.search(r'<script>\s*\S',s):errors.append(f'{name}: inline script conflicts with CSP')
print(json.dumps({'pages':len(pages),'structuredDataBlocks':schemas,'sitemapURLs':len(locs),'errors':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
