import { supabase } from '../../core/supabase.js';

const BUSINESS_TABLES = Object.freeze({
  DRIVER: 'driver_profiles',
  CARGO_OWNER: 'cargo_owner_profiles',
  TRANSPORT_COMPANY: 'transport_companies',
  BROKER: 'broker_profiles'
});

export async function getCurrentSession() {
  return supabase.auth.getSession();
}

export async function getProfile(userId) {
  return supabase
    .from('profiles')
    .select('id,email,first_name,last_name,phone,is_active,business_user_type,whatsapp_phone,tractor_transit_plate,container_transit_plate,driver_company_name')
    .eq('id', userId)
    .single();
}

export async function getBusinessProfile(type, userId) {
  const table = BUSINESS_TABLES[type];
  if (!table) return { data: null, error: null };

  return supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
}

export async function updateBaseProfile(userId, payload) {
  return supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId);
}

export async function upsertBusinessProfile(type, payload) {
  const table = BUSINESS_TABLES[type];
  if (!table) {
    return { data: null, error: new Error('Unsupported business profile type') };
  }

  return supabase
    .from(table)
    .upsert(payload, { onConflict: 'user_id' });
}
