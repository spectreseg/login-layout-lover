import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  food_post_id: string | null;
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Add dummy notifications for the existing dummy posts
  const dummyNotifications: Notification[] = [
    {
      id: 'notif-1',
      user_id: 'current-user',
      type: 'new_listing',
      title: 'New Food Available!',
      message: 'Someone shared Fresh Garden Salad in Downtown Café',
      food_post_id: 'dummy-1',
      read: false,
      created_at: new Date().toISOString()
    },
    {
      id: 'notif-2',
      user_id: 'current-user',
      type: 'new_listing',
      title: 'New Food Available!',
      message: 'Someone shared Homemade Pizza Slices in University District',
      food_post_id: 'dummy-2',
      read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-3',
      user_id: 'current-user',
      type: 'new_listing',
      title: 'New Food Available!',
      message: 'Someone shared Fresh Fruit Bowl in Community Center',
      food_post_id: 'dummy-3',
      read: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-4',
      user_id: 'current-user',
      type: 'new_listing',
      title: 'New Food Available!',
      message: 'Someone shared Artisan Bagels in Local Bakery',
      food_post_id: 'dummy-4',
      read: true,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif-5',
      user_id: 'current-user',
      type: 'new_listing',
      title: 'New Food Available!',
      message: 'Someone shared Gourmet Sandwiches in Business District',
      food_post_id: 'dummy-5',
      read: true,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${supabase.auth.getUser().then(u => u.data.user?.id)}`
        },
        (payload) => {
          console.log('New notification:', payload);
          setNotifications(prev => [payload.new as Notification, ...prev]);
          toast({
            title: (payload.new as Notification).title,
            description: (payload.new as Notification).message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        // Use dummy notifications if there's an error or no real notifications
        setNotifications(dummyNotifications);
      } else {
        // Combine real notifications with dummy ones for now
        setNotifications([...data, ...dummyNotifications]);
      }
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      setNotifications(dummyNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    // Skip API call for dummy notifications
    if (notificationId.startsWith('notif-')) {
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error in markAsRead:', error);
    }
  };

  const markAllAsRead = async () => {
    // Update dummy notifications
    const dummyIds = notifications.filter(n => n.id.startsWith('notif-')).map(n => n.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update real notifications
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
      }

      // Update state for all notifications
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );

      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error in markAllAsRead:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <div className="text-center">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950 p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </div>
          
          {unreadCount > 0 && (
            <Button 
              onClick={markAllAsRead}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You'll see notifications here when other users share food near you.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id}
                className={`transition-all duration-200 ${
                  !notification.read 
                    ? 'border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20' 
                    : 'border-gray-200 dark:border-gray-800'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <Button
                        onClick={() => markAsRead(notification.id)}
                        variant="ghost"
                        size="sm"
                        className="ml-4 flex-shrink-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;