'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Activity, Shield, Home, Dna, Info, X, ChevronRight } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadBreeds() {
      const { data } = await supabase.from('breeds').select('*').order('name');
      if (data) setBreeds(data);
      setLoading(false);
    }
    loadBreeds();
  }, [supabase]);

  const handleQuizSubmit = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizCompleted(false);
  };

  const filteredBreeds = breeds.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.species.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If quiz is completed, apply quiz filters based on characteristics
    if (quizCompleted && b.characteristics) {
      if (quizAnswers.energy && b.characteristics.energy !== quizAnswers.energy) return false;
      if (quizAnswers.size && b.characteristics.size !== quizAnswers.size) return false;
    }

    return matchesSearch;
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Dna className="h-4 w-4" />
            <span>The Breed Lab</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter"
          >
            Canine & Feline <span className="text-teal-600">Genetics</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Explore the encyclopedia of pedigrees, traits, and temperaments. 
            Discover the perfect companion for your lifestyle.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-4 rounded-[32px] shadow-sm border border-gray-100">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Golden Retriever, Siamese..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-transparent outline-none focus:ring-0 text-lg font-medium text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="w-full md:w-auto flex items-center space-x-3 pr-2">
            {quizCompleted && (
              <button onClick={resetQuiz} className="text-xs font-bold text-gray-400 hover:text-gray-600 px-4">
                Clear Quiz
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuiz(true)}
              className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-teal-600 text-white rounded-3xl font-bold shadow-lg hover:bg-teal-700 transition"
            >
              <Sparkles className="h-5 w-5" />
              <span>{quizCompleted ? 'Quiz Applied' : 'Take Match Quiz'}</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredBreeds.map((breed, idx) => (
              <motion.div
                key={breed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-50 to-transparent rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">{breed.name}</h3>
                      <p className="text-teal-600 font-bold tracking-wide mt-1 uppercase text-xs">{breed.species}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:text-teal-500 group-hover:bg-teal-50 transition-colors">
                      <Info className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="text-gray-500 font-medium leading-relaxed line-clamp-3">
                    {breed.description || 'A wonderful companion with unique traits and a loyal heart. Perfect for the right family.'}
                  </p>

                  {breed.characteristics && (
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                      {Object.entries(breed.characteristics).slice(0,4).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 px-4 py-3 rounded-2xl flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{key}</span>
                          <span className="text-sm font-black text-gray-800 capitalize">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBreeds.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl font-bold text-gray-900">No breeds found</p>
            <p className="text-gray-500 mt-2">Try adjusting your quiz answers or search term.</p>
          </div>
        )}
      </div>

      {/* Quiz Modal */}
      <AnimatePresence>
        {showQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[40px] p-8 md:p-12 max-w-xl w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowQuiz(false)}
                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">Compatibility Quiz</h2>
                  <p className="text-gray-500 mt-2">Let's find the breed that matches your lifestyle.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">What is your energy level?</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['low', 'medium', 'high'].map(level => (
                        <button
                          key={level}
                          onClick={() => setQuizAnswers({...quizAnswers, energy: level})}
                          className={py-3 rounded-2xl font-bold text-sm transition border-2 \}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">What size pet can your home accommodate?</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => setQuizAnswers({...quizAnswers, size: size})}
                          className={py-3 rounded-2xl font-bold text-sm transition border-2 \}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleQuizSubmit}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black transition flex items-center justify-center space-x-2"
                >
                  <span>Find My Match</span>
                  <ChevronRight className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
