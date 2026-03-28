import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Volume2, VolumeX, Loader2, Sparkles } from 'lucide-react';

export const FocusAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const AUDIO_URL = "https://soundcloud.com/thrilz-network/music-focus"; // New Focus Track

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Audio playback failed:", err);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    // Show tooltip initially to let user know about focus audio
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-end">
      <AnimatePresence>
        {showTooltip && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-full right-0 mb-4 whitespace-nowrap rounded-lg bg-gold/90 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black shadow-xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Focus Mode Available
            </div>
            <div className="absolute -bottom-1 right-5 h-2 w-2 rotate-45 bg-gold/90" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-500 ${
          isPlaying 
            ? 'bg-gold text-black shadow-gold/40' 
            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
        }`}
        title={isPlaying ? "Stop Focus Audio" : "Play Focus Audio"}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <Headphones className="h-5 w-5" />
        )}
        
        {isPlaying && (
          <motion.div
            layoutId="playing-ring"
            className="absolute inset-0 rounded-full border-2 border-gold"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      <audio
        ref={audioRef}
        src={AUDIO_URL}
        loop
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};
