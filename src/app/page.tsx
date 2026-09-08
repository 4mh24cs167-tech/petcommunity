'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Hospital, Users, MessageSquare, Dog, ShieldCheck, Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-100/40 to-transparent blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-blue-100/40 to-transparent blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-xs font-medium tracking-tight"
          >
            <Sparkles className="h-3 w-3 text-teal-500" />
            <span>Next-Generation Pet Community</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-medium tracking-tighter leading-[0.9] text-black"
          >
            Pet<span className="text-gray-400">Community</span><br />
            <span className="italic font-serif">Redefined.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light"
          >
            An ultra-modern ecosystem for the discerning pet owner.
            Merging intelligent matching with a world-class healthcare network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12"
          >
            <Link
              href="/signup"
              className="group relative px-10 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 flex items-center space-x-2 overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/breeds"
              className="px-10 py-4 bg-transparent text-black border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition-all hover:scale-105"
            >
              Explore Breeds
            </Link>
          </motion.div>
        </div>
      </section>

      {/* The "Capability" Grid (Astra Style) */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Feature 1: High Impact */}
          <div className="md:col-span-8 group relative overflow-hidden bg-[#F9F9F9] rounded-[40px] p-12 border border-gray-100 transition-all hover:border-gray-300">
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="text-4xl font-medium tracking-tight text-black">Intelligent Matching</h3>
              <p className="text-gray-500 text-lg max-w-md leading-relaxed">
                Beyond simple filters. We use deep breed characteristics and temperament data to connect pets that truly belong together.
              </p>
              <Link href="/matches" className="inline-flex items-center space-x-2 text-black font-bold hover:underline pt-4">
                <span>Start Discovering</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute right-[-5%] bottom-[-5%] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <Heart className="h-80 w-80" />
            </div>
          </div>

          {/* Feature 2: Minimalist */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-[40px] border border-gray-100 p-12 transition-all hover:border-gray-300">
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-teal-500 text-white rounded-full flex items-center justify-center">
                <Hospital className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-black">Care Network</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Instant access to verified specialty clinics and top-tier veterinary care.
              </p>
              <Link href="/hospitals" className="inline-flex items-center space-x-2 text-teal-600 font-bold hover:underline pt-4">
                <span>Find Care</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Feature 3: Minimalist */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-[40px] border border-gray-100 p-12 transition-all hover:border-gray-300">
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-black">Community</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                A curated space for storytelling and expert advice.
              </p>
              <Link href="/community" className="inline-flex items-center space-x-2 text-blue-600 font-bold hover:underline pt-4">
                <span>Enter Feed</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Feature 4: Minimalist */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-[40px] border border-gray-100 p-12 transition-all hover:border-gray-300">
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-black">Expert QA</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Direct lines to certified animal health professionals.
              </p>
              <Link href="/qa" className="inline-flex items-center space-x-2 text-orange-600 font-bold hover:underline pt-4">
                <span>Ask Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Feature 5: Minimalist */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-[40px] border border-gray-100 p-12 transition-all hover:border-gray-300">
            <div className="relative z-10 space-y-6">
              <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">
                <Dog className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-medium tracking-tight text-black">Breed Lab</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Comprehensive data on every breed, tailored for owners.
              </p>
              <Link href="/breeds" className="inline-flex items-center space-x-2 text-purple-600 font-bold hover:underline pt-4">
                <span>Explore</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Closing Section */}
      <section className="bg-black py-32 text-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-xl border border-white/20">
              <ShieldCheck className="h-12 w-12 text-teal-400" />
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-medium tracking-tighter leading-tight">
            Secure. Verified. <br />
            <span className="text-gray-500">Built for the bond.</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
            We combine rigorous verification with a love for animals to create the safest networking environment in the pet world.
          </p>
        </div>
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />
      </section>

      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-2">
            <Dog className="h-6 w-6 text-black" />
            <span className="text-lg font-bold tracking-tight">PetCommunity</span>
          </div>
          <div className="text-gray-400 text-xs font-medium">
            © {new Date().getFullYear()} PetCommunity. Minimalist Design for Maximum Care.
          </div>
        </div>
      </footer>
    </div>
  );
}
