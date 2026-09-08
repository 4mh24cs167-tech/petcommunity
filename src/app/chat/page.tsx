'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, User, MoreVertical, Send } from 'lucide-react';
import PetAnimation from '@/components/PetAnimation';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function ChatPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadConversations() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('conversation_members')
        .select(`
          conversation_id,
          conversations (*),
          profiles (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading conversations:', error);
      } else {
        // Group by conversation and get the other member
        const grouped = {};
        data?.forEach(member => {
          const convId = member.conversation_id;
          if (!grouped[convId]) grouped[convId] = { ...member.conversations, members: [] };
          if (member.profiles && member.profiles.id !== user.id) {
            grouped[convId].otherMember = member.profiles;
          }
        });
        setConversations(Object.values(grouped));
      }
      setLoading(false);
    }
    loadConversations();
  }, [supabase, router]);

  const filteredConversations = conversations.filter(conv =>
    conv.otherMember?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 py-12 h-[calc(100vh-100px)] flex gap-8">
      {/* Conversations List */}
      <div className="w-full max-w-md flex flex-col space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition shadow-sm"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2">
          <AnimatePresence>
            {filteredConversations.map((conv, idx) => (
              <PetAnimation
                key={conv.id}
                pattern="nudge"
                className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center space-x-4 group"
                onClick={() => router.push(`/chat/${conv.id}`)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                    {conv.otherMember?.avatar_url ? (
                      <img src={conv.otherMember.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                        {conv.otherMember?.username?.[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-gray-900 truncate">{conv.otherMember?.username}</p>
                    <span className="text-[10px] text-gray-400">2m ago</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Click to open chat...</p>
                </div>
              </PetAnimation>
            ))}
          </AnimatePresence>
          {filteredConversations.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <MessageSquare className="h-12 w-12 text-gray-200 mx-auto" />
              <p className="text-gray-400 font-medium">No conversations yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window Placeholder */}
      <div className="hidden md:flex flex-grow bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center text-center p-12 space-y-4">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
            <MessageSquare className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-gray-900">Select a Conversation</h2>
            <p className="text-gray-500 font-light">Start a conversation with your matches to plan playdates or discuss breeding.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
