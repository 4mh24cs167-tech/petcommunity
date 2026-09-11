'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, HeartPulse, Check, ArrowRight, Shield } from 'lucide-react';

const plans = [
  {
    provider: 'PawGuard',
    name: 'Essential Care',
    price: '',
    coverage: 'Accidents & Illnesses',
    deductible: '',
    reimbursement: '80%',
    features: ['Emergency Vet Visits', 'Surgery', 'Prescription Meds'],
    popular: false,
  },
  {
    provider: 'PetCare Plus',
    name: 'Comprehensive',
    price: '',
    coverage: 'Nose-to-Tail Protection',
    deductible: '',
    reimbursement: '90%',
    features: ['Routine Checkups', 'Dental Illness', 'Hereditary Conditions', 'Behavioral Therapy'],
    popular: true,
  },
  {
    provider: 'FetchIt',
    name: 'Accident Only',
    price: '',
    coverage: 'Accidents Only',
    deductible: '',
    reimbursement: '70%',
    features: ['X-Rays & Ultrasounds', 'Hospitalization', 'Surgery'],
    popular: false,
  }
];

export default function InsuranceMarketplacePage() {
  return (
    <div className="min-h-screen bg-[#FCFAF8] p-6 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-50 rounded-full blur-[150px] -z-10 opacity-70 translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto space-y-16 py-12">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Pet Insurance Marketplace</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter"
          >
            Protect Their <span className="text-teal-600">Tomorrow.</span>
          </motion.h1>
          
          <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Compare trusted pet insurance plans side-by-side. Get peace of mind knowing you'll never have to choose between your pet and your wallet.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-[40px] p-8 border ${plan.popular ? 'border-teal-500 shadow-2xl shadow-teal-100 scale-105 z-10' : 'border-gray-100 shadow-lg'} relative overflow-hidden flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 bg-teal-500 text-white text-[10px] font-black uppercase tracking-widest py-1.5 text-center">
                  Most Popular Choice
                </div>
              )}
              
              <div className={`space-y-4 ${plan.popular ? 'mt-4' : ''}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-400">{plan.provider}</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                  </div>
                  <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'}`}>
                    <Shield className="h-6 w-6" />
                  </div>
                </div>

                <div className="flex items-end space-x-1">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 font-medium pb-1">/mo</span>
                </div>
                
                <p className="text-sm font-medium text-gray-500 pb-6 border-b border-gray-50">{plan.coverage}</p>
              </div>

              <div className="py-6 space-y-4 flex-grow">
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deductible</p>
                    <p className="font-bold text-gray-900">{plan.deductible}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Reimbursement</p>
                    <p className="font-bold text-teal-600">{plan.reimbursement}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  {plan.features.map(feature => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="bg-teal-50 text-teal-600 rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className={`w-full py-4 rounded-2xl font-black shadow-xl transition-all mt-6 ${plan.popular ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-900 text-white hover:bg-black'}`}>
                Get Free Quote
              </button>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center bg-teal-50 p-12 rounded-[40px] border border-teal-100 mt-12 relative overflow-hidden">
          <HeartPulse className="absolute -right-10 -bottom-10 h-64 w-64 text-teal-100/50 -rotate-12" />
          <h2 className="text-3xl font-black text-gray-900 relative z-10">Not sure what you need?</h2>
          <p className="text-teal-800 mt-2 max-w-xl mx-auto relative z-10">Our AI assistant can analyze your pet's breed and age to recommend the exact coverage that makes sense.</p>
          <button className="mt-8 px-8 py-4 bg-white text-teal-700 font-black rounded-full shadow-lg border border-teal-100 hover:scale-105 transition-transform relative z-10">
            Start Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
