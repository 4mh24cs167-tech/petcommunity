'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Share2,
  Heart,
  MessageSquare,
  Tag,
  Sparkles,
  Send,
  User,
  Smile,
  ArrowRight
} from 'lucide-react';
import PetAnimation from '@/components/PetAnimation';
import { PET_SPRINGS } from '@/lib/motion-variants';

const FloatingPet = ({ emoji, delay, x, y, duration = 6 }: { emoji: string, delay: number, x: string, y: string, duration?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.1, 0.4, 0.1],
      scale: [1, 1.1, 1],
      y: [0, -30, 0],
      x: [0, 20, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className="absolute text-7xl pointer-events-none z-0 filter blur-[1px] opacity-50"
    style={{ left: x, top: y }}
  >
    {emoji}
  </motion.div>
);

const AmbientPaw = ({ delay, x, y }: { delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 0.1, 0],
      y: [0, -100],
      x: [0, 20, -20, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
    className="absolute text-4xl pointer-events-none z-0 text-teal-300/30"
    style={{ left: x, top: y }}
  >
    🐾
  </motion.div>
);

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAuth(false);
        router.push('/login');
        return;
      }
      setIsAuth(true);

      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (username, avatar_url),
          pets (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    init();
  }, [supabase, router]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to post');
      return;
    }

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      content,
    });

    if (error) {
      alert(error.message);
    } else {
      setContent('');
      const { data } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (username, avatar_url),
          pets (name)
        `)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-black selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden pb-24">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/30 blur-[120px]" />
        <FloatingPet emoji="🐕" delay={0} x="5%" y="15%" />
        <FloatingPet emoji="🐈" delay={1} x="85%" y="10%" duration={8} />
        <FloatingPet emoji="🦜" delay={2} x="10%" y="65%" duration={7} />
        <FloatingPet emoji="🐇" delay={3} x="80%" y="75%" duration={9} />

        <AmbientPaw delay={0} x="20%" y="70%" />
        <AmbientPaw delay={6} x="60%" y="30%" />
        <AmbientPaw delay={12} x="80%" y="80%" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 pt-32 space-y-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="h-3 w-3 text-teal-500" />
            <span>The Collective Space</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight text-black">
            Pet <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Stories.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            A curated sanctuary for sharing moments, wisdom, and the unconditional love of our companions.
          </p>
        </motion.header>

        {/* Story Starter - Floating Post Area */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] border border-white/40 shadow-2xl space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl shadow-inner">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">What's on your mind?</h2>
            </div>

            <form onSubmit={handlePost} className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a story, ask for advice, or post a moment..."
                className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800 placeholder:text-gray-400 min-h-[120px] resize-none"
                required
              />

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-2">
                  <button type="button" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors group">
                    <Image className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button type="button" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors group">
                    <Tag className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                  </button>
                  <button type="button" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors group">
                    <Smile className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  transition={PET_SPRINGS.pounce}
                  type="submit"
                  className="group px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl flex items-center space-x-3"
                >
                  <span>Post to Feed</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </form>
          </div>
        </motion.section>

        {/* Collective Feed - Bento-like List */}
        <section className="space-y-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-teal-500" />
              <span>The Collective Feed</span>
            </h2>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {posts.length} Moments Shared
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence>
              {posts.map((post, idx) => (
                <PetAnimation
                  key={post.id}
                  pattern="pounce"
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm overflow-hidden">
                            {post.profiles?.avatar_url ? (
                              <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-black text-gray-900 leading-none">{post.profiles?.username || 'Anonymous'}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">
                            {new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      {post.pet_id && (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-teal-100 shadow-sm">
                          <span className="text-xs">🐾</span>
                          <span>{post.pets?.name}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 leading-relaxed font-light text-lg">
                      {post.content}
                    </p>

                    <div className="flex items-center space-x-6 pt-4 border-t border-gray-50">
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-red-500 transition-colors group">
                        <Heart className="h-5 w-5 group-hover:fill-current transition-all" />
                        <span className="text-xs font-bold">Like</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition-colors group">
                        <MessageSquare className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold">Reply</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-400 hover:text-teal-600 transition-colors group ml-auto">
                        <Share2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-bold">Share</span>
                      </button>
                    </div>
                  </div>
                </PetAnimation>
              ))}
            </AnimatePresence>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-gray-500 font-medium">The feed is quiet. Be the first to share a story!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
