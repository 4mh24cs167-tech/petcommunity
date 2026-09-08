'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function BookAppointmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function initBooking() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load hospital info
      const { data: hospitalData } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', id)
        .single();
      setHospital(hospitalData);

      // Load user's pets
      const { data: userPets } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id);
      setPets(userPets || []);

      setLoading(false);
    }
    initBooking();
  }, [id, supabase, router]);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !date || !time) {
      alert('Please fill in all required fields');
      return;
    }

    setBookingStatus('booking');
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('appointments').insert({
      hospital_id: id,
      user_id: user?.id,
      pet_id: selectedPet,
      appointment_date: new Date(`${date}T${time}`).toISOString(),
      reason,
      status: 'pending'
    });

    if (error) {
      console.error('Booking error:', error);
      setBookingStatus('error');
    } else {
      setBookingStatus('success');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  if (bookingStatus === 'success') return (
    <div className="min-h-screen bg-[#FCFAF8] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[40px] p-12 text-center shadow-2xl border border-gray-100 space-y-6"
      >
        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-500">Your appointment at {hospital?.name} has been requested. The clinic will contact you shortly.</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/profile')}
          className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg"
        >
          Back to Profile
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-teal-600 transition mb-8 group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Hospital</span>
        </button>

        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-teal-600 p-8 text-white">
            <h1 className="text-3xl font-black tracking-tight">Book Appointment</h1>
            <p className="text-teal-100 font-medium opacity-90">{hospital?.name}</p>
          </div>

          <form onSubmit={handleBookAppointment} className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
                <User className="h-3 w-3" />
                <span>Select Pet</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pets.map((pet) => (
                  <motion.button
                    key={pet.id}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPet(pet.id)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedPet === pet.id
                        ? 'border-teal-600 bg-teal-50 text-teal-700 shadow-sm'
                        : 'border-gray-100 hover:border-teal-200 text-gray-600'
                    }`}
                  >
                    <p className="font-bold truncate">{pet.name}</p>
                    <p className="text-[10px] opacity-70">{pet.breeds?.name || 'Pet'}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
                  <Calendar className="h-3 w-3" />
                  <span>Appointment Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
                  <Clock className="h-3 w-3" />
                  <span>Preferred Time</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertCircle className="h-3 w-3" />
                <span>Reason for Visit</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Tell us more about your pet's needs..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition min-h-[100px]"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={PET_SPRINGS.pounce}
              disabled={bookingStatus === 'booking'}
              className={`w-full py-5 rounded-3xl font-black text-white text-lg shadow-xl transition-all ${
                bookingStatus === 'booking' ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {bookingStatus === 'booking' ? 'Processing...' : 'Confirm Booking'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
}
