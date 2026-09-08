'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadBreeds() {
      const { data } = await supabase.from('breeds').select('*').order('name');
      if (data) setBreeds(data);
      setLoading(false);
    }
    loadBreeds();
  }, [supabase]);

  const filteredBreeds = breeds.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading breeds...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Breed Directory</h1>
        <p className="text-gray-600">Explore and find the perfect breed for your pet</p>
      </header>

      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search by breed or species..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-full outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBreeds.map((breed) => (
          <div key={breed.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-800">{breed.name}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                {breed.species}
              </span>
            </div>
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {breed.description || 'No description available for this breed.'}
            </p>
            {breed.characteristics && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Object.entries(breed.characteristics).map(([key, value]) => (
                  <span key={key} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-500 rounded border border-gray-100">
                    <span className="font-semibold uppercase">{key}:</span> {String(value)}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredBreeds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No breeds found matching your search.</p>
        </div>
      )}
    </div>
  );
}
