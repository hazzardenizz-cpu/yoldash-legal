import { supabase } from '../../core/supabase.js';

export async function getPublicChatMessages(limit = 60) {
  return supabase.rpc('get_public_chat_messages', {
    p_limit: limit,
    p_before: null
  });
}

export async function markPublicChatRead() {
  return supabase.rpc('mark_public_chat_read');
}

export async function sendPublicChatMessage({ requestId, body }) {
  return supabase.rpc('send_public_chat_message_idempotent', {
    p_request_id: requestId,
    p_body: body,
    p_reply_to_id: null
  });
}

export async function getPublicChatUnreadCount() {
  return supabase.rpc('get_public_chat_unread_count');
}
