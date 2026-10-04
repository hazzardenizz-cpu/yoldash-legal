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

// These commands are intentionally RPC calls.  The database verifies that only
// the cargo owner can decide an offer and only the two shipment parties can
// access the chat room.
export async function setCargoOfferStatus(offerId, status) {
  return supabase.rpc('set_cargo_offer_status', {
    p_offer_id: offerId,
    p_status: status
  });
}

export async function getMyShipmentRooms() {
  return supabase.rpc('get_my_shipment_rooms', {
    p_completed: false,
    p_limit: 100
  });
}

export async function getShipmentRoomForOffer(offerId) {
  return supabase.rpc('get_shipment_room_for_offer', {
    p_offer_id: offerId
  });
}

export async function getShipmentMessages(roomId) {
  return supabase.rpc('get_shipment_messages', {
    p_room_id: roomId,
    p_limit: 100
  });
}

export async function sendShipmentText(roomId, body) {
  return supabase.rpc('send_shipment_message', {
    p_room_id: roomId,
    p_message_type: 'TEXT',
    p_body: body.trim()
  });
}

export function subscribeToShipmentRoom(roomId, onChange) {
  return supabase
    .channel(`web-shipment-room-${roomId}`)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'shipment_messages', filter: `room_id=eq.${roomId}`
    }, onChange)
    .on('postgres_changes', {
      event: '*', schema: 'public', table: 'shipment_chat_rooms', filter: `id=eq.${roomId}`
    }, onChange)
    .subscribe();
}

export function unsubscribeFromShipmentRoom(channel) {
  if (channel) return supabase.removeChannel(channel);
}
