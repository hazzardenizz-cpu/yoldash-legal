import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const html=fs.readFileSync('index.html','utf8');
const files=[...html.matchAll(/(?:src|href)="(\/assets\/(?:app|site)\.([a-f0-9]{12})\.(?:js|css))"/g)];assert.equal(files.length,2,'Expected one versioned app and stylesheet');
for(const [,url,hash]of files){const content=fs.readFileSync('.'+url);assert.equal(crypto.createHash('sha256').update(content).digest('hex').slice(0,12),hash,'Asset hash does not match contents: '+url);assert.ok(content.length>0);}
const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));assert.ok(config.headers.some(h=>h.source==='/assets/(.*)'&&h.headers.some(v=>v.key==='Cache-Control'&&v.value.includes('immutable'))));
console.log('PASS: release asset existence, content hashes and immutable cache configuration');
