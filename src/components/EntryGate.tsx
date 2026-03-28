import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, User, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { signInWithPopup, signInAnonymously, updateProfile } from 'firebase/auth';
import { auth, googleProvider, syncUser, saveEntry } from '../firebase';

interface EntryGateProps {
  onAccessGranted: () => void;
  hasApiKey: boolean;
  onSelectKey: () => void;
}

export const EntryGate: React.FC<EntryGateProps> = ({ onAccessGranted }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const accessGranted = sessionStorage.getItem('immersive_access_granted');
    if (accessGranted === 'true') {
      setIsVisible(false);
      onAccessGranted();
    }
  }, [onAccessGranted]);

  const grantAccess = () => {
    sessionStorage.setItem('immersive_access_granted', 'true');
    setIsVisible(false);
    setTimeout(() => onAccessGranted(), 500);
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const referrerCode = localStorage.getItem('quantum_referrer');
      await syncUser(result.user, referrerCode);
      grantAccess();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // Sign in anonymously so auth.currentUser is set
      const result = await signInAnonymously(auth);
      // Attach the display name to the anonymous user
      await updateProfile(result.user, { displayName: name.trim() });
      // Save their name + email to entries collection
      await saveEntry(name.trim(), email.trim());
      // Sync a basic user profile
      const referrerCode = localStorage.getItem('quantum_referrer');
      await syncUser(
        { ...result.user, displayName: name.trim(), email: email.trim() },
        referrerCode
      );
      grantAccess();
    } catch (err: any) {
      console.error('Email entry error:', err);
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
                <Sparkles className="h-7 w-7 text-gold" />
              </div>
              <h1 className="mb-2 font-serif text-3xl font-black tracking-tight text-white">Unlock the Experience</h1>
              <p className="text-sm text-white/40">
                Join the immersive journey of <span className="italic text-gold/60">Somehow I&nbsp;&nbsp;MANAGED</span>.
              </p>
            </div>

            {/* Google Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="group flex w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 py-4 font-mono text-xs font-bold uppercase tracking-[2px] text-white transition-all hover:bg-white/10 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="font-mono text-[10px] uppercase tracking-[2px] text-white/20">or</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            {/* Email + Name Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50"
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
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-4 font-mono text-xs font-bold uppercase tracking-[2px] text-black transition-all hover:bg-yellow-400 disabled:opacity-50"
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

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Footer */}
            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <p className="font-mono text-[8px] uppercase tracking-[1px] text-white/20">
                Hospitality Edition · First Print · Interactive
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
