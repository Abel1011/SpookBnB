'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function DarkModeTransition({ isTransitioning, isDarkMode }) {
  const [showScaryImage, setShowScaryImage] = useState(false);
  const [flickerCount, setFlickerCount] = useState(0);

  useEffect(() => {
    if (isTransitioning && isDarkMode) {
      // Show scary image flash sequence
      setShowScaryImage(true);
      setFlickerCount(0);
      
      // Flicker effect
      const flickerSequence = [100, 50, 150, 30, 200, 80, 100];
      let totalDelay = 0;
      
      flickerSequence.forEach((delay, index) => {
        setTimeout(() => {
          setFlickerCount(prev => prev + 1);
        }, totalDelay);
        totalDelay += delay;
      });
      
      // Hide after transition
      setTimeout(() => {
        setShowScaryImage(false);
      }, 1200);
    }
  }, [isTransitioning, isDarkMode]);

  if (!isTransitioning) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] pointer-events-none"
      >
        {/* Initial blackout */}
        <motion.div 
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDarkMode ? [0, 1, 1, 0.95] : [0, 0.8, 0] }}
          transition={{ duration: isDarkMode ? 1.2 : 0.8, times: isDarkMode ? [0, 0.1, 0.8, 1] : [0, 0.3, 1] }}
        />

        {isDarkMode && (
          <>
            {/* Scary image flash - full screen reveal */}
            <motion.div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: 'url(/cabin-transition.png)',
                filter: 'saturate(0.3) contrast(1.2)',
              }}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: showScaryImage ? [0, 1, 0.3, 1, 0, 0.8, 0.2, 0] : 0,
              }}
              transition={{ 
                duration: 1,
                times: [0, 0.1, 0.15, 0.25, 0.35, 0.5, 0.7, 1],
              }}
            />

            {/* Red flash overlay */}
            <motion.div 
              className="absolute inset-0 bg-red-900"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.6, 0, 0.4, 0, 0.3, 0],
              }}
              transition={{ 
                duration: 0.8,
                times: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1],
              }}
            />

            {/* White lightning flash */}
            <motion.div 
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.9, 0, 0.5, 0, 0],
              }}
              transition={{ 
                duration: 0.5,
                times: [0, 0.05, 0.1, 0.2, 0.3, 1],
              }}
            />

            {/* Creepy text flash */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0, 1, 0, 0.7, 0],
              }}
              transition={{ 
                duration: 1,
                times: [0, 0.3, 0.35, 0.45, 0.55, 0.7],
              }}
            >
              <span 
                className="text-red-600 text-6xl md:text-8xl font-bold tracking-widest"
                style={{ 
                  fontFamily: 'var(--font-serif)',
                  textShadow: '0 0 50px rgba(220, 38, 38, 0.8)',
                }}
              >
                RUN
              </span>
            </motion.div>

            {/* Glitch lines */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 h-1 bg-red-500/50"
                style={{ top: `${20 + i * 15}%` }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ 
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  x: ['-100%', '100%'],
                }}
                transition={{ 
                  duration: 0.3,
                  delay: 0.1 + i * 0.08,
                }}
              />
            ))}

            {/* Static noise overlay */}
            <motion.div 
              className="absolute inset-0 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0.1, 0.4, 0] }}
              transition={{ duration: 0.8 }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Vignette pulse */}
            <motion.div 
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0.4] }}
              transition={{ duration: 1 }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.9) 100%)',
              }}
            />
          </>
        )}

        {/* Light mode transition - simple fade */}
        {!isDarkMode && (
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.8 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
