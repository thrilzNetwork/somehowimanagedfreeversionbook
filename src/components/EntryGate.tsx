import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Mail, User, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { saveEntry } from '../firebase';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

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

  const containerRef = useRef<HTMLDivElement>(null);

  // Check if access was already granted in this session
  useEffect(() => {
    const accessGranted = sessionStorage.getItem('immersive_access_granted');
    if (accessGranted === 'true') {
      setIsVisible(false);
      onAccessGranted();
    }
  }, [onAccessGranted]);

  // GSAP entrance timeline
  useGSAP(() => {
    if (!isVisible) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Background fades in
    tl.fromTo('.entry-bg',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.7 }
    )
    // Card rises from below with back ease
    .fromTo('.entry-card',
      { y: 40, scale: 0.96, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: 'back.out(1.3)' },
      '-=0.35'
    )
    // Icon bounces in
    .fromTo('.entry-icon',
      { scale: 0, rotation: -20, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.7, ease: 'back.out(2)' },
      '-=0.5'
    )
    // Title and subtitle stagger
    .fromTo('.entry-heading',
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6 },
      '-=0.3'
    )
    .fromTo('.entry-subheading',
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5 },
      '-=0.25'
    )
    // Fields slide in
    .fromTo('.entry-field',
      { x: -14, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.5, stagger: 0.1 },
      '-=0.2'
    )
    // Submit button
    .fromTo('.entry-submit',
      { y: 10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.5 },
      '-=0.15'
    )
    // Footer
    .fromTo('.entry-footer',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.6 },
      '-=0.1'
    );

    // Ambient orb pulse
    gsap.to('.entry-orb-1', {
      scale: 1.25,
      opacity: 0.08,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.entry-orb-2', {
      scale: 1.2,
      opacity: 0.06,
      duration: 4.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.5,
    });

    // Icon float
    gsap.to('.entry-icon', {
      y: -5,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2,
    });

  }, { scope: containerRef, dependencies: [isVisible] });

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

      // GSAP exit animation before hiding
      if (containerRef.current) {
        gsap.to('.entry-card', {
          y: -20,
          scale: 0.97,
          autoAlpha: 0,
          duration: 0.5,
          ease: 'power2.in',
        });
        gsap.to('.entry-bg', {
          autoAlpha: 0,
          duration: 0.7,
          delay: 0.2,
          onComplete: () => {
            setIsVisible(false);
            onAccessGranted();
          }
        });
      } else {
        setIsVisible(false);
        setTimeout(() => onAccessGranted(), 500);
      }
    } catch (err: any) {
      console.error('Entry error:', err);
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div
          ref={containerRef}
          className="entry-bg fixed inset-0 z-[100] flex items-center justify-center bg-black p-6"
          style={{ visibility: 'hidden' }}  // GSAP will set autoAlpha → visible
        >
          {/* Background orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="entry-orb-1 absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#c9a84c] opacity-[0.05] blur-[120px]" />
            <div className="entry-orb-2 absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#c9a84c] opacity-[0.04] blur-[120px]" />
          </div>

          {/* Grain overlay */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '256px 256px',
            }}
          />

          <div
            className="entry-card relative z-20 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl md:p-10"
            style={{ visibility: 'hidden' }}
          >
            {/* Subtle top glow line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c]/40 to-transparent" />

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="entry-icon mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a84c]/20 bg-[#c9a84c]/5" style={{ visibility: 'hidden' }}>
                <Sparkles className="h-7 w-7 text-[#c9a84c]" />
              </div>
              <h1 className="entry-heading mb-2 font-serif text-3xl font-black tracking-tight text-white" style={{ visibility: 'hidden' }}>
                Unlock the Experience
              </h1>
              <p className="entry-subheading text-sm text-white/40" style={{ visibility: 'hidden' }}>
                Enter your details to begin the immersive journey of{' '}
                <span className="italic text-[#c9a84c]/60">Somehow I&nbsp;&nbsp;MANAGED</span>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="entry-field space-y-2" style={{ visibility: 'hidden' }}>
                <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Michael Scott"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-[#c9a84c]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="entry-field space-y-2" style={{ visibility: 'hidden' }}>
                <label className="block font-mono text-[10px] uppercase tracking-[2px] text-white/30">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michael@dundermifflin.com"
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/10 focus:border-[#c9a84c]/50 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/50 transition-all"
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
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="entry-submit group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#c9a84c] py-4 font-mono text-xs font-bold uppercase tracking-[2px] text-black transition-all hover:bg-[#d4ff00] disabled:opacity-50"
                style={{ visibility: 'hidden' }}
              >
                {/* Button shimmer */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-15deg] bg-white/20 transition-transform duration-700 group-hover:translate-x-[200%]" />
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
            <div className="entry-footer mt-8 border-t border-white/5 pt-6 text-center space-y-2" style={{ visibility: 'hidden' }}>
              <p className="font-mono text-[8px] uppercase tracking-[1px] text-white/20">
                Hospitality Edition · First Print · Interactive
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('open-community'));
                  }}
                  className="block mx-auto font-mono text-[8px] uppercase tracking-[1px] text-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors"
                >
                  Community Access
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
