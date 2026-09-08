'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadHospitals() {
      const { data } = await supabase.from('hospitals').select('*').order('name');
      if (data) setHospitals(data);
      setLoading(false);
    }
    loadHospitals();
  }, [supabase]);

  const filteredHospitals = hospitals.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.specialties && h.specialties.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading hospitals...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Health Services</h1>
        <p className="text-gray-600">Find the best care for your beloved pets</p>
        <div className="pt-2">
          <a href="/hospitals/map" className="text-blue-600 hover:underline font-medium text-sm">View on Map →</a>
        </div>
      </header>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by name, address, or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((h) => (
          <div key={h.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{h.name}</h3>
              <div className="flex items-center text-yellow-500 font-bold">
                ★ <span className="ml-1 text-gray-600">{h.rating || 'N/A'}</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{h.address}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {h.specialties && h.specialties.map((s: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-green-50 text-green-600 rounded border border-green-100">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-6">
              <button className="w-full py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No hospitals found matching your search.</p>
        </div>
      )}
    </div>
  );
}
