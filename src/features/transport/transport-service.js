import { supabase } from '../../core/supabase.js';

export async function getCargoOfferSnapshot(cargoId) {
  return supabase.rpc('get_cargo_offer_snapshot', {
    p_cargo_id: cargoId
  });
}

export async function submitCargoOffer({
  cargoId,
  proposedPrice,
  currencyCode,
  message,
  requestedTruckCount
}) {
  return supabase.rpc('submit_cargo_offer', {
    p_cargo_id: cargoId,
    p_proposed_price: proposedPrice,
    p_currency_code: currencyCode,
    p_message: message,
    p_requested_truck_count: requestedTruckCount
  });
}

export async function getMyTransportCargo() {
  return supabase.rpc('get_my_transport_cargo');
}
