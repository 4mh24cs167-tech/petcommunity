'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function MatchingDashboardPage() {
  const [sentRequests, setSentRequests] = useState<any[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadRequests() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's pets
      const { data: myPets } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', user.id);

      if (!myPets || myPets.length === 0) {
        setLoading(false);
        return;
      }

      const petIds = myPets.map(p => p.id);

      // Fetch requests sent by user's pets
      const { data: sent } = await supabase
        .from('cross_requests')
        .select(`
          *,
          target_pet_id (name, breeds(name))
        `)
        .in('requester_pet_id', petIds);

      // Fetch requests received by user's pets
      const { data: received } = await supabase
        .from('cross_requests')
        .select(`
          *,
          requester_pet_id (name, breeds(name))
        `)
        .in('target_pet_id', petIds);

      setSentRequests(sent || []);
      setReceivedRequests(received || []);
      setLoading(false);
    }
    loadRequests();
  }, [supabase]);

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    const { error } = await supabase
      .from('cross_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      alert(error.message);
    } else {
      // Refresh lists
      setReceivedRequests(prev =>
        prev.map(r => r.id === requestId ? { ...r, status } : r)
      );
      alert(`Request ${status}!`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading your dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Matching Dashboard</h1>
        <p className="text-gray-600">Manage your pet's breeding requests and connections</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Received Requests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
            📥 Requests Received
          </h2>
          <div className="space-y-3">
            {receivedRequests.length === 0 ? (
              <p className="text-gray-500 italic">No requests received yet.</p>
            ) : (
              receivedRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Request from:</p>
                      <p className="font-bold text-lg text-gray-800">
                        {req.requester_pet_id?.name} ({req.requester_pet_id?.breeds?.name})
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 italic">"{req.message}"</p>

                  {req.status === 'pending' && (
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => updateRequestStatus(req.id, 'accepted')}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateRequestStatus(req.id, 'rejected')}
                        className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Sent Requests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
            📤 Requests Sent
          </h2>
          <div className="space-y-3">
            {sentRequests.length === 0 ? (
              <p className="text-gray-500 italic">No requests sent yet.</p>
            ) : (
              sentRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">Request to:</p>
                      <p className="font-bold text-lg text-gray-800">
                        {req.target_pet_id?.name} ({req.target_pet_id?.breeds?.name})
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      req.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 italic">"{req.message}"</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
