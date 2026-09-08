'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Award,
  ShieldCheck,
  Lightbulb,
  CheckCircle2,
  Send,
  MessageSquare,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';

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

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadQA() {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading QA:', error);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    }
    loadQA();
  }, [supabase]);

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to ask a question');
      return;
    }

    const { error } = await supabase.from('questions').insert({
      user_id: user.id,
      title,
      content,
    });

    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      setContent('');
      const { data } = await supabase.from('questions').select(`*, profiles (username)`).order('created_at', { ascending: false });
      setQuestions(data || []);
      alert('Question posted!');
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
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 pt-32 space-y-16">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="h-3 w-3 text-teal-500" />
            <span>Professional Veterinary Guidance</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight text-black">
            Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Insight.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Connect with certified specialists to ensure your pet's wellbeing.
          </p>
        </motion.header>

        {/* Consultation Hub - Glassmorphic Form */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-white/70 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/40 shadow-2xl space-y-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-2xl shadow-inner">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Consult our Specialists</h2>
            </div>

            <form onSubmit={askQuestion} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Question</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., What are the best supplements for a Golden Retriever?"
                  className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition text-gray-800 placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Details & Context</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide more details about your pet's age, symptoms, or habits..."
                  className="w-full px-6 py-4 bg-white/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition text-gray-800 placeholder:text-gray-400 min-h-[120px]"
                  required
                />
              </div>
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="group px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all shadow-xl flex items-center space-x-3"
                >
                  <span>Submit Inquiry</span>
                  <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </form>
          </div>
        </motion.section>

        {/* Knowledge Grid - Bento Layout */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center space-x-3">
              <Lightbulb className="h-8 w-8 text-orange-500" />
              <span>Community Knowledge</span>
            </h2>
            <div className="hidden md:flex items-center space-x-2 text-sm font-medium text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Live Consultations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <AnimatePresence>
              {questions.map((q, idx) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`group relative bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 ${
                    idx % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          <User className="h-3 w-3" />
                          <span>{q.profiles?.username || 'Anonymous'}</span>
                          <span className="text-gray-300">•</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-teal-600 transition-colors">
                          {q.title}
                        </h3>
                      </div>
                      {q.is_answered && (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-100 shadow-sm">
                          <Award className="h-3 w-3" />
                          <span>Verified Expert</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed font-light">
                      {q.content}
                    </p>

                    {q.answer && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 p-6 bg-amber-50/50 rounded-2xl border-l-4 border-amber-500 space-y-3 relative overflow-hidden"
                      >
                        <div className="absolute top-[-10px] right-[-10px] opacity-10">
                          <ShieldCheck className="h-20 w-20 text-amber-500 rotate-12" />
                        </div>
                        <div className="flex items-center space-x-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Expert Response</span>
                        </div>
                        <p className="text-gray-800 italic font-medium leading-relaxed">
                          "{q.answer}"
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {questions.length === 0 && (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="text-5xl mb-4">🐾</div>
              <p className="text-gray-500 font-medium">No questions yet. Be the first to seek expert advice!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
