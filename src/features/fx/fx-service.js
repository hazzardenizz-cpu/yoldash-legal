import { supabase } from '../../core/supabase.js';

export async function fetchFxRates() {
  return supabase.functions.invoke('fx-rates', { method: 'GET' });
}
