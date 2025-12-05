'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { MapPin, Phone, Mail, ArrowRight, TreePine, Skull, Lock, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FAQModal, AboutModal, TermsModal, PrivacyModal } from '@/components/ui/FooterModals';

// Horror images for subscription trap
const HORROR_IMAGES = [
  '/cabin-dark.png',
  '/cabin-dark2.png',
  '/room-basement-dark.png',
  '/room-master-dark.png',
];

// Flickering text component for horror effect
function FlickerText({ children, className = '', intensity = 'medium' }) {
  const intensityMap = {
    low: { duration: 8, opacity: [1, 0.7, 1, 0.9, 1] },
    medium: { duration: 5, opacity: [1, 0.4, 1, 0.6, 1, 0.8, 1] },
    high: { duration: 3, opacity: [1, 0.2, 0.8, 0.3, 1, 0.5, 1] }
  };
  
  const config = intensityMap[intensity];
  
  return (
    <motion.span
      className={className}
      animate={{ opacity: config.opacity }}
      transition={{ duration: config.duration, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

// Glitch text effect component
function GlitchText({ children, className = '' }) {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 150);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className={`relative inline-block ${className}`}>
      <span className={isGlitching ? 'opacity-0' : 'opacity-100'}>{children}</span>
      {isGlitching && (
        <>
          <span 
            className="absolute inset-0 text-red-500" 
            style={{ transform: 'translate(-2px, 0)', clipPath: 'inset(10% 0 60% 0)' }}
          >
            {children}
          </span>
          <span 
            className="absolute inset-0 text-cyan-500" 
            style={{ transform: 'translate(2px, 0)', clipPath: 'inset(50% 0 20% 0)' }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}

export function Footer() {
  const { isDarkMode, toggleMode } = useTheme();
  const { playSwitch, startAmbient } = useAudio();
  
  // Newsletter trap states
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showHorrorSequence, setShowHorrorSequence] = useState(false);
  const [currentHorrorImage, setCurrentHorrorImage] = useState(0);
  const [showStatic, setShowStatic] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isTrapped, setIsTrapped] = useState(false);
  
  // Modal states
  const [showFAQ, setShowFAQ] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // Handle newsletter subscription trap
  const handleSubscribe = async () => {
    if (!email || isDarkMode || isSubscribing) return;
    
    setIsSubscribing(true);
    
    // Start with static noise
    await new Promise(r => setTimeout(r, 800));
    setShowStatic(true);
    
    // Horror image sequence
    setShowHorrorSequence(true);
    
    // Flash through horror images
    for (let i = 0; i < 4; i++) {
      setCurrentHorrorImage(i);
      await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
    }
    
    // Show final message
    setShowStatic(false);
    setShowHorrorSequence(false);
    setShowFinalMessage(true);
    
    // Activate dark mode after message appears
    setTimeout(() => {
      playSwitch();
      startAmbient();
      toggleMode();
      setIsTrapped(true);
    }, 1500);
    
    // Close sequence
    setTimeout(() => {
      setShowFinalMessage(false);
      setIsSubscribing(false);
    }, 4000);
  };

  // Simplified footer links - scrolls to sections or opens modals
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const footerLinks = {
    [isDarkMode ? 'Wander' : 'Explore']: [
      { label: isDarkMode ? 'The Chambers' : 'Rooms', action: () => scrollToSection('location') },
      { label: isDarkMode ? 'The Warnings' : 'Amenities', action: () => scrollToSection('amenities') },
      { label: isDarkMode ? 'Lost Souls' : 'Reviews', action: () => scrollToSection('reviews') },
    ],
    [isDarkMode ? 'The Truth' : 'Info']: [
      { label: isDarkMode ? 'Our History' : 'About Us', action: () => setShowAbout(true) },
      { label: isDarkMode ? 'Questions' : 'FAQ', action: () => setShowFAQ(true) },
    ],
    [isDarkMode ? 'Contracts' : 'Legal']: [
      { label: isDarkMode ? 'Eternal Binding' : 'Terms', action: () => setShowTerms(true) },
      { label: isDarkMode ? 'We See All' : 'Privacy', action: () => setShowPrivacy(true) },
    ],
  };

  const socialIcons = [
    { icon: null, customIcon: '𝕏', label: 'X', creepyMsg: 'Your last post was 3 days ago. We noticed.' },
    { icon: Linkedin, label: 'LinkedIn', creepyMsg: '47 people viewed your profile this week. Not all of them are alive.' },
    { icon: Facebook, label: 'Facebook', creepyMsg: 'Your friends miss you. Especially the ones who stayed here.' },
    { icon: Instagram, label: 'Instagram', creepyMsg: 'Nice photos. We saved them all. Just in case.' }
  ];
  
  // Social tooltip state
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  const handleSocialClick = (index) => {
    if (isDarkMode) return;
    setActiveTooltip(activeTooltip === index ? null : index);
    // Auto-hide after 3 seconds
    setTimeout(() => setActiveTooltip(null), 3000);
  };
  
  // Calculate tooltip position based on icon index
  const getTooltipPosition = (index) => {
    // First icon (Twitter) - align to left
    if (index === 0) return 'left-0 -translate-x-0';
    // Last icon (Instagram) - align to right  
    if (index === 3) return 'right-0 translate-x-0';
    // Middle icons - center
    return 'left-1/2 -translate-x-1/2';
  };
  
  const getTooltipArrowPosition = (index) => {
    if (index === 0) return 'left-4';
    if (index === 3) return 'right-4';
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <footer 
      id="contact"
      className={`relative overflow-hidden ${
        isDarkMode 
          ? 'bg-black' 
          : 'bg-gradient-to-b from-[#f5f0e8] to-[#ede6da]'
      }`}
    >
      {/* Newsletter Trap Overlay */}
      <AnimatePresence>
        {(showStatic || showHorrorSequence || showFinalMessage) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
          >
            {/* Static noise effect */}
            {showStatic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0 newsletter-static"
                  style={{ mixBlendMode: 'overlay' }}
                />
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                    animation: 'scanlines 0.1s linear infinite',
                  }}
                />
              </motion.div>
            )}

            {/* Horror image flashes */}
            {showHorrorSequence && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <div 
                  className="absolute inset-0"
                  style={{ 
                    backgroundImage: `url(${HORROR_IMAGES[currentHorrorImage]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.4) contrast(1.3) saturate(0.4)',
                  }}
                />
                <div className="absolute inset-0 bg-red-900/20" />
                {/* Glitch distortion */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 6px)',
                  }}
                />
              </motion.div>
            )}

            {/* Final message */}
            {showFinalMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
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
                
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative z-10 text-center px-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-950/50 border-2 border-red-800 flex items-center justify-center"
                  >
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Skull className="w-10 h-10 text-red-500" />
                    </motion.div>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl text-red-500 mb-4"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    WELCOME TO THE FAMILY
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-gray-400 text-base max-w-md mx-auto mb-3"
                  >
                    Your subscription is confirmed. You'll never miss another update.
                  </motion.p>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 1.2 }}
                    className="text-red-900 text-xs tracking-[0.3em]"
                  >
                    UNSUBSCRIBE IS NOT AN OPTION
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Decorative top border */}
      <div className={`h-px w-full ${isDarkMode ? 'bg-red-900/30' : 'bg-gradient-to-r from-transparent via-gold-400/50 to-transparent'}`} />

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isDarkMode ? (
          <>
            {/* Subtle cross pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
            
            {/* Animated fog/mist effect */}
            <motion.div 
              className="absolute inset-0 opacity-[0.03]"
              animate={{ 
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(139, 0, 0, 0.3) 70%, transparent 100%)',
                backgroundSize: '200% 200%',
              }}
            />
            
            {/* Vignette effect */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
              }}
            />
            
            {/* Random flicker spots */}
            <motion.div 
              className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full blur-3xl bg-red-900/10"
              animate={{ opacity: [0, 0.3, 0, 0.1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full blur-3xl bg-red-950/20"
              animate={{ opacity: [0, 0.2, 0.1, 0.3, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        ) : (
          <>
            <motion.div 
              className="absolute -bottom-40 -right-40 w-[50rem] h-[50rem] rounded-full blur-3xl bg-gold-300/20"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <motion.div 
              className="absolute -top-20 -left-20 w-[30rem] h-[30rem] rounded-full blur-3xl bg-pine-300/10"
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </>
        )}
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="py-20 lg:py-28">
          {/* Top Section - Brand & CTA */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
            {/* Brand Side */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-red-900/50 to-red-950/80 border border-red-800/30' 
                      : 'bg-pine-900 shadow-lg shadow-pine-900/20'
                  }`}
                >
                  {isDarkMode ? (
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Skull className="w-7 h-7 text-red-500" />
                    </motion.div>
                  ) : (
                    <TreePine className="w-7 h-7 text-white" />
                  )}
                </motion.div>
                <div>
                  <h3 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-red-500' : 'text-pine-900'
                  }`} style={{ fontFamily: 'var(--font-serif)' }}>
                    {isDarkMode ? <GlitchText>SpookBnB</GlitchText> : 'SpookBnB'}
                  </h3>
                  <p className={`text-xs tracking-[0.2em] uppercase ${
                    isDarkMode ? 'text-red-900' : 'text-gold-600'
                  }`}>
                    {isDarkMode ? (
                      <FlickerText intensity="low">Forever Yours</FlickerText>
                    ) : 'Mountain Retreats'}
                  </p>
                </div>
              </div>
              
              <p className={`text-lg leading-relaxed mb-10 max-w-md ${
                isDarkMode ? 'text-gray-400' : 'text-pine-700/80'
              }`}>
                {isDarkMode 
                  ? (
                    <>
                      Where every stay becomes... <FlickerText intensity="medium" className="text-red-400">permanent</FlickerText>. 
                      The mountains called, you answered. Now you are part of them.
                    </>
                  )
                  : 'Discover unique mountain retreats designed for those who seek peace, luxury, and an unforgettable connection with nature.'}
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: isDarkMode ? 'Coordinates Unknown' : 'Alpine Valley, Swiss Alps', darkFlicker: true },
                  { icon: Phone, text: isDarkMode ? '???-???-????' : '+41 123 456 789', darkFlicker: false },
                  { icon: Mail, text: isDarkMode ? 'no.reply@spookbnb.com' : 'hello@spookbnb.com', darkFlicker: false },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className={`flex items-center gap-3 ${
                      isDarkMode ? 'text-gray-500' : 'text-pine-700/70'
                    }`}
                  >
                    <motion.div
                      animate={isDarkMode ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 4 + i, repeat: Infinity }}
                    >
                      <item.icon className={`w-4 h-4 ${isDarkMode ? 'text-red-600' : 'text-gold-500'}`} />
                    </motion.div>
                    <span className="text-sm">
                      {isDarkMode && item.darkFlicker ? (
                        <FlickerText intensity="low">{item.text}</FlickerText>
                      ) : item.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Side */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:pl-12"
            >
              <div className={`inline-flex items-center gap-3 mb-6 ${
                isDarkMode ? 'text-red-500' : 'text-gold-500'
              }`}>
                <span className="w-8 h-px bg-current" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase">
                  {isDarkMode ? 'Join Us' : 'Newsletter'}
                </span>
              </div>

              <h4 className={`text-3xl lg:text-4xl mb-4 ${
                isDarkMode ? 'text-white' : 'text-pine-900'
              }`} style={{ fontFamily: 'var(--font-serif)' }}>
                {isDarkMode ? (
                  <>
                    <GlitchText>Stay</GlitchText>{' '}
                    <span className="text-red-500 italic">
                      <FlickerText intensity="medium">Forever</FlickerText>
                    </span>
                  </>
                ) : (
                  <>Stay <span className="text-gold-500 italic">Inspired</span></>
                )}
              </h4>

              <p className={`text-base mb-8 ${
                isDarkMode ? 'text-gray-500' : 'text-pine-700/70'
              }`}>
                {isDarkMode 
                  ? isTrapped 
                    ? (
                      <span>
                        Your <FlickerText intensity="high" className="text-red-400">eternal</FlickerText> subscription is active. 
                        There is no unsubscribe.
                      </span>
                    )
                    : 'Subscribe and become part of our eternal guest list.'
                  : 'Get exclusive offers, travel inspiration, and mountain retreat updates.'}
              </p>

              {/* Newsletter Input - Changes based on mode */}
              {isDarkMode ? (
                // Dark mode - Already trapped state
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 px-5 py-4 rounded-full bg-red-950/20 border border-red-900/40 relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-red-600" />
                        <span className={`text-sm ${isTrapped ? 'text-red-400' : 'text-red-900/60'}`}>
                          {isTrapped && email 
                            ? <span className="line-through opacity-60">{email}</span>
                            : 'Already subscribed to eternity...'
                          }
                        </span>
                      </div>
                      {/* Subtle pulse effect */}
                      <motion.div 
                        className="absolute inset-0 bg-red-900/10 rounded-full"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                    <motion.div
                      className="px-8 py-4 rounded-full text-sm font-bold tracking-wide flex items-center justify-center gap-2 bg-red-950/50 text-red-700 border border-red-900/30 cursor-not-allowed"
                    >
                      <Skull className="w-4 h-4" />
                      Bound
                    </motion.div>
                  </div>
                  {isTrapped && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-900/50 mt-3 text-center sm:text-left"
                    >
                      ✓ You are now part of us. Forever.
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                // Light mode - Normal input that triggers trap
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubscribing}
                    className={`flex-1 px-5 py-4 rounded-full text-sm outline-none transition-all bg-white border border-stone-200 text-pine-900 placeholder:text-pine-400 focus:border-gold-400 shadow-sm ${
                      isSubscribing ? 'opacity-50' : ''
                    }`}
                  />
                  <motion.button 
                    whileHover={{ scale: isSubscribing ? 1 : 1.02 }}
                    whileTap={{ scale: isSubscribing ? 1 : 0.98 }}
                    onClick={handleSubscribe}
                    disabled={!email || isSubscribing}
                    className={`px-8 py-4 rounded-full text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all ${
                      !email 
                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                        : isSubscribing
                        ? 'bg-pine-700 text-white'
                        : 'bg-pine-900 text-white hover:bg-pine-800 shadow-lg shadow-pine-900/20'
                    }`}
                  >
                    {isSubscribing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Joining...
                      </>
                    ) : (
                      <>
                        Subscribe
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Links Grid */}
          <div className={`grid grid-cols-3 gap-8 lg:gap-16 py-16 border-y ${
            isDarkMode ? 'border-red-900/20' : 'border-pine-200/50'
          }`}>
            {Object.entries(footerLinks).map(([title, links], colIndex) => (
              <motion.div 
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * colIndex }}
              >
                <h4 className={`font-bold mb-6 text-xs uppercase tracking-[0.2em] ${
                  isDarkMode ? 'text-red-500' : 'text-pine-900'
                }`}>
                  {isDarkMode ? (
                    <FlickerText intensity="low">{title}</FlickerText>
                  ) : title}
                </h4>
                <ul className="space-y-4">
                  {links.map((link, linkIndex) => (
                    <li key={link.label}>
                      <motion.button 
                        onClick={link.action}
                        whileHover={{ x: isDarkMode ? 8 : 4 }}
                        className={`text-sm transition-colors inline-flex items-center gap-2 group ${
                          isDarkMode 
                            ? 'text-gray-500 hover:text-red-400' 
                            : 'text-pine-700/70 hover:text-gold-600'
                        }`}
                      >
                        <motion.span 
                          className={`w-0 h-px transition-all group-hover:w-3 ${
                            isDarkMode ? 'bg-red-500' : 'bg-gold-500'
                          }`}
                          animate={isDarkMode ? { opacity: [1, 0.3, 1] } : {}}
                          transition={{ duration: 2 + linkIndex * 0.5, repeat: Infinity }}
                        />
                        {isDarkMode ? (
                          <motion.span
                            whileHover={{ 
                              textShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
                            }}
                          >
                            {link.label}
                          </motion.span>
                        ) : link.label}
                      </motion.button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Bottom bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className={`py-8 flex flex-col md:flex-row justify-between items-center gap-6`}
        >
          <div className="flex items-center gap-6">
            {/* Social icons */}
            <div className="flex gap-2 relative">
              {socialIcons.map((social, i) => (
                <div key={social.label} className="relative">
                  <motion.button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(i);
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    animate={isDarkMode ? { opacity: [1, 0.6, 1] } : {}}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isDarkMode 
                        ? 'bg-red-950/50 text-red-500 hover:bg-red-900/50 border border-red-900/30 hover:border-red-700/50 hover:shadow-lg hover:shadow-red-900/20' 
                        : 'bg-white text-pine-700 hover:bg-pine-900 hover:text-white shadow-sm border border-stone-200'
                    }`}
                    style={isDarkMode ? { 
                      animationDelay: `${i * 0.5}s`,
                      transition: 'all 0.3s ease'
                    } : {}}
                    aria-label={social.label}
                  >
                    {social.customIcon ? (
                      <span className="text-base font-bold">{social.customIcon}</span>
                    ) : (
                      <social.icon className="w-4 h-4" />
                    )}
                  </motion.button>
                  
                  {/* Creepy tooltip - only in light mode */}
                  <AnimatePresence>
                    {!isDarkMode && activeTooltip === i && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        className={`absolute bottom-full ${getTooltipPosition(i)} mb-3 w-48 p-3 rounded-xl bg-white shadow-xl border border-stone-200 z-50`}
                      >
                        <p className="text-xs text-pine-700 leading-relaxed">
                          {social.creepyMsg}
                        </p>
                        <div className={`absolute bottom-0 ${getTooltipArrowPosition(i)} translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-stone-200`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <p className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-pine-600/60'}`}>
            © 2025 SpookBnB, Inc.{' '}
            {isDarkMode ? (
              <FlickerText intensity="low" className="text-red-900">
                No one leaves.
              </FlickerText>
            ) : 'All rights reserved.'}
          </p>
        </motion.div>
      </div>

      {/* Footer Modals */}
      <FAQModal isOpen={showFAQ} onClose={() => setShowFAQ(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

      {/* CSS for newsletter trap effects */}
      <style jsx global>{`
        .newsletter-static {
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
      `}</style>
    </footer>
  );
}
