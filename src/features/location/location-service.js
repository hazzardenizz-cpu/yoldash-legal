import { supabase } from '../../core/supabase.js';

export async function submitSharedLocation(name, gpsUrl) {
  return supabase.rpc('submit_shared_location', {
    p_name: name.trim(),
    p_gps_url: gpsUrl.trim()
  });
}
