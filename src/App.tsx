import { motion, AnimatePresence } from "motion/react";
import { 
  Key, 
  Linkedin, 
  Twitter, 
  Mail, 
  Copy, 
  Check, 
  ArrowRight, 
  Quote, 
  CheckSquare, 
  ExternalLink,
  MessageCircle,
  Image as ImageIcon,
  Sparkles,
  Loader2,
  ArrowUp,
  Menu,
  Info,
  ChevronDown,
  AlertCircle,
  RefreshCw,
  Headphones,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenAI } from "@google/genai";
import { STATIC_CHAPTER_IMAGES } from "./chapterAssets";
import { EntryGate } from './components/EntryGate';
import { FocusAudio } from './components/FocusAudio';

const BOOK_URL = typeof window !== 'undefined' ? window.location.href : '';

const CHAPTERS = [
  { id: "ch0", title: "Foreword", prompt: "A young man cleaning a luxury hotel lobby at night, cinematic lighting" },
  { id: "ch1", title: "Day Zero", prompt: "A grand hotel opening ceremony, red ribbon, architectural beauty" },
  { id: "ch2", title: "The Turnaround", prompt: "A dark, empty hotel corridor with a single flickering light, cinematic" },
  { id: "ch3", title: "The Money People", prompt: "A high-end boardroom meeting with city views, luxury aesthetic" },
  { id: "ch4", title: "Your Team Is Everything", prompt: "A diverse hotel team standing together in a modern lobby, warm lighting" },
  { id: "ch5", title: "F&B Is Not an Amenity", prompt: "A beautifully plated dish in a dimly lit, high-end hotel restaurant" },
  { id: "ch6", title: "Modernization", prompt: "A futuristic hotel lobby with subtle holographic displays and warm wood accents" },
  { id: "ch7", title: "Running on Empty", prompt: "A quiet, rainy night view from a hotel window, reflective and moody" },
  { id: "ch8", title: "Closing Notes", prompt: "A sunrise over a beautiful hotel skyline, hopeful and bright" },
];

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const LivingPortrait = ({ src, alt, isGenerating, explanation, hasError, onRetry }: { src?: string, alt: string, isGenerating: boolean, explanation?: string, hasError?: boolean, onRetry?: () => void }) => {
  return (
    <div className="relative mb-8 md:mb-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#050505]"
        style={{ 
          aspectRatio: '16/9'
        }}
      >
        {isGenerating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-gold/60">Developing visual...</span>
            </div>
          </div>
        )}

        {hasError && !isGenerating && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="rounded-full bg-red-500/10 p-3">
                <Info className="h-6 w-6 text-red-500" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-sm text-white/90">Quota Exceeded</p>
                <p className="text-[10px] text-white/40 leading-relaxed">The visual developer is resting. Please try again in a moment.</p>
              </div>
              <button 
                onClick={onRetry}
                className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 font-mono text-[10px] tracking-[2px] uppercase text-gold hover:bg-gold/20 transition-colors"
              >
                Retry Development
              </button>
            </div>
          </div>
        )}
        
        {src ? (
          <>
            {/* Glass Reflection Overlay */}
            <motion.div 
              animate={{ 
                opacity: [0.05, 0.15, 0.05],
                x: [-20, 20, -20],
                y: [-10, 10, -10]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent mix-blend-overlay" 
            />
            
            {/* Cinematic Shimmer Effect */}
            <motion.div 
              animate={{ 
                x: ['-100%', '200%'],
                opacity: [0, 0.2, 0]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
              className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-gold/5 to-transparent skew-x-12" 
            />

            <motion.img 
              src={src} 
              alt={alt} 
              className="w-full h-full object-cover brightness-[0.9] contrast-[1.05]"
              animate={{
                scale: [1, 1.01, 1],
                filter: [
                  'brightness(0.9) contrast(1.05)',
                  'brightness(0.95) contrast(1.1)',
                  'brightness(0.9) contrast(1.05)'
                ],
                x: [-0.5, 0.5, -0.5],
                y: [-0.5, 0.5, -0.5]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              referrerPolicy="no-referrer" 
            />
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-gold/20 italic font-serif px-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin opacity-20" />
            <p className="text-sm">Developing cinematic visual...</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-lg border border-gold/10 bg-gold/5 p-6 font-serif text-sm italic leading-relaxed text-white/70"
          >
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[2px] uppercase text-gold">
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

export default function App() {
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chapterImages, setChapterImages] = useState<Record<string, string>>(STATIC_CHAPTER_IMAGES);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [errorIds, setErrorIds] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [calcRevenue, setCalcRevenue] = useState(10000);
  const [calcGop, setCalcGop] = useState(6000);
  
  const generationQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);
  const isPaused = useRef(false);

  const processQueue = async () => {
    if (isProcessingQueue.current || generationQueue.current.length === 0 || isPaused.current) return;
    
    isProcessingQueue.current = true;
    while (generationQueue.current.length > 0 && !isPaused.current) {
      const chapterId = generationQueue.current.shift();
      if (!chapterId) continue;
      
      const chapter = CHAPTERS.find(c => c.id === chapterId);
      if (chapter) {
        const success = await generateChapterImage(chapter.prompt, chapterId);
        
        if (!success) {
          // If it failed with a quota error, we might want to stop processing for a while
          // The generateChapterImage already sets the error state
          // We'll pause the queue for 30 seconds
          isPaused.current = true;
          console.log("Queue paused due to quota error. Resuming in 30s...");
          setTimeout(() => {
            isPaused.current = false;
            processQueue();
          }, 30000);
          break;
        }

        // Cooldown between requests to respect rate limits
        await new Promise(r => setTimeout(r, 3000));
      }
    }
    isProcessingQueue.current = false;
  };

  // Intersection Observer for lazy generation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chapterId = entry.target.getAttribute('data-chapter-id');
            if (chapterId && !chapterImages[chapterId] && !generationQueue.current.includes(chapterId) && !errorIds[chapterId]) {
              generationQueue.current.push(chapterId);
              processQueue();
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const sections = document.querySelectorAll('section[id^="ch"]');
    sections.forEach(section => {
      const id = section.getAttribute('id');
      if (id) {
        section.setAttribute('data-chapter-id', id);
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [chapterImages, errorIds]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(BOOK_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateChapterImage = async (prompt: string, chapterId: string, retryCount = 0): Promise<boolean> => {
    if (!ai || chapterImages[chapterId]) return true;
    
    setGeneratingImageId(chapterId);
    setErrorIds(prev => ({ ...prev, [chapterId]: false }));
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `Cinematic, high-end professional photography, realistic, shallow depth of field, warm lighting, sophisticated, moody, high-quality, deep blacks and gold accents. Subject: ${prompt}. No frame, full bleed image.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          setChapterImages(prev => ({ ...prev, [chapterId]: imageUrl }));
          return true;
        }
      }
      return false;
    } catch (error: any) {
      console.error("Image Generation Error:", error);
      
      const isQuotaError = error?.message?.includes('429') || error?.message?.includes('quota');
      
      if (isQuotaError && retryCount < 2) {
        // Exponential backoff: 5s, 10s
        const delay = (retryCount + 1) * 5000;
        console.log(`Retrying image generation for ${chapterId} in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        return generateChapterImage(prompt, chapterId, retryCount + 1);
      }

      if (isQuotaError) {
        setErrorIds(prev => ({ ...prev, [chapterId]: true }));
        return false;
      }
      return false;
    } finally {
      setGeneratingImageId(null);
    }
  };

  const generateExplanation = async (chapterId: string, title: string) => {
    if (!ai || explanations[chapterId]) return;
    
    setExplainingId(chapterId);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a helpful guide for a book about hospitality leadership titled "Somehow I Managed" by Alejandro Soria. 
        The reader is looking at Chapter: "${title}". 
        Provide a brief, insightful, and sophisticated explanation (2-3 sentences) that helps the reader understand the core message or emotional weight of this chapter. 
        Keep it professional, encouraging, and cinematic in tone.`,
      });

      if (response.text) {
        setExplanations(prev => ({ ...prev, [chapterId]: response.text }));
      }
    } catch (error) {
      console.error("Explanation Generation Error:", error);
    } finally {
      setExplainingId(null);
    }
  };

  const shareText = "This free book by Alejandro Soria is the manual I wish I had in hospitality. Somehow I Managed:";
  const encodedUrl = encodeURIComponent(BOOK_URL);
  const encodedText = encodeURIComponent(`${shareText} ${BOOK_URL}`);

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-gold selection:text-black">
      <EntryGate onAccessGranted={() => setIsAccessGranted(true)} />
      
      <AnimatePresence>
        {isAccessGranted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div 
              className="fixed top-0 left-0 z-[100] h-1 bg-gold" 
              style={{ width: `${scrollProgress}%` }}
            />

      <div className="mx-auto max-w-[820px] bg-black">
        
        {/* Cover Section */}
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] px-8 py-20 text-center md:px-16">
          <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
          <div className="absolute bottom-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-12 font-mono text-[9px] tracking-[5px] uppercase text-gold/40">
              Quantum Hospitality Solutions
            </div>
            
            <div className="mb-12 opacity-70">
              <Key className="h-8 w-8 text-gold" />
            </div>
            
            <h1 className="font-serif leading-none">
              <span className="mb-2 block text-sm italic tracking-[2px] text-gold md:text-xl">Somehow</span>
              <span className="block text-5xl font-black tracking-[-3px] md:text-9xl md:tracking-[-5px]">Managed</span>
            </h1>
            
            <div className="my-10 h-[1px] w-8 bg-gold opacity-60" />
            
            <div className="font-serif text-lg tracking-wider text-white/55 md:text-xl">
              Alejandro Soria
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[4px] uppercase text-white/10">
            Hospitality Edition &nbsp;·&nbsp; First Print
          </div>
        </section>

        {/* Dedication Section */}
        <section className="flex min-h-screen flex-col items-center justify-center border-b border-white/10 px-8 py-20 text-center md:px-20">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            className="mb-5 block font-serif text-8xl leading-none text-gold"
          >
            "
          </motion.span>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-[540px] space-y-6"
          >
            <p className="font-serif text-xl italic leading-relaxed text-white/80">
              To every person who has ended a brutal shift and come back the next morning anyway. You are not just doing a job. You are carrying something most people will never understand — the weight of other people's comfort, their safety, their experiences. That is not ordinary work.
            </p>
            <p className="font-serif text-xl italic leading-relaxed text-white/80">
              To the front desk agent who smiled at 11 PM. To the housekeeper who treated every room as if it were her own. To the night auditor who sat alone with the building. To the chef who never got the credit. To every GM who stayed long after everyone else left.
            </p>
            <p className="font-serif text-xl italic leading-relaxed text-white/80">
              And to my brother, Juan Carlos — the best GM I have ever known. You taught me to love the people before you love the business. Everything in this book begins with what you showed me.
            </p>
            <span className="mt-10 block font-mono text-xs tracking-[3px] uppercase text-gold">
              — A.S.
            </span>
          </motion.div>
        </section>

        {/* TOC Section */}
        <section id="toc" className="flex min-h-screen flex-col justify-center border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <span className="mb-8 block font-mono text-[10px] tracking-[4px] uppercase text-gold md:mb-12 md:text-xs md:tracking-[5px]">Contents</span>
          <div className="space-y-0">
            {[
              { num: "00", title: "Foreword", sub: "The Houseman Who Fell in Love", id: "ch0" },
              { num: "01", title: "Day Zero", sub: "Opening a Hotel From Scratch", id: "ch1" },
              { num: "02", title: "The Turnaround", sub: "Walking Into a Broken Property", id: "ch2" },
              { num: "03", title: "The Money People", sub: "Ownership & Investors", id: "ch3" },
              { num: "04", title: "Your Team Is Everything", sub: "Real culture, real retention", id: "ch4" },
              { num: "05", title: "F&B Is Not an Amenity", sub: "Revenue strategy", id: "ch5" },
              { num: "06", title: "Modernization", sub: "The Last Industry to Modernize", id: "ch6" },
              { num: "07", title: "Running on Empty", sub: "COVID, family, resilience", id: "ch7" },
              { num: "08", title: "Closing Notes", sub: "What I Know Now", id: "ch8" },
              { num: "—", title: "About the Author", sub: "", id: "about" },
            ].map((item, i) => (
              <a 
                key={i} 
                href={`#${item.id}`}
                className="group flex items-center gap-4 border-b border-white/10 py-5 transition-colors hover:bg-white/5 active:bg-white/10 md:gap-6 md:py-4"
              >
                <span className="min-w-[24px] font-mono text-[9px] text-white/20 group-hover:text-gold md:min-w-[28px] md:pt-1 md:text-[10px]">{item.num}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white group-hover:text-gold md:text-base">{item.title}</div>
                  {item.sub && <div className="text-xs italic text-white/45 md:text-sm">{item.sub}</div>}
                </div>
                <ArrowRight className="h-4 w-4 text-white/10 transition-transform group-hover:translate-x-1 group-hover:text-gold md:h-5 md:w-5" />
              </a>
            ))}
          </div>
        </section>

        {/* Chapter 00 */}
        <section id="ch0" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">00 · Foreword</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch0", "The Houseman Who Fell in Love")}
                disabled={explainingId === 'ch0'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch0' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">The Houseman Who Fell in Love</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "I showed up thinking I was going to work in an office. I was. It just needed to be cleaned first."
          </span>
          
          <LivingPortrait 
            src={chapterImages['ch0']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch0'} 
            explanation={explanations['ch0']}
            hasError={errorIds['ch0']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch0')?.prompt || '', 'ch0')}
          />

          <div className="markdown-body">
            <p className="dropcap">
              Before anything else, let me be clear about what this book is and what it is not. I did not write this to inspire you to build a company. I did not write it to turn my journey into a template you should follow. There are enough books that try to do that. This is not one of them.
            </p>
            <p>
              I wrote this because I am the manager you always asked for and never had. The director of operations who still has GM experience in his hands and feet — not just on a résumé. The voice you needed when you were standing in the middle of something hard and nobody around you said anything useful. The support that was not there when you needed it. So I wrote it down.
            </p>
            <p>
              This is a manual. For the front desk agent who wants to understand why decisions above them get made the way they do. For the housekeeping supervisor who runs the most operationally complex department in the building and rarely gets acknowledged for it. For the GM who has been doing this fifteen years and still sometimes feels like they are improvising. For the F&B manager who knows something is wrong with the numbers but cannot name it precisely. For the new hire on week two still trying to understand what a hotel actually is.
            </p>
            
            <div className="relative my-10 overflow-hidden border border-white/10 bg-[#0d0d0d] px-11 py-9">
              <Quote className="absolute top-6 left-6 h-20 w-20 text-gold opacity-10" />
              <p className="relative z-10 font-serif text-xl italic leading-relaxed text-white">
                "I didn't write this because I figured it all out. I wrote it because I'm still in it, still learning, still making mistakes — and I got tired of pretending otherwise."
              </p>
              <cite className="relative z-10 mt-4 block font-mono text-[10px] tracking-[2px] uppercase text-gold not-italic">
                — A.S.
              </cite>
            </div>

            <h3 className="relative mb-4 mt-12 pl-4 font-serif text-2xl font-bold text-white before:absolute before:top-1 before:left-0 before:h-full before:w-[3px] before:rounded-sm before:bg-gold">
              Where I Started
            </h3>
            <p>
              I was born in South America and moved to the United States in 2009. After high school I enrolled in aviation academy. Before that, it had been soccer — my entire life built around the game. And then one day on a field, I waited for the feeling to return and it did not. I was ready for something else, though I did not know what yet.
            </p>
            
            <div className="my-10 border-l-[3px] border-gold bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-gold">The Beginning — Hampton Brand, 2009</span>
              <p className="font-serif text-base italic leading-relaxed text-white/65">
                My GM, Justin, was the person who gave me the real opportunity — alongside my brother, he is one of the people most responsible for who I became. I worked houseman from 9 to 3 and security from 5 to 3. Security meant a flashlight and a radio. That was it. And somehow, from the very first week, I loved it. I loved the structure of the hotel. Its rhythm. The way the building shifted energy at different hours. I did not know I was falling in love with an industry. I just knew I wanted to understand everything about how this place worked.
              </p>
            </div>

            <p>
              My English was not ready for a guest-facing role. So instead of waiting, I positioned myself. I spent time near the front desk. I learned to make keys. I printed registration cards. I answered phones when they let me. I watched how experienced agents handled complaints, how they read a guest, how they moved through a check-in with forty people in line. I was learning without being enrolled in anything.
            </p>
          </div>
        </section>

        {/* Chapter 01 */}
        <section id="ch1" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">01 · Day Zero</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch1", "Opening a Hotel From Scratch")}
                disabled={explainingId === 'ch1'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch1' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">Opening a Hotel From Scratch</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "You will never feel ready. Open anyway. The hotel will finish building itself around you."
          </span>

          <LivingPortrait 
            src={chapterImages['ch1']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch1'} 
            explanation={explanations['ch1']}
            hasError={errorIds['ch1']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch1')?.prompt || '', 'ch1')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              Opening day feels like this. You have been building toward it for months. You have made hundreds of decisions under pressure with information you wished you had but did not. Your team is a mix of people who are ready and people who are not — you know the difference, but you need all of them today because there is no one else. The building is ninety-something percent finished. The flag goes up whether the punch list is complete or not.
            </p>
            
            <div className="my-10 border-l-[3px] border-pink bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-pink">Lesson 01</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">The building is the easy part. Culture is not.</h4>
              <p className="text-sm leading-relaxed text-white/80">
                Contractors fix walls on a schedule. Nobody fixes a culture that was built wrong in the first ninety days on any schedule. Your front desk script cannot wait. Your housekeeping sequence cannot wait. Your service philosophy cannot wait. Start there — everything else arranges itself around it.
              </p>
            </div>

            <div className="my-10 grid grid-cols-1 bg-yellow md:grid-cols-3">
              <div className="border-b border-black/10 p-7 text-center md:border-b-0 md:border-r">
                <span className="block font-serif text-4xl font-black leading-none text-black">90</span>
                <div className="mt-2 text-[12px] font-medium leading-tight text-black/60">Days to permanently set a hotel's operational DNA</div>
              </div>
              <div className="border-b border-black/10 p-7 text-center md:border-b-0 md:border-r">
                <span className="block font-serif text-4xl font-black leading-none text-black">3×</span>
                <div className="mt-2 text-[12px] font-medium leading-tight text-black/60">The cost of fixing a culture problem vs. a systems problem</div>
              </div>
              <div className="p-7 text-center">
                <span className="block font-serif text-4xl font-black leading-none text-black">1</span>
                <div className="mt-2 text-[12px] font-medium leading-tight text-black/60">Chance to make a first impression on your entire market</div>
              </div>
            </div>

            <div className="my-10 border border-white/10 bg-[#0d0d0d] px-8 py-7">
              <span className="mb-5 block font-mono text-[10px] tracking-[3px] uppercase text-yellow">Pre-Opening Checklist</span>
              <div className="space-y-2">
                {[
                  { id: 'task1', text: "Weeks 1–4: Brand approvals finalized, all department heads hired, PMS and POS configuration begun." },
                  { id: 'task2', text: "Weeks 5–8: Full line staff hired, department training programs running, all safety certifications completed." },
                  { id: 'task3', text: "Weeks 9–10: Full mock operations — front desk, F&B service, housekeeping turns, room service." },
                  { id: 'task4', text: "Weeks 11–12: Soft open with invited guests only. Fix everything they find." },
                  { id: 'task5', text: "Week 13+: Grand opening. You are not fully ready. Open anyway. Fix in motion." }
                ].map((item, i) => (
                  <label key={i} className="flex cursor-pointer gap-3 border-b border-white/5 py-2 text-[15px] leading-relaxed text-white/80 transition-colors hover:bg-white/5 last:border-none">
                    <input type="checkbox" className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-pink accent-pink" />
                    {item.text}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Chapter 02 */}
        <section id="ch2" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">02 · The Turnaround</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch2", "Walking Into a Broken Property")}
                disabled={explainingId === 'ch2'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch2' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">Walking Into a Broken Property</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "Don't fix what you see first. Understand what broke it."
          </span>

          <LivingPortrait 
            src={chapterImages['ch2']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch2'} 
            explanation={explanations['ch2']}
            hasError={errorIds['ch2']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch2')?.prompt || '', 'ch2')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              The first time I walked into a genuinely distressed property, I made the mistake every new turnaround manager makes. I saw what was wrong and I started fixing it immediately — visibly, energetically, with the kind of motion I wanted ownership and the team to read as leadership. I fixed the wrong things. Confidently, efficiently, with full commitment — and I fixed the wrong things.
            </p>
            
            <div className="my-10 border border-white/10 bg-[#0d0d0d] p-8">
              <span className="mb-6 block font-mono text-[10px] tracking-[3px] uppercase text-gold">Interactive Framework — The 90-Day Turnaround Map</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                {[
                  { step: "D1–7", title: "Listen", content: "Walk every space, speak to every level, zero announcements." },
                  { step: "D8–14", title: "Diagnose", content: "Identify the three actual causes beneath all visible symptoms." },
                  { step: "D15–21", title: "Act", content: "Address non-negotiables: safety, toxic behavior, irregularities." },
                  { step: "D22–30", title: "Present", content: "Share root causes and 90-day plan with ownership." },
                  { step: "D31–90", title: "Execute", content: "Measure, adjust, and maintain weekly communication." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="group cursor-default rounded border border-white/5 bg-white/5 p-4 transition-colors hover:border-gold/30 hover:bg-gold/5"
                  >
                    <span className="mb-2 block font-mono text-[10px] text-yellow">{item.step}</span>
                    <div className="mb-1 font-bold text-white group-hover:text-gold">{item.title}</div>
                    <div className="text-[11px] leading-relaxed text-white/40">{item.content}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <p>
              The visible problems were symptoms. The actual cause was something quieter and deeper, embedded in how the team related to each other, in what had silently become normal. Activity looks like leadership. They have the same energy signature. But leadership without diagnosis is confident improvisation — and in a distressed property, that can reinforce the exact dynamics that created the crisis.
            </p>

            <div className="relative my-10 overflow-hidden border border-white/10 bg-[#0d0d0d] px-11 py-9">
              <Quote className="absolute top-6 left-6 h-20 w-20 text-gold opacity-10" />
              <p className="relative z-10 font-serif text-xl italic leading-relaxed text-white">
                "The person who knows the most about what's wrong with your hotel has been there three years and nobody has asked them yet. Go find that person on day one."
              </p>
              <cite className="relative z-10 mt-4 block font-mono text-[10px] tracking-[2px] uppercase text-gold not-italic">
                — A.S.
              </cite>
            </div>
          </div>
        </section>

        {/* Chapter 03 */}
        <section id="ch3" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">03 · The Money People</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch3", "Managing Ownership & Investors")}
                disabled={explainingId === 'ch3'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch3' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">Managing Ownership & Investors</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "They own the building. You run the building. These are not the same job."
          </span>

          <LivingPortrait 
            src={chapterImages['ch3']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch3'} 
            explanation={explanations['ch3']}
            hasError={errorIds['ch3']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch3')?.prompt || '', 'ch3')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              The quality of your ownership relationship is determined almost entirely before things go wrong — not during. The trust that lets you push back professionally on a bad decision, deliver a difficult month honestly, or advocate for your team against a cost-cutting proposal was built in the ordinary months before the hard one arrived. You cannot build it retroactively.
            </p>
            
            <div className="my-10 bg-yellow p-8">
              <span className="mb-2 block font-mono text-[10px] tracking-[3px] uppercase text-black/40">Demonstration — P&L Calculator</span>
              <h4 className="mb-5 font-serif text-xl font-bold text-black">Test Your Flow-Through</h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-black/60">Incremental Revenue ($)</label>
                    <input 
                      type="number" 
                      value={calcRevenue} 
                      onChange={(e) => setCalcRevenue(Number(e.target.value))}
                      className="w-full border-b border-black/20 bg-transparent py-2 font-mono text-xl font-bold text-black outline-none focus:border-black" 
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase text-black/60">Incremental GOP ($)</label>
                    <input 
                      type="number" 
                      value={calcGop} 
                      onChange={(e) => setCalcGop(Number(e.target.value))}
                      className="w-full border-b border-black/20 bg-transparent py-2 font-mono text-xl font-bold text-black outline-none focus:border-black" 
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded border border-black/10 bg-black/5 p-6 text-center">
                  <span className="mb-1 block text-[10px] font-bold uppercase text-black/40">Your Flow-Through</span>
                  <span className="font-serif text-5xl font-black text-black">
                    {calcRevenue > 0 ? Math.round((calcGop / calcRevenue) * 100) : 0}%
                  </span>
                  <div className="mt-2 text-[11px] font-medium text-black/60">A healthy benchmark for select-service hotels.</div>
                </div>
              </div>
            </div>

            <div className="my-10 border-l-[3px] border-pink bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-pink">Lesson 03</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">A P&L is a story. Tell it before they read it.</h4>
              <p className="text-sm leading-relaxed text-white/80">
                Never allow ownership to encounter a difficult month without context from you first. Call the day before the report is distributed. Own what is yours. Explain what happened, what you are doing, and what you expect. Surprises destroy trust faster than bad performance.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 04 */}
        <section id="ch4" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">04 · People First</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch4", "Your Team Is Everything")}
                disabled={explainingId === 'ch4'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch4' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">Your Team Is Everything</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "Real culture is not a ping-pong table or a pizza party. It's what happens when you aren't in the room."
          </span>

          <LivingPortrait 
            src={chapterImages['ch4']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch4'} 
            explanation={explanations['ch4']}
            hasError={errorIds['ch4']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch4')?.prompt || '', 'ch4')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              In hospitality, we talk about "service" as if it's something we can buy or install. It isn't. Service is an output of culture. And culture is the sum of every interaction your team has with each other. If your front desk agent is being treated poorly by their supervisor, they will eventually treat a guest poorly. It's a thermodynamic law of management: energy is conserved.
            </p>
            
            <div className="my-10 border border-white/10 bg-[#0d0d0d] p-8">
              <span className="mb-6 block font-mono text-[10px] tracking-[3px] uppercase text-gold">Interactive Tool — The Turnover Cost Calculator</span>
              <div className="space-y-6">
                <p className="text-sm text-white/60">Most managers underestimate the cost of losing a single line-level employee. Let's look at the reality.</p>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="rounded border border-white/5 bg-white/5 p-5">
                    <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">Recruitment</span>
                    <span className="font-serif text-2xl font-bold text-white">$1,500</span>
                    <p className="mt-1 text-[10px] text-white/40">Ads, interviewing time, background checks.</p>
                  </div>
                  <div className="rounded border border-white/5 bg-white/5 p-5">
                    <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">Training</span>
                    <span className="font-serif text-2xl font-bold text-white">$2,200</span>
                    <p className="mt-1 text-[10px] text-white/40">Shadowing, reduced productivity, supervisor time.</p>
                  </div>
                  <div className="rounded border border-white/5 bg-white/5 p-5">
                    <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">Lost Knowledge</span>
                    <span className="font-serif text-2xl font-bold text-white">$1,800</span>
                    <p className="mt-1 text-[10px] text-white/40">Guest relationships, property-specific nuances.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-white/40">Total Estimated Cost per Exit:</span>
                  <span className="font-serif text-3xl font-black text-gold">$5,500</span>
                </div>
              </div>
            </div>

            <p>
              Retention is not about paying the most. It's about being the place where people feel like they belong. I learned this from my brother, Juan Carlos. He didn't just manage people; he cared for them. He knew their kids' names, their struggles, their ambitions. He loved the people before he loved the business. And because of that, the business loved him back.
            </p>

            <div className="my-10 border-l-[3px] border-yellow bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-yellow">Lesson 04</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">Hire for attitude, train for skill.</h4>
              <p className="text-sm leading-relaxed text-white/80">
                I can teach anyone to use a PMS. I cannot teach someone to care about a guest's lost luggage at 2 AM. If they don't have the "hospitality heart" on day one, they won't have it on day one hundred. Don't compromise on the human element to fill a shift.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 05 */}
        <section id="ch5" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">05 · F&B Strategy</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch5", "F&B Is Not an Amenity")}
                disabled={explainingId === 'ch5'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch5' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">F&B Is Not an Amenity</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "Stop treating your restaurant like a loss leader. It's a profit center that happens to serve food."
          </span>

          <LivingPortrait 
            src={chapterImages['ch5']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch5'} 
            explanation={explanations['ch5']}
            hasError={errorIds['ch5']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch5')?.prompt || '', 'ch5')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              In many hotels, F&B is the department that everyone complains about but nobody wants to fix. It's "too expensive," "too hard to manage," or "just there for the guests." This is a failure of imagination. F&B is your most powerful tool for local engagement and brand identity. It's where the building comes alive.
            </p>
            
            <div className="my-10 border border-white/10 bg-[#0d0d0d] p-8">
              <span className="mb-6 block font-mono text-[10px] tracking-[3px] uppercase text-gold">The F&B Profitability Matrix</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded border border-white/5 bg-white/5 p-6">
                  <h5 className="mb-3 font-serif text-lg font-bold text-white">The Breakfast Trap</h5>
                  <p className="text-xs leading-relaxed text-white/60">
                    Free breakfast is a commodity. A <i>great</i> breakfast is a memory. If you're select-service, your breakfast is the last thing a guest experiences before they leave. Don't let it be a lukewarm buffet. Elevate one thing — the coffee, the local pastry, the service — and you elevate the whole stay.
                  </p>
                </div>
                <div className="rounded border border-white/5 bg-white/5 p-6">
                  <h5 className="mb-3 font-serif text-lg font-bold text-white">Labor vs. Revenue</h5>
                  <p className="text-xs leading-relaxed text-white/60">
                    F&B labor is the most volatile line item on your P&L. If you aren't cross-training your front desk to help during peak breakfast hours, or your servers to understand basic front desk tasks, you are leaving money on the table. Flexibility is the only way to protect your margins.
                  </p>
                </div>
              </div>
            </div>

            <p>
              Revenue strategy in F&B isn't just about menu prices. It's about capturing the "captive audience." Your guests are already in the building. Why are they ordering Uber Eats? If they are, you've failed to provide value, convenience, or quality. Fix that, and you fix your F&B P&L.
            </p>

            <div className="my-10 border-l-[3px] border-pink bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-pink">Lesson 05</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">Measure what matters.</h4>
              <p className="text-sm leading-relaxed text-white/80">
                Stop looking at F&B in isolation. Look at it as a driver of RevPAR. A hotel with a top-rated restaurant can command a higher ADR across the board. The restaurant is the "vibe" that guests pay for, even if they only eat there once.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 06 */}
        <section id="ch6" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">06 · Modernization</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch6", "The Last Industry to Modernize")}
                disabled={explainingId === 'ch6'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch6' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">The Last Industry to Modernize</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "Technology is not your enemy. It's your leverage. Use it to be more human, not less."
          </span>

          <LivingPortrait 
            src={chapterImages['ch6']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch6'} 
            explanation={explanations['ch6']}
            hasError={errorIds['ch6']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch6')?.prompt || '', 'ch6')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              Hospitality is notoriously slow to change. We still use systems built in the 90s. We still rely on manual checklists and paper logs. This gap is your greatest advantage. If you can embrace technology while everyone else is resisting it, you can operate at a level of efficiency and personalization they can't even imagine.
            </p>
            
            <div className="my-10 border border-white/10 bg-[#0d0d0d] p-8">
              <span className="mb-6 block font-mono text-[10px] tracking-[3px] uppercase text-gold">Quantum Hospitality Solutions — The AI Advantage</span>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded border border-white/5 bg-white/5 p-5">
                  <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">ReviewFlow</span>
                  <p className="text-[11px] leading-relaxed text-white/60">AI-powered guest review management that sounds human, not robotic.</p>
                </div>
                <div className="rounded border border-white/5 bg-white/5 p-5">
                  <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">EventFlow</span>
                  <p className="text-[11px] leading-relaxed text-white/60">Streamlining group bookings and event coordination with intelligent automation.</p>
                </div>
                <div className="rounded border border-white/5 bg-white/5 p-5">
                  <span className="mb-2 block text-[10px] font-bold uppercase text-gold/60">ShuttleFlow</span>
                  <p className="text-[11px] leading-relaxed text-white/60">Real-time tracking and optimization for hotel transportation services.</p>
                </div>
              </div>
            </div>

            <p>
              The goal of technology in a hotel isn't to replace the front desk agent. It's to free them from the screen. If the AI handles the repetitive tasks — the check-in paperwork, the basic FAQs, the data entry — the agent can actually look the guest in the eye and have a conversation. That is where hospitality happens.
            </p>

            <div className="my-10 border-l-[3px] border-yellow bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-yellow">Lesson 06</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">Don't be afraid of the "Black Box."</h4>
              <p className="text-sm leading-relaxed text-white/80">
                You don't need to understand how the AI works. You need to understand how it helps your team. If it saves them an hour a day, that's an hour they can spend on guest experience. That's an hour they can spend on their own development. That's the real ROI.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 07 */}
        <section id="ch7" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">07 · Resilience</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch7", "Running on Empty")}
                disabled={explainingId === 'ch7'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch7' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">Running on Empty</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "Burnout is not a badge of honor. It's a failure of sustainability."
          </span>

          <LivingPortrait 
            src={chapterImages['ch7']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch7'} 
            explanation={explanations['ch7']}
            hasError={errorIds['ch7']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch7')?.prompt || '', 'ch7')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              2020 changed everything. For the first time in my career, the buildings were empty. The rhythm stopped. And in that silence, I realized how much I had been sacrificing. I had been running on empty for years, mistaking exhaustion for dedication. I wasn't the only one. Our entire industry was built on the backs of people who didn't know how to stop.
            </p>
            
            <div className="my-10 border border-white/10 bg-[#0d0d0d] p-8">
              <span className="mb-6 block font-mono text-[10px] tracking-[3px] uppercase text-gold">The Resilience Audit</span>
              <div className="space-y-4">
                <p className="text-sm text-white/60">Ask yourself these three questions. If the answer to any is "No," you are at risk.</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded border border-white/5 bg-white/5 p-4">
                    <CheckSquare className="h-5 w-5 text-gold" />
                    <span className="text-sm text-white/80">Can your hotel run for 48 hours without you checking your email?</span>
                  </div>
                  <div className="flex items-center gap-3 rounded border border-white/5 bg-white/5 p-4">
                    <CheckSquare className="h-5 w-5 text-gold" />
                    <span className="text-sm text-white/80">Do you know the name of your child's teacher or your partner's best friend?</span>
                  </div>
                  <div className="flex items-center gap-3 rounded border border-white/5 bg-white/5 p-4">
                    <CheckSquare className="h-5 w-5 text-gold" />
                    <span className="text-sm text-white/80">Have you taken a full week off in the last twelve months?</span>
                  </div>
                </div>
              </div>
            </div>

            <p>
              I took a step back. I focused on my family. I realized that the hotel would still be there, but my kids wouldn't be young forever. This wasn't a retreat; it was a recalibration. I came back stronger, more focused, and with a new mission: to build tools that make this industry more sustainable for everyone in it.
            </p>

            <div className="my-10 border-l-[3px] border-pink bg-[#0d0d0d] px-8 py-7">
              <span className="mb-3 block font-mono text-[10px] tracking-[3px] uppercase text-pink">Lesson 07</span>
              <h4 className="mb-3 font-serif text-xl font-bold text-white">Protect your peace.</h4>
              <p className="text-sm leading-relaxed text-white/80">
                You cannot pour from an empty cup. If you are burned out, you are a liability to your team and your guests. Learning to say "No" is a leadership skill. Learning to delegate is a leadership skill. Learning to rest is a survival skill.
              </p>
            </div>
          </div>
        </section>

        {/* Chapter 08 */}
        <section id="ch8" className="border-b border-white/10 px-6 py-16 md:px-20 md:py-20">
          <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between">
            <span className="font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">08 · Closing Notes</span>
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <button 
                onClick={() => generateExplanation("ch8", "What I Know Now")}
                disabled={explainingId === 'ch8'}
                className="flex items-center gap-2 rounded-full border border-gold/10 bg-gold/5 px-3 py-1.5 font-mono text-[8px] tracking-[2px] uppercase text-gold/60 hover:text-gold disabled:opacity-50 md:border-none md:bg-transparent md:p-0 md:text-[9px]"
              >
                {explainingId === 'ch8' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Info className="h-3 w-3" />}
                Guide Me
              </button>
            </div>
          </div>

          <h2 className="mb-4 font-serif text-3xl font-black tracking-tight md:text-6xl">What I Know Now</h2>
          <span className="mb-8 block border-b border-gold pb-6 font-serif text-base italic leading-relaxed text-white/45 md:mb-12 md:pb-9 md:text-lg">
            "You are not just managing a building. You are managing a legacy. Make it one worth leaving."
          </span>

          <LivingPortrait 
            src={chapterImages['ch8']} 
            alt="Visualizing the story" 
            isGenerating={generatingImageId === 'ch8'} 
            explanation={explanations['ch8']}
            hasError={errorIds['ch8']}
            onRetry={() => generateChapterImage(CHAPTERS.find(c => c.id === 'ch8')?.prompt || '', 'ch8')}
          />
          
          <div className="markdown-body">
            <p className="dropcap">
              If you've made it this far, you know that hospitality isn't just a job. It's a calling. It's the art of making people feel at home when they are away from it. It's the science of managing complexity with grace. And it's the privilege of leading teams through some of the hardest shifts of their lives.
            </p>
            
            <p>
              The title of this book, "Somehow I Managed," is a bit of a joke. Because the truth is, we never just "somehow" manage. We manage with intention. We manage with heart. We manage with a relentless focus on the people who make the building work.
            </p>

            <div className="my-10 border border-white/10 bg-[#0d0d0d] px-11 py-9 text-center">
              <Quote className="mx-auto mb-6 h-12 w-12 text-gold opacity-20" />
              <p className="font-serif text-2xl italic leading-relaxed text-white">
                "The building is just the stage. The people are the performance. Your job is to make sure the lights never go out on them."
              </p>
            </div>

            <p>
              My hope for you is that you find the same joy in this industry that I have. That you build cultures that people never want to leave. That you use technology to make your life easier and your guests' lives better. And that you never forget why you started in the first place.
            </p>

            <p className="mt-12 font-serif text-xl font-bold text-gold">
              Go manage something great.
            </p>
            
            <span className="mt-4 block font-mono text-xs tracking-[3px] uppercase text-white/40">
              — Alejandro Soria
            </span>
          </div>
        </section>




        {/* About Section */}
        <section id="about" className="px-6 py-16 md:px-20 md:py-20">
          <span className="mb-8 block font-mono text-[10px] tracking-[5px] uppercase text-gold md:mb-12 md:text-xs">About the Author</span>
          <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-[170px_1fr] md:gap-11">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative flex h-[210px] w-[170px] flex-col items-center justify-center bg-[#111] p-6 text-center before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-full before:bg-gold">
                <span className="mb-4 font-mono text-[9px] uppercase tracking-[3px] text-gold">Interactive Edition</span>
                <p className="font-serif text-[11px] italic leading-relaxed text-white/60">
                  This is the interactive version.
                </p>
                <div className="my-3 h-[1px] w-8 bg-gold/20" />
                <p className="font-serif text-[11px] italic leading-relaxed text-white/60">
                  Hard copy full chapters drop April 13.
                </p>
                <div className="mt-5 rounded-sm border border-gold/20 bg-gold/5 px-2 py-1 font-mono text-[8px] uppercase tracking-[1px] text-gold/80">
                  Sign up for waiting list
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="mb-1 font-serif text-3xl font-black tracking-tight text-white md:text-4xl">Alejandro Soria</h2>
              <span className="mb-6 block font-mono text-[10px] tracking-[2px] uppercase text-gold">Operator · Founder · 10+ Years in the Building</span>
              <div className="space-y-4 text-sm leading-relaxed text-white/80 md:text-base">
                <p>
                  Alejandro Soria was born in South America and moved to the United States in 2009. He began his career as a houseman and spent the next decade building operational expertise from the ground up: night auditor, front office manager, assistant general manager, and general manager across limited, select, and full-service hotels spanning multiple national brands.
                </p>
                <p>
                  He founded Quantum Hospitality Solutions — AI-powered operational tools built by a hotel operator for hotel operators. He is not a tech founder who studied hotels. He is an operator who studied technology.
                </p>
              </div>
              
              <div className="mt-7 flex flex-wrap justify-center gap-6 border-t border-white/10 pt-6 md:justify-start md:gap-7">
                <div>
                  <span className="block font-serif text-2xl font-black leading-none text-gold md:text-3xl">10+</span>
                  <div className="mt-1 text-[10px] text-white/20 md:text-[11px]">Years in operations</div>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-black leading-none text-gold md:text-3xl">6+</span>
                  <div className="mt-1 text-[10px] text-white/20 md:text-[11px]">Tools built & live</div>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-black leading-none text-gold md:text-3xl">3</span>
                  <div className="mt-1 text-[10px] text-white/20 md:text-[11px]">Property tiers managed</div>
                </div>
              </div>
              
              <div className="mt-8 md:mt-6">
                <a 
                  href="https://www.linkedin.com/in/alejandro-soria-3a849915a" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-3 font-mono text-xs tracking-wider text-gold transition-colors hover:bg-gold hover:text-black md:rounded-none md:px-4 md:py-2"
                >
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-16 text-center md:px-20 md:py-20">
          <Key className="mb-6 h-6 w-6 text-gold opacity-60 md:mb-9 md:h-8 md:w-8" />
          <h2 className="mb-4 font-serif text-2xl font-black text-white md:text-4xl">Quantum Hospitality Solutions</h2>
          <p className="mb-6 max-w-[440px] text-xs leading-relaxed text-white/45 md:mb-4 md:text-sm">
            AI-powered operational tools built by a hotel operator, for hotel operators.
          </p>
          <span className="max-w-[300px] font-mono text-[8px] tracking-[1px] text-white/20 uppercase md:max-w-none md:text-[10px] md:tracking-[2px]">
            Attenda · ReviewFlow · EventFlow · ShuttleFlow · DirectoryOS · SEO Engine · Content Studio
          </span>
          <div className="my-8 h-10 w-[1px] bg-gradient-to-b from-transparent via-gold to-transparent md:my-11 md:h-14" />
          <div className="font-serif text-xl italic text-white/30 md:text-2xl">Somehow I Managed</div>
          <div className="mt-2 font-mono text-[8px] tracking-[2px] uppercase text-white/10 md:text-[10px] md:tracking-[3px]">Hospitality Edition · First Print</div>
        </section>

        {/* Share Section */}
        <section className="border-t border-white/10 bg-[#050505] px-6 py-16 text-center md:px-20 md:py-20">
          <span className="mb-5 block font-mono text-[9px] tracking-[4px] uppercase text-gold md:text-[10px] md:tracking-[5px]">Spread the Word</span>
          <h2 className="mb-3 font-serif text-2xl font-black text-white md:text-3xl">Know someone who needs this?</h2>
          <p className="mx-auto mb-8 max-w-[440px] text-xs leading-relaxed text-white/45 md:mb-9 md:text-sm">
            Share with 5 colleagues in hospitality. They will thank you for it.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#0077b5] px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 md:px-5 md:py-3 md:text-sm"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a 
              href={`https://wa.me/?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#25d366] px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 md:px-5 md:py-3 md:text-sm"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black border border-white/20 px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 md:px-5 md:py-3 md:text-sm"
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a 
              href={`mailto:?subject=You need to read this book&body=${encodedText}`}
              className="flex items-center gap-2 rounded-lg bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 md:px-5 md:py-3 md:text-sm"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <button 
              onClick={copyLink}
              className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-xs font-semibold text-black transition-transform hover:-translate-y-0.5 md:px-5 md:py-3 md:text-sm"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </section>

      </div>
      
      {/* Fixed Navigation Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 md:bottom-10 md:right-10">
        <FocusAudio />
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-black shadow-lg shadow-gold/20 transition-colors hover:bg-yellow"
          title="Scroll to Top"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => document.getElementById('toc')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg shadow-white/10 transition-colors hover:bg-white/90"
          title="Table of Contents"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-gold px-6 py-3 font-bold text-black transition-all duration-300 ${copied ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
        Copied!
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
