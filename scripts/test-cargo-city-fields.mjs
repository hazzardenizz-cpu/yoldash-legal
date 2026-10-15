import assert from 'node:assert/strict';
import fs from 'node:fs';
const {cargoCityFields}=await import('data:text/javascript;base64,'+fs.readFileSync('src/features/loads/city-fields.js').toString('base64'));
const original={origin_city:'Istanbul',origin_country_code:'TR'};
assert.deepEqual(cargoCityFields('origin',null,'Istanbul','TR',original),{},'Unchanged route retains its stored location');
for(const [city,country] of [['Ankara','TR'],['Istanbul','IR']]){
 const fields=cargoCityFields('origin',null,city,country,original);
 assert.equal(Object.keys(fields).length,7);
 assert.ok(Object.values(fields).every(value=>value===null),'Edited route clears ALL old location and translated fields');
}
const selected=cargoCityFields('destination',{latitude:'39.9',longitude:'32.8',name_en:'Ankara'},'Ankara','TR',original);
assert.equal(selected.destination_lat,39.9);assert.equal(selected.destination_lng,32.8);
assert.equal(selected.destination_city_name_en,'Ankara');assert.equal(selected.destination_city_name_fa,null);
assert.equal(selected.destination_city_id,null);
const invalid=cargoCityFields('origin',{latitude:'bad',longitude:Infinity,city_id:'bad'},'X','TR');
assert.equal(invalid.origin_lat,null);assert.equal(invalid.origin_lng,null);assert.equal(invalid.origin_city_id,null);
assert.deepEqual(cargoCityFields('origin',null,'X','TR'),{});
console.log('PASS: city edits clear stale coordinates and translations; unchanged routes retain metadata; selected cities replace metadata');
