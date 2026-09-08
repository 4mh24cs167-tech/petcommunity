'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, FileText, Trash2, ChevronLeft, Activity, Syringe, ClipboardList, X } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function PetHealthPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    record_type: 'vaccination',
    date: '',
    provider: '',
    notes: ''
  });

  useEffect(() => {
    async function loadHealthData() {
      const { data: petData } = await supabase
        .from('pets')
        .select('*, breeds(name)')
        .eq('id', id)
        .single();
      setPet(petData);

      const { data: recordsData } = await supabase
        .from('health_records')
        .select('*')
        .eq('pet_id', id)
        .order('date', { ascending: false });
      setRecords(recordsData || []);

      setLoading(false);
    }
    loadHealthData();
  }, [id, supabase]);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('health_records').insert({
      pet_id: id,
      ...newRecord
    });

    if (error) {
      alert(error.message);
    } else {
      const { data: updatedRecords } = await supabase
        .from('health_records')
        .select('*')
        .eq('pet_id', id)
        .order('date', { ascending: false });
      setRecords(updatedRecords || []);
      setShowAddModal(false);
      setNewRecord({ record_type: 'vaccination', date: '', provider: '', notes: '' });
    }
  };

  const deleteRecord = async (recordId: string) => {
    const { error } = await supabase.from('health_records').delete().eq('id', recordId);
    if (error) alert(error.message);
    else setRecords(records.filter(r => r.id !== recordId));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.push('/profile')}
          className="flex items-center space-x-2 text-gray-500 hover:text-teal-600 transition group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Profile</span>
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 font-black text-2xl shadow-sm">
              {pet?.name?.[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{pet?.name}'s Health Hub</h1>
              <p className="text-gray-500 font-medium">{pet?.breeds?.name || 'Pet'} Health Tracking</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={PET_SPRINGS.pounce}
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Record</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-teal-500" />
              <span>Medical History</span>
            </h3>

            <div className="space-y-4">
              <AnimatePresence>
                {records.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-4"
                  >
                    <Activity className="h-12 w-12 text-gray-200 mx-auto" />
                    <p className="text-gray-400 font-medium">No health records found. Start tracking your pet's health!</p>
                  </motion.div>
                ) : (
                  records.map((record, idx) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-xl ${
                            record.record_type === 'vaccination' ? 'bg-blue-50 text-blue-600' :
                            record.record_type === 'checkup' ? 'bg-teal-50 text-teal-600' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {record.record_type === 'vaccination' ? <Syringe className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 capitalize">{record.record_type}</h4>
                            <p className="text-xs text-gray-400 font-medium">{new Date(record.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 leading-relaxed">{record.notes}</p>
                        {record.provider && (
                          <div className="flex items-center space-x-1 text-xs text-gray-400 font-medium">
                            <FileText className="h-3 w-3" />
                            <span>Provider: {record.provider}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">Health Summary</h3>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center p-4 bg-teal-50 rounded-2xl">
                <span className="text-sm font-medium text-teal-700">Total Records</span>
                <span className="text-xl font-black text-teal-700">{records.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                <span className="text-sm font-medium text-blue-700">Vaccinations</span>
                <span className="text-xl font-black text-blue-700">{records.filter(r => r.record_type === 'vaccination').length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                <span className="text-sm font-medium text-purple-700">Checkups</span>
                <span className="text-xl font-black text-purple-700">{records.filter(r => r.record_type === 'checkup').length}</span>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl space-y-6 relative"
              >
                <button
                  onClick={() => setShowAddModal(false)}
                  className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Add Health Record</h3>
                  <p className="text-gray-500 text-sm">Keep your pet's medical history up to date.</p>
                </div>

                <form onSubmit={handleAddRecord} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Record Type</label>
                    <select
                      value={newRecord.record_type}
                      onChange={(e) => setNewRecord({ ...newRecord, record_type: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition"
                    >
                      <option value="vaccination">Vaccination</option>
                      <option value="checkup">General Checkup</option>
                      <option value="surgery">Surgery</option>
                      <option value="medication">Medication</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                    <input
                      type="date"
                      required
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Provider</label>
                    <input
                      type="text"
                      placeholder="Clinic or Vet name"
                      value={newRecord.provider}
                      onChange={(e) => setNewRecord({ ...newRecord, provider: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Notes</label>
                    <textarea
                      required
                      placeholder="What happened during the visit?"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 transition min-h-[100px]"
                    />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg"
                  >
                    Save Record
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
