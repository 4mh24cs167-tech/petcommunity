'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Plus, Trash2, Calendar, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';

export default function PetHealthPage() {
  const params = useParams();
  const router = useRouter();
  const petId = params.id as string;
  const [pet, setPet] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [newRecord, setNewRecord] = useState({ title: '', date: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadHealthData() {
      const { data: petData } = await supabase
        .from('pets')
        .select('*, breeds(name)')
        .eq('id', petId)
        .single();

      if (petData) {
        setPet(petData);
        setRecords(petData.health_records || []);
      }
      setLoading(false);
    }
    loadHealthData();
  }, [petId, supabase]);

  const addRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.title || !newRecord.date) return;

    const updatedRecords = [...records, { ...newRecord, id: Date.now() }];

    const { error } = await supabase
      .from('pets')
      .update({ health_records: updatedRecords })
      .eq('id', petId);

    if (error) {
      alert(error.message);
    } else {
      setRecords(updatedRecords);
      setNewRecord({ title: '', date: '', notes: '' });
    }
  };

  const deleteRecord = async (id: number) => {
    const updatedRecords = records.filter(r => r.id !== id);
    const { error } = await supabase
      .from('pets')
      .update({ health_records: updatedRecords })
      .eq('id', petId);

    if (error) {
      alert(error.message);
    } else {
      setRecords(updatedRecords);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div></div>;
  if (!pet) return <div className="flex items-center justify-center min-h-screen">Pet not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10 py-12">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <button onClick={() => router.back()} className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition font-medium mb-4">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </button>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">{pet.name}'s Health Hub</h1>
            <div className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Up to Date</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <span>Health Summary</span>
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl flex justify-between items-center">
                <span className="text-sm text-blue-600 font-medium">Total Records</span>
                <span className="text-xl font-bold text-blue-800">{records.length}</span>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl flex justify-between items-center">
                <span className="text-sm text-green-600 font-medium">Vaccinations</span>
                <span className="text-xl font-bold text-green-800">
                  {records.filter(r => r.title.toLowerCase().includes('vaccine')).length}
                </span>
              </div>
              <div className="p-4 bg-yellow-50 rounded-2xl flex justify-between items-center">
                <span className="text-sm text-yellow-600 font-medium">Pending Tasks</span>
                <span className="text-xl font-bold text-yellow-800">0</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white space-y-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold">Health Tip</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Regular check-ups every 6 months are recommended for {pet.breeds?.name} to ensure optimal health.
              </p>
            </div>
            <div className="absolute -bottom-4 -right-4 text-blue-400 opacity-20">
              <Activity className="h-24 w-24" />
            </div>
          </div>
        </div>

        {/* Right Column: Records Management */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Log New Health Event</h2>
            <form onSubmit={addRecord} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Record Title</label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                  placeholder="e.g. Annual Rabies Vaccination"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Date</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase">Notes</label>
                <input
                  type="text"
                  value={newRecord.notes}
                  onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <button type="submit" className="md:col-span-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                Save to Medical History
              </button>
            </form>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Medical History</h2>
            <div className="space-y-4">
              <AnimatePresence>
                {records.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 italic"
                  >
                    No health records found. Start logging today!
                  </motion.div>
                ) : (
                  records.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((rec: any) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-blue-200 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{rec.title}</h4>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{rec.date}</span>
                            <span>•</span>
                            <span>{rec.notes || 'No notes'}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRecord(rec.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
