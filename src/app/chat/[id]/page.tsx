'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, MoreVertical, Phone, Video, Smile } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function ChatWindowPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherMember, setOtherMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let channel: any;

    async function initChat() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUserId(user.id);

      // Load other member info
      const { data: memberData } = await supabase
        .from('conversation_members')
        .select('profiles(*)')
        .eq('conversation_id', id)
        .neq('user_id', user.id)
        .single();

      if (memberData) setOtherMember(memberData.profiles);

      // Load messages
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true });

      if (error) console.error('Error loading messages:', error);
      else setMessages(messagesData || []);

      // Setup Realtime Subscription
      channel = supabase
        .channel(`chat:${id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` },
          (payload: any) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      setLoading(false);
    }
    initChat();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [id, supabase, router]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('messages').insert({
      conversation_id: id,
      sender_id: user.id,
      content: newMessage,
    });

    if (error) {
      alert(error.message);
    } else {
      setMessages([...messages, {
        id: Math.random().toString(),
        content: newMessage,
        sender_id: user.id,
        created_at: new Date().toISOString()
      }]);
      setNewMessage('');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="h-screen bg-[#FCFAF8] flex overflow-hidden">
      <div className="flex-grow flex flex-col relative">
        {/* Chat Header */}
        <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/chat')}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                {otherMember?.avatar_url ? (
                  <img src={otherMember.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    {otherMember?.username?.[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <h2 className="font-black text-gray-900 leading-none">{otherMember?.username}</h2>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online Now</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-teal-600">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-teal-600">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUserId;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] p-4 rounded-[24px] shadow-sm ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-teal-100' : 'text-gray-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Input Area */}
        <footer className="p-6 bg-white border-t border-gray-100">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex items-center space-x-4">
            <button type="button" className="p-3 text-gray-400 hover:text-teal-600 transition">
              <Smile className="h-6 w-6" />
            </button>
            <div className="flex-grow relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-full outline-none focus:ring-2 focus:ring-teal-500 transition text-gray-800"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={PET_SPRINGS.pounce}
              type="submit"
              className="p-4 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-all"
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </form>
        </footer>
      </div>
    </div>
  );
}
