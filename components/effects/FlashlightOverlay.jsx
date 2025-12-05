'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '@/components/hooks/useMousePosition';
import { useSearchParams } from 'next/navigation';
import { useEscape } from '@/components/providers/EscapeProvider';

export function FlashlightOverlay({ isActive }) {
  const { x, y } = useMousePosition();
  const [flickerOpacity, setFlickerOpacity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const searchParams = useSearchParams();
  const { fragment1Complete, fragment2Complete, fragment3Complete } = useEscape();

  // Calculate radius based on fragments completed
  const baseRadius = 200;
  const radiusPerFragment = 50;
  const fragmentsCompleted = [fragment1Complete, fragment2Complete, fragment3Complete].filter(Boolean).length;
  const radius = baseRadius + (fragmentsCompleted * radiusPerFragment);

  useEffect(() => {
    setMounted(true);
    // Check for debug parameter
    const debug = searchParams.get('debug');
    setDebugMode(debug === 'true');
  }, [searchParams]);

  // Random flicker effect like a real flashlight
  useEffect(() => {
    if (!isActive || debugMode) return;
    
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setFlickerOpacity(0.85 + Math.random() * 0.15);
        setTimeout(() => setFlickerOpacity(1), 30 + Math.random() * 70);
      }
    }, 100);

    return () => clearInterval(flickerInterval);
  }, [isActive, debugMode]);

  if (!isActive || !mounted) return null;
  
  // Debug mode - no flashlight overlay, see everything
  if (debugMode) {
    return (
      <div className="fixed top-4 left-4 z-[200] bg-red-900/90 text-white px-4 py-2 rounded-lg text-sm font-mono">
        🔦 DEBUG MODE - Flashlight disabled
      </div>
    );
  }

  return (
    <>
      {/* TOTAL DARKNESS - This is the key layer that makes everything black */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 pointer-events-none z-[100]"
        style={{
          background: '#000000',
          maskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, 
            transparent 0%, 
            transparent 60%,
            rgba(0,0,0,0.4) 75%,
            rgba(0,0,0,0.8) 85%,
            black 100%
          )`,
          WebkitMaskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, 
            transparent 0%, 
            transparent 60%,
            rgba(0,0,0,0.4) 75%,
            rgba(0,0,0,0.8) 85%,
            black 100%
          )`,
          opacity: flickerOpacity,
        }}
      />
      
      {/* Warm flashlight glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="fixed inset-0 pointer-events-none z-[99] mix-blend-overlay"
        style={{
          background: `radial-gradient(circle ${radius * 0.8}px at ${x}px ${y}px, 
            rgba(255, 220, 180, 0.3) 0%, 
            rgba(255, 180, 120, 0.15) 40%,
            transparent 70%
          )`,
        }}
      />
      
      {/* Subtle light edge glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.03, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="fixed pointer-events-none z-[98]"
        style={{
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          boxShadow: `
            inset 0 0 ${radius * 0.3}px ${radius * 0.1}px rgba(255, 200, 150, 0.1),
            0 0 ${radius * 0.5}px ${radius * 0.2}px rgba(255, 200, 150, 0.05)
          `,
        }}
      />
      
      {/* Film grain / noise for atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none z-[101] opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
