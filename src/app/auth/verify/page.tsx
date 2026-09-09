'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { PET_SPRINGS } from '@/lib/motion-variants';

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus the first input on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the full 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real Supabase setup, you'd use verifyOtp
      // For the demo/UI focus, we'll simulate a successful verification
      // if the environment variables are missing.
      const { data, error: authError } = await supabase.auth.verifyOtp({
        token: otpString,
        type: 'signup',
      });

      if (authError) throw authError;

      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF8] text-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-teal-100/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-100/30 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={PET_SPRINGS.pounce}
        className="relative z-10 w-full max-w-md space-y-12 text-center"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl border border-gray-100 mb-4"
          >
            <ShieldCheck className="h-10 w-10 text-teal-600" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900">Verify Your Identity</h1>
          <p className="text-gray-500 font-light">
            We've sent a 6-digit verification code to your email. <br />
            Please enter it below to join the community.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <motion.div
              key={index}
              whileTap={{ scale: 0.9 }}
              transition={PET_SPRINGS.nudge}
              className="relative"
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-14 h-16 text-center text-2xl font-black rounded-2xl border-2 transition-all outline-none bg-white/80 backdrop-blur-sm shadow-sm
                  ${digit ? 'border-teal-500 ring-4 ring-teal-100 text-teal-600' : 'border-gray-200 text-gray-400'}
                  focus:border-teal-600 focus:ring-4 focus:ring-teal-100`}
              />
              <AnimatePresence>
                {digit && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={PET_SPRINGS.pounce}
                    className="absolute -top-2 -right-2 text-teal-500"
                  >
                    <Sparkles className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-sm font-medium"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={PET_SPRINGS.pounce}
            onClick={handleVerify}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-full font-bold shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-3 disabled:bg-gray-400"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Verify & Enter</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          <button
            onClick={() => router.push('/signup')}
            className="text-sm text-gray-400 hover:text-gray-600 transition font-medium flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign Up</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
