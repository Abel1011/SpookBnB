'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ModeToggle } from '@/components/ui/ModeToggle';
import { useTheme } from '@/components/providers/ThemeProvider';
import { ReservationModal } from '@/components/ui/ReservationModal';
import { TreePine } from 'lucide-react';
import Image from 'next/image';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { useReservationPersistence } from '@/components/hooks/useReservationPersistence';

export function Header() {
  const { isDarkMode } = useTheme();
  const { playJumpscare } = useSoundEffects();
  const { shouldAutoOpen, clearAutoOpen } = useReservationPersistence();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  
  // Auto-open modal if there's persisted state (creepy "it remembers" effect)
  useEffect(() => {
    if (shouldAutoOpen) {
      setIsReservationOpen(true);
      clearAutoOpen();
    }
  }, [shouldAutoOpen, clearAutoOpen]);
  
  // Scare states
  const [showScare, setShowScare] = useState(false);
  const [scareType, setScareType] = useState('skull');
  const [scareMessage, setScareMessage] = useState('');

  const scareMessages = [
    "YOU'RE NOT LEAVING",
    "FOREVER MEANS FOREVER",
    "THERE IS NO CHECKOUT",
    "YOU ALREADY STAYED",
    "WE'VE BEEN WAITING",
    "TOO LATE TO RUN",
    "YOU BELONG HERE NOW",
  ];

  const scareIcons = ['skull', 'doll', 'witch', 'hand'];

  const triggerScare = () => {
    if (!isDarkMode) {
      setIsReservationOpen(true);
      return;
    }
    
    // Random scare effect in dark mode
    setScareType(scareIcons[Math.floor(Math.random() * scareIcons.length)]);
    setScareMessage(scareMessages[Math.floor(Math.random() * scareMessages.length)]);
    setShowScare(true);
    playJumpscare(0.6); // Play jumpscare sound
    
    // Hide after scare
    setTimeout(() => setShowScare(false), 1500);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isDarkMode 
    ? [
        { label: 'The Chambers', href: 'location' },
        { label: 'The Warnings', href: 'amenities' },
        { label: 'Lost Souls', href: 'reviews' },
      ]
    : [
        { label: 'Rooms', href: 'location' },
        { label: 'Amenities', href: 'amenities' },
        { label: 'Reviews', href: 'reviews' },
      ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex justify-center ${
        scrolled 
          ? 'py-4' 
          : 'py-6'
      }`}
    >
      <div className={`transition-all duration-500 flex items-center justify-between px-6 lg:px-8 ${
        scrolled 
          ? isDarkMode 
            ? 'w-[90%] max-w-5xl bg-black/80 backdrop-blur-xl rounded-full shadow-2xl shadow-black/50' 
            : 'w-[90%] max-w-5xl bg-white/80 backdrop-blur-xl rounded-full shadow-xl shadow-stone-200/20 py-2'
          : 'w-full max-w-7xl bg-transparent'
      }`}>
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-red-900/50 to-red-950/50 border border-red-800/30' 
                : 'bg-pine-900'
            }`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <TreePine className={`w-5 h-5 ${isDarkMode ? 'text-red-500' : 'text-white'}`} />
          </motion.div>
          <div>
            <h1 className={`text-xl font-bold tracking-tight transition-colors duration-500 ${
              isDarkMode ? 'text-red-500' : 'text-pine-900'
            }`} style={{ fontFamily: 'var(--font-serif)' }}>
              SpookBnB
            </h1>
          </div>
        </motion.div>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, i) => (
            <motion.button 
              key={item.label}
              onClick={() => scrollToSection(item.href)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -2 }}
              className={`relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-red-400' 
                  : 'text-pine-800/70 hover:text-pine-900'
              }`}
            >
              {item.label}
              <motion.span 
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full ${
                  isDarkMode ? 'bg-red-500' : 'bg-gold-500'
                }`}
                initial={{ width: 0 }}
                whileHover={{ width: '40%' }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 relative z-[150]">
          <ModeToggle />
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={triggerScare}
            className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-red-800 to-red-900 text-white border border-red-700 hover:shadow-lg hover:shadow-red-900/30' 
                : 'bg-pine-900 text-white hover:bg-pine-800 hover:shadow-lg shadow-pine-900/20'
            }`}
          >
            <span>{isDarkMode ? 'Stay Forever' : 'Book Now'}</span>
          </motion.button>

          {/* Mobile menu button */}
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full ${
              isDarkMode ? 'bg-red-900/30' : 'bg-stone-100'
            }`}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className={`w-full h-0.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-pine-900'}`}
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className={`w-full h-0.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-pine-900'}`}
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className={`w-full h-0.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-pine-900'}`}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden ${
              isDarkMode ? 'bg-black/95' : 'bg-white/95'
            } backdrop-blur-xl`}
          >
            <nav className="flex flex-col p-6 gap-2">
              {navItems.map((item, i) => (
                <motion.button 
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`px-4 py-3 rounded-xl text-lg font-medium text-left ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-400' 
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reservation Modal */}
      <ReservationModal 
        isOpen={isReservationOpen} 
        onClose={() => setIsReservationOpen(false)} 
      />
    </motion.header>

      {/* SCARE OVERLAY - Outside header for proper z-index stacking */}
      <AnimatePresence>
        {showScare && (
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
              animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            />
            
            {/* Scare icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ 
                scale: [0, 1.5, 1.2, 1.3, 1.2],
                rotate: [-30, 10, -5, 5, 0],
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src={`/icons/${scareType}.png`}
                alt=""
                width={250}
                height={250}
                className="drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] brightness-90"
              />
            </motion.div>

            {/* Scare message */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="absolute bottom-1/4 text-center"
            >
              <motion.p
                className="text-red-500 text-4xl md:text-6xl font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 30px rgba(220,38,38,0.8)' }}
                animate={{ scale: [1, 1.05, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {scareMessage}
              </motion.p>
            </motion.div>

            {/* Screen shake effect via CSS */}
            <style jsx>{`
              @keyframes screen-shake {
                0%, 100% { transform: translate(0, 0); }
                10% { transform: translate(-10px, -5px); }
                20% { transform: translate(10px, 5px); }
                30% { transform: translate(-10px, 5px); }
                40% { transform: translate(10px, -5px); }
                50% { transform: translate(-5px, 10px); }
                60% { transform: translate(5px, -10px); }
                70% { transform: translate(-5px, -5px); }
                80% { transform: translate(5px, 5px); }
                90% { transform: translate(-3px, 3px); }
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
