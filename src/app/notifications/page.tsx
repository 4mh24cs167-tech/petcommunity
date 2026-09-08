'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, ExternalLink, Clock } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) console.error('Error loading notifications:', error);
      else setNotifications(data || []);
      setLoading(false);
    }
    loadNotifications();
  }, [supabase, router]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) console.error('Error marking as read:', error);
    else setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);

    if (error) console.error('Error marking all as read:', error);
    else setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 py-12 space-y-8">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Notifications</h1>
          <p className="text-gray-500 font-medium">Stay updated with your pet community</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={markAllAsRead}
          className="text-sm font-bold text-teal-600 hover:text-teal-700 transition"
        >
          Mark all as read
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-4"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                <Bell className="h-10 w-10" />
              </div>
              <p className="text-gray-400 font-medium">All caught up! No new notifications.</p>
            </motion.div>
          ) : (
            notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-6 rounded-3xl border transition-all group ${
                  notif.is_read
                    ? 'bg-white border-gray-100 opacity-70'
                    : 'bg-white border-teal-100 shadow-sm ring-1 ring-teal-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex space-x-4">
                    <div className={`p-3 rounded-2xl ${
                      notif.is_read ? 'bg-gray-50 text-gray-400' : 'bg-teal-50 text-teal-600'
                    }`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-bold ${notif.is_read ? 'text-gray-700' : 'text-gray-900'}`}>{notif.title}</h3>
                        {!notif.is_read && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{notif.content}</p>
                      <div className="flex items-center space-x-2 pt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(notif.created_at).toLocaleDateString()} • {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-2 text-gray-300 hover:text-teal-600 transition"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
                {notif.link && (
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => router.push(notif.link)}
                    className="mt-4 w-full py-2 bg-gray-50 hover:bg-teal-50 text-gray-600 hover:text-teal-700 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-3 w-3" />
                  </motion.button>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
