'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { heroContent } from '@/data/content';
import { Star, Users, Key, Skull, Ghost, HelpCircle, DoorOpen, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GalleryModal } from '@/components/ui/GalleryModal';
import { ReservationModal } from '@/components/ui/ReservationModal';
import Image from 'next/image';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';

export function Hero() {
  const { isDarkMode } = useTheme();
  const { playJumpscare, playCreak } = useSoundEffects();
  const [glitchText, setGlitchText] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [showClue, setShowClue] = useState(false);
  const [cluePhase, setCluePhase] = useState(0); // 0=searching, 1=found, 2=glitch, 3=gone, 4=back
  const [textCorruption, setTextCorruption] = useState(0);
  
  // Scare states for EXIT button
  const [showExitScare, setShowExitScare] = useState(false);
  const [exitScareIcon, setExitScareIcon] = useState('skull');
  const [exitScareMessage, setExitScareMessage] = useState('');
  const [exitAttempts, setExitAttempts] = useState(0);

  const exitScareMessages = [
    "THE DOOR IS SEALED",
    "NO ONE LEAVES",
    "YOU TRIED TO RUN?",
    "THERE IS NO EXIT",
    "STAY WITH US",
    "FOREVER",
  ];

  const scareIcons = ['skull', 'doll', 'witch', 'hand'];

  const triggerExitScare = () => {
    const newAttempts = exitAttempts + 1;
    setExitAttempts(newAttempts);
    setExitScareIcon(scareIcons[Math.floor(Math.random() * scareIcons.length)]);
    setExitScareMessage(exitScareMessages[Math.min(newAttempts - 1, exitScareMessages.length - 1)]);
    setShowExitScare(true);
    playCreak(0.5); // Door creak sound
    setTimeout(() => playJumpscare(0.5), 200); // Followed by jumpscare
    setTimeout(() => setShowExitScare(false), 1200);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show clue after delay in dark mode with eerie intermittent behavior
  useEffect(() => {
    if (!isDarkMode) {
      setShowClue(false);
      setCluePhase(0);
      setExitAttempts(0); // Reset exit attempts when leaving dark mode
      return;
    }
    
    // Phase 1: Found after 6 seconds
    const timer1 = setTimeout(() => {
      setShowClue(true);
      setCluePhase(1);
    }, 6000);
    
    // Phase 2: System glitch - disappears
    const timer2 = setTimeout(() => {
      setCluePhase(2);
    }, 8500);
    
    // Phase 3: Gone completely
    const timer3 = setTimeout(() => {
      setCluePhase(3);
    }, 9000);
    
    // Phase 4: Flickers back unstable
    const timer4 = setTimeout(() => {
      setCluePhase(4);
    }, 12000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isDarkMode]);

  // Progressive text corruption effect
  useEffect(() => {
    if (!isDarkMode) {
      setTextCorruption(0);
      return;
    }
    const corruptionInterval = setInterval(() => {
      setTextCorruption(prev => Math.min(prev + 1, 10));
    }, 800);
    return () => clearInterval(corruptionInterval);
  }, [isDarkMode]);

  useEffect(() => {
    if (!isDarkMode) return;
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 100 + Math.random() * 150);
      }
    }, 2000);
    return () => clearInterval(glitchInterval);
  }, [isDarkMode]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <section className={`relative min-h-screen overflow-hidden flex items-center ${
      isDarkMode ? 'bg-black' : 'bg-[#fdfcfb]'
    }`}>
      {/* Full background image */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            backgroundImage: isDarkMode 
              ? 'url(/cabin-dark.png)'
              : 'url(/cabin-light.png)',
            filter: isDarkMode ? 'saturate(0.7) brightness(0.85) contrast(1.1)' : 'brightness(1.05)',
          }}
        />
        {/* Gradient overlay - lighter in dark mode to show image details */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode 
            ? 'bg-gradient-to-t from-black via-black/40 to-transparent'
            : 'bg-gradient-to-r from-white/80 via-white/40 to-transparent'
        }`} />
      </div>

      {/* Blood drip effect for dark mode */}
      {isDarkMode && mounted && (
        <div className="absolute top-0 left-0 right-0 h-40 pointer-events-none overflow-hidden z-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 w-1 bg-gradient-to-b from-red-700 via-red-800 to-transparent rounded-full"
              style={{ left: `${5 + i * 10}%` }}
              initial={{ height: 0 }}
              animate={{ height: [0, 80 + Math.random() * 60, 0] }}
              transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Floating particles */}
      {isDarkMode && mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-500/50 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ 
                y: [0, -150 - Math.random() * 100],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 5 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20">
        {/* Light mode - Clean landing page style */}
        {!isDarkMode && (
          <motion.div 
            className="max-w-3xl bg-white/30 backdrop-blur-md p-8 md:p-12 rounded-[3rem] border border-white/50 shadow-2xl shadow-stone-200/20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8 backdrop-blur-md bg-white/80 border border-white/60 shadow-sm"
            >
              <motion.span 
                className="w-2 h-2 rounded-full bg-gold-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-pine-900">
                The Ultimate Escape
              </span>
            </motion.div>
            
            {/* Main headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-8xl leading-[0.95] mb-8 tracking-tight text-pine-900"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Find Peace in<br />
              <span className="italic text-gold-500 font-light">Nature's</span> Embrace
            </motion.h1>
            
            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg lg:text-xl mb-10 max-w-lg leading-relaxed font-medium text-pine-800/80"
            >
              {heroContent.lightSubheadline}
            </motion.p>
            
            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 mb-12">
              <motion.button 
                onClick={() => setIsReservationOpen(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-full text-base font-bold tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 bg-pine-900 text-white shadow-pine-900/20 hover:shadow-pine-900/40"
              >
                Reserve Your Stay
              </motion.button>
              
              <motion.button 
                onClick={() => setIsGalleryOpen(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-full text-base font-bold tracking-wide backdrop-blur-sm transition-all flex items-center justify-center gap-2 bg-white text-pine-900 shadow-lg shadow-stone-200/50 hover:bg-stone-50"
              >
                View Gallery
              </motion.button>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-4 sm:gap-8 pt-8 border-t border-pine-900/10"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-pine-900">4.9</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pine-800/60">Average Rating</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-pine-900">200+</span>
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-[10px] text-stone-500 font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pine-800/60">Happy Guests</p>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-bold text-pine-900">5</span>
                  <Key className="w-5 h-5 text-gold-500" />
                </div>
                <p className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-pine-800/60">Luxury Rooms</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Dark mode - Chaotic terror design */}
        {isDarkMode && mounted && (
          <motion.div 
            className="max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Scattered warning messages */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: [0.4, 0.8, 0.4], x: 0 }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-24 right-10 text-red-600/60 text-sm font-mono rotate-12 hidden lg:block"
            >
              SIGNAL LOST...
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute top-40 right-20 text-red-800/40 text-xs font-mono -rotate-6 hidden lg:block"
            >
              [RECORDING...]
            </motion.div>

            {/* Glitchy main content area */}
            <div className="relative">
              {/* Corrupted badge */}
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-3 px-4 py-2 mb-6 border border-red-900/50 bg-black/60 backdrop-blur-sm"
                style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }}
              >
                <motion.span 
                  className="w-2 h-2 bg-red-600"
                  animate={{ 
                    opacity: [1, 0, 1, 0, 1],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs font-mono tracking-wider text-red-500 uppercase">
                  EMERGENCY BROADCAST
                </span>
              </motion.div>
              
              {/* Main terror headline - ULTRA CREEPY VERSION */}
              <motion.div 
                variants={itemVariants}
                className="mb-8 relative"
              >
                {/* Background noise/static effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute h-px bg-red-500"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: 0,
                        right: 0,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scaleX: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.1,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 5,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </div>

                <div className="relative">
                  {/* Multiple glitch layers that intensify */}
                  {textCorruption > 2 && (
                    <motion.div 
                      className="absolute inset-0 text-red-500/40 select-none"
                      animate={{ x: [-4, 4, -2, 3, 0], opacity: [0.4, 0.6, 0.3] }}
                      transition={{ duration: 0.15, repeat: Infinity }}
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter block">THEY</span>
                    </motion.div>
                  )}
                  {textCorruption > 4 && (
                    <motion.div 
                      className="absolute inset-0 text-cyan-500/30 select-none"
                      animate={{ x: [3, -3, 2, -4, 0], opacity: [0.3, 0.5, 0.2] }}
                      transition={{ duration: 0.12, repeat: Infinity }}
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter block">THEY</span>
                    </motion.div>
                  )}
                  {textCorruption > 6 && (
                    <motion.div 
                      className="absolute inset-0 text-green-500/20 select-none mix-blend-screen"
                      animate={{ y: [-2, 2, -1, 3, 0] }}
                      transition={{ duration: 0.08, repeat: Infinity }}
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter block">THEY</span>
                    </motion.div>
                  )}
                  
                  {/* Main text - distorted and unsettling */}
                  <motion.div
                    animate={textCorruption > 5 ? { 
                      x: [0, -1, 2, -2, 1, 0],
                      filter: ['blur(0px)', 'blur(0.5px)', 'blur(0px)']
                    } : {}}
                    transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <motion.span 
                      className="text-6xl sm:text-7xl lg:text-9xl font-bold tracking-tighter text-red-500 block relative"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span className="relative">
                        T
                        <motion.span
                          className="absolute -top-2 left-0 text-red-600/50 text-7xl lg:text-[8rem]"
                          animate={{ opacity: [0, 0.5, 0], y: [-5, 0, 5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          T
                        </motion.span>
                      </span>
                      HEY
                    </motion.span>
                  </motion.div>
                  
                  <motion.span 
                    className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter text-red-600 block ml-8 sm:ml-16 relative"
                    style={{ fontFamily: 'var(--font-serif)' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      letterSpacing: textCorruption > 3 ? ['-0.05em', '0.02em', '-0.05em'] : '-0.05em'
                    }}
                    transition={{ 
                      delay: 0.3,
                      letterSpacing: { duration: 0.1, repeat: Infinity, repeatDelay: 4 }
                    }}
                  >
                    ARE
                  </motion.span>
                  
                  <motion.div
                    className="relative"
                    animate={textCorruption > 7 ? { skewX: [0, -0.5, 0.5, 0] } : {}}
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <motion.span 
                      className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tighter text-red-700 block -ml-4"
                      style={{ fontFamily: 'var(--font-serif)' }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      W
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        A
                      </motion.span>
                      TCHING
                    </motion.span>
                  </motion.div>
                  
                  {/* The "YOU" - most unsettling part */}
                  <motion.div className="relative">
                    {/* Shadow/echo of YOU */}
                    {textCorruption > 4 && (
                      <>
                        <motion.span 
                          className="absolute text-7xl sm:text-8xl lg:text-[10rem] font-bold tracking-tighter text-red-900/30 block ml-4 sm:ml-20"
                          style={{ fontFamily: 'var(--font-serif)', top: '4px', left: '4px' }}
                          animate={{ 
                            opacity: [0.2, 0.4, 0.2],
                            x: [0, 3, 0],
                            y: [0, 2, 0]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          YOU
                        </motion.span>
                        <motion.span 
                          className="absolute text-7xl sm:text-8xl lg:text-[10rem] font-bold tracking-tighter text-red-500/20 block ml-4 sm:ml-20"
                          style={{ fontFamily: 'var(--font-serif)', top: '-4px', left: '-4px' }}
                          animate={{ 
                            opacity: [0.1, 0.3, 0.1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          YOU
                        </motion.span>
                      </>
                    )}
                    <motion.span 
                      className="text-7xl sm:text-8xl lg:text-[10rem] font-bold tracking-tighter text-red-800 block ml-4 sm:ml-20 relative"
                      style={{ fontFamily: 'var(--font-serif)' }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: 1, 
                        scale: [1, 1.02, 1],
                        textShadow: [
                          '0 0 0px rgba(220, 38, 38, 0)',
                          '0 0 80px rgba(220, 38, 38, 0.8)',
                          '0 0 0px rgba(220, 38, 38, 0)'
                        ]
                      }}
                      transition={{ 
                        opacity: { delay: 0.7 },
                        scale: { duration: 4, repeat: Infinity },
                        textShadow: { duration: 3, repeat: Infinity }
                      }}
                    >
                      YOU
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Fragmented message box */}
              <motion.div
                variants={itemVariants}
                className="bg-black/80 border-l-4 border-red-600 px-4 py-3 max-w-md mb-8"
              >
                <p className="text-gray-400 text-sm leading-relaxed font-mono">
                  The doors locked behind you. The windows show only darkness.
                  <motion.span 
                    className="text-red-500 font-bold ml-2"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    You are not alone.
                  </motion.span>
                </p>
              </motion.div>

              {/* System message panel with dynamic clue */}
              <motion.div
                variants={itemVariants}
                className="mb-8 p-4 bg-black/70 border border-red-900/30 relative overflow-hidden max-w-lg"
              >
                {/* Scan line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"
                  animate={{ y: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="relative flex items-start gap-3">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-red-500 mt-0.5"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-red-500 text-xs font-mono mb-1 tracking-wider">// SYSTEM_ERROR: TOGGLE_NOT_FOUND</p>
                    <p className="text-gray-500 text-sm leading-relaxed font-mono">
                      Night mode activated. <span className="text-red-400">Exit function disabled.</span>
                    </p>
                    
                    {/* Searching animation that reveals clue */}
                    <div className="mt-3 text-xs font-mono">
                      <span className="text-gray-600">&gt; Searching for alternative escape route</span>
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-gray-600"
                      >
                        _
                      </motion.span>
                      
                      {/* Clue appears with eerie intermittent behavior */}
                      {showClue && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: cluePhase === 3 ? 0 : cluePhase === 2 ? [1, 0, 1, 0, 0.3, 0] : cluePhase === 4 ? [0.3, 0.8, 0.3, 1, 0.5] : 1, 
                            height: 'auto' 
                          }}
                          transition={{ 
                            duration: cluePhase === 2 ? 0.5 : cluePhase === 4 ? 2 : 0.5,
                            repeat: cluePhase === 4 ? Infinity : 0
                          }}
                          className="mt-2"
                        >
                          {/* Phase 2: Glitching/corrupting */}
                          {cluePhase === 2 && (
                            <motion.p 
                              className="text-red-500 font-mono text-xs"
                              animate={{ opacity: [1, 0, 1, 0] }}
                              transition={{ duration: 0.3 }}
                            >
                              &gt; ERROR: CONNECTION_LOST
                            </motion.p>
                          )}
                          
                          {/* Phase 1 or 4: Show route */}
                          {(cluePhase === 1 || cluePhase === 4) && (
                            <>
                              <motion.p 
                                className={cluePhase === 4 ? "text-green-600/40" : "text-green-500/80"}
                                animate={{ 
                                  opacity: cluePhase === 4 ? [0.2, 0.6, 0.2, 0.8, 0.3] : [0.6, 1, 0.6],
                                  x: cluePhase === 4 ? [0, -1, 1, 0] : 0
                                }}
                                transition={{ 
                                  duration: cluePhase === 4 ? 0.8 : 2, 
                                  repeat: Infinity 
                                }}
                              >
                                &gt; {cluePhase === 4 ? '1 r0ut█ f▒und' : '1 route found'}
                              </motion.p>
                              <motion.p 
                                className={`mt-1 cursor-pointer transition-colors ${cluePhase === 4 ? 'text-gray-600 hover:text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                                initial={{ opacity: 0 }}
                                animate={{ 
                                  opacity: cluePhase === 4 ? [0.3, 0.7, 0.3] : 1,
                                }}
                                transition={{ 
                                  delay: cluePhase === 1 ? 0.5 : 0,
                                  duration: cluePhase === 4 ? 1.5 : 0.3,
                                  repeat: cluePhase === 4 ? Infinity : 0
                                }}
                                onClick={() => {
                                  const featuresSection = document.getElementById('amenities');
                                  if (featuresSection) {
                                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                                  }
                                }}
                              >
                                &gt; <span className="underline decoration-red-800/50 underline-offset-2">
                                  {cluePhase === 4 ? 'expl▒re_c█bin.exe' : 'explore_cabin.exe'}
                                </span>
                                {cluePhase === 1 && (
                                  <motion.span
                                    className="ml-2 text-red-600/60 text-xs"
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  >
                                    [CLICK]
                                  </motion.span>
                                )}
                              </motion.p>
                            </>
                          )}
                          
                          {/* Phase 3: Nothing - system failure message */}
                          {cluePhase === 3 && (
                            <motion.p 
                              className="text-red-900/50 font-mono text-xs"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.5, 0] }}
                              transition={{ duration: 2 }}
                            >
                              &gt; ...
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Only the EXIT button - no search button */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.button 
                  onClick={triggerExitScare}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-4 bg-red-950/50 border border-red-800/50 text-red-600 font-mono text-sm flex items-center gap-2 cursor-pointer relative overflow-hidden hover:bg-red-900/30 hover:border-red-700/60 transition-colors"
                >
                  <motion.div
                    className="absolute inset-0 bg-red-900/20"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <DoorOpen className="w-4 h-4" />
                  <span className="line-through opacity-60">EXIT</span>
                  <span className="text-red-400 text-xs ml-2">[LOCKED]</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
          isDarkMode ? 'border-red-900/50' : 'border-pine-900/40 bg-white/20 backdrop-blur-sm'
        }`}>
          <motion.div 
            className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-red-600' : 'bg-pine-900'}`}
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Gallery Modal */}
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
      
      {/* Reservation Modal */}
      <ReservationModal isOpen={isReservationOpen} onClose={() => setIsReservationOpen(false)} />

      {/* EXIT SCARE OVERLAY */}
      <AnimatePresence>
        {showExitScare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            {/* Flashing background */}
            <motion.div
              className="absolute inset-0 bg-red-900"
              animate={{ opacity: [0, 0.4, 0, 0.3, 0] }}
              transition={{ duration: 0.4, repeat: 2 }}
            />
            
            {/* Door slamming effect */}
            <motion.div
              className="absolute inset-0 flex"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0, 1, 1, 0] }}
              transition={{ duration: 0.8, times: [0, 0.2, 0.8, 1] }}
            >
              <div className="w-1/2 h-full bg-gradient-to-r from-gray-900 to-gray-800 border-r-4 border-red-900" />
              <div className="w-1/2 h-full bg-gradient-to-l from-gray-900 to-gray-800 border-l-4 border-red-900" />
            </motion.div>
            
            {/* Scare icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ 
                scale: [0, 1.3, 1.1],
                rotate: [-20, 5, 0],
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src={`/icons/${exitScareIcon}.png`}
                alt=""
                width={200}
                height={200}
                className="drop-shadow-[0_0_40px_rgba(220,38,38,0.8)] brightness-90"
              />
            </motion.div>

            {/* Scare message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              className="absolute bottom-1/4 text-center"
            >
              <motion.p
                className="text-red-500 text-3xl md:text-5xl font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 25px rgba(220,38,38,0.8)' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
              >
                {exitScareMessage}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
