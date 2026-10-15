// All reads use the signed-in client and database row-level security.
export async function fetchTransportDashboard(db,userId){
  if(!userId)return {data:[],error:null};
  const [owned,requested]=await Promise.all([
    db.from('cargo_posts').select('*').eq('owner_id',userId).is('deleted_at',null).order('updated_at',{ascending:false}).limit(100),
    db.from('cargo_offers').select('id,status,cargo_id,created_at,cargo:cargo_posts!cargo_offers_cargo_id_fkey(*)').eq('provider_id',userId).order('created_at',{ascending:false}).limit(100)
  ]);
  if(owned.error||requested.error)return {data:null,error:owned.error||requested.error};
  const rows=new Map((owned.data||[]).map(c=>[c.id,c]));
  for(const offer of requested.data||[]){const c=offer.cargo;if(c&&!c.deleted_at&&!rows.has(c.id))rows.set(c.id,c);}
  return {data:[...rows.values()].sort((a,b)=>(Date.parse(b.updated_at)||0)-(Date.parse(a.updated_at)||0)),error:null};
}
export async function mapLimited(items,limit,fn){
  const results=new Array(items.length);let next=0;
  await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(next<items.length){const i=next++;results[i]=await fn(items[i],i);}}));
  return results;
}
