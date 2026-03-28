import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Mail, User, ArrowRight, Loader2, AlertCircle, Chrome, Sparkles, ShieldCheck } from 'lucide-react';
import { saveEntry, auth, googleProvider, syncUser, updateUserConsent } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface EntryGateProps {
  onAccessGranted: () => void;
  hasApiKey: boolean;
  onSelectKey: () => void;
}

export const EntryGate: React.FC<EntryGateProps> = ({ onAccessGranted, hasApiKey, onSelectKey }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showConsent, setShowConsent] = useState(false);
  const [user, setUser] = useState<any>(null);

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
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const referrerCode = localStorage.getItem('quantum_referrer');
      const userData = await syncUser(userCredential.user, referrerCode);
      if (referrerCode) {
        localStorage.removeItem('quantum_referrer');
      }
      
      if (!userData?.communityConsent) {
        setUser(userCredential.user);
        setShowConsent(true);
      } else {
        sessionStorage.setItem('immersive_access_granted', 'true');
        setIsVisible(false);
        setTimeout(() => onAccessGranted(), 500);
      }
    } catch (err: any) {
      console.error('Sign-up error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const referrerCode = localStorage.getItem('quantum_referrer');
      const userData = await syncUser(result.user, referrerCode);
      if (referrerCode) {
        localStorage.removeItem('quantum_referrer');
      }
      
      if (!userData?.communityConsent) {
        setUser(result.user);
        setShowConsent(true);
      } else {
        sessionStorage.setItem('immersive_access_granted', 'true');
        setIsVisible(false);
        setTimeout(() => onAccessGranted(), 500);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConsent = async (consent: boolean) => {
    setIsSubmitting(true);
    try {
      await updateUserConsent(user.uid, consent);
      if (consent) {
        sessionStorage.setItem('immersive_access_granted', 'true');
        setIsVisible(false);
        setTimeout(() => onAccessGranted(), 500);
      } else {
        // Handle refusal
        setShowConsent(false);
        setError('You must consent to join the community to access the experience.');
      }
    } catch (err: any) {
      console.error('Consent error:', err);
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
            {showConsent ? (
              <div className="text-center space-y-6">
                <h2 className="font-serif text-2xl font-black text-white">Join the Community</h2>
                <p className="text-sm text-white/60">
                  By joining the community, you agree to share your profile information with other members and participate in discussions.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleConsent(true)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-gold py-3 font-mono text-xs font-bold uppercase tracking-[2px] text-black hover:bg-yellow transition-all"
                  >
                    Agree
                  </button>
                  <button
                    onClick={() => handleConsent(false)}
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-3 font-mono text-xs font-bold uppercase tracking-[2px] text-white hover:bg-white/10 transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                    <Sparkles className="h-7 w-7 text-gold" />
                  </div>
                  <h1 className="mb-2 font-serif text-3xl font-black tracking-tight text-white">Unlock the Experience</h1>
                  <p className="text-sm text-white/40">
                    Enter your details to begin the immersive journey of <span className="italic text-gold/60">Somehow I&nbsp;&nbsp;MANAGED</span>.
                  </p>
                </div>

                {/* API Key Selection (Mandatory for Pro Model) */}
                {!hasApiKey && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 rounded-xl border border-gold/20 bg-gold/5 p-6 text-center"
                  >
                    <div className="mb-3 flex items-center justify-center gap-2 text-gold">
                      <ShieldCheck className="h-5 w-5" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[2px]">Pro Visuals Enabled</span>
                    </div>
                    <p className="mb-4 text-[11px] leading-relaxed text-white/60">
                      This experience uses <span className="text-gold">Gemini 3 Pro</span> for high-fidelity cinematic visuals. A paid Google Cloud API key is required.
                    </p>
                    <button
                      onClick={onSelectKey}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold/10 px-4 py-3 font-mono text-[10px] font-bold uppercase tracking-[2px] text-gold border border-gold/30 hover:bg-gold/20 transition-all"
                    >
                      Select API Key
                    </button>
                    <a 
                      href="https://ai.google.dev/gemini-api/docs/billing" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-3 block text-[9px] text-white/30 hover:text-gold transition-colors"
                    >
                      Learn about billing & keys
                    </a>
                  </motion.div>
                )}

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

                  <div className="space-y-2">
                    <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">Password</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
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

                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="mx-4 flex-shrink font-mono text-[8px] uppercase tracking-[1px] text-white/20">or</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-3 text-xs font-medium text-white transition-all hover:bg-white/10 disabled:opacity-50"
                  >
                    <Chrome className="h-4 w-4 text-gold" />
                    Continue with Google
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
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
