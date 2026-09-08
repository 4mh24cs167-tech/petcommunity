'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Dog, Heart, Hospital, Users, MessageSquare, UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navLinks = [
    { name: 'Matches', href: '/matches', icon: Heart },
    { name: 'Breeds', href: '/breeds', icon: Dog },
    { name: 'Health', href: '/hospitals', icon: Hospital },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'QA', href: '/qa', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: UserCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-black text-white p-1 rounded-lg group-hover:scale-110 transition-transform">
                <Dog className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tighter text-black">
                Pet<span className="text-gray-400">Community</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="px-4 py-1.5 text-sm font-bold bg-black text-white rounded-full hover:bg-gray-800 transition-all"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-black transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-3 text-lg font-medium text-gray-600 hover:text-black transition"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="w-full py-3 text-lg font-bold text-red-600 text-left"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Helper for AnimatePresence since it's used in the return
import { AnimatePresence } from 'framer-motion';
