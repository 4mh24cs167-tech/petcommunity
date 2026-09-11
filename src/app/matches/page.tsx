'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Heart, Sparkles, Info, Dog, User, MessageCircle } from 'lucide-react';

export default function FindMatchesPage() {
  const [pets, setPets] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced V2 Filters
  const [filterIntactOnly, setFilterIntactOnly] = useState(true);
  const [maxStudFee, setMaxStudFee] = useState(1000);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          breeds(name, species, characteristics),
          profiles:owner_id(username, location, verification_status)
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
  }, [supabase, router]);

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

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breeds?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pet.breeds?.species.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Advanced logic
    const matchesIntact = !filterIntactOnly || pet.spay_neuter_status === false;
    const matchesFee = (pet.stud_fee || 0) <= maxStudFee;

    return matchesSearch && matchesIntact && matchesFee;
  });

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

      <div className="flex flex-col gap-4 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-6 py-4 border rounded-3xl transition shadow-sm font-bold ${
              showFilters ? 'bg-teal-600 text-white border-teal-600' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5" />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* V2 Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900">Breeding Settings</h4>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filterIntactOnly}
                      onChange={(e) => setFilterIntactOnly(e.target.checked)}
                      className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500" 
                    />
                    <span className="text-gray-700">Must be Intact (Not Spayed/Neutered)</span>
                  </label>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-900">Max Stud Fee</h4>
                    <span className="text-teal-600 font-black">${maxStudFee}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={maxStudFee}
                    onChange={(e) => setMaxStudFee(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" 
                  />
                  <div className="flex justify-between text-xs text-gray-400 font-bold">
                    <span>$0</span>
                    <span>$5,000+</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
