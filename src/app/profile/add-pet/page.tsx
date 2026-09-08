'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddPetPage() {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [breedId, setBreedId] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadBreeds() {
      const { data } = await supabase.from('breeds').select('*').order('name');
      if (data) setBreeds(data);
    }
    loadBreeds();
  }, [supabase]);

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to add a pet');
      return;
    }

    const { error } = await supabase.from('pets').insert({
      owner_id: user.id,
      breed_id: breedId,
      name,
      age: parseInt(age),
      gender,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/profile');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <header className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="text-gray-600 hover:text-gray-800">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Add New Pet</h1>
      </header>

      <form onSubmit={handleAddPet} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700">Pet Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Breed</label>
          <select
            value={breedId}
            onChange={(e) => setBreedId(e.target.value)}
            className="w-full px-3 py-2 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a breed</option>
            {breeds.map((b) => (
              <option key={b.id} value={b.id}>{b.name} ({b.species})</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Age (Years)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? 'Adding Pet...' : 'Save Pet'}
        </button>
      </form>
    </div>
  );
}
