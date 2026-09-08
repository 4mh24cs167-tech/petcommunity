'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { createClient } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Star, Phone, Mail, ZoomIn, ZoomOut, Layers, X } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function HospitalMapView() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClient();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // Note: The API Key should be added to .env.local as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'
  });

  useEffect(() => {
    async function loadHospitals() {
      const { data } = await supabase.from('hospitals').select('*');
      if (data) setHospitals(data);
      setLoading(false);
    }
    loadHospitals();
  }, [supabase]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
    </div>
  );

  if (!isLoaded) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
        <p className="text-gray-500 font-medium">Loading Google Maps...</p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-gray-50">
      {/* Map Header Overlay */}
      <div className="absolute top-6 left-6 z-10 flex flex-col space-y-4 w-full max-w-md px-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-white/50 flex items-center space-x-2"
        >
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for specialist clinics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
            />
          </div>
        </motion.div>

        <div className="pointer-events-auto flex space-x-2">
          <button className="p-2 bg-white rounded-xl shadow-md hover:bg-gray-50 transition border border-gray-100">
            <Layers className="h-4 w-4 text-gray-600" />
          </button>
          <div className="flex bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <button className="p-2 hover:bg-gray-50 border-r border-gray-100 transition"><ZoomIn className="h-4 w-4 text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-50 transition"><ZoomOut className="h-4 w-4 text-gray-600" /></button>
          </div>
        </div>
      </div>

      {/* Google Map Integration */}
      <div className="relative flex-grow bg-slate-200 overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{ lat: 40.7128, lng: -74.0060 }} // Default center (NYC), would be dynamic in prod
          zoom={12}
          options={{
            disableDefaultUI: true,
            zoomControl: false,
            styles: [
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#616161" }]
              },
              {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e9e9e9" }]
              }
            ]
          }}
        >
          {hospitals.map((h) => (
            <Marker
              key={h.id}
              position={{
                lat: h.coordinates?.lat || 40.7 + Math.random()*0.1,
                lng: h.coordinates?.lng || -74.0 + Math.random()*0.1
              }}
              onClick={() => setSelectedHospital(h)}
            />
          ))}
        </GoogleMap>
      </div>

      {/* Right Side Detail Panel */}
      <AnimatePresence>
        {selectedHospital && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-20 border-l border-gray-100 overflow-y-auto"
          >
            <div className="relative h-48 bg-teal-600 p-8 flex items-end">
              <button
                onClick={() => setSelectedHospital(null)}
                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition backdrop-blur-md"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-white space-y-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Verified Clinic</span>
                </div>
                <h2 className="text-3xl font-bold">{selectedHospital.name}</h2>
                <div className="flex items-center space-x-1 text-yellow-300 font-bold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>{selectedHospital.rating || '4.5'}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><MapPin className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Address</p>
                    <p className="text-gray-700 font-medium">{selectedHospital.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Phone className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Phone</p>
                    <p className="text-gray-700 font-medium">{selectedHospital.contact_info?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400"><Mail className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase">Email</p>
                    <p className="text-gray-700 font-medium">{selectedHospital.contact_info?.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedHospital.specialties?.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full border border-teal-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex space-x-3">
                <button className="flex-grow py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100 flex items-center justify-center space-x-2">
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                </button>
                <button className="p-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
