import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const id='12345678-1234-1234-1234-123456789abc';
const make=(file,fetch)=>{
 const context={fetch,console,Date,encodeURIComponent,AbortSignal};vm.createContext(context);
 vm.runInContext(fs.readFileSync(file,'utf8').replace('export default async function handler','async function handler'),context);
 return context.handler;
};
const response=()=>({headers:{},code:0,body:'',setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},send(b){this.body=b;}});
let calls=0;let res=response();let handler=make('api/public-load.js',async()=>{calls++;throw Error('should not fetch')});
await handler({query:{id:'-'.repeat(36)}},res);assert.equal(res.code,404);assert.equal(calls,0);
handler=make('api/public-load.js',async()=>({ok:true,json:async()=>[{id,status:'PUBLISHED',origin_city:'A <town>',destination_city:'B',cargo_type:'Textile',expires_at:'2099-01-01'}]}));
res=response();await handler({query:{id}},res);assert.equal(res.code,200);assert(res.body.includes('A &lt;town&gt;'));assert(res.body.includes('twitter:card'));assert(res.body.includes('/load/'+id));assert.equal(res.headers['X-Robots-Tag'],'index, follow');
const schema=JSON.parse(res.body.match(/application\/ld\+json">(.*?)<\/script>/s)[1]);assert.equal(schema.about['@type'],'Service');assert(!schema.mainEntity);
handler=make('api/public-load.js',async()=>{throw Error('network')});res=response();await handler({query:{id}},res);assert.equal(res.code,503);assert.equal(res.headers['X-Robots-Tag'],'noindex, follow');
handler=make('api/public-load.js',async()=>({ok:true,json:async()=>[{id,expires_at:'2000-01-01'}]}));res=response();await handler({query:{id}},res);assert.equal(res.code,404);
handler=make('api/load-sitemap.js',async()=>({ok:true,json:async()=>[{id},{id:'invalid'},{id,published_at:'bad-date'}]}));res=response();await handler({},res);assert.equal(res.code,200);assert(!res.body.includes('<lastmod>'));assert(!res.body.includes('invalid'));
handler=make('api/load-sitemap.js',async()=>{throw Error('network')});res=response();await handler({},res);assert.equal(res.code,503);
console.log('PASS: UUID validation, escaped HTML, metadata/schema, active/expired states, transient failures, sitemap dates');

for(const file of ['api/public-load.js','api/load-sitemap.js']){
 handler=make(file,async()=>{throw Error('must not fetch')});res=response();await handler({method:'POST',query:{id}},res);assert.equal(res.code,405);assert.equal(res.headers.Allow,'GET, HEAD');
 handler=make(file,async()=>({ok:true,json:async()=>{throw Error('malformed JSON')}}));res=response();await handler({query:{id}},res);assert.equal(res.code,503);assert.equal(res.headers['Cache-Control'],'no-store');
 handler=make(file,async()=>({ok:true,json:async()=>({error:'bad shape'})}));res=response();await handler({query:{id}},res);assert.equal(res.code,503);
}
handler=make('api/public-load.js',async()=>({ok:true,json:async()=>[{id,accepting_requests:false}]}));res=response();await handler({query:{id}},res);assert.equal(res.code,404);
console.log('PASS: method restrictions, bounded upstream requests, malformed JSON, invalid data shape and closed cargo');
