'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function GhostText({ 
  text, 
  className = '', 
  letterClassName = '',
  interval = 3000, // How often the ghost effect triggers
  duration = 2000,  // Duration of the animation
}) {
  const [isAnimating, setIsAnimating] = useState(true);
  const [cycle, setCycle] = useState(0);
  const letters = text.split('');

  // Cycle the animation
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCycle(c => c + 1);
        setIsAnimating(true);
      }, 100);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  // Different delays for each letter to create organic feel
  const getDelay = (index) => {
    const delays = [0, 0.15, 0.25, 0.1, 0.05, 0.2, 0.12, 0.08, 0.22, 0.03];
    return delays[index % delays.length];
  };

  return (
    <span className={`ghost-text-container relative inline-block ${className}`}>
      {/* Main text that fades */}
      <motion.span 
        className="ghost-text-main relative z-10"
        key={`main-${cycle}`}
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 1, 0.3, 0],
        }}
        transition={{
          duration: duration / 1000,
          times: [0, 0.4, 0.7, 1],
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.span>
      
      {/* Ghost letters that float up - these are the "souls" leaving */}
      <span 
        className="ghost-letters absolute top-0 left-0 flex"
        style={{ filter: 'blur(1px)' }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={`${i}-${cycle}`}
            className={`ghost-letter inline-block text-red-500/60 ${letterClassName}`}
            initial={{ y: '0%', opacity: 1, skewX: '0deg' }}
            animate={isAnimating ? {
              y: ['0%', '-30%', '-60%', '-100%', '-140%', '-180%'],
              skewX: ['0deg', '-8deg', '10deg', '-6deg', '5deg', '0deg'],
              opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
              scale: [1, 1.05, 1.1, 1.05, 1, 0.95],
            } : { y: '0%', opacity: 0 }}
            transition={{
              duration: duration / 1000,
              delay: getDelay(i),
              ease: "easeOut",
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </span>

      {/* Secondary ghost layer - more blurred, offset */}
      <span 
        className="ghost-letters-secondary absolute top-0 left-0 flex"
        style={{ filter: 'blur(3px)', transform: 'translateX(2px)' }}
      >
        {letters.map((letter, i) => (
          <motion.span
            key={`secondary-${i}-${cycle}`}
            className={`ghost-letter inline-block text-red-400/30 ${letterClassName}`}
            initial={{ y: '0%', opacity: 0.5 }}
            animate={isAnimating ? {
              y: ['0%', '-25%', '-50%', '-80%', '-120%', '-160%'],
              opacity: [0.4, 0.3, 0.2, 0.1, 0.05, 0],
            } : { y: '0%', opacity: 0 }}
            transition={{
              duration: (duration / 1000) * 1.2,
              delay: getDelay(i) + 0.1,
              ease: "easeOut",
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

// Simpler version - just the floating souls effect without the main text fade
export function FloatingSouls({ 
  count = 5, 
  className = '' 
}) {
  const souls = Array.from({ length: count });
  
  return (
    <div className={`floating-souls absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {souls.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-red-900/20 font-serif italic text-2xl"
          style={{
            left: `${15 + (i * 18)}%`,
            top: '50%',
            filter: 'blur(1px)',
          }}
          animate={{
            y: ['0%', '-100%', '-200%', '-300%'],
            x: [0, Math.random() > 0.5 ? 10 : -10, Math.random() > 0.5 ? -5 : 5, 0],
            opacity: [0, 0.4, 0.3, 0],
            scale: [0.8, 1, 1.1, 0.9],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 8 + (i * 0.5),
            repeat: Infinity,
            delay: i * 1.5,
            ease: "easeOut",
          }}
        >
          ◯
        </motion.div>
      ))}
    </div>
  );
}

// Soul wisps - ethereal floating particles
export function SoulWisps({ className = '' }) {
  const wisps = Array.from({ length: 8 });
  
  return (
    <div className={`soul-wisps absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {wisps.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-8 bg-gradient-to-t from-transparent via-red-800/30 to-transparent rounded-full"
          style={{
            left: `${10 + (i * 12)}%`,
            bottom: '20%',
            filter: 'blur(2px)',
          }}
          animate={{
            y: [0, -100, -200, -300],
            x: [0, (i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -10 : 10), 0],
            opacity: [0, 0.6, 0.4, 0],
            scaleY: [0.5, 1.5, 1, 0.5],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + (i * 0.3),
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
