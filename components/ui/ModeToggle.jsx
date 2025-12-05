'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { useState } from 'react';

export function ModeToggle() {
  const { isDarkMode, toggleMode, isTransitioning } = useTheme();
  const { playSwitch, startAmbient, stopAmbient } = useAudio();
  const { fragment4Complete } = useEscape();
  const { playClick, playGrowl } = useSoundEffects();
  
  // Trap states for dark mode
  const [trapAttempts, setTrapAttempts] = useState(0);
  const [isBroken, setIsBroken] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [hasCracks, setHasCracks] = useState(false);

  // Creepy messages that appear when trying to escape
  const trapMessages = [
    "Did you think it would be that easy?",
    "There is no light here...",
    "You can't leave. Not yet.",
    "The darkness holds you tight.",
    "Find another way... if you can.",
    "NICE TRY.",
    "We're not done with you.",
    "The button doesn't work anymore.",
  ];

  const handleToggle = () => {
    // If in dark mode and hasn't escaped yet - TRAP!
    if (isDarkMode && !fragment4Complete) {
      const newAttempts = trapAttempts + 1;
      setTrapAttempts(newAttempts);
      
      // Play crack/click sound on each attempt
      playClick(0.5 + newAttempts * 0.1); // Gets louder with each attempt
      
      // Shake effect
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      // Show cracks after 2 attempts
      if (newAttempts >= 2) {
        setHasCracks(true);
      }
      
      // Show message
      setCurrentMessage(trapMessages[Math.min(newAttempts - 1, trapMessages.length - 1)]);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2500);
      
      // Break the button after 4 attempts
      if (newAttempts >= 4) {
        setIsBroken(true);
        setCurrentMessage("💀 BROKEN 💀");
        setShowMessage(true);
        playGrowl(0.6); // Growl when fully broken
        // Keep message visible for broken state
      }
      
      return; // Don't toggle
    }
    
    // Normal toggle for light mode or after escape
    playClick(0.4); // Click sound on press
    playSwitch();
    
    if (!isDarkMode) {
      startAmbient();
    } else {
      stopAmbient();
    }
    
    toggleMode();
    
    // Reset trap states when going to dark mode
    if (!isDarkMode) {
      setTrapAttempts(0);
      setIsBroken(false);
      setShowMessage(false);
      setHasCracks(false);
    }
  };

  return (
    <div className="relative">
      {/* Trap message tooltip */}
      <AnimatePresence>
        {showMessage && isDarkMode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap z-[300]"
          >
            <div className={`px-4 py-2 rounded-lg text-sm font-mono ${
              isBroken 
                ? 'bg-red-900 text-red-300 border border-red-700' 
                : 'bg-black/90 text-red-400 border border-red-900/50'
            }`}>
              <motion.span
                animate={isBroken ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                {currentMessage}
              </motion.span>
            </div>
            {/* Arrow */}
            <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
              isBroken ? 'bg-red-900 border-l border-t border-red-700' : 'bg-black/90 border-l border-t border-red-900/50'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messenger-style buzz keyframes */}
      <style jsx>{`
        @keyframes messenger-buzz {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-4px, -2px) rotate(-2deg); }
          20% { transform: translate(4px, 2px) rotate(2deg); }
          30% { transform: translate(-4px, 2px) rotate(-1deg); }
          40% { transform: translate(4px, -2px) rotate(1deg); }
          50% { transform: translate(-3px, -1px) rotate(-2deg); }
          60% { transform: translate(3px, 1px) rotate(2deg); }
          70% { transform: translate(-2px, 1px) rotate(-1deg); }
          80% { transform: translate(2px, -1px) rotate(1deg); }
          90% { transform: translate(-1px, 0px) rotate(0deg); }
        }
        .buzz-effect {
          animation: messenger-buzz 0.5s ease-in-out;
        }
      `}</style>

      <button
        onClick={handleToggle}
        disabled={isTransitioning || isBroken}
        style={{ zIndex: 200, position: 'relative' }}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${
          isDarkMode 
            ? isBroken
              ? 'bg-gray-900 border-2 border-gray-700 opacity-60 cursor-not-allowed'
              : 'bg-gradient-to-br from-red-900/80 to-red-950/80 border-2 border-red-700 shadow-lg shadow-red-900/50' 
            : 'bg-stone-100 border border-stone-200 hover:bg-stone-200'
        } ${isTransitioning ? 'animate-pulse' : ''} ${isShaking ? 'buzz-effect' : ''}`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {/* Crack effects */}
        {hasCracks && isDarkMode && !isBroken && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 56 56">
                <motion.path
                  d="M10 10 L20 25 L15 30 L25 45"
                  stroke="rgba(220, 38, 38, 0.6)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.path
                  d="M45 15 L35 28 L40 35 L30 50"
                  stroke="rgba(220, 38, 38, 0.4)"
                  strokeWidth="1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                />
              </svg>
            </div>
          </>
        )}

        {/* Broken X overlay */}
        {isBroken && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <motion.path
                d="M18 6L6 18M6 6l12 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </motion.div>
        )}

        {/* Glow effect for dark mode */}
        {isDarkMode && !isBroken && (
        <motion.div 
          className="absolute inset-0 rounded-2xl"
          animate={{ 
            boxShadow: ['0 0 20px rgba(220, 38, 38, 0.3)', '0 0 40px rgba(220, 38, 38, 0.5)', '0 0 20px rgba(220, 38, 38, 0.3)']
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <AnimatePresence mode="wait">
        {isDarkMode && !isBroken ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Sun icon */}
            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
            
            {/* Animated rays */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-1 bg-red-400/30 rounded-full"
                  style={{
                    transform: `rotate(${i * 45}deg) translateY(-14px)`
                  }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : isDarkMode && isBroken ? (
          // Broken state - no icon, just the X overlay
          <motion.div key="broken" />
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Moon icon */}
            <svg className="w-6 h-6 text-stone-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            
            {/* Stars */}
            <motion.div 
              className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -bottom-0.5 -left-1 w-1 h-1 bg-amber-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
    </div>
  );
}
