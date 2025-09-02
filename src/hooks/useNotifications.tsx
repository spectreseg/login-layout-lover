import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    
    // Set up real-time subscription for notification changes
    const channel = supabase
      .channel('notifications-count-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'notifications',
        },
        async (payload) => {
          console.log('Real-time notification update for badge:', payload);
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            // Check if this notification affects the current user
            const affectedUserId = (payload.new as any)?.user_id || (payload.old as any)?.user_id;
            if (affectedUserId === user.id) {
              console.log('Updating unread count for current user');
              fetchUnreadCount();
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Notification count subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUnreadCount(0);
        return;
      }

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error fetching unread count:', error);
        return;
      }

      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error in fetchUnreadCount:', error);
    }
  };

  return { unreadCount, refetchUnreadCount: fetchUnreadCount };
};