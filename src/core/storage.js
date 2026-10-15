// Storage may be disabled by browser policy or unavailable in private sessions.
export function readStored(key,fallback='',storage){
  try{return (storage??globalThis.localStorage)?.getItem(key)??fallback;}catch{return fallback;}
}
