'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, Plus, Heart } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function MarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadMarketplace() {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) console.error('Error loading marketplace:', error);
      else setItems(data || []);
      setLoading(false);
    }
    loadMarketplace();
  }, [supabase]);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', 'food', 'toys', 'healthcare', 'accessories'];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#FCFAF8]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Pet <span className="text-teal-600">Marketplace</span></h1>
          <p className="text-gray-500 font-medium">Find the best gear for your furry friends</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => alert('Listing feature coming soon!')}
          className="px-6 py-3 bg-black text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>List an Item</span>
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for toys, food, accessories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl outline-none focus:ring-2 focus:ring-teal-500 transition shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-4 rounded-3xl font-bold text-sm transition-all capitalize whitespace-nowrap ${
                filter === cat
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-100'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 space-y-4"
            >
              <ShoppingBag className="h-16 w-16 text-gray-200 mx-auto" />
              <p className="text-gray-400 font-medium">No items found matching your search.</p>
            </motion.div>
          ) : (
            filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/marketplace/item/${item.id}`)}
                className="bg-white rounded-[32px] border border-gray-100 overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ShoppingBag className="h-12 w-12" />
                    </div>
                  )}
                  <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition shadow-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors truncate">{item.item_name}</h3>
                    <span className="text-lg font-black text-gray-900">${item.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">New</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
