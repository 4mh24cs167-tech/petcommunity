'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Activity, Award, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PetProfilePage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPet() {
      const { data, error } = await supabase
        .from('pets')
        .select(`
          *,
          breeds (name, species, description, characteristics),
          profiles (username, full_name)
        `)
        .eq('id', petId)
        .single();

      if (data) setPet(data);
      setLoading(false);
    }
    loadPet();
  }, [petId, supabase]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;
  if (!pet) return <div className="flex items-center justify-center min-h-screen">Pet not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition font-medium"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to Profile</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Visual Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
            <div className="h-80 bg-gray-100 flex items-center justify-center relative">
              <div className="text-6xl opacity-20 group-hover:scale-110 transition-transform">🐕</div>
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-md">
                  {pet.breeds?.species}
                </span>
              </div>
            </div>
            <div className="p-6 text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-500 font-medium">{pet.breeds?.name}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-500" />
              <span>Quick Info</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Age</span>
                <span className="font-medium text-gray-700">{pet.age} years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Gender</span>
                <span className="font-medium text-gray-700">{pet.gender}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Owner</span>
                <span className="font-medium text-gray-700">{pet.profiles?.username}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Breed Characteristics</h2>
              <Award className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-gray-600 leading-relaxed">
              {pet.breeds?.description || 'No detailed description available for this breed.'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {pet.breeds?.characteristics && Object.entries(pet.breeds.characteristics).map(([key, value]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400">{key}</p>
                  <p className="text-sm font-semibold text-gray-700">{String(value)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href={`/profile/pet/${petId}/health`}
              className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-100 transition">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Health Records</h4>
                  <p className="text-xs text-gray-500">View medical history</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 transition" />
            </Link>

            <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-600 group-hover:bg-red-100 transition">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Breeding</h4>
                  <p className="text-xs text-gray-500">Compatibility status</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                pet.is_available_for_cross ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {pet.is_available_for_cross ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
