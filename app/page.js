'use client';

import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { Reviews } from '@/components/sections/Reviews';
import { NightView } from '@/components/sections/NightView';
import { CTA } from '@/components/sections/CTA';
import { Rooms } from '@/components/sections/Rooms';
import { FlashlightOverlay } from '@/components/effects/FlashlightOverlay';
import { HiddenElements } from '@/components/effects/HiddenElements';
import { CursorTrail } from '@/components/effects/CursorTrail';
import { DarkModeTransition } from '@/components/effects/DarkModeTransition';
import DarkModeAudio from '@/components/effects/DarkModeAudio';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function Home() {
  const { isDarkMode, isTransitioning } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${
      isDarkMode ? 'bg-black dark-mode-cursor' : 'bg-[#faf9f7]'
    }`}>
      {/* Terrifying mode transition */}
      <DarkModeTransition isTransitioning={isTransitioning} isDarkMode={isDarkMode} />
      
      {/* Dark mode ambient audio */}
      <DarkModeAudio />
      
      <Header />
      
      <main className="overflow-hidden">
        <Hero />
        <Rooms />
        <Features />
        {!isDarkMode && <NightView />}
        <Reviews />
        <CTA />
      </main>
      
      <Footer />
      
      {/* Dark mode darkness overlay - subtle darkening */}
      <AnimatePresence>
        {isDarkMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 bg-black/20 pointer-events-none z-5"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      {/* Dark mode effects */}
      <AnimatePresence>
        {isDarkMode && (
          <>
            <Suspense fallback={null}>
              <FlashlightOverlay isActive={isDarkMode} />
            </Suspense>
            <HiddenElements isActive={isDarkMode} />
            <CursorTrail isActive={isDarkMode} />
          </>
        )}
      </AnimatePresence>
      
      {/* Ambient particles for light mode */}
      {!isDarkMode && (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-amber-300/20 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000
              }}
              animate={{ 
                y: -50,
                x: `+=${Math.random() * 100 - 50}`
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 3,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
