'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { hiddenIcons, hiddenStaticElements } from '@/data/content';

// Generate random position within safe bounds
const getRandomPosition = () => ({
  x: `${5 + Math.random() * 85}%`,
  y: `${10 + Math.random() * 80}%`,
  rotation: Math.random() * 60 - 30,
});

export function HiddenElements({ isActive }) {
  const { playJumpscare, playGrowl } = useSoundEffects();
  const [mounted, setMounted] = useState(false);
  const [showJumpscare, setShowJumpscare] = useState(false);
  const [jumpscareIcon, setJumpscareIcon] = useState('skull');
  
  // Click scare states
  const [showClickScare, setShowClickScare] = useState(false);
  const [clickScareIcon, setClickScareIcon] = useState('skull');
  const [clickScareMessage, setClickScareMessage] = useState('');
  
  // Dynamic elements with position state
  const [iconElements, setIconElements] = useState(() => 
    hiddenIcons.map(icon => ({ ...icon, ...getRandomPosition() }))
  );

  // Handle icon click - trigger scare with sound
  const handleIconClick = (icon, message) => {
    setClickScareIcon(icon);
    setClickScareMessage(message);
    setShowClickScare(true);
    playGrowl(0.5); // Play growl sound on click
    setTimeout(() => setShowClickScare(false), 1500);
  };



  useEffect(() => {
    setMounted(true);
  }, []);

  // Randomize icon positions periodically
  useEffect(() => {
    if (!isActive || !mounted) return;
    
    // Each icon has its own timer based on its cycle duration (longer cycles now)
    const timers = hiddenIcons.map((icon, index) => {
      const visibleDuration = 8 + index * 2;
      const hiddenDuration = 6 + index * 1.5;
      const totalCycle = (visibleDuration + hiddenDuration) * 1000; // Convert to ms
      return setInterval(() => {
        setIconElements(prev => prev.map(el => 
          el.id === icon.id 
            ? { ...el, ...getRandomPosition() }
            : el
        ));
      }, totalCycle);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [isActive, mounted]);

  // Rare jumpscare effect with random icon and sound
  useEffect(() => {
    if (!isActive) return;
    const icons = ['skull', 'doll', 'witch'];
    const jumpscareInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setJumpscareIcon(icons[Math.floor(Math.random() * icons.length)]);
        setShowJumpscare(true);
        playJumpscare(0.6); // Play jumpscare sound!
        setTimeout(() => setShowJumpscare(false), 200);
      }
    }, 5000);
    return () => clearInterval(jumpscareInterval);
  }, [isActive, playJumpscare]);

  if (!isActive || !mounted) return null;

  return (
    <>
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Quick flash jumpscare with horror icon */}
      {showJumpscare && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black/95 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: [0.5, 1.2, 1], rotate: [-10, 10, 0] }}
            transition={{ duration: 0.15 }}
          >
            <Image
              src={`/icons/${jumpscareIcon}.png`}
              alt=""
              width={200}
              height={200}
              className="drop-shadow-[0_0_30px_rgba(220,38,38,0.8)] brightness-75 contrast-125"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Dynamic horror icons that change position - NOW CLICKABLE */}
      {iconElements.map((element, index) => {
        const visibleDuration = 8 + index * 2; // Much longer visible time (8-18 seconds)
        const hiddenDuration = 6 + index * 1.5; // Longer hidden time between appearances
        const totalCycle = visibleDuration + hiddenDuration;
        
        return (
          <motion.div
            key={`${element.id}-${element.x}-${element.y}`}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0, 0.5, 0.5, 0],
              // Timeline: fade in (20%), stay visible (60%), fade out (20%)
            }}
            transition={{ 
              duration: totalCycle,
              times: [0, 0.1, 0.2, 0.8, 1], // Smooth fade in/out with long visible period
              repeat: Infinity,
              delay: index * 3, // More staggered delays
              ease: "easeInOut",
            }}
            className="absolute pointer-events-auto cursor-pointer"
            style={{
              left: element.x,
              top: element.y,
              transform: `rotate(${element.rotation}deg) scale(${element.scale})`,
            }}
            onClick={() => handleIconClick(element.icon, element.message)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: visibleDuration, repeat: Infinity, ease: "easeInOut" }}
              className="drop-shadow-[0_0_15px_rgba(127,29,29,0.6)]"
            >
              <Image
                src={`/icons/${element.icon}.png`}
                alt=""
                width={80}
                height={80}
                className="brightness-50 contrast-125 saturate-50 hover:brightness-75 transition-all"
                style={{ filter: 'brightness(0.5) contrast(1.25) saturate(0.5) drop-shadow(0 0 10px rgba(220,38,38,0.5))' }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Static elements (text, symbols, effects) */}
      {hiddenStaticElements.map((element, index) => (
        <motion.div
          key={element.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.15, 0.5, 0.15] }}
          transition={{ 
            duration: 3 + Math.random() * 3, 
            repeat: Infinity,
            delay: index * 0.2
          }}
          className="absolute"
          style={{
            left: element.x,
            top: element.y,
            transform: `rotate(${element.rotation || 0}deg) scale(${element.scale || 1})`,
          }}
        >
          {element.type === 'symbol' && (
            <motion.div 
              className="text-red-700 text-6xl select-none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              ⛧
            </motion.div>
          )}
          
          {element.type === 'text' && (
            <motion.span 
              className="text-red-800 text-lg font-bold tracking-widest select-none drop-shadow-[0_0_8px_rgba(127,29,29,0.8)]"
              style={{ 
                fontFamily: 'var(--font-serif)', 
                writingMode: element.rotation === 90 ? 'vertical-rl' : 'horizontal-tb',
                textShadow: '0 0 10px rgba(220, 38, 38, 0.5)'
              }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {element.text}
            </motion.span>
          )}
          
          {element.type === 'scratch' && (
            <div className="flex flex-col gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-20 h-1 bg-red-800 rounded-full"
                  style={{ transform: `rotate(${-8 + i * 4}deg)` }}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 0.6 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                />
              ))}
            </div>
          )}
          
          {element.type === 'drip' && (
            <div className="flex flex-col items-center">
              {[...Array(6)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-4 bg-red-800 rounded-full mb-1"
                  initial={{ opacity: 0, y: -10, scaleY: 0.5 }}
                  animate={{ 
                    opacity: [0, 0.7, 0], 
                    y: [0, 30, 60],
                    scaleY: [0.5, 1.5, 0.5]
                  }}
                  transition={{ 
                    duration: 2.5, 
                    repeat: Infinity, 
                    delay: i * 0.3,
                    ease: "easeIn"
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>
      ))}
      
      {/* Breathing darkness at edges */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 6, repeat: Infinity }}
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(127, 29, 29, 0.2) 100%)',
        }}
      />
      
      {/* Random red flash */}
      <motion.div 
        className="absolute inset-0 bg-red-900/10 pointer-events-none"
        animate={{ opacity: [0, 0, 0, 0.2, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatDelay: 8 }}
      />
    </div>

      {/* CLICK SCARE OVERLAY - Outside main container for proper z-index */}
      <AnimatePresence>
        {showClickScare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center pointer-events-auto"
            onClick={() => setShowClickScare(false)}
          >
            {/* Pulsing red background */}
            <motion.div
              className="absolute inset-0"
              animate={{ 
                backgroundColor: ['rgba(127,29,29,0)', 'rgba(127,29,29,0.5)', 'rgba(127,29,29,0)', 'rgba(127,29,29,0.3)', 'rgba(127,29,29,0)']
              }}
              transition={{ duration: 0.8, repeat: 1 }}
            />
            
            {/* The clicked icon - BIG and scary */}
            <motion.div
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ 
                scale: [0, 1.8, 1.4, 1.5, 1.4],
                rotate: [-45, 15, -10, 5, 0],
                opacity: 1,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src={`/icons/${clickScareIcon}.png`}
                alt=""
                width={280}
                height={280}
                className="drop-shadow-[0_0_60px_rgba(220,38,38,1)] brightness-100"
              />
            </motion.div>

            {/* Scare message */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.25 }}
              className="absolute bottom-1/4 text-center"
            >
              <motion.p
                className="text-red-500 text-4xl md:text-6xl font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 40px rgba(220,38,38,0.9)' }}
                animate={{ 
                  scale: [1, 1.08, 1],
                  textShadow: [
                    '0 0 40px rgba(220,38,38,0.9)',
                    '0 0 80px rgba(220,38,38,1)',
                    '0 0 40px rgba(220,38,38,0.9)'
                  ]
                }}
                transition={{ duration: 0.4, repeat: 2 }}
              >
                {clickScareMessage}
              </motion.p>
            </motion.div>

            {/* Vignette effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
