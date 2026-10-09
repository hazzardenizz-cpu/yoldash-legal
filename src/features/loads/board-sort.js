export function distanceKm(position, cargo) {
  if (!position || cargo.origin_lat == null || cargo.origin_lng == null || cargo.origin_lat === '' || cargo.origin_lng === '') return null;
  const lat=Number(cargo.origin_lat), lng=Number(cargo.origin_lng);
  if (!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180) return null;
  const rad=n=>n*Math.PI/180;
  const a=Math.sin(rad(lat-position.latitude)/2)**2+Math.cos(rad(position.latitude))*Math.cos(rad(lat))*Math.sin(rad(lng-position.longitude)/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(Math.min(1,a)),Math.sqrt(Math.max(0,1-a)));
}
export function sortBoardLoads(loads, mode, position) {
  const rows=[...loads];
  const price=c=>c.freight_price!=null&&Number.isFinite(Number(c.freight_price))?Number(c.freight_price):-Infinity;
  const published=c=>Date.parse(c.published_at||c.announced_at||c.created_at)||0;
  if(mode==='price') rows.sort((a,b)=>price(b)-price(a)||published(b)-published(a));
  else if(mode==='nearest'&&position) rows.sort((a,b)=>(distanceKm(position,a)??Infinity)-(distanceKm(position,b)??Infinity)||published(b)-published(a));
  else rows.sort((a,b)=>published(b)-published(a));
  return rows;
}
