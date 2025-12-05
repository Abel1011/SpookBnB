'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { 
  Calendar, 
  Users, 
  CreditCard, 
  Check, 
  AlertTriangle,
  Lock,
  Skull,
  X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const STEPS = {
  DATES: 0,
  GUESTS: 1,
  DETAILS: 2,
  CONFIRM: 3,
};

// Horror images for TV static flashes
const HORROR_IMAGES = [
  '/cabin-dark.png',
  '/cabin-dark2.png',
  '/room-basement-dark.png',
  '/room-deck-dark.png',
  '/room-master-dark.png',
  '/room-living-dark.png',
];

export function ReservationModal({ isOpen, onClose }) {
  const { isDarkMode, toggleMode } = useTheme();
  const { playSwitch, startAmbient } = useAudio();
  const { playStatic, playJumpscare, stopSound, playGrowl, playBuzz, playPianoSting } = useSoundEffects();
  const [currentStep, setCurrentStep] = useState(STEPS.DATES);
  const [attemptedClose, setAttemptedClose] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showHorrorFlash, setShowHorrorFlash] = useState(false);
  const [currentHorrorImage, setCurrentHorrorImage] = useState(0);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const [staticIntensity, setStaticIntensity] = useState(0);
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2,
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [restoredFromStorage, setRestoredFromStorage] = useState(false);
  const [showRestoredMessage, setShowRestoredMessage] = useState(false);
  const modalRef = useRef(null);
  
  // Persist modal state to localStorage for creepy "it remembers" effect
  const STORAGE_KEY = 'spookbnb-reservation-state';
  
  // Save state to localStorage whenever important values change
  // Only save if there's meaningful progress to avoid false positives
  useEffect(() => {
    if (isOpen && !showFinalMessage && !isComplete) {
      // Only save if user has made some progress (not just opened the modal)
      const hasProgress = currentStep > 0 || 
                         attemptedClose > 0 || 
                         formData.checkIn || 
                         formData.name ||
                         formData.email;
      
      if (hasProgress) {
        const stateToSave = {
          currentStep,
          attemptedClose,
          formData,
          wasOpened: true,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      }
    }
  }, [isOpen, currentStep, attemptedClose, formData, showFinalMessage, isComplete]);
  
  // Clear storage when modal completes or transitions to dark mode
  useEffect(() => {
    // Clear storage if modal completed its purpose (user is now in dark mode)
    if (isComplete || showFinalMessage || isDarkMode) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isComplete, showFinalMessage, isDarkMode]);
  
  // Visual corruption level - defined here to use in useEffect
  const corruptionLevel = Math.min(attemptedClose, 4);
  const isCorrupted = corruptionLevel >= 3;

  // Messages that appear when trying to close
  const closeAttemptMessages = [
    "Are you sure? The cabin awaits...",
    "You've come so far. Why leave now?",
    "The forest grows darker outside...",
    "We've been expecting you. Stay.",
  ];

  // TV static effect when modal is corrupted
  useEffect(() => {
    if (isCorrupted && isOpen && !showFinalMessage) {
      // Enable continuous static with sound
      setShowStatic(true);
      setStaticIntensity(0.3);
      playStatic(0.3, true); // Loop static sound
      
      // Horror image flashes through the static
      const flashInterval = setInterval(() => {
        // Show horror image through static
        const showHorrorThroughStatic = async () => {
          // Increase static
          setStaticIntensity(0.8);
          await new Promise(r => setTimeout(r, 200));
          
          // Show horror image(s)
          const numImages = 1 + Math.floor(Math.random() * 3); // 1-3 images
          for (let i = 0; i < numImages; i++) {
            setCurrentHorrorImage(Math.floor(Math.random() * HORROR_IMAGES.length));
            setShowHorrorFlash(true);
            setStaticIntensity(0.15); // Reduce static to see image
            if (Math.random() > 0.5) playGrowl(0.4); // Random growl with horror flash
            await new Promise(r => setTimeout(r, 400 + Math.random() * 600)); // 400-1000ms visible
            setShowHorrorFlash(false);
            setStaticIntensity(0.9); // Heavy static between images
            await new Promise(r => setTimeout(r, 100 + Math.random() * 150));
          }
          
          // Return to normal static
          setStaticIntensity(0.3);
        };
        
        showHorrorThroughStatic();
      }, 4000 + Math.random() * 2000); // Cada 4-6 segundos
      
      return () => {
        clearInterval(flashInterval);
        setShowStatic(false);
        stopSound('static');
      };
    } else {
      setShowStatic(false);
      stopSound('static');
    }
  }, [isCorrupted, isOpen, showFinalMessage]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      // Check if we have saved state to restore (creepy persistence)
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState && !restoredFromStorage) {
        try {
          const parsed = JSON.parse(savedState);
          // Only restore if saved within last 30 minutes
          const thirtyMinutes = 30 * 60 * 1000;
          if (Date.now() - parsed.timestamp < thirtyMinutes) {
            setCurrentStep(parsed.currentStep || STEPS.DATES);
            setAttemptedClose(parsed.attemptedClose || 0);
            setFormData(parsed.formData || {
              checkIn: '',
              checkOut: '',
              guests: 2,
              name: '',
              email: '',
              phone: '',
            });
            setRestoredFromStorage(true);
            // Show creepy "we remember" message
            setShowRestoredMessage(true);
            playPianoSting(0.5); // Creepy piano sting when restored
            setTimeout(() => setShowRestoredMessage(false), 3500);
            return;
          }
        } catch (e) {
          // Invalid saved state, continue with fresh state
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      // Fresh open - reset everything
      setCurrentStep(STEPS.DATES);
      setAttemptedClose(0);
      setShowWarning(false);
      setIsComplete(false);
      setShowFinalMessage(false);
      setShowHorrorFlash(false);
      setShowStatic(false);
      setStaticIntensity(0);
      
      // Play piano sting on first open (light mode only)
      if (!isDarkMode && !restoredFromStorage) {
        playPianoSting(0.4);
      }
    } else {
      // Make sure to stop static sound when modal closes
      stopSound('static');
      // Reset restoredFromStorage so it can trigger again on next page load
      setRestoredFromStorage(false);
    }
  }, [isOpen]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Block escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCloseAttempt();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, attemptedClose]);

  const handleCloseAttempt = () => {
    // Block closing during final message or completion sequence
    if (showFinalMessage || isComplete) {
      return;
    }
    
    const newAttempt = attemptedClose + 1;
    setAttemptedClose(newAttempt);
    
    // Shake del modal
    if (modalRef.current) {
      modalRef.current.classList.add('animate-shake');
      setTimeout(() => {
        modalRef.current?.classList.remove('animate-shake');
      }, 500);
    }
    
    // Al 5to intento: mostrar mensaje final PRIMERO, luego cambiar a dark mode y cerrar
    if (newAttempt >= 5) {
      setShowFinalMessage(true);
      
      // After 2 seconds showing the message, activate dark mode
      setTimeout(() => {
        playSwitch();
        startAmbient();
        toggleMode();
      }, 2000);
      
      // Close after showing the complete message
      setTimeout(() => {
        onClose();
      }, 4000);
      return;
    }
    
    setShowWarning(true);
    playBuzz(0.4 + attemptedClose * 0.1); // Volume increases with each attempt
    setTimeout(() => setShowWarning(false), 2500);
  };

  const handleNext = () => {
    if (currentStep < STEPS.CONFIRM) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    // After certain attempts, going back sometimes doesn't work
    if (attemptedClose >= 3 && Math.random() > 0.5) {
      return;
    }
    if (currentStep > STEPS.DATES) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsComplete(true);
    
    // Switch to dark mode after showing message, then close
    if (!isDarkMode) {
      setTimeout(() => {
        playSwitch();
        startAmbient();
        toggleMode();
      }, 2000);
      
      // Close modal after dramatic sequence
      setTimeout(() => {
        onClose();
      }, 4000);
    } else {
      // Already in dark mode, just close after message
      setTimeout(() => {
        onClose();
      }, 3000);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case STEPS.DATES:
        return formData.checkIn && formData.checkOut;
      case STEPS.GUESTS:
        return formData.guests > 0;
      case STEPS.DETAILS:
        return formData.name && formData.email;
      default:
        return true;
    }
  };

  // Titles that become more sinister with close attempts
  const getStepTitles = () => {
    if (attemptedClose >= 3) {
      return [
        { title: 'Select Dates', subtitle: 'When will you arrive? You will never leave.' },
        { title: 'Guest Count', subtitle: 'How many souls will join you?' },
        { title: 'Your Details', subtitle: 'We must know everything about you.' },
        { title: 'Confirm Booking', subtitle: 'Seal your fate.' },
      ];
    }
    return [
      { title: 'Select Dates', subtitle: 'When will you arrive?' },
      { title: 'Guest Count', subtitle: 'How many guests?' },
      { title: 'Your Details', subtitle: 'Tell us about yourself' },
      { title: 'Confirm Booking', subtitle: 'Review and complete' },
    ];
  };

  const stepTitles = getStepTitles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleCloseAttempt}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 backdrop-blur-md transition-all duration-700"
            animate={{ 
              backgroundColor: `rgba(0, 0, 0, ${0.7 + (corruptionLevel * 0.05)})`,
            }}
          />

          {/* TV static effect */}
          <AnimatePresence>
            {showStatic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: staticIntensity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-10 pointer-events-none"
              >
                {/* Animated static */}
                <div 
                  className="absolute inset-0 tv-static"
                  style={{ 
                    mixBlendMode: 'overlay',
                  }}
                />
                {/* Scan lines */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                    animation: 'scanlines 0.1s linear infinite',
                  }}
                />
                {/* Color flicker */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'rgba(255, 0, 0, 0.05)',
                    animation: 'colorFlicker 0.15s infinite',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horror image flashes through static */}
          <AnimatePresence>
            {showHorrorFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.9, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[11]"
              >
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    backgroundImage: `url(${HORROR_IMAGES[currentHorrorImage]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'brightness(0.5) contrast(1.4) saturate(0.5)',
                  }}
                />
                {/* Subtle red overlay */}
                <div className="absolute inset-0 bg-red-900/15" />
                {/* Horizontal distortion */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 6px)',
                  }}
                />
                {/* Random horizontal glitch */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    clipPath: 'inset(10% 0 40% 0)',
                    transform: 'translateX(-10px)',
                    opacity: 0.8,
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundImage: `url(${HORROR_IMAGES[currentHorrorImage]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: 'brightness(0.3) contrast(1.5) grayscale(0.4)',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Intensifying vignette */}
          {corruptionLevel >= 2 && (
            <div 
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                background: `radial-gradient(ellipse at center, transparent 0%, transparent ${60 - corruptionLevel * 10}%, rgba(0,0,0,${0.4 + corruptionLevel * 0.1}) 100%)`,
              }}
            />
          )}

          {/* Warning message */}
          <AnimatePresence>
            {showWarning && !showFinalMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
              >
                <motion.div 
                  className={`px-10 py-8 rounded-2xl shadow-2xl max-w-md ${
                    corruptionLevel >= 3 
                      ? 'bg-black/95 border-2 border-red-800' 
                      : 'bg-pine-900'
                  }`}
                >
                  <p className={`text-xl font-bold text-center ${
                    corruptionLevel >= 3 ? 'text-red-500' : 'text-white'
                  }`} style={{ fontFamily: corruptionLevel >= 3 ? 'var(--font-serif)' : 'inherit' }}>
                    {closeAttemptMessages[Math.min(attemptedClose - 1, closeAttemptMessages.length - 1)]}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Restored from storage - creepy "we remember" message */}
          <AnimatePresence>
            {showRestoredMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[300] flex items-center justify-center"
              >
                {/* Full black backdrop to hide modal behind */}
                <div className="absolute inset-0 bg-black" />
                
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: -10 }}
                  className="relative bg-black border-2 border-red-800 rounded-xl px-12 py-10 shadow-2xl"
                  style={{
                    boxShadow: '0 0 80px rgba(220, 38, 38, 0.4)',
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-950 border-2 border-red-700 flex items-center justify-center"
                  >
                    <Skull className="w-8 h-8 text-red-500" />
                  </motion.div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-red-500 text-2xl font-bold text-center mb-3"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    We Remember You
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-300 text-sm text-center"
                  >
                    You thought you could escape by closing the page?
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-red-600 text-xs text-center mt-3"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    The reservation continues where you left off...
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* FINAL MESSAGE - When dark mode activates */}
          <AnimatePresence>
            {showFinalMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center"
              >
                {/* Horror background image */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundImage: `url(/cabin-dark.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.15) saturate(0.3)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
                
                {/* Final message */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative z-10 text-center px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-950/50 border-2 border-red-800 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Skull className="w-12 h-12 text-red-500" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-4xl md:text-5xl text-red-500 mb-6"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    THERE IS NO ESCAPE
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-400 text-lg max-w-md mx-auto mb-4"
                  >
                    You tried to leave. But the cabin has already chosen you.
                  </motion.p>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.5 }}
                    className="text-red-900 text-sm tracking-[0.3em]"
                  >
                    WELCOME HOME
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* COMPLETION MESSAGE - When reservation is completed */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center"
              >
                {/* Horror background image */}
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundImage: `url(/cabin-dark.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.15) saturate(0.3)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
                
                {/* Completion message */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative z-10 text-center px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-950/50 border-2 border-red-800 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Lock className="w-12 h-12 text-red-500" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-4xl md:text-5xl text-red-500 mb-6"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    RESERVATION SEALED
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-gray-400 text-lg max-w-md mx-auto mb-4"
                  >
                    Your booking is confirmed. The cabin has been expecting you.
                  </motion.p>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1.5 }}
                    className="text-red-900 text-sm tracking-[0.3em]"
                  >
                    CHECK-OUT IS NOT AN OPTION
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Modal Content - Only visible if not final message */}
          {!showFinalMessage && !isComplete && (
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl transition-colors duration-500 z-30 ${
                isCorrupted 
                  ? 'bg-[#0a0808] border border-red-900/40' 
                  : 'bg-[#fdfcfb]'
              }`}
            >
              {/* Close button */}
              {!isComplete && (
                <motion.button
                  onClick={handleCloseAttempt}
                  className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCorrupted
                      ? 'bg-red-950/50 text-red-900/50 hover:bg-red-950/70'
                      : corruptionLevel >= 1
                      ? 'bg-stone-200 text-stone-500 hover:bg-stone-300'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  style={{ 
                    opacity: Math.max(0.3, 1 - corruptionLevel * 0.15),
                  }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}

              {/* Progress bar */}
              {!isComplete && (
                <div className={`h-1 ${isCorrupted ? 'bg-red-950/50' : 'bg-stone-200'}`}>
                  <motion.div
                    className={`h-full ${isCorrupted ? 'bg-red-700' : 'bg-pine-900'}`}
                    initial={{ width: '25%' }}
                    animate={{ width: `${((currentStep + 1) / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {isComplete ? null : (
                  // Form steps
                  <>
                    {/* Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrupted ? (
                          <Lock className="w-4 h-4 text-red-600" />
                        ) : null}
                        <span className={`text-xs font-bold tracking-wider uppercase ${
                          isCorrupted ? 'text-red-600' : 'text-gold-500'
                        }`}>
                          Step {currentStep + 1} of 4
                        </span>
                      </div>
                      <h2 
                        className={`text-3xl transition-colors duration-300 ${isCorrupted ? 'text-white' : 'text-pine-900'}`}
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {stepTitles[currentStep].title}
                      </h2>
                      <p className={`mt-1 transition-colors duration-300 ${isCorrupted ? 'text-gray-500' : 'text-pine-700/60'}`}>
                        {stepTitles[currentStep].subtitle}
                      </p>
                    </div>

                    {/* Step content */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="min-h-[200px]"
                      >
                        {currentStep === STEPS.DATES && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors ${
                                  isCorrupted ? 'text-gray-400' : 'text-pine-900'
                                }`}>
                                  Check-in
                                </label>
                                <div className="relative">
                                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                    isCorrupted ? 'text-red-600' : 'text-gold-500'
                                  }`} />
                                  <input
                                    type="date"
                                    value={formData.checkIn}
                                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                                      isCorrupted
                                        ? 'bg-black/50 border-red-900/40 text-white focus:border-red-700'
                                        : 'bg-white border-stone-200 text-pine-900 focus:border-gold-400'
                                    }`}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors ${
                                  isCorrupted ? 'text-gray-400' : 'text-pine-900'
                                }`}>
                                  Check-out
                                  {isCorrupted && <span className="text-red-600/50 ml-1">(optional)</span>}
                                </label>
                                <div className="relative">
                                  <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                    isCorrupted ? 'text-red-600' : 'text-gold-500'
                                  }`} />
                                  <input
                                    type="date"
                                    value={formData.checkOut}
                                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl border outline-none transition-all ${
                                      isCorrupted
                                        ? 'bg-black/50 border-red-900/40 text-white focus:border-red-700'
                                        : 'bg-white border-stone-200 text-pine-900 focus:border-gold-400'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                            {corruptionLevel >= 2 && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                className="text-xs text-red-600/70 italic"
                              >
                                {isCorrupted 
                                  ? "Check-out will not be necessary."
                                  : "* Check-out dates are... flexible."
                                }
                              </motion.p>
                            )}
                          </div>
                        )}

                        {currentStep === STEPS.GUESTS && (
                          <div className="space-y-6">
                            <div>
                              <label className={`block text-sm font-medium mb-4 transition-colors ${
                                isCorrupted ? 'text-gray-400' : 'text-pine-900'
                              }`}>
                                Number of {isCorrupted ? 'Souls' : 'Guests'}
                              </label>
                              <div className="flex items-center gap-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setFormData({...formData, guests: Math.max(1, formData.guests - 1)})}
                                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-colors ${
                                    isCorrupted
                                      ? 'bg-red-950/50 text-red-500 hover:bg-red-950/70 border border-red-900/30'
                                      : 'bg-stone-100 text-pine-900 hover:bg-stone-200'
                                  }`}
                                >
                                  −
                                </motion.button>
                                <div className="flex items-center gap-3">
                                  <Users className={`w-6 h-6 transition-colors ${isCorrupted ? 'text-red-600' : 'text-gold-500'}`} />
                                  <span className={`text-4xl font-bold transition-colors ${isCorrupted ? 'text-white' : 'text-pine-900'}`}>
                                    {formData.guests}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setFormData({...formData, guests: Math.min(10, formData.guests + 1)})}
                                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold transition-colors ${
                                    isCorrupted
                                      ? 'bg-red-950/50 text-red-500 hover:bg-red-950/70 border border-red-900/30'
                                      : 'bg-stone-100 text-pine-900 hover:bg-stone-200'
                                  }`}
                                >
                                  +
                                </motion.button>
                              </div>
                            </div>
                            {corruptionLevel >= 2 && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                className="text-xs text-red-600/70 italic"
                              >
                                {isCorrupted 
                                  ? "The more the merrier. They are all welcome."
                                  : "More guests means more... company."
                                }
                              </motion.p>
                            )}
                          </div>
                        )}

                        {currentStep === STEPS.DETAILS && (
                          <div className="space-y-4">
                            <div>
                              <label className={`block text-sm font-medium mb-2 transition-colors ${
                                isCorrupted ? 'text-gray-400' : 'text-pine-900'
                              }`}>
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder={isCorrupted ? "We already know..." : "Your name"}
                                className={`w-full px-4 py-4 rounded-xl border outline-none transition-all ${
                                  isCorrupted
                                    ? 'bg-black/50 border-red-900/40 text-white placeholder:text-gray-600 focus:border-red-700'
                                    : 'bg-white border-stone-200 text-pine-900 placeholder:text-stone-400 focus:border-gold-400'
                                }`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-2 transition-colors ${
                                isCorrupted ? 'text-gray-400' : 'text-pine-900'
                              }`}>
                                Email
                              </label>
                              <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder={isCorrupted ? "For our records. Forever." : "your@email.com"}
                                className={`w-full px-4 py-4 rounded-xl border outline-none transition-all ${
                                  isCorrupted
                                    ? 'bg-black/50 border-red-900/40 text-white placeholder:text-gray-600 focus:border-red-700'
                                    : 'bg-white border-stone-200 text-pine-900 placeholder:text-stone-400 focus:border-gold-400'
                                }`}
                              />
                            </div>
                            <div>
                              <label className={`block text-sm font-medium mb-2 transition-colors ${
                                isCorrupted ? 'text-gray-400' : 'text-pine-900'
                              }`}>
                                Phone {!isCorrupted && '(Optional)'}
                              </label>
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                placeholder={isCorrupted ? "In case we need to... reach you" : "+1 234 567 890"}
                                className={`w-full px-4 py-4 rounded-xl border outline-none transition-all ${
                                  isCorrupted
                                    ? 'bg-black/50 border-red-900/40 text-white placeholder:text-gray-600 focus:border-red-700'
                                    : 'bg-white border-stone-200 text-pine-900 placeholder:text-stone-400 focus:border-gold-400'
                                }`}
                              />
                            </div>
                            {corruptionLevel >= 2 && (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.6 }}
                                className="text-xs text-red-600/70 italic"
                              >
                                {isCorrupted 
                                  ? "Your information will be kept... indefinitely."
                                  : "We need to know exactly who is coming..."
                                }
                              </motion.p>
                            )}
                          </div>
                        )}

                        {currentStep === STEPS.CONFIRM && (
                          <div className="space-y-6">
                            {/* Summary */}
                            <div className={`p-6 rounded-2xl transition-colors ${
                              isCorrupted ? 'bg-black/50 border border-red-900/30' : 'bg-stone-50'
                            }`}>
                              <h3 className={`font-bold mb-4 transition-colors ${isCorrupted ? 'text-white' : 'text-pine-900'}`}>
                                {isCorrupted ? 'Final Summary' : 'Booking Summary'}
                              </h3>
                              <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className={isCorrupted ? 'text-gray-500' : 'text-pine-600'}>
                                    {isCorrupted ? 'Arrival' : 'Dates'}
                                  </span>
                                  <span className={isCorrupted ? 'text-white' : 'text-pine-900'}>
                                    {formData.checkIn} {isCorrupted ? '→ ∞' : `→ ${formData.checkOut}`}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={isCorrupted ? 'text-gray-500' : 'text-pine-600'}>
                                    {isCorrupted ? 'Souls' : 'Guests'}
                                  </span>
                                  <span className={isCorrupted ? 'text-white' : 'text-pine-900'}>
                                    {formData.guests} {formData.guests === 1 ? (isCorrupted ? 'soul' : 'guest') : (isCorrupted ? 'souls' : 'guests')}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className={isCorrupted ? 'text-gray-500' : 'text-pine-600'}>Name</span>
                                  <span className={isCorrupted ? 'text-white' : 'text-pine-900'}>{formData.name}</span>
                                </div>
                                <div className={`pt-3 mt-3 border-t transition-colors ${isCorrupted ? 'border-red-900/30' : 'border-stone-200'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className={`font-bold transition-colors ${isCorrupted ? 'text-white' : 'text-pine-900'}`}>
                                      {isCorrupted ? 'Cost' : 'Total'}
                                    </span>
                                    <div className="text-right">
                                      <span className={`text-2xl font-bold transition-colors ${isCorrupted ? 'text-red-500' : 'text-pine-900'}`}>
                                        {isCorrupted ? 'Your Soul' : '$897'}
                                      </span>
                                      {isCorrupted && (
                                        <p className="text-xs text-red-900 mt-1">+ eternal residency</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Terms */}
                            <div className={`flex items-start gap-3 text-xs transition-colors ${
                              isCorrupted ? 'text-gray-500' : 'text-pine-600/70'
                            }`}>
                              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 transition-colors ${
                                isCorrupted ? 'text-red-600' : 'text-gold-500'
                              }`} />
                              <p>
                                {isCorrupted 
                                  ? 'By completing this reservation, you agree to become a permanent resident of SpookBnB. Your soul is bound to these grounds. There is no refund. There is no escape.'
                                  : 'By completing this reservation, you agree to our terms and cancellation policy. Free cancellation up to 48 hours before check-in.'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className={`flex justify-between mt-8 pt-6 border-t transition-colors ${
                      isCorrupted ? 'border-red-900/20' : 'border-stone-200'
                    }`}>
                      {currentStep > STEPS.DATES ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleBack}
                          className={`px-6 py-3 rounded-full font-medium transition-all ${
                            isCorrupted
                              ? 'text-gray-600 hover:text-gray-500'
                              : 'text-pine-600 hover:text-pine-900'
                          }`}
                          style={{ 
                            opacity: isCorrupted ? 0.5 : 1,
                          }}
                        >
                          ← Back
                        </motion.button>
                      ) : (
                        <div />
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={currentStep === STEPS.CONFIRM ? handleSubmit : handleNext}
                        disabled={!canProceed() || isSubmitting}
                        className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 transition-all ${
                          !canProceed()
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : isCorrupted
                            ? 'bg-red-700 text-white hover:bg-red-600 shadow-lg shadow-red-900/40 border border-red-600'
                            : 'bg-pine-900 text-white hover:bg-pine-800 shadow-lg shadow-pine-900/20'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            {isCorrupted ? 'Binding...' : 'Processing...'}
                          </>
                        ) : currentStep === STEPS.CONFIRM ? (
                          <>
                            {isCorrupted ? <Lock className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                            {isCorrupted ? 'Seal Your Fate' : 'Complete Booking'}
                          </>
                        ) : (
                          'Continue →'
                        )}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* CSS for animations */}
          <style jsx global>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
              20%, 40%, 60%, 80% { transform: translateX(4px); }
            }
            .animate-shake {
              animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
            
            /* TV Static */
            .tv-static {
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
              background-size: 200px 200px;
              animation: staticMove 0.1s steps(10) infinite;
            }
            
            @keyframes staticMove {
              0% { background-position: 0 0; }
              100% { background-position: 200px 200px; }
            }
            
            @keyframes scanlines {
              0% { transform: translateY(0); }
              100% { transform: translateY(4px); }
            }
            
            @keyframes colorFlicker {
              0%, 100% { opacity: 0; }
              50% { opacity: 1; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
