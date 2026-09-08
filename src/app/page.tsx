'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Hospital, Users, MessageSquare, Dog, ShieldCheck, Sparkles, ArrowRight, Cat, Bird } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import PetAnimation from '@/components/PetAnimation';
import { PET_SPRINGS } from '@/lib/motion-variants';

const FloatingPet = ({ emoji, delay, x, y, duration = 6 }: { emoji: string, delay: number, x: string, y: string, duration?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.1, 0.4, 0.1],
      scale: [1, 1.1, 1],
      y: [0, -30, 0],
      x: [0, 20, 0],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut"
    }}
    className="absolute text-7xl pointer-events-none z-0 filter blur-[1px] opacity-50"
    style={{ left: x, top: y }}
  >
    {emoji}
  </motion.div>
);

const AmbientPaw = ({ delay, x, y }: { delay: number, x: string, y: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 0.1, 0],
      y: [0, -100],
      x: [0, 20, -20, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay,
      ease: "linear"
    }}
    className="absolute text-4xl pointer-events-none z-0 text-teal-300/30"
    style={{ left: x, top: y }}
  >
    🐾
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuth(!!user);
    }
    checkUser();
  }, [supabase]);

  const handleProtectedNavigation = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (!isAuth) {
      router.push('/login');
    } else {
      router.push(href);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-black selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/30 blur-[120px]" />

        <FloatingPet emoji="🐕" delay={0} x="5%" y="15%" />
        <FloatingPet emoji="🐈" delay={1} x="85%" y="10%" duration={8} />
        <FloatingPet emoji="🦜" delay={2} x="10%" y="65%" duration={7} />
        <FloatingPet emoji="🐇" delay={3} x="80%" y="75%" duration={9} />
        <FloatingPet emoji="🐕‍🦺" delay={4} x="40%" y="20%" duration={6} />
        <FloatingPet emoji="🐈‍⬛" delay={5} x="65%" y="85%" duration={10} />

        <AmbientPaw delay={0} x="15%" y="80%" />
        <AmbientPaw delay={5} x="75%" y="40%" />
        <AmbientPaw delay={10} x="45%" y="60%" />
      </div>

      {/* Hero Section - Ultra Modern */}
      <section className="relative pt-32 pb-24 z-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-widest shadow-sm"
          >
            <Sparkles className="h-3 w-3 text-teal-500" />
            <span>The Gold Standard of Pet Networking</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-4"
          >
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-black">
              Pets <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Reimagined.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              A curated digital sanctuary for the modern pet parent.
              Find compatibility, elite care, and a community of kindred spirits.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-12"
          >
            <motion.div whileTap={{ scale: 0.92 }} transition={PET_SPRINGS.pounce}>
              <Link
                href="/signup"
                className="group relative px-10 py-5 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all hover:scale-105 shadow-2xl flex items-center space-x-3"
              >
                <span>Join the Inner Circle</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileTap={{ scale: 0.92 }} transition={PET_SPRINGS.pounce}>
              <Link
                href="/breeds"
                onClick={(e) => handleProtectedNavigation(e, '/breeds')}
                className="px-10 py-5 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-all hover:scale-105 shadow-sm"
              >
                Discover Breeds
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Luxury Bento Grid - "Instagram Style" */}
      <section className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Feature 1: Matching - Immersive Large Card */}
          <PetAnimation pattern="pounce" className="md:col-span-8 group relative overflow-hidden bg-white rounded-[50px] p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-inner">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Intelligent <br /> Matchmaking</h3>
              <p className="text-gray-500 text-lg max-w-md leading-relaxed font-light">
                Our bespoke algorithm analyzes genetic traits and temperament to find the perfect companion for your pet.
              </p>
            <Link
              href="/matches"
              onClick={(e) => handleProtectedNavigation(e, '/matches')}
              className="inline-flex items-center space-x-2 text-red-500 font-bold hover:text-red-600 pt-4 group"
            >
                <span className="underline underline-offset-4">Begin Discovery</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none rotate-12">
              <Heart className="h-96 w-96" />
            </div>
          </PetAnimation>

          {/* Feature 2: Hospitals - Vertical Card */}
          <PetAnimation pattern="pounce" className="md:col-span-4 group relative overflow-hidden bg-white rounded-[50px] p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-teal-50 text-teal-500 rounded-3xl flex items-center justify-center shadow-inner">
                <Hospital className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">Elite Care</h3>
              <p className="text-gray-500 text-base leading-relaxed font-light">
                Instant access to a curated network of verified specialty clinics.
              </p>
              <Link
                href="/hospitals"
                onClick={(e) => handleProtectedNavigation(e, '/hospitals')}
                className="inline-flex items-center space-x-2 text-teal-600 font-bold hover:text-teal-700 pt-4"
              >
                <span className="underline underline-offset-4">Find Clinics</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </PetAnimation>

          {/* Feature 3: Community */}
          <PetAnimation pattern="pounce" className="md:col-span-4 group relative overflow-hidden bg-white rounded-[50px] p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center shadow-inner">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">The Collective</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                A shared space for high-end pet storytelling and expert advice.
              </p>
              <Link
                href="/community"
                onClick={(e) => handleProtectedNavigation(e, '/community')}
                className="inline-flex items-center space-x-2 text-blue-600 font-bold hover:text-blue-700 pt-4"
              >
                <span className="underline underline-offset-4">Enter Feed</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </PetAnimation>

          {/* Feature 4: QA */}
          <PetAnimation pattern="pounce" className="md:col-span-4 group relative overflow-hidden bg-white rounded-[50px] p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center shadow-inner">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Expert QA</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Direct consultation with certified animal health specialists.
              </p>
              <Link
                href="/qa"
                onClick={(e) => handleProtectedNavigation(e, '/qa')}
                className="inline-flex items-center space-x-2 text-orange-600 font-bold hover:text-orange-700 pt-4"
              >
                <span className="underline underline-offset-4">Ask Expert</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </PetAnimation>

          {/* Feature 5: Breeds */}
          <PetAnimation pattern="pounce" className="md:col-span-4 group relative overflow-hidden bg-white rounded-[50px] p-12 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <div className="relative z-10 space-y-8">
              <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-3xl flex items-center justify-center shadow-inner">
                <Dog className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Breed Lab</h3>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                Deep-dive into a comprehensive encyclopedia of pet genetics.
              </p>
              <Link
                href="/breeds"
                onClick={(e) => handleProtectedNavigation(e, '/breeds')}
                className="inline-flex items-center space-x-2 text-purple-600 font-bold hover:text-purple-700 pt-4"
              >
                <span className="underline underline-offset-4">Browse Lab</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </PetAnimation>
        </div>
      </section>

      {/* High-Impact Trust Section */}
      <section className="bg-black py-32 text-white overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-16 relative z-10">
          <div className="flex justify-center">
            <div className="p-8 bg-white/10 rounded-full backdrop-blur-2xl border border-white/20 shadow-2xl">
              <ShieldCheck className="h-20 w-20 text-teal-400" />
            </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight">
            Safe. Secure. <br />
            <span className="text-gray-500 italic font-serif">Uncompromising.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">
            Integrating high-security verification with a passion for animals to create the safest networking environment in the pet world.
          </p>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-teal-500/20 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      </section>

      <footer className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-3">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Dog className="h-6 w-6" />
            </div>
            <span className="text-xl font-black tracking-tighter">PetCommunity</span>
          </div>
          <div className="text-gray-400 text-xs font-medium tracking-wide uppercase">
            © {new Date().getFullYear()} PetCommunity. A New Standard in Pet Care.
          </div>
        </div>
      </footer>
    </div>
  );
}
