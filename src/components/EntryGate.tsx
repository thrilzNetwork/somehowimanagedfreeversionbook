import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Mail, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { saveEntry } from '../firebase';

interface EntryGateProps {
  onAccessGranted: () => void;
}

export const EntryGate: React.FC<EntryGateProps> = ({ onAccessGranted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Check if access was already granted in this session
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('immersive_access_granted');
    if (accessGranted === 'true') {
      setIsVisible(false);
      onAccessGranted();
    }
  }, [onAccessGranted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await saveEntry(name, email);
      sessionStorage.setItem('immersive_access_granted', 'true');
      setIsVisible(false);
      setTimeout(() => onAccessGranted(), 500); // Wait for animation
    } catch (err: any) {
      console.error('Entry error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black p-6"
        >
          {/* Background Atmosphere */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-gold/5 blur-[120px]" />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl md:p-10"
          >
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                <Key className="h-7 w-7 text-gold" />
              </div>
              <h1 className="mb-2 font-serif text-3xl font-black tracking-tight text-white">Unlock the Experience</h1>
              <p className="text-sm text-white/40">
                Enter your details to begin the immersive journey of <span className="italic text-gold/60">Somehow I&nbsp;&nbsp;MANAGED</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Michael Scott"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michael@dundermifflin.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gold py-4 font-mono text-xs font-bold uppercase tracking-[2px] text-black transition-all hover:bg-yellow disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Enter Experience
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-white/5 pt-6 text-center space-y-2">
              <p className="font-mono text-[8px] uppercase tracking-[1px] text-white/20">
                Hospitality Edition · First Print · Interactive
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-community'));
                  }}
                  className="block mx-auto font-mono text-[8px] uppercase tracking-[1px] text-gold/40 hover:text-gold transition-colors"
                >
                  Community Access
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-admin'));
                  }}
                  className="block mx-auto font-mono text-[7px] uppercase tracking-[1px] text-white/5 hover:text-gold/20 transition-colors"
                >
                  Admin Access
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
