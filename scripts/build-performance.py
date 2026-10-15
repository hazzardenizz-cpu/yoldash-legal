"""Rebuild committed performance assets after changing app.js, src/, or root CSS."""
from pathlib import Path
import subprocess, hashlib, re, json, tempfile
root=Path(__file__).resolve().parents[1]
assets=root/'assets';assets.mkdir(exist_ok=True)
css=['styles.css','legacy-base.css','design-system.css','international.css','minimal-theme.css']
cli=['npm','exec','--yes','--package=esbuild@0.25.12','--','esbuild']
subprocess.run(cli+['app.js','--bundle','--minify','--format=esm','--external:https://*','--target=es2020','--outfile=assets/app.min.js'],cwd=root,check=True)
with tempfile.TemporaryDirectory() as tmp:
 source=Path(tmp)/'site.css';source.write_text('\n'.join((root/p).read_text() for p in css))
 subprocess.run(cli+[str(source),'--minify','--outfile=assets/site.min.css'],cwd=root,check=True)
names={}
for name,ext in [('app','js'),('site','css')]:
 p=assets/f'{name}.min.{ext}';target=f'{name}.{hashlib.sha256(p.read_bytes()).hexdigest()[:12]}.{ext}';p.rename(assets/target);names[name]=target
p=root/'index.html';s=p.read_text()
for file in css:s=re.sub(r'<link\b[^>]*href="'+re.escape(file)+r'(?:\?[^" ]*)?"[^>]*>','',s)
s=re.sub(r'<link rel="stylesheet" href="/assets/site\.[a-f0-9]+\.css">','',s)
s=s.replace('</head>',f'<link rel="stylesheet" href="/assets/{names["site"]}">\n</head>')
s=re.sub(r'src="(?:app\.js(?:\?[^" ]*)?|/assets/app\.[a-f0-9]+\.js)"',f'src="/assets/{names["app"]}"',s)
p.write_text(re.sub(r"\n[ \t]*\n(?:[ \t]*\n)+", "\n\n", s))
config=root/'vercel.json';v=json.loads(config.read_text())
if not any(h['source']=='/assets/(.*)' for h in v['headers']):v['headers'].append({'source':'/assets/(.*)','headers':[{'key':'Cache-Control','value':'public, max-age=31536000, immutable'}]})
config.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
print(names)
