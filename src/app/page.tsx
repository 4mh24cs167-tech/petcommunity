import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Hospital, Users, MessageSquare, Dog, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100/50 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-100/50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="h-3 w-3" />
            <span>The Future of Pet Networking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-gray-900 tracking-tight leading-[1.1]"
          >
            Where Pets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Find Their People.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            A premium ecosystem for pet owners. Discover compatible breeds,
            secure health resources, and a community that truly understands your pet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-6 pt-8"
          >
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-2xl hover:scale-105 flex items-center justify-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/breeds"
              className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm hover:scale-105 flex items-center justify-center"
            >
              Explore Breeds
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold text-gray-900">Everything your pet needs.</h2>
          <p className="text-gray-500">A comprehensive suite of tools designed for the modern pet parent.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          {/* Large Feature: Matching */}
          <div className="md:col-span-8 group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Smart Matchmaking</h3>
              <p className="text-gray-500 max-w-md text-lg leading-relaxed">
                Our algorithm analyzes temperament, energy, and health to find the most compatible partners for your pet.
              </p>
              <Link href="/matches" className="inline-flex items-center space-x-2 text-red-500 font-bold hover:underline pt-4">
                <span>Find a Match</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] text-red-100 group-hover:scale-110 transition-transform duration-700">
              <Heart className="h-64 w-64" />
            </div>
          </div>

          {/* Medium Feature: Vets */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <Hospital className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Health Network</h3>
              <p className="text-gray-500 text-base leading-relaxed">
                Verified veterinary clinics and hospitals at your fingertips.
              </p>
              <Link href="/hospitals" className="inline-flex items-center space-x-2 text-teal-500 font-bold hover:underline pt-4">
                <span>Find Vets</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="absolute right-[-20%] bottom-[-20%] text-teal-100 group-hover:scale-110 transition-transform duration-700">
              <Hospital className="h-40 w-40" />
            </div>
          </div>

          {/* Small Feature: Community */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">The Community</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Share stories, advice, and the joy of pet ownership.
              </p>
              <Link href="/community" className="inline-flex items-center space-x-2 text-blue-500 font-bold hover:underline pt-4">
                <span>Join Feed</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Small Feature: QA */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Vet Q&A</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Get expert advice from certified animal health professionals.
              </p>
              <Link href="/qa" className="inline-flex items-center space-x-2 text-orange-500 font-bold hover:underline pt-4">
                <span>Ask Expert</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Small Feature: Breeds */}
          <div className="md:col-span-4 group relative overflow-hidden bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Dog className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Breed Library</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Everything you need to know about various pet breeds.
              </p>
              <Link href="/breeds" className="inline-flex items-center space-x-2 text-purple-500 font-bold hover:underline pt-4">
                <span>Browse Breeds</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-900 py-24 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="flex justify-center mb-8">
            <ShieldCheck className="h-16 w-16 text-teal-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Your pet's safety is our priority.</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            We use secure verification and expert oversight to ensure that every match
            and every medical recommendation is safe and reliable.
          </p>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
      </section>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} PetCommunity. Designed for pets and their humans.
        </div>
      </footer>
    </div>
  );
}
