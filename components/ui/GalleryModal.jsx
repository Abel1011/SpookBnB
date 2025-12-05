'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { X, ChevronLeft, ChevronRight, Moon, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { galleryImages } from '@/data/content';



export function GalleryModal({ isOpen, onClose }) {
  const { isDarkMode, toggleMode } = useTheme();
  const { playSwitch, startAmbient } = useAudio();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentImage = galleryImages[currentIndex];

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, []);

  const handleActivateNightMode = () => {
    playSwitch();
    startAmbient();
    toggleMode();
    onClose();
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isOpen || isPaused) return;
    
    const autoPlayInterval = setInterval(() => {
      goToNext();
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(autoPlayInterval);
  }, [isOpen, isPaused, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev]);

  // Prevent body scroll when modal is open
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

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (isDarkMode) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] bg-[#fdfcfb] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-pine-900 hover:bg-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Image Section */}
              <div 
                className="relative flex-1 min-h-[300px] lg:min-h-[500px] bg-stone-100 overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0"
                  >
                    <img
                      src={currentImage.src}
                      alt={currentImage.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Night View Special Overlay */}
                    {currentImage.isNightView && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col items-center justify-end p-8 pb-24 lg:pb-16"
                      >
                        {/* Floating particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(20)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-gold-300/60 rounded-full"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                              }}
                              animate={{ 
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
                              }}
                              transition={{
                                duration: 2 + Math.random() * 3,
                                repeat: Infinity,
                                delay: Math.random() * 2,
                              }}
                            />
                          ))}
                        </div>

                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-center relative z-10"
                        >
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-400/30 mb-4">
                            <Sparkles className="w-4 h-4 text-gold-400" />
                            <span className="text-gold-400 text-sm font-bold tracking-wide">EXCLUSIVE</span>
                          </div>
                          
                          <h3 className="text-3xl md:text-4xl font-serif text-white mb-3">
                            Ready for the <span className="text-gold-400 italic">Night</span>?
                          </h3>
                          
                          <p className="text-stone-300 mb-6 max-w-md mx-auto">
                            Experience our cabin under the stars. The night reveals secrets 
                            that daylight cannot show.
                          </p>

                          <motion.button
                            onClick={handleActivateNightMode}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-pine-900 font-bold tracking-wide shadow-xl shadow-gold-500/30"
                          >
                            <Moon className="w-5 h-5" />
                            Enter Night Mode
                          </motion.button>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToPrev}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-pine-900 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToNext}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-pine-900 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1);
                        setCurrentIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentIndex 
                          ? img.isNightView ? 'bg-gold-400 w-8' : 'bg-pine-900 w-8'
                          : 'bg-white/50 w-1.5 hover:bg-white/80'
                      }`}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}
                </div>
              </div>

              {/* Info Section */}
              <div className="w-full lg:w-80 p-6 lg:p-8 flex flex-col justify-between bg-[#fdfcfb]">
                <div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {currentImage.isNightView ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pine-900 mb-4">
                          <Moon className="w-3 h-3 text-gold-400" />
                          <span className="text-gold-400 text-xs font-bold tracking-wide">NIGHT EXPERIENCE</span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold tracking-[0.2em] text-gold-500 uppercase">
                          {currentIndex + 1} / {galleryImages.length}
                        </span>
                      )}
                      
                      <h2 
                        className={`text-3xl lg:text-4xl mt-3 mb-4 ${
                          currentImage.isNightView ? 'text-pine-900' : 'text-pine-900'
                        }`}
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {currentImage.title}
                      </h2>
                      
                      <p className="text-pine-700/70 leading-relaxed">
                        {currentImage.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Thumbnail strip - grid on desktop, scroll on mobile */}
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <p className="text-xs font-bold tracking-wider text-pine-600/50 uppercase mb-3">
                    Gallery
                  </p>
                  {/* Mobile: horizontal scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 lg:hidden">
                    {galleryImages.map((img, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setDirection(i > currentIndex ? 1 : -1);
                          setCurrentIndex(i);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                          i === currentIndex 
                            ? img.isNightView ? 'border-gold-500' : 'border-pine-900'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                        {img.isNightView && (
                          <div className="absolute inset-0 bg-pine-900/60 flex items-center justify-center">
                            <Moon className="w-4 h-4 text-gold-400" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  {/* Desktop: grid layout */}
                  <div className="hidden lg:grid grid-cols-4 gap-2">
                    {galleryImages.map((img, i) => (
                      <motion.button
                        key={i}
                        onClick={() => {
                          setDirection(i > currentIndex ? 1 : -1);
                          setCurrentIndex(i);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          i === currentIndex 
                            ? img.isNightView ? 'border-gold-500' : 'border-pine-900'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.title}
                          className="w-full h-full object-cover"
                        />
                        {img.isNightView && (
                          <div className="absolute inset-0 bg-pine-900/60 flex items-center justify-center">
                            <Moon className="w-4 h-4 text-gold-400" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
