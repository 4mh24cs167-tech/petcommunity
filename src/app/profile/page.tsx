'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Camera, Plus, Heart, Activity, Trash2, Edit3, ChevronRight, ShieldCheck, Zap, Award } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [pets, setPets] = useState<any[]>([]);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username || '');
        setFullName(profile.full_name || '');
        setLocation(profile.location || '');
      }

      const { data: userPets } = await supabase
        .from('pets')
        .select(`*, breeds(name)`)
        .eq('owner_id', user.id);

      if (userPets) setPets(userPets);
      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        full_name: fullName,
        location,
      });

    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 py-12">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">My <span className="text-teal-600">Profile</span></h1>
        <button
          onClick={async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              router.push('/login');
            } catch (error: any) {
              console.error('Sign out error:', error);
              alert(`Sign out failed: ${error.message}`);
            }
          }}
          className="px-6 py-2 text-sm font-bold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
        >
          Sign Out
        </button>
      </div >

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* User Identity Card - Wide Bento */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
          <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600" />
          <div className="px-8 pb-8 -mt-12 relative">
            <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden">
                  <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="h-16 w-16" />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-teal-600 hover:text-teal-700 transition">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center md:text-left mb-2">
                <h2 className="text-3xl font-black text-gray-900">{fullName || 'New Member'}</h2>
                <p className="text-gray-500 font-medium">@{username || 'username'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-teal-500" />
                <span className="text-sm text-gray-600 font-medium truncate">{location || 'No location set'}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-3">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-600 font-medium">{pets.length} Pets Registered</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-3">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 font-medium">Verified Owner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card - Small Bento */}
        <div className="md:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Edit3 className="h-5 w-5 text-teal-500" />
            <span>Quick Edit</span>
          </h3>
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg shadow-gray-200 text-sm">
              Update Profile
            </button>
          </form>
        </div>

        {/* Pets Section - Full Width Bento */}
        <div className="md:col-span-12 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-gray-900">My <span className="text-teal-600">Pet Family</span></h2>
            <button
              onClick={() => router.push('/profile/add-pet')}
              className="flex items-center space-x-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Pet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {pets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center space-y-4"
                >
                  <div className="text-5xl">🐾</div>
                  <p className="text-gray-500 font-medium">Your pet family is empty. Start by adding your first companion!</p>
                </motion.div>
              ) : (
                pets.map((pet, idx) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all space-y-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-2xl">
                          {pet.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">{pet.name}</h3>
                          <p className="text-sm text-gray-500">{pet.breeds?.name || 'Unknown Breed'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-2 text-gray-300 hover:text-teal-600 transition"><Edit3 className="h-4 w-4" /></button>
                        <button className="p-2 text-gray-300 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span className="text-gray-400 uppercase font-bold">Age</span>
                        <span className="font-bold text-gray-800">{pet.age}y</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span className="text-gray-400 uppercase font-bold">Gender</span>
                        <span className="font-bold text-gray-800">{pet.gender}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => router.push(`/profile/pet/${pet.id}/health`)}
                        className="flex items-center space-x-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition group"
                      >
                        <Activity className="h-3 w-3" />
                        <span className="group-hover:underline">Health Hub</span>
                      </button>
                      <Link
                        href={`/profile/pet/${pet.id}`}
                        className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center space-x-1 transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
