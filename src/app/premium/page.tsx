'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Crown, Star, CheckCircle2 } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function PremiumPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const supabase = createClient();

  const handleSubscribe = async (plan: 'premium' | 'lifetime') => {
    alert(`Redirecting to payment for ${plan} plan...`);
    // Integration with Stripe would happen here
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-20 py-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-block p-3 bg-amber-100 text-amber-600 rounded-2xl mb-4"
          >
            <Crown className="h-8 w-8" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter">
            Join the <span className="text-teal-600">Inner Circle</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
            Unlock exclusive breeding matches, priority vet consultations, and a curated sanctuary for the most dedicated pet parents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Basic</h3>
              <p className="text-gray-500 text-sm font-medium">Perfect for casual pet lovers.</p>
            </div>
            <div className="text-4xl font-black text-gray-900">Free</div>
            <div className="space-y-4">
              {[
                'Standard Matching',
                'Community Access',
                'Public Breed Directory',
                'Basic Health Tracking'
              ].map(feat => (
                <div key={feat} className="flex items-center space-x-3 text-sm text-gray-600 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold cursor-not-allowed">
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="p-8 bg-white rounded-[40px] border-4 border-teal-600 shadow-2xl space-y-8 relative overflow-hidden transform scale-105 z-10"
          >
            <div className="absolute top-0 right-0 bg-teal-600 text-white px-6 py-2 rounded-bl-3xl font-black text-xs uppercase tracking-widest">
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 flex items-center space-x-2">
                <span>Premium</span>
                <Zap className="h-6 w-6 text-teal-600 fill-current" />
              </h3>
              <p className="text-gray-500 text-sm font-medium">For the dedicated pet parent.</p>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-gray-900">${billingCycle === 'monthly' ? '9' : '89'}</span>
              <span className="text-gray-400 font-bold">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div className="space-y-4">
              {[
                'Priority Matching',
                'Verified Expert Q&A',
                'Advanced Health Analytics',
                'Exclusive Marketplace Access',
                'Inner Circle Badge',
                'Priority Support'
              ].map(feat => (
                <div key={feat} className="flex items-center space-x-3 text-sm text-gray-700 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={PET_SPRINGS.pounce}
              onClick={() => handleSubscribe('premium')}
              className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all"
            >
              Upgrade Now
            </motion.button>
          </motion.div>

          {/* Lifetime Plan */}
          <div className="p-8 bg-gray-900 text-white rounded-[40px] border border-gray-800 shadow-sm space-y-8 relative overflow-hidden">
            <div className="space-y-2">
              <h3 className="text-2xl font-black flex items-center space-x-2">
                <span>Lifetime</span>
                <Star className="h-6 w-6 text-amber-400 fill-current" />
              </h3>
              <p className="text-gray-400 text-sm font-medium">The ultimate commitment.</p>
            </div>
            <div className="text-4xl font-black">$299</div>
            <div className="space-y-4">
              {[
                'Everything in Premium',
                'Lifetime Access',
                'Founder Badge',
                'Early Access to Features',
                'Custom Pet Portrait'
              ].map(feat => (
                <div key={feat} className="flex items-center space-x-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={PET_SPRINGS.pounce}
              onClick={() => handleSubscribe('lifetime')}
              className="w-full py-4 bg-white text-black rounded-2xl font-black hover:bg-gray-100 transition-all"
            >
              Go Lifetime
            </motion.button>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4">
          <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-gray-200 rounded-full relative p-1 transition-colors hover:bg-gray-300"
          >
            <motion.div
              animate={{ x: billingCycle === 'monthly' ? 0 : 28 }}
              className="w-5 h-5 bg-teal-600 rounded-full shadow-sm"
            />
          </button>
          <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>Yearly (Save 20%)</span>
        </div>
      </div>
    </div>
  );
}
