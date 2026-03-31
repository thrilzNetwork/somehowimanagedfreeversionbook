import { useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Key } from 'lucide-react';

gsap.registerPlugin(useGSAP);

// Seeded pseudo-random for stable SSR/hydration parity
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

const PARTICLE_COUNT = 22;

export const CoverSection = () => {
  const sectionRef   = useRef<HTMLElement>(null);
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stable particle data — computed once
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left:     seededRandom(i * 3)      * 100,       // 0–100 %
      size:     seededRandom(i * 7) * 3  + 1.2,       // 1.2–4.2 px
      delay:    seededRandom(i * 11)     * 6,          // 0–6 s
      duration: seededRandom(i * 13) * 9 + 7,          // 7–16 s
      xDrift:   (seededRandom(i * 17) - 0.5) * 60,    // ±30 px horizontal wander
    })),
  []);

  useGSAP(() => {
    // ── Entrance timeline ───────────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });

    tl.fromTo(
      ['.cover-line-top', '.cover-line-bottom'],
      { scaleX: 0 },
      { scaleX: 1, duration: 1.4, ease: 'expo.inOut', stagger: 0 },
    )
    .fromTo('.cover-eyebrow',
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7 },
      '-=0.55',
    )
    .fromTo('.cover-key-icon',
      { scale: 0, rotation: -25, autoAlpha: 0 },
      { scale: 1, rotation: 0, autoAlpha: 0.75, duration: 0.9, ease: 'back.out(1.6)' },
      '-=0.4',
    )
    .fromTo('.cover-somehow',
      { y: 22, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.65 },
      '-=0.35',
    )
    .fromTo('.cover-managed',
      { y: 32, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      '-=0.4',
    )
    .fromTo('.cover-divider',
      { scaleX: 0, autoAlpha: 0 },
      { scaleX: 1, autoAlpha: 0.6, duration: 0.6, ease: 'power2.inOut' },
      '-=0.25',
    )
    .fromTo('.cover-author',
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6 },
      '-=0.2',
    )
    .fromTo('.cover-edition',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.2 },
      '-=0.2',
    );

    // ── Ambient orbs ────────────────────────────────────────────────────────
    gsap.to('.cover-orb-main', {
      scale: 1.18, opacity: 0.055,
      duration: 4.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8,
    });
    gsap.to('.cover-orb-secondary', {
      scale: 1.12, opacity: 0.04,
      duration: 5.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3,
    });

    // ── Key icon float ──────────────────────────────────────────────────────
    gsap.to('.cover-key-icon', {
      y: -7, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
    });

    // ── Gold shimmer sweep ──────────────────────────────────────────────────
    gsap.fromTo('.cover-shimmer',
      { x: '-110%' },
      { x: '210%', duration: 1.6, ease: 'power2.inOut', delay: 2.2, repeat: -1, repeatDelay: 6 },
    );

    // ── Gold dust particles ─────────────────────────────────────────────────
    particleRefs.current.forEach((el, i) => {
      if (!el) return;
      const p = particles[i];

      // Reset to bottom, invisible
      gsap.set(el, { y: '105vh', opacity: 0, x: 0 });

      // Float upward with a gentle horizontal wander
      gsap.to(el, {
        y: '-12vh',
        x: p.xDrift,
        duration: p.duration,
        delay: p.delay,
        repeat: -1,
        ease: 'none',
        onRepeat() {
          gsap.set(el, { y: '105vh', x: 0 });
        },
      });

      // Fade in → hold → fade out
      gsap.to(el, {
        keyframes: [
          { opacity: 0,    duration: p.duration * 0.15, ease: 'none' },
          { opacity: 0.55, duration: p.duration * 0.3,  ease: 'none' },
          { opacity: 0.55, duration: p.duration * 0.4,  ease: 'none' },
          { opacity: 0,    duration: p.duration * 0.15, ease: 'none' },
        ],
        duration: p.duration,
        delay: p.delay,
        repeat: -1,
      });
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-6 pt-10 pb-20 text-center md:px-16"
    >
      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.032]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />

      {/* Gold dust particles */}
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={el => { particleRefs.current[i] = el; }}
          className="pointer-events-none absolute rounded-full bg-[#c9a84c]"
          style={{
            left:   `${p.left}%`,
            bottom: 0,
            width:  `${p.size}px`,
            height: `${p.size}px`,
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        />
      ))}

      {/* Ambient orbs */}
      <div className="cover-orb-main pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full bg-[#c9a84c] opacity-[0.04] blur-[130px]" />
      <div className="cover-orb-secondary pointer-events-none absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-[#c9a84c] opacity-[0.03] blur-[90px]" />

      {/* Gold accent lines — wipe outward from center */}
      <div
        className="cover-line-top absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-50"
        style={{ transformOrigin: 'center' }}
      />
      <div
        className="cover-line-bottom absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-50"
        style={{ transformOrigin: 'center' }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="cover-eyebrow mb-12 font-mono text-[9px] tracking-[5px] uppercase text-[#c9a84c]/40">
          Quantum Hospitality Solutions
        </div>

        <div className="cover-key-icon mb-12">
          <Key className="h-8 w-8 text-[#c9a84c]" />
        </div>

        <h1 className="relative font-serif leading-none overflow-hidden">
          <span className="cover-shimmer pointer-events-none absolute inset-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-[#c9a84c]/20 to-transparent skew-x-[-15deg]" />
          <span className="cover-somehow mb-2 block text-sm italic tracking-[2px] text-[#c9a84c] md:text-xl">
            Somehow
          </span>
          <span className="cover-managed block font-black text-4xl md:text-[44px] leading-tight md:leading-[49px] tracking-normal">
            I&nbsp;&nbsp;MANAGED
          </span>
        </h1>

        <div
          className="cover-divider my-10 h-[1px] w-8 bg-[#c9a84c]"
          style={{ transformOrigin: 'left' }}
        />

        <div className="cover-author font-serif text-lg tracking-wider text-white/55 md:text-xl">
          Alejandro Soria
        </div>
      </div>

      <div className="cover-edition absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[4px] uppercase text-white/10">
        Hospitality Edition &nbsp;·&nbsp; First Print
      </div>
    </section>
  );
};
