'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ReviewCard } from '@/components/ui/ReviewCard';
import { reviews } from '@/data/content';
import { useRef, useState, useEffect } from 'react';
import { Ghost, Skull, Eye } from 'lucide-react';
import { GhostText, SoulWisps } from '@/components/effects/GhostText';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';

export function Reviews() {
  const { isDarkMode } = useTheme();
  const { playWhisper } = useSoundEffects();
  const containerRef = useRef(null);
  const [whisperText, setWhisperText] = useState('');
  const [showWhisper, setShowWhisper] = useState(false);
  
  // Whispers from the souls
  const whispers = [
    "can you hear us...",
    "we never left...",
    "join us...",
    "help...",
    "don't look away...",
    "we're still here...",
    "remember us...",
    "so cold..."
  ];

  // Random whispers in dark mode with sound
  useEffect(() => {
    if (!isDarkMode) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setWhisperText(whispers[Math.floor(Math.random() * whispers.length)]);
        setShowWhisper(true);
        playWhisper(0.3); // Play whisper sound
        setTimeout(() => setShowWhisper(false), 2500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isDarkMode, playWhisper]);

  // Helper to shift array
  const shift = (arr, n) => {
    if (!arr.length) return [];
    const offset = n % arr.length;
    return [...arr.slice(offset), ...arr.slice(0, offset)];
  };

  // Create columns with duplicated content for seamless loop
  const col1 = [...reviews, ...reviews]; 
  const col2 = [...shift(reviews, 2), ...shift(reviews, 2)];
  const col3 = [...shift(reviews, 4), ...shift(reviews, 4)];

  return (
    <section 
      id="reviews"
      ref={containerRef}
      className={`relative py-24 lg:py-32 overflow-hidden ${
        isDarkMode ? 'bg-black' : 'bg-[#fdfcfb]'
      }`}
    >
      {/* Dark mode: Ghostly fog effect */}
      {isDarkMode && (
        <>
          <div className="absolute inset-0 pointer-events-none">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-transparent to-red-950/20"
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          {/* Floating souls */}
          <motion.div 
            className="absolute top-20 left-10 text-red-900/20"
            animate={{ 
              y: [-20, 20, -20], 
              x: [-10, 10, -10],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ duration: 12, repeat: Infinity }}
          >
            <Ghost size={40} />
          </motion.div>
          <motion.div 
            className="absolute bottom-40 right-20 text-red-900/20"
            animate={{ 
              y: [20, -20, 20], 
              x: [10, -10, 10],
              opacity: [0.15, 0.35, 0.15] 
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          >
            <Ghost size={32} />
          </motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/4 text-red-900/10"
            animate={{ 
              y: [0, -30, 0], 
              rotate: [0, 10, 0],
              opacity: [0.05, 0.2, 0.05] 
            }}
            transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          >
            <Skull size={28} />
          </motion.div>
          
          {/* Whisper overlay */}
          <AnimatePresence>
            {showWhisper && (
              <motion.div 
                className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.p 
                  className="text-4xl md:text-6xl text-red-900/30 font-serif italic"
                  initial={{ scale: 0.8, filter: 'blur(10px)' }}
                  animate={{ scale: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 1.2, filter: 'blur(20px)' }}
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {whisperText}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      
      {/* Light mode: Background pattern */}
      {!isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_50%)]" />
        </div>
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20 lg:mb-28 relative z-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {isDarkMode ? (
            // Dark mode header - Souls theme with ghost text effect
            <>
              {/* Soul wisps rising from behind the title */}
              <SoulWisps className="z-0" />
              
              <motion.div 
                className="inline-flex items-center gap-3 mb-8 text-red-800/60 relative z-10"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Eye size={16} className="opacity-50" />
                <span className="text-xs font-bold tracking-[0.4em] uppercase">
                  Echoes of the Departed
                </span>
                <Eye size={16} className="opacity-50" />
              </motion.div>
              
              <h2 
                className="text-4xl sm:text-5xl lg:text-7xl mb-8 leading-[1.05] text-white relative z-10"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <GhostText 
                  text="Souls in" 
                  className="block mb-2"
                  interval={4000}
                  duration={2500}
                />
                <br />
                <span className="text-red-600 italic">
                  <GhostText 
                    text="Limbo" 
                    interval={4500}
                    duration={2500}
                  />
                </span>
              </h2>
              
              <motion.p 
                className="text-lg lg:text-xl max-w-2xl mx-auto text-gray-600 relative z-10"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                They checked in. They never checked out. Their voices linger between the walls, 
                whispering fragments of their final thoughts.
              </motion.p>

              {/* Soul counter */}
              <motion.div 
                className="mt-8 inline-flex items-center gap-2 px-4 py-2 border border-red-900/30 rounded-full"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-red-600"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs font-mono text-red-700/60">
                  {reviews.length} souls detected in this vicinity
                </span>
              </motion.div>
            </>
          ) : (
            // Light mode header
            <>
              <motion.div className="inline-flex items-center gap-3 mb-8 text-gold-500">
                <span className="w-12 h-px bg-current" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase">
                  Guest Stories
                </span>
                <span className="w-12 h-px bg-current" />
              </motion.div>
              
              <h2 
                className="text-4xl sm:text-5xl lg:text-7xl mb-8 leading-[1.05] text-pine-900"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Unforgettable<br /><span className="text-gold-500 italic">Memories</span>
              </h2>
              
              <p className="text-lg lg:text-xl max-w-2xl mx-auto text-pine-700/70">
                Join hundreds of satisfied guests who have experienced the magic of our mountain retreat.
              </p>
            </>
          )}
        </motion.div>

        {/* Scrolling Container */}
        <div className="relative h-[600px] overflow-hidden -mx-6 px-6 lg:-mx-0 lg:px-0">
          {/* Gradient masks */}
          <div className={`absolute top-0 left-0 right-0 h-32 z-10 bg-gradient-to-b ${
            isDarkMode ? 'from-black via-black/80 to-transparent' : 'from-[#fdfcfb] via-[#fdfcfb]/80 to-transparent'
          }`} />
          <div className={`absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t ${
            isDarkMode ? 'from-black via-black/80 to-transparent' : 'from-[#fdfcfb] via-[#fdfcfb]/80 to-transparent'
          }`} />

          {/* Dark mode: Vertical red lines like prison bars / soul containment */}
          {isDarkMode && (
            <div className="absolute inset-0 pointer-events-none z-[5] opacity-20">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-red-900 to-transparent"
                  style={{ left: `${(i + 1) * 8}%` }}
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-full">
            {/* Column 1 - Scroll Up */}
            <div className="w-full h-full overflow-hidden">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  duration: isDarkMode ? 60 : 40,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex flex-col"
              >
                {col1.map((review, i) => (
                  <div key={`col1-${i}`} className="mb-6 lg:mb-8">
                    <ReviewCard review={review} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Column 2 - Scroll Down */}
            <div className="hidden md:block w-full h-full overflow-hidden">
              <motion.div
                animate={{ y: ["-50%", "0%"] }}
                transition={{
                  duration: isDarkMode ? 70 : 50,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex flex-col"
              >
                {col2.map((review, i) => (
                  <div key={`col2-${i}`} className="mb-6 lg:mb-8">
                    <ReviewCard review={review} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Column 3 - Scroll Up */}
            <div className="hidden lg:block w-full h-full overflow-hidden">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  duration: isDarkMode ? 65 : 45,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="flex flex-col"
              >
                {col3.map((review, i) => (
                  <div key={`col3-${i}`} className="mb-6 lg:mb-8">
                    <ReviewCard review={review} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
