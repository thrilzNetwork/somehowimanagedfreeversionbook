import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { Info, Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Each chapter's unique cinematic mood colour
export const CHAPTER_MOODS: Record<string, string> = {
  ch0: 'rgba(201, 120, 40,  0.28)', // warm amber   — nostalgia / beginnings
  ch1: 'rgba(40,  130, 210, 0.22)', // ocean blue   — new horizons / grand opening
  ch2: 'rgba(180, 30,  30,  0.28)', // deep red     — crisis / turnaround
  ch3: 'rgba(100, 40,  180, 0.22)', // purple       — power / boardroom
  ch4: 'rgba(40,  150, 80,  0.20)', // forest green — people / warmth
  ch5: 'rgba(220, 90,  20,  0.28)', // burnt orange — culinary / F&B
  ch6: 'rgba(20,  100, 220, 0.22)', // electric blue— technology / modernization
  ch7: 'rgba(60,  80,  120, 0.35)', // cold grey-blue— exhaustion / COVID
  ch8: 'rgba(201, 168, 76,  0.25)', // gold         — hope / resolution
};

interface CinematicPortraitProps {
  src?: string;
  alt: string;
  isGenerating: boolean;
  explanation?: string;
  hasError?: boolean;
  onRetry?: () => void;
  chapterId: string;
  chapterQuote?: string;
}

export const CinematicPortrait: React.FC<CinematicPortraitProps> = ({
  src,
  alt,
  isGenerating,
  explanation,
  hasError,
  onRetry,
  chapterId,
  chapterQuote,
}) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const imageRef      = useRef<HTMLImageElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const shimmerRef    = useRef<HTMLDivElement>(null);
  const quoteRef      = useRef<HTMLDivElement>(null);

  const moodColor = CHAPTER_MOODS[chapterId] ?? 'rgba(201, 168, 76, 0.2)';

  useGSAP(() => {
    if (!src || !imageRef.current) return;

    // ── 1. Scroll-parallax: image drifts at half the scroll speed ──────────
    gsap.to(imageRef.current, {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // ── 2. Cinematic entrance: veil lifts, image brightens, frame scales ───
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top 80%',
        once: true,
      },
    });
    entranceTl
      .fromTo(
        wrapperRef.current,
        { scale: 0.96 },
        { scale: 1, duration: 1.2, ease: 'power3.out' },
      )
      .fromTo(
        overlayRef.current,
        { opacity: 0.82 },
        { opacity: 0, duration: 1.8, ease: 'power2.out' },
        '<',
      )
      .fromTo(
        imageRef.current,
        { filter: 'brightness(0.25) contrast(1.25)' },
        { filter: 'brightness(0.92) contrast(1.05)', duration: 1.8, ease: 'power2.out' },
        '<',
      );

    // ── 3. Quote overlay: scrubs in as image passes the viewport centre ────
    if (quoteRef.current && chapterQuote) {
      gsap.fromTo(
        quoteRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 32%',
            end: 'top 5%',
            scrub: 1.2,
          },
        },
      );
    }

    // ── 4. Enhanced Ken Burns: slow, continuous zoom + drift ──────────────
    gsap.to(imageRef.current, {
      scale: 1.08,
      x: 12,
      duration: 26,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // ── 5. Repeating cinematic shimmer sweep ───────────────────────────────
    if (shimmerRef.current) {
      gsap.fromTo(
        shimmerRef.current,
        { x: '-110%' },
        {
          x: '210%',
          duration: 1.8,
          ease: 'power2.inOut',
          delay: 1.5,
          repeat: -1,
          repeatDelay: 7,
        },
      );
    }
  }, { scope: containerRef, dependencies: [src] });

  return (
    <div ref={containerRef} className="relative mb-8 md:mb-12">

      {/* ── Frame ──────────────────────────────────────────────────────────── */}
      <div
        ref={wrapperRef}
        className="relative overflow-hidden rounded-lg shadow-[0_24px_64px_rgba(0,0,0,0.9)] bg-[#050505]"
        style={{ aspectRatio: '16/9', willChange: 'transform' }}
      >

        {/* Loading */}
        {isGenerating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-[#c9a84c]" />
          </div>
        )}

        {/* Error */}
        {hasError && !isGenerating && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="rounded-full bg-red-500/10 p-3">
                <Info className="h-6 w-6 text-red-500" />
              </div>
              <p className="font-serif text-sm text-white/90">Quota Exceeded</p>
              <p className="text-[10px] text-white/40 leading-relaxed">The visual developer is resting.</p>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 px-4 py-2 font-mono text-[10px] tracking-[2px] uppercase text-[#c9a84c] hover:bg-[#c9a84c]/20 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {src ? (
          <>
            {/* Cinematic veil — GSAP lifts this on entrance */}
            <div
              ref={overlayRef}
              className="absolute inset-0 z-20 bg-black pointer-events-none"
              style={{ opacity: 0.82 }}
            />

            {/* Chapter mood colour tint */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ backgroundColor: moodColor, mixBlendMode: 'color' }}
            />

            {/* Glass light reflection */}
            <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent mix-blend-overlay" />

            {/* Shimmer sweep */}
            <div
              ref={shimmerRef}
              className="absolute inset-0 z-[15] pointer-events-none w-1/3 bg-gradient-to-r from-transparent via-[#c9a84c]/[0.06] to-transparent skew-x-[-12deg]"
            />

            {/* The image — parallax + ken burns target */}
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'brightness(0.25) contrast(1.25)',
                transformOrigin: 'center center',
                willChange: 'transform, filter',
              }}
              referrerPolicy="no-referrer"
            />

            {/* Film grain */}
            <div
              className="absolute inset-0 z-30 pointer-events-none opacity-[0.055]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '192px 192px',
              }}
            />

            {/* Chapter quote — scrubs over image as you scroll through it */}
            {chapterQuote && (
              <div
                ref={quoteRef}
                className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
                style={{ visibility: 'hidden' }}
              >
                <div className="bg-gradient-to-t from-black/85 via-black/45 to-transparent px-8 pb-10 pt-20">
                  <p className="font-serif text-sm italic leading-relaxed text-white/90 md:text-base lg:text-lg">
                    {chapterQuote}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Placeholder while image generates */
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-[#c9a84c]/20 italic font-serif px-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin opacity-20" />
          </div>
        )}
      </div>

      {/* Guide note below image */}
      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-lg border border-[#c9a84c]/10 bg-[#c9a84c]/5 p-6 font-serif text-sm italic leading-relaxed text-white/70"
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-[#c9a84c]">
              <Info className="h-3 w-3" />
              Guide Note
            </div>
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
