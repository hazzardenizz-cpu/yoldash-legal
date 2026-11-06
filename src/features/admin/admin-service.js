import { supabase } from '../../core/supabase.js';

export async function isSuperAdmin(userId) {
  return supabase.rpc('yoldash_is_super_admin', {
    p_user_id: userId
  });
}

export async function getSuperAdminUserMap(minutes = 60) {
  return supabase.rpc('get_super_admin_user_map_window', { p_minutes: minutes });
}
