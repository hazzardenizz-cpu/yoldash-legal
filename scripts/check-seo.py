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
# Metadata must describe the same page in search and sharing previews.
descriptions=[]
for path,content in pages.items():
 if path.startswith('/google') or path=='/about':continue
 title=re.search(r'<title>(.*?)</title>',content,re.S).group(1)
 desc=re.findall(r'<meta name="description" content="([^"]+)"',content)
 if len(desc)!=1:errors.append(f'{path}: missing or repeated description');continue
 descriptions.append(desc[0])
 for kind,key,expected in [('property','og:title',title),('property','og:description',desc[0]),('property','og:url',base+path),('name','twitter:title',title),('name','twitter:description',desc[0])]:
  actual=re.findall(rf'<meta {kind}="{key}" content="([^"]+)"',content)
  if actual!=[expected]:errors.append(f'{path}: inconsistent {key}')
 for key in ['og:image','og:image:alt','og:locale']:
  if f'property="{key}"' not in content:errors.append(f'{path}: missing {key}')
 if not re.search(r'<link rel="icon"[^>]*href="/brand/yoldash.webp"',content):errors.append(f'{path}: favicon must use a crawlable image URL')
 if not re.search(r'<head>\s*<meta charset="utf-8"',content):errors.append(f'{path}: charset must be first in head')
 if path!='/delete-account':
  if len(re.findall(r'<h1\b',content))!=1:errors.append(f'{path}: expected one main heading')
 for tag in re.findall(r'<img\b[^>]*>',content):
  if 'alt='not in tag:errors.append(f'{path}: image without alt text')
  if 'width='not in tag or 'height='not in tag:errors.append(f'{path}: image without dimensions')
 for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',content,re.S):
  data=json.loads(block)
  for node in data.get('@graph',[data]):
   if node.get('@type') in ['WebPage','AboutPage','ContactPage'] and node.get('url')!=base+path:errors.append(f'{path}: schema page URL differs from canonical')
   if node.get('@type')=='BreadcrumbList':
    items=node['itemListElement']
    if [x['position'] for x in items]!=list(range(1,len(items)+1)):errors.append(f'{path}: breadcrumb order')
    if items[-1]['item']!=base+path:errors.append(f'{path}: breadcrumb final URL')
for description,count in Counter(descriptions).items():
 if count>1:errors.append(f'duplicate description ({count}): {description}')
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
