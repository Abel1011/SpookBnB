'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { Star, Quote, User, Ghost, Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ReviewCard({ review, index }) {
  const { isDarkMode } = useTheme();
  const { collectLetter, collectedLetterIds, fragment1Complete } = useEscape();
  const { playClick, playWhisper } = useSoundEffects();
  const [showClue, setShowClue] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [justCollected, setJustCollected] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Check if this letter was already collected
  const isCollected = review.hasClue && collectedLetterIds.includes(review.id);

  // Random glitch for dark mode
  useEffect(() => {
    if (!isDarkMode || !review.hasClue || isCollected) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 150);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isDarkMode, review.hasClue, isCollected]);

  // Handle letter collection
  const handleCollectLetter = () => {
    if (!review.hasClue || isCollected || !isDarkMode) return;
    
    const success = collectLetter(review.clueChar, review.id);
    if (success) {
      playWhisper(0.5); // Ghostly whisper when collecting soul fragment
      playClick(0.3); // Subtle click
      setJustCollected(true);
      setTimeout(() => setJustCollected(false), 1000);
    }
  };

  // Get initials from author name
  const getInitials = (name) => {
    const cleanName = name.replace(/[̷]/g, '');
    return cleanName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const authorName = isDarkMode ? review.darkAuthor : review.lightAuthor;

  // Dark mode card - ghostly soul appearance
  if (isDarkMode) {
    return (
      <motion.div 
        whileHover={{ scale: 1.02, y: -3 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: 'linear-gradient(180deg, rgba(20,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)',
          border: isCollected 
            ? '1px solid rgba(180, 130, 60, 0.4)' 
            : '1px solid rgba(127, 29, 29, 0.2)',
          boxShadow: isHovering 
            ? '0 0 30px rgba(127, 29, 29, 0.2), inset 0 0 20px rgba(127, 29, 29, 0.1)' 
            : 'none'
        }}
      >
        {/* Ghostly aura effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          animate={{ 
            background: [
              'radial-gradient(circle at 50% 0%, rgba(127,29,29,0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 0%, rgba(127,29,29,0.15) 0%, transparent 60%)',
              'radial-gradient(circle at 50% 0%, rgba(127,29,29,0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Soul icon */}
        <motion.div 
          className="absolute top-3 right-3 text-red-900/30"
          animate={{ 
            y: [-2, 2, -2], 
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <Ghost size={18} />
        </motion.div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-5 relative z-10">
          {/* Avatar / Letter collector */}
          <motion.div 
            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold relative ${
              review.hasClue && !isCollected
                ? 'bg-red-950/80 border border-red-700/50 text-red-400 cursor-pointer' 
                : isCollected 
                  ? 'bg-amber-950/50 border border-amber-700/40 text-amber-400'
                  : 'bg-red-950/50 border border-red-900/30 text-red-600/60'
            }`}
            onClick={handleCollectLetter}
            whileHover={review.hasClue && !isCollected ? { scale: 1.15, borderColor: 'rgba(220,38,38,0.6)' } : {}}
            whileTap={review.hasClue && !isCollected ? { scale: 0.9 } : {}}
            animate={glitch ? { x: [-2, 2, -1, 1, 0], opacity: [1, 0.5, 1] } : {}}
          >
            {review.hasClue ? (
              isCollected ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Check size={18} className="text-amber-400" />
                </motion.div>
              ) : (
                <motion.span 
                  className="text-base font-mono font-bold"
                  animate={justCollected ? { scale: [1, 2, 0] } : { opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: justCollected ? 0.3 : 2, repeat: justCollected ? 0 : Infinity }}
                >
                  {review.clueChar}
                </motion.span>
              )
            ) : (
              <Ghost size={16} className="opacity-40" />
            )}
            
            {/* Pulse for uncollected */}
            {review.hasClue && !isCollected && (
              <motion.div
                className="absolute inset-0 rounded-full border border-red-600/50"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            )}
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <motion.h4 
              className="font-medium text-sm text-red-300/80 truncate"
              animate={glitch ? { x: [-1, 1, 0] } : {}}
            >
              {authorName}
            </motion.h4>
            <p className="text-[10px] font-mono text-red-900/50 tracking-wider uppercase mt-0.5">
              {review.darkDate}
            </p>
          </div>
        </div>

        {/* Soul status indicator - like a heartbeat flatline */}
        <div className="flex items-center gap-1.5 mb-4 relative z-10">
          <motion.div 
            className="flex-1 h-px bg-gradient-to-r from-red-900/40 via-red-700/60 to-red-900/40"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono text-red-900/40 uppercase tracking-wider">departed</span>
          <motion.div 
            className="flex-1 h-px bg-gradient-to-r from-red-900/40 via-red-700/60 to-red-900/40"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          />
        </div>
        
        {/* Message from beyond */}
        <motion.p 
          className="text-[13px] leading-relaxed relative z-10 text-gray-500 italic"
          style={{ fontFamily: 'var(--font-serif)' }}
          animate={glitch ? { opacity: [1, 0.3, 1], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] } : {}}
        >
          "{review.darkText}"
        </motion.p>

        {/* Fragment indicator */}
        {review.hasClue && (
          <motion.div 
            className={`mt-4 pt-3 border-t ${isCollected ? 'border-amber-900/30' : 'border-red-900/20'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isCollected ? (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Sparkles size={12} className="text-amber-500" />
                <span className="text-[10px] font-mono text-amber-500/80">
                  Soul fragment "{review.clueChar}" bound
                </span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-red-600"
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono text-red-900/40">
                  Fragment detected • click to capture
                </span>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  // Light mode card - normal review style
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative p-8 rounded-[2rem] overflow-hidden transition-all duration-500 bg-white border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
    >
      {/* Quote Icon Background */}
      <div className="absolute top-6 right-6 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 text-gold-500">
        <Quote size={48} />
      </div>
      
      {/* Header: Author & Date */}
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-inner bg-stone-50 border border-stone-100 text-pine-900">
          {getInitials(authorName)}
        </div>
        
        <div>
          <h4 className="font-bold text-base text-pine-900">
            {authorName}
          </h4>
          <p className="text-xs font-medium tracking-wide uppercase text-gold-500">
            {review.lightDate}
          </p>
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-4 relative z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i}
            size={14}
            className="fill-gold-400 text-gold-400"
          />
        ))}
      </div>
      
      {/* Review text */}
      <p className="text-base leading-relaxed relative z-10 text-pine-800/70" style={{ fontFamily: 'var(--font-serif)' }}>
        "{review.lightText}"
      </p>
      
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-b from-gold-400/5 to-transparent" />
    </motion.div>
  );
}
