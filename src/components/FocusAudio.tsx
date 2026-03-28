import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Headphones, Volume2, Loader2, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    SC: any;
  }
}

export const FocusAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const widgetRef = useRef<any>(null);

  const SOUNDCLOUD_URL = "https://soundcloud.com/thrilz-network/music-focus";
  const EMBED_URL = `https://w.soundcloud.com/player/?url=${encodeURIComponent(SOUNDCLOUD_URL)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&loop=true`;

  useEffect(() => {
    // Load SoundCloud Widget API
    const script = document.createElement('script');
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    script.onload = () => {
      if (iframeRef.current && window.SC) {
        const widget = window.SC.Widget(iframeRef.current);
        widgetRef.current = widget;
        
        widget.bind(window.SC.Widget.Events.READY, () => {
          setWidgetReady(true);
        });

        widget.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
          setIsLoading(false);
        });

        widget.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false);
        });

        widget.bind(window.SC.Widget.Events.FINISH, () => {
          // Force loop if the URL parameter doesn't catch it
          widget.play();
        });

        widget.bind(window.SC.Widget.Events.ERROR, (err: any) => {
          console.error("SoundCloud Widget Error:", err);
          setIsLoading(false);
        });
      }
    };
    document.body.appendChild(script);

    // Show tooltip initially
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    
    return () => {
      document.body.removeChild(script);
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const togglePlay = () => {
    if (!widgetRef.current || !widgetReady) return;

    if (isPlaying) {
      // User requested that once pressed, it cannot stop
      return;
    } else {
      setIsLoading(true);
      widgetRef.current.play();
    }
  };

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
        disabled={!widgetReady}
        className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-500 ${
          isPlaying 
            ? 'bg-gold text-black shadow-gold/40' 
            : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
        } ${!widgetReady ? 'opacity-50 cursor-not-allowed' : ''}`}
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

      {/* Hidden SoundCloud Widget */}
      <iframe
        ref={iframeRef}
        src={EMBED_URL}
        className="hidden"
        allow="autoplay"
        title="SoundCloud Focus Audio"
      />
    </div>
  );
};
