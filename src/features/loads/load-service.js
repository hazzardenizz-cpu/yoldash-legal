import { supabase } from '../../core/supabase.js';

export async function fetchOpenLoads(query = '', limit = 50) {
  const rpc = await supabase.rpc('get_open_cargo_posts', {
    p_query: query || '',
    p_offset: 0,
    p_limit: limit
  });

  if (!rpc.error) {
    return {
      data: Array.isArray(rpc.data) ? rpc.data : [],
      source: 'rpc',
      error: null
    };
  }

  const fallback = await supabase
    .from('cargo_posts')
    .select('*')
    .eq('status', 'PUBLISHED')
    .is('deleted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(limit);

  return {
    data: fallback.error ? [] : (fallback.data || []),
    source: 'table',
    error: fallback.error || null,
    rpcError: rpc.error
  };
}

export async function publishLoad(payload) {
  return supabase
    .from('cargo_posts')
    .insert(payload)
    .select('id')
    .single();
}

export function subscribeToOpenLoads(onChange) {
  return supabase
    .channel('web-live-cargo-posts')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'cargo_posts' },
      onChange
    )
    .subscribe();
}

export function unsubscribeFromOpenLoads(channel) {
  if (channel) return supabase.removeChannel(channel);
}
