'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Camera, Plus, Heart, Activity, Trash2, Edit3, ChevronRight, ShieldCheck, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import PetAnimation from '@/components/PetAnimation';
import { PET_SPRINGS } from '@/lib/motion-variants';
import { checkGamification } from '@/app/actions/gamification';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  const [pets, setPets] = useState<any[]>([]);
  const [petPoints, setPetPoints] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUsername(profile.username || '');
        setFullName(profile.full_name || '');
        setLocation(profile.location || '');
        setVerificationStatus(profile.verification_status || 'unverified');
        setPetPoints(profile.pet_points || 0);
        setBadges(profile.badges || []);

        if (profile.verification_status === 'unverified') {
          router.push('/auth/verify');
          return;
        }
      }

      const { data: userPets } = await supabase
        .from('pets')
        .select('*, breeds(name)')
        .eq('owner_id', user.id);

      if (userPets) setPets(userPets);

      // Check Gamification in background
      try {
        const result = await checkGamification(user.id);
        if (result.success && (result.newPoints > 0 || result.newBadges.length > 0)) {
          setPetPoints(prev => prev + result.newPoints);
          setBadges(prev => [...prev, ...result.newBadges]);
          if (result.newPoints > 0) alert(`You earned ${result.newPoints} Pet Points!`);
        }
      } catch (err) {
        console.error('Failed to run gamification checks:', err);
      }

      setLoading(false);
    }
    loadProfile();
  }, [router, supabase]);

  const handleVerifyIdentity = () => {
    setShowUpload(true);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const fileInput = (e.currentTarget as HTMLFormElement).elements.namedItem('id_doc') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      alert('Please select a document first');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(true);
    try {
      const filePath = `verifications/\${user.id}/\${Date.now()}_\${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('verifications')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('verifications')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          verification_status: 'pending',
          id_document_url: publicUrl,
          verified_at: null
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setVerificationStatus('pending');
      setShowUpload(false);
      alert('Identity document submitted! Our team will verify it within 24-48 hours.');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        full_name: fullName,
        location,
      });

    if (error) alert(error.message);
    else alert('Profile updated!');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div></div>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-6 space-y-10 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">My <span className="text-teal-600">Profile</span></h1>
            <p className="text-gray-500 font-medium mt-1">Manage your pet family and details</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-sm border border-amber-200">
              <div className="bg-amber-400 p-2 rounded-full text-white">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-amber-700 font-bold uppercase tracking-wider">Pet Points</p>
                <p className="text-xl font-black text-amber-900 leading-none">{petPoints}</p>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              transition={PET_SPRINGS.pounce}
              onClick={async () => {
                try {
                  const { error } = await supabase.auth.signOut();
                  if (error) throw error;
                  router.push('/login');
                } catch (error: any) {
                  console.error('Sign out error:', error);
                }
              }}
              className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm"
            >
              Sign Out
            </motion.button>
          </div>
        </div>

        {/* Badges Section */}
        {badges.length > 0 && (
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 flex-wrap">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mr-2">Earned Badges:</h3>
            {badges.map(badge => (
              <span key={badge} className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-md">
                🏆 {badge}
              </span>
            ))}
          </div>
        )}

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* User Identity Card - Wide Bento */}
          <PetAnimation pattern="nudge" className="md:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600" />
            <div className="px-8 pb-8 -mt-12 relative">
              <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-2xl overflow-hidden">
                    <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                      <User className="h-16 w-16" />
                    </div>
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-teal-600 hover:text-teal-700 transition">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-center md:text-left mb-2">
                  <h2 className="text-3xl font-black text-gray-900">{fullName || 'New Member'}</h2>
                  <p className="text-gray-500 font-medium">@{username || 'username'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-teal-500" />
                  <span className="text-sm text-gray-600 font-medium truncate">{location || 'No location set'}</span >
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-600 font-medium">{pets.length} Pets Registered</span >
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className={`h-5 w-5 \${verificationStatus === 'verified' ? 'text-green-500' : verificationStatus === 'pending' ? 'text-amber-500' : 'text-blue-500'}`} />
                    <span className="text-sm text-gray-600 font-medium capitalize">{verificationStatus} Owner</span >
                  </div>
                  {verificationStatus === 'unverified' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={PET_SPRINGS.pounce}
                      onClick={handleVerifyIdentity}
                      className="px-3 py-1 bg-teal-600 text-white text-[10px] font-bold rounded-full hover:bg-teal-700 transition"
                    >
                      Verify Now
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </PetAnimation>

          {/* Settings Card - Small Bento */}
          <PetAnimation pattern="nudge" className="md:col-span-4 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-teal-500" />
              <span >Quick Edit</span >
            </h3>
            <form onSubmit={updateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 transition text-sm"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.92 }}
                transition={PET_SPRINGS.pounce}
                type="submit"
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg shadow-gray-200 text-sm"
              >
                Update Profile
              </motion.button>
            </form>
          </PetAnimation>

          {/* Pets Section - Full Width Bento */}
          <div className="md:col-span-12 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">My <span className="text-teal-600">Pet Family</span></h2>
              <motion.button
                whileTap={{ scale: 0.92 }}
                transition={PET_SPRINGS.pounce}
                onClick={() => router.push('/profile/add-pet')}
                className="flex items-center space-x-2 px-5 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
              >
                <Plus className="h-4 w-4" />
                <span >Add New Pet</span >
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {pets.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center space-y-4"
                  >
                    <div className="text-5xl">🐾</div>
                    <p className="text-gray-500 font-medium">Your pet family is empty. Start by adding your first companion!</p>
                  </motion.div >
                ) : (
                  pets.map((pet, idx) => (
                    <PetAnimation
                      key={pet.id}
                      pattern="pounce"
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all space-y-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 font-black text-2xl">
                            {pet.name.charAt(0).toUpperCase()}
                          </div>
                          <div >
                            <h3 className="font-bold text-xl text-gray-900">{pet.name}</h3>
                            <p className="text-sm text-gray-500">{pet.breeds?.name || 'Unknown Breed'}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-2 text-gray-300 hover:text-teal-600 transition"><Edit3 className="h-4 w-4" /></button>
                          <button className="p-2 text-gray-300 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span className="text-gray-400 uppercase font-bold">Age</span >
                          <span className="font-bold text-gray-800">{pet.age}y</span >
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span className="text-gray-400 uppercase font-bold">Gender</span >
                          <span className="font-bold text-gray-800">{pet.gender}</span >
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => router.push(`/profile/pet/\${pet.id}/health`)}
                          className="flex items-center space-x-1 text-xs font-bold text-teal-600 hover:text-teal-700 transition group"
                        >
                          <Activity className="h-3 w-3" />
                          <span className="group-hover:underline">Health Hub</span >
                        </button>
                        <Link
                          href={`/profile/pet/\${pet.id}`}
                          className="text-xs font-bold text-gray-400 hover:text-gray-600 flex items-center space-x-1 transition"
                        >
                          <span >Details</span >
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </PetAnimation>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

    <AnimatePresence>
      {showUpload && (
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
              onClick={() => setShowUpload(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition"
            >
              <Plus className="h-6 w-6 rotate-45" />
            </button>

            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Verify Identity</h3>
              <p className="text-gray-500 text-sm">Upload a valid government ID to earn your verified badge.</p>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="relative group">
                <input
                  type="file"
                  name="id_doc"
                  accept="image/*,.pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center group-hover:border-teal-500 transition-all bg-gray-50">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Click to upload document</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or PDF (max 5MB)</p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={uploading}
                className={`w-full py-4 rounded-2xl font-bold text-white transition shadow-lg \${uploading ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                {uploading ? 'Uploading...' : 'Submit for Verification'}
              </motion.button>
            </form>
          </motion.div >
        </motion.div >
      )}
    </AnimatePresence>
    </>
  );
}
