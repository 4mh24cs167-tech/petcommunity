'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Star, ShieldCheck, ChevronLeft, Calendar } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function HospitalDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHospital() {
      const { data } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();
      setHospital(data);
      setLoading(false);
    }
    loadHospital();
  }, [id, supabase]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  if (!hospital) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <p className="text-gray-500">Hospital not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-teal-600 transition group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Search</span>
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="h-64 bg-gradient-to-br from-teal-500 to-blue-600 relative">
            <div className="absolute -bottom-12 left-12">
              <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <ShieldCheck className="h-16 w-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-12 pb-12 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{hospital.name}</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-amber-400">
                    {[...Array(Math.floor(hospital.rating || 5))].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 font-bold">{hospital.rating || 5}.0 Rating</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={PET_SPRINGS.pounce}
                onClick={() => router.push(`/hospitals/book/${id}`)}
                className="px-8 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all flex items-center space-x-2"
              >
                <Calendar className="h-5 w-5" />
                <span>Book Appointment</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-teal-600">
                  <MapPin className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Location</span>
                </div>
                <p className="text-gray-700 font-medium">{hospital.address}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-teal-600">
                  <Phone className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Contact</span>
                </div>
                <p className="text-gray-700 font-medium">{hospital.contact_info?.phone || 'Contact available on request'}</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-3xl space-y-3">
                <div className="flex items-center space-x-3 text-teal-600">
                  <Clock className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Hours</span>
                </div>
                <p className="text-gray-700 font-medium">{hospital.contact_info?.hours || '9 AM - 6 PM'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-gray-900">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {hospital.specialties?.map((s: string) => (
                  <span key={s} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
