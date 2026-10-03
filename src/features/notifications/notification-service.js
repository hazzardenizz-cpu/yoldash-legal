import { supabase } from '../../core/supabase.js';

export async function listUserNotifications(userId, limit = 40) {
  return supabase
    .from('user_notifications')
    .select('id,type,cargo_id,offer_id,assignment_id,room_id,actor_name,message_preview,origin_city,destination_city,read_at,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
}

export async function markUserNotificationRead({ userId, id }) {
  return supabase
    .from('user_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .is('read_at', null);
}

export async function markAllUserNotificationsRead(userId) {
  return supabase
    .from('user_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);
}

export function subscribeToUserNotifications(userId, onChange) {
  return supabase
    .channel('web-user-notifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      },
      onChange
    )
    .subscribe();
}

export function unsubscribeFromUserNotifications(channel) {
  if (channel) return supabase.removeChannel(channel);
}
