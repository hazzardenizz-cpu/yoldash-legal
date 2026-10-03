import { supabase } from '../../core/supabase.js';

export async function listDriverHubListings(limit = 200) {
  return supabase
    .from('driver_hub_listings')
    .select('id,user_id,listing_type,title,description,country_code,city,truck_type,contact_phone,status,created_at,updated_at,show_identity,first_name,last_name,employment_type')
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function upsertDriverHubListing(payload) {
  return supabase.rpc('upsert_driver_hub_listing', payload);
}

export async function setDriverHubListingStatus({ id, userId, status }) {
  return supabase
    .from('driver_hub_listings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);
}

export async function deleteDriverHubListing({ id, userId }) {
  return supabase
    .from('driver_hub_listings')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
}
