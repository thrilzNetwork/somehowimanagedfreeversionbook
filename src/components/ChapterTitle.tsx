import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ChapterTitleProps {
  text: string;
  className?: string;
}

export const ChapterTitle: React.FC<ChapterTitleProps> = ({
  text,
  className = 'mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl',
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const words = text.split(' ');

  useGSAP(() => {
    const inners = headingRef.current?.querySelectorAll('.word-inner');
    if (!inners?.length) return;

    gsap.from(inners, {
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 88%',
        once: true,
      },
      y: '108%',
      autoAlpha: 0,
      stagger: 0.07,
      duration: 0.75,
      ease: 'power3.out',
    });
  }, { scope: headingRef });

  return (
    <h2
      ref={headingRef}
      className={className}
      style={{ lineHeight: '1.1' }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: i < words.length - 1 ? '0.22em' : undefined }}
        >
          <span className="word-inner inline-block">{word}</span>
        </span>
      ))}
    </h2>
  );
};
