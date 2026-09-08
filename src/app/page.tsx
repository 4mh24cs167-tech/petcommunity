'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Hospital, Users, MessageSquare, Dog, ShieldCheck, Sparkles, ArrowRight, Cat, Bird } from 'lucide-react';

const FloatingPet = ({ emoji, delay, x, y }: { emoji: string, delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      y: [0, -20, 0],
      x: [0, 10, 0],
    }}
    transition={{
      duration: 5 + Math.random() * 2,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className="absolute text-6xl pointer-events-none z-0"
    style={{ left: x, top: y }}
  >
    {emoji}
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-100/40 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-orange-100/40 to-transparent blur-3xl" />

        {/* Floating Pets */}
        <FloatingPet emoji="🐕" delay={0} x="10%" y="15%" />
        <FloatingPet emoji="🐈" delay={1} x="85%" y="10%" />
        <FloatingPet emoji="🦜" delay={2} x="15%" y="60%" />
        <FloatingPet emoji="🐇" delay={3} x="80%" y, "70%" />
        <FloatingPet emoji="🐕‍🦺" delay={4} x="45%" y="30%" />
        <FloatingPet emoji="🐈‍⬛" delay={5} x="60%" y="80%" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium tracking-tight shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-teal-500" />
            <span className="uppercase font-bold">Pet Community 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter leading-[0.9]"
          >
            The Pet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600">Universe.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Connecting hearts, paws, and scales. An ultra-modern hub for matching,
            healing, and sharing the joy of pet ownership.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12"
          >
            <Link
              href="/signup"
              className="group relative px-10 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 flex items-center space-x-2 shadow-2xl"
            >
              <span>Join the Pack</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/breeds"
              className="px-10 py-4 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all hover:scale-105"
            >
              Breed Directory
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The "Graphical" Feature Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Large Feature: Matching - Now with " laura-style" glassmorphism */}
          <div className="md:col-span-8 group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[48px] p-12 border border-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-red-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-red-200">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tight">Smart Matching</h3>
              <p className="text-gray-600 text-lg max-w-md leading-relaxed">
                Our AI-driven compatibility engine connects pets based on temperament,
                energy levels, and genetic health.
              </p>
              <Link href="/matches" className="inline-flex items-center space-x-2 text-red-500 font-bold hover:text-red-600 pt-4 group">
                <span>Find Your Match</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute right-[-5%] bottom-[-5%] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Heart className="h-96 w-96" />
            </div>
          </div>

          {/* Medium Feature: Hospitals */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[48px] p-12 border border-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-teal-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-teal-200">
                <Hospital className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Health Hub</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Curated network of verified specialty clinics and emergency care.
              </p>
              <Link href="/hospitals" className="inline-flex items-center space-x-2 text-teal-600 font-bold hover:text-teal-700 pt-4">
                <span>Locate Vets</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Small Feature: Community */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[48px] p-12 border border-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-blue-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-blue-200">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">The Pack</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A shared space for pet owners to exchange wisdom and stories.
              </p>
              <Link href="/community" className="inline-flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700 pt-4">
                <span>Join Feed</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Small Feature: QA */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[48px] p-12 border border-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-orange-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-orange-200">
                <MessageSquare className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Expert Advice</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Direct access to certified animal health professionals.
              </p>
              <Link href="/qa" className="inline-flex items-center space-x-2 text-orange-600 font-bold hover:text-orange-700 pt-4">
                <span>Ask Expert</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Small Feature: Breeds */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white/60 backdrop-blur-md rounded-[48px] p-12 border border-white shadow-xl hover:shadow-2xl transition-all">
            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 bg-purple-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Dog className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Breed Lab</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Explore a comprehensive encyclopedia of pet breeds and traits.
              </p>
              <Link href="/breeds" className="inline-flex items-center space-x-2 text-purple-600 font-bold hover:text-purple-700 pt-4">
                <span>Browse Lab</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The "Ultra-Premium" Trust Section */}
      <section className="bg-black py-32 text-white overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-16 relative z-10">
          <div className="flex justify-center">
            <div className="p-6 bg-white/10 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl">
              <ShieldCheck className="h-20 w-20 text-teal-400" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            Security. Integrity. <br />
            <span className="text-gray-500">Uncompromising Care.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            We've built the most secure infrastructure for pet data, ensuring that every interaction is verified and every medical record is encrypted.
          </p>
        </div>
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/20 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      </section>

      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <div className="bg-black text-white p-1 rounded-lg">
              <Dog className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tighter">PetCommunity</span>
          </div>
          <div className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} PetCommunity. A New Standard in Pet Care.
          </div>
        </div>
      </footer>
    </div>
  );
}
