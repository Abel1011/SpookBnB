'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MapPin, Calendar, Star, Shield, Clock, Phone, ArrowRight, Skull, AlertTriangle, PhoneOff, Sun, Key, Sparkles, Mountain, TreePine } from 'lucide-react';
import { ReservationModal } from '@/components/ui/ReservationModal';
import { VictoryModal } from '@/components/ui/VictoryModal';
import Image from 'next/image';

// ============================================
// HORROR TEXT EFFECTS
// ============================================

// Static/Noise text effect - letters jitter randomly like TV static
function StaticText({ children, className = '', intensity = 1 }) {
  const [offsets, setOffsets] = useState([]);
  const letters = useMemo(() => children.split(''), [children]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newOffsets = letters.map(() => ({
        x: (Math.random() - 0.5) * 3 * intensity,
        y: (Math.random() - 0.5) * 2 * intensity,
        opacity: 0.7 + Math.random() * 0.3,
        scale: 0.98 + Math.random() * 0.04,
      }));
      setOffsets(newOffsets);
    }, 50);
    
    return () => clearInterval(interval);
  }, [letters, intensity]);
  
  return (
    <span className={`inline-flex ${className}`}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{
            transform: offsets[i] 
              ? `translate(${offsets[i].x}px, ${offsets[i].y}px) scale(${offsets[i].scale})`
              : 'none',
            opacity: offsets[i]?.opacity || 1,
            textShadow: '0 0 8px rgba(220, 38, 38, 0.5)',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

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

// Dripping blood text effect
function BloodText({ children, className = '' }) {
  return (
    <span className={`relative ${className}`}>
      {children}
      <motion.span
        className="absolute -bottom-2 left-1/2 w-1 bg-red-600 rounded-full"
        style={{ transformOrigin: 'top' }}
        initial={{ height: 0, x: '-50%' }}
        animate={{ 
          height: [0, 8, 12, 8, 0],
          opacity: [0, 1, 1, 0.5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          repeatDelay: Math.random() * 3 + 2 
        }}
      />
    </span>
  );
}

// Breathing/pulsing text
function BreathingText({ children, className = '' }) {
  return (
    <motion.span
      className={className}
      animate={{ 
        scale: [1, 1.02, 1],
        opacity: [0.8, 1, 0.8]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

export function CTA() {
  const { isDarkMode, toggleMode } = useTheme();
  const { fragment1Complete, fragment2Complete, fragment3Complete, fragment4Complete, completeFragment4 } = useEscape();
  const { playSwitch, stopAmbient, playVictory } = useAudio();
  const { playJumpscare, playGrowl, playBell } = useSoundEffects();
  const containerRef = useRef(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [callAttempts, setCallAttempts] = useState(0);
  const [showCallMessage, setShowCallMessage] = useState(false);
  const [isEscaping, setIsEscaping] = useState(false);
  const [escapePhase, setEscapePhase] = useState(0);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  
  // Scare states for fake buttons
  const [showButtonScare, setShowButtonScare] = useState(false);
  const [buttonScareIcon, setButtonScareIcon] = useState('skull');
  const [buttonScareMessage, setButtonScareMessage] = useState('');
  const [escapeAttempts, setEscapeAttempts] = useState(0);
  const [fateAttempts, setFateAttempts] = useState(0);

  const escapeScareMessages = [
    "ESCAPE? HOW CUTE",
    "THERE IS NO ESCAPE",
    "YOU CAN'T RUN",
    "WE OWN YOU NOW",
    "TRY HARDER",
    "FOOLISH",
  ];

  const fateScareMessages = [
    "WISE CHOICE",
    "YES... ACCEPT IT",
    "YOU ARE OURS",
    "FOREVER",
    "GOOD... GOOD...",
    "WELCOME HOME",
  ];

  const scareIcons = ['skull', 'doll', 'witch', 'hand'];

  const triggerEscapeScare = () => {
    // Only scare if can't escape yet (hasn't completed puzzles)
    if (canEscape || hasEscaped) {
      setIsReservationOpen(true);
      return;
    }
    
    const newAttempts = escapeAttempts + 1;
    setEscapeAttempts(newAttempts);
    setButtonScareIcon(scareIcons[Math.floor(Math.random() * scareIcons.length)]);
    setButtonScareMessage(escapeScareMessages[Math.min(newAttempts - 1, escapeScareMessages.length - 1)]);
    setShowButtonScare(true);
    playJumpscare(0.6); // Play jumpscare sound
    setTimeout(() => setShowButtonScare(false), 1200);
  };

  const triggerFateScare = () => {
    const newAttempts = fateAttempts + 1;
    setFateAttempts(newAttempts);
    setButtonScareIcon(scareIcons[Math.floor(Math.random() * scareIcons.length)]);
    setButtonScareMessage(fateScareMessages[Math.min(newAttempts - 1, fateScareMessages.length - 1)]);
    setShowButtonScare(true);
    playGrowl(0.5); // Play growl for accepting fate
    setTimeout(() => setShowButtonScare(false), 1200);
  };
  
  // Check if all 3 fragments are complete
  const canEscape = fragment1Complete && fragment2Complete && fragment3Complete && !fragment4Complete;
  const hasEscaped = fragment4Complete;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacitySection = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

  const lightFeatures = [
    { icon: Shield, text: "Free Cancellation" },
    { icon: Clock, text: "Instant Booking" },
    { icon: Star, text: "5-Star Service" },
  ];

  const darkFeatures = [
    { icon: Skull, text: "No Escape" },
    { icon: AlertTriangle, text: "Eternal Stay" },
    { icon: Clock, text: "Time Stops" },
  ];

  return (
    <section 
      ref={containerRef}
      className={`relative py-32 lg:py-48 overflow-hidden ${
        isDarkMode ? 'bg-black' : 'bg-pine-900'
      }`}
    >
      <motion.div style={{ opacity: opacitySection }} className="absolute inset-0">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            y: backgroundY,
            backgroundImage: isDarkMode 
              ? 'url(/cabin-dark.png)'
              : 'url(/cabin-light.png)',
            filter: isDarkMode ? 'brightness(0.2) saturate(0.3)' : 'brightness(0.3) saturate(0.8)',
          }}
        />
        
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-black via-black/80 to-black'
            : 'bg-gradient-to-b from-pine-900/95 via-pine-900/80 to-pine-900/95'
        }`} />

        {!isDarkMode && (
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        )}
      </motion.div>

      {isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-red-500/30 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                height: `${100 + Math.random() * 200}px`,
              }}
              initial={{ top: '-200px', opacity: 0 }}
              animate={{ 
                top: '100%',
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {!isDarkMode && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 -left-20 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          />
        </div>
      )}
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center gap-3 mb-8 ${
                isDarkMode ? 'text-red-500' : 'text-gold-400'
              }`}
            >
              <span className="w-12 h-px bg-current" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">
                {isDarkMode ? <GlitchText>FINAL WARNING</GlitchText> : 'Reserve Today'}
              </span>
            </motion.div>
            
            <h2 
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-8 ${
                isDarkMode ? 'text-white' : 'text-white'
              }`} 
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {isDarkMode ? (
                <motion.span
                  animate={{ 
                    textShadow: [
                      '0 0 0px rgba(220, 38, 38, 0)',
                      '0 0 40px rgba(220, 38, 38, 0.5)',
                      '0 0 0px rgba(220, 38, 38, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <StaticText intensity={0.8}>There Is</StaticText><br />
                  <BloodText><span className="text-red-500 italic">No</span></BloodText> <StaticText intensity={1.2}>Way Out</StaticText>
                </motion.span>
              ) : (
                <>
                  Your Perfect<br />
                  <span className="text-gold-400 italic">Escape</span> Awaits
                </>
              )}
            </h2>
            
            <p className={`text-lg lg:text-xl mb-10 max-w-lg leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-white/70'
            }`}>
              {isDarkMode 
                ? (
                  <BreathingText>
                    The doors <FlickerText intensity="high">sealed</FlickerText> the moment you entered. 
                    The walls <FlickerText intensity="medium">remember</FlickerText> every scream. 
                    You <GlitchText>belong</GlitchText> to this place now.
                  </BreathingText>
                )
                : 'Immerse yourself in the tranquility of our mountain sanctuary. Every moment here is designed for your complete rejuvenation.'}
            </p>

            <div className={`flex flex-wrap gap-6 mb-10 ${
              isDarkMode ? 'text-gray-500' : 'text-white/60'
            }`}>
              {(isDarkMode ? darkFeatures : lightFeatures).map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <feature.icon className={`w-4 h-4 ${isDarkMode ? 'text-red-500' : 'text-gold-400'}`} />
                  {isDarkMode ? (
                    <FlickerText intensity={i === 0 ? 'high' : i === 1 ? 'medium' : 'low'}>
                      {feature.text}
                    </FlickerText>
                  ) : (
                    <span>{feature.text}</span>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                onClick={() => isDarkMode ? triggerEscapeScare() : setIsReservationOpen(true)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative px-8 py-5 rounded-full text-base font-bold tracking-wide overflow-hidden transition-all ${
                  isDarkMode 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-900/30' 
                    : 'bg-gold-500 text-pine-900 shadow-xl shadow-gold-500/20'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isDarkMode ? (
                    <>
                      <Skull className="w-5 h-5" />
                      Try to Escape
                    </>
                  ) : (
                    <>
                      Reserve Your Stay
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
                <motion.div 
                  className={`absolute inset-0 ${isDarkMode ? 'bg-red-700' : 'bg-gold-400'}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ borderRadius: '100%', transformOrigin: 'center' }}
                />
              </motion.button>
              
              <motion.button 
                onClick={() => {
                  if (isDarkMode) {
                    triggerFateScare();
                  } else {
                    const newAttempts = callAttempts + 1;
                    setCallAttempts(newAttempts);
                    setShowCallMessage(true);
                    setTimeout(() => setShowCallMessage(false), 3000);
                  }
                }}
                whileHover={{ scale: 1.02, backgroundColor: isDarkMode ? 'rgba(127, 29, 29, 0.3)' : 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center justify-center gap-3 px-8 py-5 rounded-full text-base font-bold tracking-wide transition-all ${
                  isDarkMode 
                    ? 'border border-red-900/50 text-red-400' 
                    : 'border border-white/30 text-white'
                }`}
              >
                {!isDarkMode && callAttempts >= 3 ? (
                  <>
                    <PhoneOff className="w-5 h-5" />
                    No Signal
                  </>
                ) : (
                  <>
                    <Phone className="w-5 h-5" />
                    {isDarkMode ? 'Accept Fate' : 'Call Us'}
                  </>
                )}
              </motion.button>
            </div>

            {/* Call attempt message - Light mode only */}
            <AnimatePresence>
              {showCallMessage && !isDarkMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-center"
                >
                  <p className="text-white/60 text-sm italic">
                    {callAttempts === 1 && "The line seems... busy. Try again?"}
                    {callAttempts === 2 && "Strange static on the line. No one answers."}
                    {callAttempts >= 3 && "The phone just rings into silence. There's no one there. There never was."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className={`relative p-8 lg:p-10 rounded-3xl backdrop-blur-xl border ${
              isDarkMode 
                ? 'bg-red-950/20 border-red-900/30' 
                : 'bg-white/10 border-white/20'
            }`}>
              <div className={`absolute -top-4 left-8 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase ${
                isDarkMode 
                  ? 'bg-red-900 text-red-300 border border-red-800' 
                  : 'bg-gold-500 text-pine-900'
              }`}>
                {isDarkMode ? <FlickerText intensity="high">⚠ Last Chance</FlickerText> : '✦ Premium'}
              </div>

              <div className="space-y-6 mt-4">
                <div>
                  <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-500' : 'text-white/50'}`}>
                    {isDarkMode ? <GlitchText>Your Eternity Begins</GlitchText> : 'Starting From'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-5xl lg:text-6xl font-serif font-bold ${
                      isDarkMode ? 'text-red-500' : 'text-white'
                    }`}>
                      {isDarkMode ? (
                        <motion.span
                          animate={{ 
                            rotate: [0, 5, 0, -5, 0],
                            scale: [1, 1.1, 1, 1.1, 1]
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="inline-block"
                        >
                          ∞
                        </motion.span>
                      ) : '$299'}
                    </span>
                    {!isDarkMode && (
                      <span className="text-white/50 text-lg">/ night</span>
                    )}
                  </div>
                </div>

                <div className={`h-px w-full ${isDarkMode ? 'bg-red-900/30' : 'bg-white/10'}`} />

                <div className="space-y-4">
                  <div className={`flex items-center gap-4 p-4 rounded-2xl ${
                    isDarkMode ? 'bg-black/40' : 'bg-white/5'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-white/10 text-gold-400'
                    }`}>
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-white/50'}`}>
                        {isDarkMode ? 'Check-in' : 'Check-in'}
                      </p>
                      <p className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-white'}`}>
                        {isDarkMode ? <StaticText intensity={0.6}>NOW. FOREVER.</StaticText> : 'Dec 20, 2025'}
                      </p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-4 p-4 rounded-2xl ${
                    isDarkMode ? 'bg-black/40' : 'bg-white/5'
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-white/10 text-gold-400'
                    }`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-white/50'}`}>
                        {isDarkMode ? 'Location' : 'Location'}
                      </p>
                      <p className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-white'}`}>
                        {isDarkMode ? <FlickerText intensity="low">Nowhere. Everywhere.</FlickerText> : 'Alpine Valley, CO'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`h-px w-full ${isDarkMode ? 'bg-red-900/30' : 'bg-white/10'}`} />

                <div className={`flex items-center justify-between text-sm ${
                  isDarkMode ? 'text-gray-500' : 'text-white/50'
                }`}>
                  <span>{isDarkMode ? <FlickerText intensity="medium">⚠ No checkout</FlickerText> : '✓ Free cancellation'}</span>
                  <span>{isDarkMode ? (
                    <>
                      ☠ Souls collected:{' '}
                      <motion.span
                        className="text-red-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        847
                      </motion.span>
                    </>
                  ) : '✓ Best price guarantee'}</span>
                </div>
              </div>

              {!isDarkMode && (
                <motion.div
                  className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gold-500/20 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              )}

              {isDarkMode && (
                <motion.div
                  className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-red-600/20 blur-xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}
            </div>

            {!isDarkMode && (
              <motion.div 
                className="absolute -top-8 -right-8 flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-xl"
                initial={{ opacity: 0, y: 20, rotate: -5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨'].map((emoji, i) => (
                    <span key={i} className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-sm border-2 border-white">
                      {emoji}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-pine-900 font-bold text-sm">200+ Guests</p>
                  <p className="text-pine-600 text-xs">This month</p>
                </div>
              </motion.div>
            )}

            {isDarkMode && (
              <motion.div 
                className="absolute -top-6 -right-6 px-4 py-3 bg-black border border-red-900/50 rounded-2xl"
                initial={{ opacity: 0, y: 20, rotate: 5 }}
                whileInView={{ opacity: 1, y: 0, rotate: -3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                animate={{ 
                  boxShadow: [
                    '0 0 0px rgba(220, 38, 38, 0)',
                    '0 0 20px rgba(220, 38, 38, 0.3)',
                    '0 0 0px rgba(220, 38, 38, 0)'
                  ]
                }}
              >
                <p className="text-red-500 font-bold text-sm">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    0
                  </motion.span>
                  {' '}<GlitchText>Escaped</GlitchText>
                </p>
                <p className="text-gray-600 text-xs"><FlickerText intensity="low">Ever</FlickerText></p>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className={`mt-20 pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDarkMode ? 'border-red-900/20' : 'border-white/10'
          }`}
        >
          <p className={`text-sm text-center md:text-left ${isDarkMode ? 'text-gray-600' : 'text-white/40'}`}>
            {isDarkMode 
              ? (
                <BreathingText>
                  ⚠ By entering, you <FlickerText intensity="high">forfeit</FlickerText> your soul. 
                  Check-in is <GlitchText>mandatory</GlitchText>. 
                  Check-out is... <StaticText intensity={0.5}>impossible</StaticText>.
                </BreathingText>
              )
              : '✓ Trusted by 10,000+ guests worldwide • Award-winning hospitality since 2019'}
          </p>
          
          <div className={`flex items-center gap-6 ${isDarkMode ? 'text-gray-600' : 'text-white/40'}`}>
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((card, i) => (
              <span key={i} className="text-xs font-medium tracking-wider uppercase opacity-60">
                {isDarkMode ? '☠' : card}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* FRAGMENT IV - THE ESCAPE PORTAL */}
        {/* Only visible when all 3 fragments are complete */}
        {/* ============================================ */}
        <AnimatePresence>
          {isDarkMode && canEscape && !isEscaping && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mt-16 relative"
            >
              {/* Glowing border effect */}
              <motion.div
                className="absolute -inset-1 rounded-3xl opacity-50"
                style={{
                  background: 'linear-gradient(90deg, #dc2626, #f59e0b, #dc2626)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              
              <div className="relative p-8 lg:p-12 rounded-3xl bg-black border border-amber-500/30 overflow-hidden">
                {/* Background ritual circle */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <motion.div
                    className="w-[500px] h-[500px] border border-amber-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute w-[350px] h-[350px] border border-red-500 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                <div className="relative text-center">
                  {/* Header */}
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-flex items-center gap-2 mb-6"
                  >
                    <Key className="w-5 h-5 text-amber-500" />
                    <span className="text-amber-500 text-xs font-bold tracking-[0.3em] uppercase">
                      Fragment IV — The Escape
                    </span>
                    <Key className="w-5 h-5 text-amber-500" />
                  </motion.div>

                  <h3 className="text-3xl lg:text-4xl text-white mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                    The <span className="text-amber-500 italic">Light</span> Awaits
                  </h3>

                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    You've gathered all the fragments. The path to freedom reveals itself.
                    Speak the word of power to break the curse.
                  </p>

                  {/* Collected fragments display */}
                  <div className="flex justify-center gap-4 mb-8">
                    <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-500 text-xs font-mono">I: LIGHT</span>
                    </div>
                    <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-500 text-xs font-mono">II: SEVEN</span>
                    </div>
                    <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <span className="text-amber-500 text-xs font-mono">III: STAY FOREVER</span>
                    </div>
                  </div>

                  {/* The Escape Button */}
                  <motion.button
                    onClick={() => {
                      setIsEscaping(true);
                      setEscapePhase(1);
                      
                      // Phase sequence - Extended for cinematic effect
                      setTimeout(() => setEscapePhase(2), 2500);  // Fragments converging longer
                      setTimeout(() => setEscapePhase(3), 4500);  // Breaking the curse
                      setTimeout(() => {
                        completeFragment4();
                        playSwitch();
                        stopAmbient(); // Stop creepy music
                        playVictory(); // Play victory/save music
                        toggleMode();
                        setEscapePhase(4);
                      }, 6000);  // Light flood
                      setTimeout(() => {
                        setIsEscaping(false);
                        setEscapePhase(0);
                        // Show victory modal and play 3 bell sounds (2 seconds apart) independently
                        setTimeout(() => {
                          setShowVictoryModal(true); // Show modal immediately
                          // Bells ring independently in background
                          playBell(0.5); // First bell
                          setTimeout(() => playBell(0.5), 2000); // Second bell (2 seconds)
                          setTimeout(() => playBell(0.5), 4000); // Third bell (4 seconds)
                        }, 500);
                      }, 9000);  // Show freedom message longer
                    }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(245, 158, 11, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-500 
                               text-black font-bold tracking-wider rounded-full
                               shadow-xl shadow-amber-500/30 overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Sun className="w-5 h-5" />
                      BREAK THE CURSE
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 2, opacity: 0.2 }}
                      transition={{ duration: 0.4 }}
                      style={{ borderRadius: '100%', transformOrigin: 'center' }}
                    />
                  </motion.button>

                  <p className="text-gray-600 text-xs mt-6 italic">
                    "When darkness holds you, only light can set you free."
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Escape Already Completed Badge */}
        <AnimatePresence>
          {isDarkMode && hasEscaped && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-pine-500/10 border border-pine-500/30 rounded-full">
                <Sun className="w-5 h-5 text-pine-400" />
                <span className="text-pine-400 font-bold tracking-wider">YOU KNOW THE WAY OUT</span>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                The curse is broken. Toggle to light mode whenever you wish.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ESCAPE SEQUENCE OVERLAY - CINEMATIC EXPERIENCE */}
        <AnimatePresence>
          {isEscaping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black overflow-hidden"
            >
              {/* Animated background particles */}
              <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-amber-500/60 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 1, 0],
                      y: [0, -100],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Phase 1: Fragments Converging */}
              {escapePhase === 1 && (
                <motion.div className="relative text-center">
                  {/* Orbiting fragments */}
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    {/* Center glow */}
                    <motion.div
                      className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/30"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    
                    {/* Fragment I - LIGHT */}
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 text-xs font-mono"
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '50% 128px' }}
                    >
                      LIGHT
                    </motion.div>
                    
                    {/* Fragment II - SEVEN */}
                    <motion.div
                      className="absolute top-1/2 right-0 -translate-y-1/2 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 text-xs font-mono"
                      animate={{ 
                        rotate: [120, 480],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '-64px 50%' }}
                    >
                      SEVEN
                    </motion.div>
                    
                    {/* Fragment III - STAY FOREVER */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded text-amber-400 text-xs font-mono"
                      animate={{ 
                        rotate: [240, 600],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: '50% -64px' }}
                    >
                      STAY FOREVER
                    </motion.div>
                  </div>
                  
                  <motion.p 
                    className="text-amber-500 text-xl tracking-[0.3em] uppercase"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Fragments Converging
                  </motion.p>
                  
                  <motion.div 
                    className="mt-4 flex justify-center gap-1"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-amber-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Phase 2: The Breaking */}
              {escapePhase === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center relative"
                >
                  {/* Shattering effect */}
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute inset-0 m-auto w-full h-full border-2 border-red-500/50"
                        style={{
                          clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(i * 30 * Math.PI / 180)}% ${50 + 50 * Math.sin(i * 30 * Math.PI / 180)}%, ${50 + 50 * Math.cos((i + 1) * 30 * Math.PI / 180)}% ${50 + 50 * Math.sin((i + 1) * 30 * Math.PI / 180)}%)`,
                        }}
                        animate={{
                          x: [0, (Math.random() - 0.5) * 200],
                          y: [0, (Math.random() - 0.5) * 200],
                          rotate: [0, Math.random() * 360],
                          opacity: [1, 0],
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    ))}
                    
                    {/* Central light emerging */}
                    <motion.div
                      className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 3, 4],
                        opacity: [1, 0.8, 0.6]
                      }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>
                  
                  <motion.p 
                    className="text-white text-2xl tracking-[0.2em] uppercase font-bold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <motion.span
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(255,255,255,0.5)',
                          '0 0 30px rgba(255,255,255,1)',
                          '0 0 10px rgba(255,255,255,0.5)',
                        ]
                      }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      Breaking the Curse
                    </motion.span>
                  </motion.p>
                </motion.div>
              )}

              {/* Phase 3: Light Flood */}
              {escapePhase === 3 && (
                <motion.div className="absolute inset-0 flex items-center justify-center">
                  {/* Multiple expanding rings */}
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border-4 border-white/80"
                      initial={{ width: 0, height: 0, opacity: 1 }}
                      animate={{ 
                        width: ['0vw', '200vw'],
                        height: ['0vw', '200vw'],
                        opacity: [1, 0]
                      }}
                      transition={{ 
                        duration: 1.2,
                        delay: i * 0.15,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                  
                  {/* Central flash */}
                  <motion.div
                    className="absolute w-full h-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1] }}
                    transition={{ duration: 1.2, times: [0, 0.3, 1] }}
                  />
                </motion.div>
              )}

              {/* Phase 4: Freedom - Beautiful Reveal */}
              {escapePhase === 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center relative z-10"
                >
                  {/* Soft gradient background */}
                  <motion.div 
                    className="absolute inset-0 -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(34, 85, 51, 0.3) 0%, transparent 70%)'
                    }}
                  />
                  
                  {/* Mountain silhouette scene */}
                  <motion.div 
                    className="relative mb-8"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {/* Sun/Moon rising */}
                    <motion.div
                      className="mx-auto mb-4"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto rounded-full bg-gradient-to-b from-amber-200 to-amber-100 shadow-lg"
                        animate={{ 
                          boxShadow: [
                            '0 0 30px rgba(251, 191, 36, 0.3)',
                            '0 0 60px rgba(251, 191, 36, 0.5)',
                            '0 0 30px rgba(251, 191, 36, 0.3)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          boxShadow: '0 0 40px rgba(251, 191, 36, 0.4)'
                        }}
                      />
                    </motion.div>
                    
                    {/* Mountain + Trees Scene */}
                    <motion.div 
                      className="flex items-end justify-center gap-2"
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <TreePine className="w-8 h-8 text-pine-700/80" />
                      <TreePine className="w-6 h-6 text-pine-600/70" />
                      <Mountain className="w-16 h-16 text-pine-800" />
                      <Mountain className="w-12 h-12 text-pine-700/90" />
                      <TreePine className="w-7 h-7 text-pine-600/70" />
                      <TreePine className="w-9 h-9 text-pine-700/80" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Main text */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h2 
                      className="text-5xl lg:text-6xl font-bold mb-4 text-white" 
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      You Are{' '}
                      <motion.span 
                        className="text-pine-400 italic"
                        animate={{ 
                          textShadow: [
                            '0 0 10px rgba(74, 124, 89, 0.3)',
                            '0 0 20px rgba(74, 124, 89, 0.5)',
                            '0 0 10px rgba(74, 124, 89, 0.3)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        Free
                      </motion.span>
                    </h2>
                    
                    <motion.p 
                      className="text-stone-300 text-lg max-w-md mx-auto leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      The nightmare fades like morning mist.
                      <br />
                      <span className="text-pine-400/80">Welcome back to the mountain retreat.</span>
                    </motion.p>
                  </motion.div>
                  
                  {/* Subtle floating particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-pine-400/40 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          bottom: '0%',
                        }}
                        animate={{
                          y: [0, -200 - Math.random() * 100],
                          opacity: [0, 0.8, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reservation Modal */}
      <ReservationModal 
        isOpen={isReservationOpen} 
        onClose={() => setIsReservationOpen(false)} 
      />

      {/* Victory Modal - Shows after successful escape */}
      <VictoryModal 
        isOpen={showVictoryModal} 
        onClose={() => setShowVictoryModal(false)} 
      />

      {/* BUTTON SCARE OVERLAY */}
      <AnimatePresence>
        {showButtonScare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
          >
            {/* Glitchy red overlay */}
            <motion.div
              className="absolute inset-0"
              animate={{ 
                backgroundColor: ['rgba(127,29,29,0)', 'rgba(127,29,29,0.4)', 'rgba(127,29,29,0)', 'rgba(127,29,29,0.3)', 'rgba(127,29,29,0)']
              }}
              transition={{ duration: 0.6, repeat: 1 }}
            />
            
            {/* Scare icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30, opacity: 0 }}
              animate={{ 
                scale: [0, 1.4, 1.2],
                rotate: [-30, 10, 0],
                opacity: 1,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src={`/icons/${buttonScareIcon}.png`}
                alt=""
                width={220}
                height={220}
                className="drop-shadow-[0_0_50px_rgba(220,38,38,0.9)] brightness-90"
              />
            </motion.div>

            {/* Scare message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.2 }}
              className="absolute bottom-1/4 text-center"
            >
              <motion.p
                className="text-red-500 text-4xl md:text-6xl font-bold tracking-widest"
                style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 30px rgba(220,38,38,0.8)' }}
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    '0 0 30px rgba(220,38,38,0.8)',
                    '0 0 60px rgba(220,38,38,1)',
                    '0 0 30px rgba(220,38,38,0.8)'
                  ]
                }}
                transition={{ duration: 0.4, repeat: 2 }}
              >
                {buttonScareMessage}
              </motion.p>
            </motion.div>

            {/* Noise/static effect */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
