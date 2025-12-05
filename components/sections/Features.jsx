'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { features, darkClues } from '@/data/content';
import { useState, useEffect, useCallback } from 'react';
import { Scroll, Eye, Flame, Key, AlertTriangle, Lock, Check, Unlock } from 'lucide-react';

const clueIcons = {
  scroll: Scroll,
  eye: Eye,
  flame: Flame,
  key: Key,
};

function ClueCard({ clue, index, isTransitioning, fragmentStatus, allPreviousComplete }) {
  const [revealed, setRevealed] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const Icon = clueIcons[clue.icon] || Scroll;
  
  // Check if this fragment is complete
  const isComplete = fragmentStatus[index];
  
  // Special state for Fragment IV when first 3 are complete
  const isEscapeReady = index === 3 && allPreviousComplete && !isComplete;

  useEffect(() => {
    // Random glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Reset revealed state when cards shuffle
  useEffect(() => {
    if (isTransitioning) {
      setRevealed(false);
    }
  }, [isTransitioning]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Portal ready glow effect for Fragment IV */}
      {isEscapeReady && (
        <motion.div
          className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-lg"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Card background with torn paper effect */}
      <div className={`relative bg-gray-950 border overflow-hidden ${
        isComplete ? 'border-amber-900/40' : 
        isEscapeReady ? 'border-amber-500/50 shadow-lg shadow-amber-500/20' : 
        'border-red-900/20'
      }`}>
        {/* Distressed edges */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-900/30 to-transparent" />
        
        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/3 to-transparent pointer-events-none"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Content */}
        <div className="relative p-6 lg:p-8">
          {/* Header with fragment number */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                  isComplete 
                    ? 'bg-amber-950/50 border-amber-800/50 text-amber-400'
                    : isEscapeReady
                    ? 'bg-amber-900/30 border-amber-500/50 text-amber-400'
                    : 'bg-red-950/50 border-red-900/30 text-red-500'
                }`}
                animate={
                  isEscapeReady 
                    ? { scale: [1, 1.1, 1], boxShadow: ['0 0 0px rgba(245, 158, 11, 0)', '0 0 15px rgba(245, 158, 11, 0.5)', '0 0 0px rgba(245, 158, 11, 0)'] }
                    : glitching && !isComplete 
                    ? { x: [-2, 2, -2, 0], opacity: [1, 0.5, 1] } 
                    : {}
                }
                transition={isEscapeReady ? { duration: 1.5, repeat: Infinity } : {}}
              >
                {isComplete ? <Check size={20} /> : <Icon size={20} />}
              </motion.div>
              <div>
                <motion.p 
                  className={`text-xs font-mono tracking-widest ${
                    isComplete ? 'text-amber-500' : 
                    isEscapeReady ? 'text-amber-400' :
                    'text-red-600'
                  }`}
                  animate={
                    isEscapeReady 
                      ? { opacity: [0.7, 1, 0.7] }
                      : glitching && !isComplete 
                      ? { opacity: [1, 0, 1] } 
                      : {}
                  }
                  transition={isEscapeReady ? { duration: 1.5, repeat: Infinity } : {}}
                >
                  {isEscapeReady ? 'IV: PORTAL READY' : clue.riddleTitle} {isComplete && '✓'}
                </motion.p>
                <div className="flex gap-1 mt-1">
                  {[...Array(4)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2 h-2 rounded-full ${
                        isComplete 
                          ? 'bg-amber-500' 
                          : i < index + 1 ? 'bg-red-600' : 'bg-red-900/30'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            {isComplete ? (
              <Unlock className="w-4 h-4 text-amber-500/60" />
            ) : (
              <Lock className="w-4 h-4 text-red-900/40" />
            )}
          </div>

          {/* Riddle text - changes when complete or escape ready */}
          <motion.div 
            className="mb-6"
            animate={glitching && !isComplete && !isEscapeReady ? { x: [-1, 1, 0] } : {}}
          >
            {isComplete ? (
              <p className="text-amber-500/70 text-sm leading-relaxed font-mono italic">
                "The soul fragment resonates... bound to your will."
              </p>
            ) : isEscapeReady ? (
              <motion.div>
                <motion.p 
                  className="text-amber-400 text-sm leading-relaxed font-mono"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  "The fragments have aligned. Scroll to where hope fades...
                </motion.p>
                <motion.p
                  className="text-amber-500/80 text-sm font-mono mt-2 flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  The portal awaits in 'There Is No Way Out'
                </motion.p>
              </motion.div>
            ) : (
              <p className="text-gray-400 text-sm leading-relaxed font-mono">
                "{clue.riddleText}"
              </p>
            )}
          </motion.div>

          {/* Hint area - appears on interaction */}
          <motion.div
            className="relative overflow-hidden"
            initial={false}
            animate={{ height: revealed && !isComplete ? 'auto' : '0px' }}
          >
            <div className="pt-4 border-t border-red-900/20">
              <p className="text-red-400/70 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                <span className="italic">{clue.hint}</span>
              </p>
            </div>
          </motion.div>

          {/* Reveal hint button - unique text per card, hidden when complete */}
          {!isComplete && (
            <motion.button
              onClick={() => setRevealed(!revealed)}
              className="mt-4 text-xs font-mono text-gray-500 hover:text-red-400 transition-colors flex items-center gap-2"
              whileHover={{ x: 3 }}
            >
              <span className="w-4 h-px bg-current" />
              {revealed ? '[ hide ]' : clue.buttonText || '...'}
            </motion.button>
          )}
          
          {/* Complete indicator */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-xs font-mono text-amber-500/60 flex items-center gap-2"
            >
              <Check size={12} />
              Soul fragment bound
            </motion.div>
          )}
        </div>

        {/* Decorative corner marks */}
        <div className={`absolute top-2 left-2 w-4 h-4 border-l border-t ${isComplete ? 'border-green-900/30' : 'border-red-900/30'}`} />
        <div className={`absolute top-2 right-2 w-4 h-4 border-r border-t ${isComplete ? 'border-green-900/30' : 'border-red-900/30'}`} />
        <div className={`absolute bottom-2 left-2 w-4 h-4 border-l border-b ${isComplete ? 'border-green-900/30' : 'border-red-900/30'}`} />
        <div className={`absolute bottom-2 right-2 w-4 h-4 border-r border-b ${isComplete ? 'border-green-900/30' : 'border-red-900/30'}`} />
      </div>
    </motion.div>
  );
}

export function Features() {
  const { isDarkMode } = useTheme();
  const { fragment1Complete, fragment2Complete, fragment3Complete, fragment4Complete, collectedLetters } = useEscape();
  const { playStatic, stopSound } = useSoundEffects();
  const [sectionGlitch, setSectionGlitch] = useState(false);
  const [textCorruption, setTextCorruption] = useState(0);
  const [shuffledClues, setShuffledClues] = useState(darkClues);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showStatic, setShowStatic] = useState(false);

  // Fragment status array for ClueCards
  const fragmentStatus = [fragment1Complete, fragment2Complete, fragment3Complete, fragment4Complete];

  // Shuffle function
  const shuffleClues = useCallback(() => {
    const shuffled = [...darkClues].sort(() => Math.random() - 0.5);
    setShuffledClues(shuffled);
  }, []);

  // Shuffle clues every 30 seconds with TV static effect
  useEffect(() => {
    if (!isDarkMode) {
      setShuffledClues(darkClues);
      return;
    }

    const shuffleInterval = setInterval(() => {
      // Phase 1: Start transition, show static with sound
      setIsTransitioning(true);
      setShowStatic(true);
      playStatic(0.4); // Play static sound!
      
      // Phase 2: After 1 second of static, shuffle
      setTimeout(() => {
        shuffleClues();
      }, 1000);
      
      // Phase 3: After 2 seconds total, hide static and stop sound
      setTimeout(() => {
        setShowStatic(false);
        setIsTransitioning(false);
        stopSound('static');
      }, 2000);
      
    }, 30000); // Every 30 seconds

    return () => clearInterval(shuffleInterval);
  }, [isDarkMode, shuffleClues]);

  // Glitch effect for dark mode
  useEffect(() => {
    if (!isDarkMode) return;
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setSectionGlitch(true);
        setTimeout(() => setSectionGlitch(false), 100 + Math.random() * 100);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, [isDarkMode]);

  // Progressive corruption
  useEffect(() => {
    if (!isDarkMode) {
      setTextCorruption(0);
      return;
    }
    const corruptionInterval = setInterval(() => {
      setTextCorruption(prev => Math.min(prev + 1, 8));
    }, 1000);
    return () => clearInterval(corruptionInterval);
  }, [isDarkMode]);

  return (
    <section 
      id="amenities"
      className={`relative py-24 lg:py-32 overflow-hidden ${
        isDarkMode ? 'bg-black' : 'bg-gradient-to-b from-[#f5f0e8] via-[#faf7f2] to-[#fdfcfb]'
      }`}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className={`absolute -top-40 -right-40 w-[40rem] h-[40rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-red-900/10' : 'bg-gold-400/10'
          }`}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className={`absolute -bottom-40 -left-40 w-[40rem] h-[40rem] rounded-full blur-3xl ${
            isDarkMode ? 'bg-red-900/10' : 'bg-pine-800/5'
          }`}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Dark mode: Floating particles */}
      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ 
                y: [0, -100 - Math.random() * 50],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Dark mode: Scan lines overlay */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />
        </div>
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20 lg:mb-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={`inline-flex items-center gap-3 mb-8 ${
              isDarkMode ? 'text-red-600/50' : 'text-gold-500'
            }`}
          >
            <span className="w-12 h-px bg-current" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">
              {isDarkMode ? '...' : 'Premium Amenities'}
            </span>
            <span className="w-12 h-px bg-current" />
          </motion.div>
          
          <h2 className={`text-4xl sm:text-5xl lg:text-7xl mb-8 leading-[1.05] ${
            isDarkMode ? 'text-white' : 'text-pine-900'
          }`} style={{ fontFamily: 'var(--font-serif)' }}>
            {isDarkMode ? (
              <div className="relative">
                {/* Glitch layers */}
                {textCorruption > 2 && (
                  <motion.div 
                    className="absolute inset-0 text-red-500/30 select-none"
                    animate={{ x: [-3, 3, -2, 0], opacity: [0.3, 0.5, 0.2] }}
                    transition={{ duration: 0.12, repeat: Infinity }}
                  >
                    <span>THEY LEFT</span> <span className="italic">WARNINGS</span>
                  </motion.div>
                )}
                {textCorruption > 4 && (
                  <motion.div 
                    className="absolute inset-0 text-cyan-500/20 select-none"
                    animate={{ x: [2, -2, 3, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity }}
                  >
                    <span>THEY LEFT</span> <span className="italic">WARNINGS</span>
                  </motion.div>
                )}
                
                {/* Main text with distortion */}
                <motion.div
                  animate={sectionGlitch ? { 
                    x: [0, -2, 3, -1, 0],
                    filter: ['blur(0px)', 'blur(1px)', 'blur(0px)']
                  } : {}}
                  transition={{ duration: 0.15 }}
                >
                  <motion.span 
                    className="text-red-500"
                    animate={textCorruption > 3 ? { 
                      textShadow: [
                        '0 0 0px rgba(220, 38, 38, 0)',
                        '0 0 30px rgba(220, 38, 38, 0.5)',
                        '0 0 0px rgba(220, 38, 38, 0)'
                      ]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    THEY LEFT
                  </motion.span>{' '}
                  <motion.span 
                    className="text-red-600 italic"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    WARNINGS
                  </motion.span>
                </motion.div>
              </div>
            ) : (
              <>Curated for Your<br /><span className="text-gold-500 italic">Comfort</span></>
            )}
          </h2>
          
          <p className={`text-lg lg:text-xl max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-600' : 'text-pine-700/70'
          }`}>
            {isDarkMode ? (
              <motion.span
                animate={sectionGlitch ? { opacity: [1, 0.5, 1] } : {}}
              >
                <span className="text-gray-500">Scratched into walls.</span>{' '}
                <motion.span 
                  className="text-red-500/90"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Whispered by the dying.
                </motion.span>{' '}
                <span className="text-gray-500">Read them carefully.</span>
              </motion.span>
            ) : (
              'Experience the perfect blend of rustic charm and modern luxury in every detail of your mountain retreat.'
            )}
          </p>
        </motion.div>
        
        {/* Light mode: Feature cards */}
        {!isDarkMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        )}

        {/* Dark mode: Cryptic clue cards with TV static transition */}
        {isDarkMode && (
          <div className="relative">
            {/* TV Static overlay during transition */}
            <AnimatePresence>
              {showStatic && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-20 pointer-events-none"
                >
                  {/* Static noise */}
                  <div className="absolute inset-0 bg-gray-900">
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        opacity: 0.4,
                      }}
                      animate={{ 
                        backgroundPosition: ['0% 0%', '100% 100%'],
                        opacity: [0.3, 0.5, 0.2, 0.6, 0.3]
                      }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                    />
                    {/* Horizontal glitch lines */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute left-0 right-0 h-1 bg-red-500/30"
                        style={{ top: `${10 + i * 12}%` }}
                        animate={{ 
                          x: [-20, 20, -10, 15, 0],
                          opacity: [0, 1, 0, 0.5, 0],
                          scaleX: [1, 1.5, 0.8, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 0.15, 
                          repeat: Infinity,
                          delay: i * 0.05 
                        }}
                      />
                    ))}
                    {/* Center text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.p
                        className="text-red-500 font-mono text-lg tracking-widest"
                        animate={{ 
                          opacity: [0, 1, 0, 1, 0],
                          x: [-5, 5, -3, 2, 0]
                        }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        ▓▓▓ SIGNAL LOST ▓▓▓
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clue cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <AnimatePresence mode="wait">
                {shuffledClues.map((clue, index) => (
                  <ClueCard 
                    key={`${clue.id}-${shuffledClues.map(c => c.id).join('-')}`} 
                    clue={clue} 
                    index={clue.id - 1}
                    isTransitioning={isTransitioning}
                    fragmentStatus={fragmentStatus}
                    allPreviousComplete={fragment1Complete && fragment2Complete && fragment3Complete}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Letter collection progress for Fragment 1 */}
            {collectedLetters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-4 bg-gray-950/80 border border-red-900/30 max-w-md mx-auto"
              >
                <p className="text-xs font-mono text-gray-500 mb-2">Fragment I Progress:</p>
                <div className="flex justify-center gap-2">
                  {['L', 'I', 'G', 'H', 'T'].map((letter, i) => (
                    <motion.div
                      key={letter}
                      className={`w-10 h-10 flex items-center justify-center font-mono text-lg font-bold border ${
                        collectedLetters.includes(letter)
                          ? 'bg-amber-950/50 border-amber-600/50 text-amber-400'
                          : 'bg-gray-900 border-red-900/30 text-red-900/30'
                      }`}
                      initial={collectedLetters.includes(letter) ? { scale: 0 } : {}}
                      animate={collectedLetters.includes(letter) ? { scale: 1 } : {}}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                {fragment1Complete && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-amber-400 text-xs font-mono text-center mt-3"
                  >
                    ✓ The word resonates: LIGHT
                  </motion.p>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* Bottom decorative element */}
        <motion.div
          className="mt-20 lg:mt-28 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {isDarkMode ? (
            <motion.div
              className="text-center relative"
            >
              {/* Flicker effect */}
              <motion.div
                animate={{ 
                  opacity: [0.3, 0.6, 0.3, 0.7, 0.2, 0.5],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="text-red-600/90 text-xs font-mono mb-2">
                  ▓▓▓░░ 4 FRAGMENTS DETECTED ░░▓▓▓
                </p>
              </motion.div>
              
              {/* Fragment completion messages */}
              <div className="flex flex-wrap justify-center gap-3 mb-3">
                {fragment1Complete && (
                  <motion.span 
                    className="text-amber-500/80 text-xs font-mono px-2 py-1 border border-amber-900/30 bg-amber-950/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    I: LIGHT
                  </motion.span>
                )}
                {fragment2Complete && (
                  <motion.span 
                    className="text-amber-500/80 text-xs font-mono px-2 py-1 border border-amber-900/30 bg-amber-950/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    II: SEVEN
                  </motion.span>
                )}
                {fragment3Complete && (
                  <motion.span 
                    className="text-amber-500/80 text-xs font-mono px-2 py-1 border border-amber-900/30 bg-amber-950/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    III: STAY FOREVER
                  </motion.span>
                )}
                {fragment4Complete && (
                  <motion.span 
                    className="text-amber-500/80 text-xs font-mono px-2 py-1 border border-amber-900/30 bg-amber-950/30"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    IV: ESCAPE
                  </motion.span>
                )}
              </div>
              
              <motion.p 
                className="text-gray-600 text-sm font-mono"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                ...{' '}
                <motion.span
                  className="text-red-500"
                  animate={{ opacity: [0.3, 1, 1, 1, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  help us
                </motion.span>
                {' '}...
              </motion.p>
            </motion.div>
          ) : (
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {[
                { value: '24/7', label: 'Concierge' },
                { value: '100%', label: 'Sustainable' },
                { value: 'Eco', label: 'Certified' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl lg:text-4xl font-serif font-bold text-pine-900">{stat.value}</p>
                  <p className="text-xs text-pine-600/60 tracking-wider uppercase mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
