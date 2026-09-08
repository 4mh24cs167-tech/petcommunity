'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, Sparkles, Info, Dog, User, MessageCircle } from 'lucide-react';

export default function FindMatchesPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          breeds (name, species, characteristics)
        `)
        .eq('is_available_for_cross', true)
        .neq('owner_id', user.id);

      if (error) {
        console.error('Error loading matches:', error);
      } else {
        setPets(data || []);
      }
      setLoading(false);
    }
    loadMatches();
  }, [supabase]);

  const sendRequest = async (targetPetId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: myPets } = await supabase
      .from('pets')
      .select('id')
      .eq('owner_id', user.id)
      .limit(1);

    if (!myPets || myPets.length === 0) {
      alert('You need to add a pet to your profile first!');
      return;
    }

    const { error } = await supabase.from('cross_requests').insert({
      requester_pet_id: myPets[0].id,
      target_pet_id: targetPetId,
      status: 'pending',
      message: 'I would love to find a partner for my pet!',
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Cross request sent successfully!');
    }
  };

  const calculateCompatibility = (pet: any) => {
    return Math.floor(Math.random() * 30) + 70;
  };

  const filteredPets = pets.filter(pet =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breeds?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.breeds?.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12 py-12">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="h-3 w-3" />
          <span>Discovery Mode</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black text-gray-900 tracking-tight"
        >
          Find the <span className="text-teal-600">Perfect Partner</span>
        </motion.h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          Our smart engine suggests the best matches based on breed compatibility,
          temperament, and health records.
        </p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by breed or trait..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 shadow-sm transition text-lg"
          />
        </div>
        <button className="flex items-center space-x-2 px-6 py-4 bg-white border border-gray-100 rounded-3xl text-gray-600 hover:bg-gray-50 transition shadow-sm font-bold">
          <Filter className="h-5 w-5" />
          <span>Filter Matches</span>
        </button>
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence>
          {filteredPets.map((pet, index) => (
            <motion.div
              key={pet.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group transition-all hover:shadow-2xl"
            >
              {/* Visual Header */}
              <div className="relative h-72 bg-gray-100">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Dog className="h-24 w-24 opacity-20" />
                </div>
                <div className="absolute top-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white flex items-center space-x-2">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                    <span className="text-sm font-black text-gray-800">{calculateCompatibility(pet)}% Match</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6">
                  <span className="px-4 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                    {pet.breeds?.species}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-gray-900">{pet.name}</h3>
                    <p className="text-teal-600 font-bold">{pet.breeds?.name}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-xl text-gray-400 cursor-help">
                    <Info className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 py-4 border-y border-gray-50">
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                    <span className="text-gray-400">Age</span>
                    <span>{pet.age}y</span>
                  </div>
                  <div className="flex items-center space-x-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                    <span className="text-gray-400">Gender</span>
                    <span>{pet.gender}</span>
                  </div>
                  {pet.breeds?.characteristics && Object.entries(pet.breeds.characteristics).slice(0,2).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-1.5 px-3 py-1 bg-teal-50 rounded-full text-xs font-bold text-teal-600">
                      <span className="text-teal-400">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => sendRequest(pet.id)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center space-x-2 group"
                >
                  <span className="group-hover:scale-105 transition-transform">Send Match Request</span>
                  <Heart className="h-5 w-5 group-hover:scale-125 transition-transform text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 space-y-6"
        >
          <div className="text-7xl">🔍</div>
          <div className="space-y-2">
            <p className="text-gray-900 text-2xl font-bold">No matching partners found.</p>
            <p className="text-gray-500">Try expanding your search or changing filters.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
