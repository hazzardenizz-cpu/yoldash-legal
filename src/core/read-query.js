// Bound read-only queries. Mutations deliberately keep their existing handling:
// cancelling a write does not prove that the server did not commit it.
export async function withReadDeadline(query, milliseconds=15000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),milliseconds);
  try{
    const result=await query.abortSignal(controller.signal);
    if(controller.signal.aborted){const error=new Error('read_request_timeout');error.code='READ_TIMEOUT';throw error;}
    return result;
  }catch(error){
    if(controller.signal.aborted){const timeout=new Error('read_request_timeout');timeout.code='READ_TIMEOUT';throw timeout;}
    throw error;
  }finally{clearTimeout(timer);}
}
