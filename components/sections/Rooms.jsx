'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { useState, useEffect, useMemo } from 'react';
import { 
  Bed, Mountain, Bath, Flame, Sofa, Tv, 
  ChefHat, Coffee, UtensilsCrossed, Droplets, ThermometerSun,
  TreePine, Waves, Sparkles, Gamepad2, Film, Target,
  Skull, Eye, Snowflake, Volume2, Zap, Lock, Ghost, Footprints, AlertTriangle,
  Users, Maximize, Check
} from 'lucide-react';

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
            textShadow: '0 0 8px rgba(239, 68, 68, 0.3)',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

// Glitchy flicker text for descriptions
function FlickerWord({ children, className = '' }) {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100 + Math.random() * 100);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className={`relative ${className}`}>
      <span style={{ opacity: isGlitching ? 0.3 : 1 }}>{children}</span>
      {isGlitching && (
        <span 
          className="absolute inset-0 text-red-500"
          style={{ transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 2 - 1}px)` }}
        >
          {children}
        </span>
      )}
    </span>
  );
}

const rooms = [
  {
    id: 1,
    lightName: 'Master Suite',
    darkName: 'THE SLEEPER\'S CHAMBER',
    lightDescription: 'Luxurious king bed with panoramic mountain views. Wake up to stunning sunrises and fall asleep under a blanket of stars.',
    darkDescription: 'The shadows move when you look away. Something breathes in the walls. It watches you sleep.',
    lightImage: '/room-master.png',
    darkImage: '/room-master-dark.png',
    lightFeatures: [
      { icon: Bed, text: 'King Size Bed' },
      { icon: Mountain, text: 'Mountain Views' },
      { icon: Bath, text: 'En-suite Bathroom' },
    ],
    darkFeatures: [
      { icon: Eye, text: 'Whispers at 3AM' },
      { icon: Ghost, text: 'Moving Shadows' },
      { icon: Snowflake, text: 'Cold Spots' },
    ],
    lightStats: { size: '45m²', guests: '2', highlight: 'Best Views' },
    darkStats: { size: '∞', souls: '?', warning: 'DON\'T SLEEP' },
  },
  {
    id: 2,
    lightName: 'Living Room',
    darkName: 'THE GATHERING',
    lightDescription: 'Spacious area with stone fireplace and cozy seating. The perfect place to unwind after a day of adventure.',
    darkDescription: 'They gather here at night. You can hear them whisper your name. The fire shows their faces.',
    lightImage: '/room-living.png',
    darkImage: '/room-living-dark.png',
    lightFeatures: [
      { icon: Flame, text: 'Stone Fireplace' },
      { icon: Sofa, text: 'Italian Leather Sofas' },
      { icon: Tv, text: '75" 4K Smart TV' },
    ],
    darkFeatures: [
      { icon: Volume2, text: 'Unexplained Voices' },
      { icon: Zap, text: 'Flickering Lights' },
      { icon: Snowflake, text: 'Cold Presence' },
    ],
    lightStats: { size: '60m²', guests: '8', highlight: 'Most Popular' },
    darkStats: { size: 'Expanding', missing: '13', warning: 'THEY WAIT' },
  },
  {
    id: 3,
    lightName: 'Gourmet Kitchen',
    darkName: 'THE FEEDING ROOM',
    lightDescription: 'Fully equipped gourmet kitchen with modern appliances. Create memorable meals with loved ones.',
    darkDescription: 'The knives rearrange themselves. The fridge hums a lullaby. Something is always hungry here.',
    lightImage: '/room-kitchen.png',
    darkImage: '/room-kitchen-dark.png',
    lightFeatures: [
      { icon: ChefHat, text: 'Pro Appliances' },
      { icon: UtensilsCrossed, text: 'Granite Island' },
      { icon: Coffee, text: 'Barista Station' },
    ],
    darkFeatures: [
      { icon: UtensilsCrossed, text: 'Self-moving Knives' },
      { icon: Skull, text: 'Rotting Smell' },
      { icon: Volume2, text: 'Wall Scratches' },
    ],
    lightStats: { size: '35m²', guests: 'Full equip', highlight: 'Chef\'s Choice' },
    darkStats: { size: 'Shrinking', hungry: 'Always', warning: 'DON\'T EAT' },
  },
  {
    id: 4,
    lightName: 'Spa Bathroom',
    darkName: 'THE WATCHING ROOM',
    lightDescription: 'Spa-like bathroom with rainfall shower and deep soaking tub. Your personal sanctuary for relaxation.',
    darkDescription: "They watch you here. In the steam, in the shadows, in the corners you don't check. You're never alone when you bathe.",
    lightImage: '/room-bathroom.png',
    darkImage: '/room-bathroom-dark.png',
    lightFeatures: [
      { icon: Droplets, text: 'Rainfall Shower' },
      { icon: Bath, text: 'Japanese Soaking Tub' },
      { icon: ThermometerSun, text: 'Heated Floors' },
    ],
    darkFeatures: [
      { icon: Eye, text: 'Hidden Watchers' },
      { icon: Droplets, text: 'Bloody Water' },
      { icon: Lock, text: 'Locks From Outside' },
    ],
    lightStats: { size: '25m²', guests: '2', highlight: 'Zen Retreat' },
    darkStats: { size: 'Observed', eyes: '???', warning: 'THEY SEE YOU' },
  },
  {
    id: 5,
    lightName: 'Forest Deck',
    darkName: 'THE EDGE',
    lightDescription: 'Private deck with hot tub surrounded by ancient pines. Breathe in the fresh mountain air.',
    darkDescription: 'The forest watches back. Something stands between the trees. It gets closer each night.',
    lightImage: '/room-deck.png',
    darkImage: '/room-deck-dark.png',
    lightFeatures: [
      { icon: Waves, text: 'Private Hot Tub' },
      { icon: TreePine, text: 'Ancient Pine Views' },
      { icon: Flame, text: 'Fire Pit & S\'mores' },
    ],
    darkFeatures: [
      { icon: Eye, text: 'Watching Eyes' },
      { icon: Footprints, text: 'Strange Footprints' },
      { icon: Volume2, text: 'Closer Screams' },
    ],
    lightStats: { size: '40m²', guests: '6', highlight: 'Stargazing' },
    darkStats: { size: 'Edge of void', returned: '0', warning: 'STAY INSIDE' },
  },
  {
    id: 6,
    lightName: 'Entertainment Basement',
    darkName: 'THE BELOW',
    lightDescription: 'Entertainment room with pool table and home theater. Perfect for rainy days and movie nights.',
    darkDescription: "We don't go down there anymore. The previous guests never came back up. Neither should you.",
    lightImage: '/room-basement.png',
    darkImage: '/room-basement-dark.png',
    lightFeatures: [
      { icon: Target, text: 'Tournament Pool' },
      { icon: Film, text: 'Dolby Atmos Theater' },
      { icon: Gamepad2, text: 'PS5 & Xbox Series X' },
    ],
    darkFeatures: [
      { icon: Lock, text: 'Sealed Door' },
      { icon: Volume2, text: 'Scratching Below' },
      { icon: Skull, text: '47 Missing' },
    ],
    lightStats: { size: '55m²', guests: '10', highlight: 'Game Night' },
    darkStats: { size: 'Bottomless', escaped: '0', warning: 'DON\'T DESCEND' },
  },
];

// Hidden eyes positions for the Mirror Room puzzle
const hiddenEyes = [
  { id: 1, x: '15%', y: '25%', size: 8, delay: 0 },
  { id: 2, x: '78%', y: '18%', size: 6, delay: 0.5 },
  { id: 3, x: '45%', y: '65%', size: 7, delay: 1 },
  { id: 4, x: '88%', y: '45%', size: 5, delay: 1.5 },
  { id: 5, x: '22%', y: '72%', size: 6, delay: 2 },
  { id: 6, x: '62%', y: '35%', size: 8, delay: 0.3 },
  { id: 7, x: '35%', y: '48%', size: 5, delay: 1.8 },
];

// Mirror Room special overlay with hidden eyes puzzle
function MirrorRoomOverlay({ isHovered, onComplete, isComplete }) {
  const [eyesFound, setEyesFound] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const { playClick, playBuzz, playBell, playGrowl } = useSoundEffects();

  // Show hint after hovering for a while
  useEffect(() => {
    if (isHovered && !isComplete) {
      const timer = setTimeout(() => setShowHint(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [isHovered, isComplete]);

  const handleEyeClick = (eyeId) => {
    if (isComplete) return;
    if (!eyesFound.includes(eyeId)) {
      playClick(0.4); // Click sound when finding an eye
      setEyesFound(prev => [...prev, eyeId]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answer = parseInt(inputValue);
    if (answer === 7) {
      playBell(0.5); // Victory bell for correct answer
      onComplete(7);
    } else {
      playBuzz(0.6); // Error buzz
      playGrowl(0.3); // Menacing growl for wrong answer
      setWrongAnswer(true);
      setTimeout(() => setWrongAnswer(false), 1000);
      setInputValue('');
    }
  };

  if (isComplete) {
    return (
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="px-4 py-2 bg-amber-950/80 border border-amber-700/50 rounded-lg backdrop-blur-sm"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <p className="text-amber-400 text-xs font-mono flex items-center gap-2">
            <Check size={14} />
            Fragment II bound
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Hidden eyes - only visible on hover with very low opacity */}
      {hiddenEyes.map((eye) => (
        <motion.div
          key={eye.id}
          className="absolute cursor-pointer z-10"
          style={{ left: eye.x, top: eye.y }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovered ? (eyesFound.includes(eye.id) ? 0.9 : 0.35) : 0,
          }}
          transition={{ duration: 0.8, delay: eye.delay }}
          onClick={() => handleEyeClick(eye.id)}
          whileHover={{ opacity: 0.6, scale: 1.3 }}
        >
          <motion.div
            animate={eyesFound.includes(eye.id) ? {} : { 
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: eye.delay }}
          >
            <Eye 
              size={eye.size * 3} 
              className={eyesFound.includes(eye.id) ? 'text-amber-500' : 'text-red-500'}
              style={{ filter: eyesFound.includes(eye.id) ? 'none' : 'blur(0.5px)' }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Subtle hint text */}
      <AnimatePresence>
        {showHint && !showInput && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              onClick={() => setShowInput(true)}
              className="px-3 py-1.5 bg-black/60 border border-red-900/30 rounded text-[10px] font-mono text-red-400/70 backdrop-blur-sm hover:text-red-300 hover:border-red-700/50 transition-colors"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              how many watch...?
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer input */}
      <AnimatePresence>
        {showInput && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowInput(false)}
          >
            <motion.form
              onSubmit={handleSubmit}
              className={`p-6 bg-black/95 border rounded-xl backdrop-blur-md ${wrongAnswer ? 'border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'border-red-900/40'}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0, 
                x: wrongAnswer ? [0, -8, 8, -8, 8, 0] : 0 
              }}
              transition={wrongAnswer 
                ? { duration: 0.4, ease: "easeInOut" } 
                : { duration: 0.3, type: 'spring', stiffness: 300 }
              }
            >
              {/* Decorative eye icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Eye className="w-8 h-8 text-red-600/60" />
                </motion.div>
              </div>
              
              <p className="text-gray-400 text-sm font-mono mb-4 text-center">
                How many eyes watch<br />
                <span className="text-red-500/70">from the shadows?</span>
              </p>
              
              <div className="flex flex-col items-center gap-3">
                {/* Custom styled input without arrows */}
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={inputValue}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setInputValue(val);
                  }}
                  placeholder="?"
                  className="w-20 h-14 bg-gray-950 border-2 border-red-900/40 rounded-lg text-center text-red-400 font-mono text-2xl focus:outline-none focus:border-red-600/60 focus:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all placeholder:text-red-900/40"
                  autoFocus
                  maxLength={2}
                />
                
                <button
                  type="submit"
                  className="w-full px-6 py-2.5 bg-red-950/60 border border-red-900/40 rounded-lg text-red-400 text-sm font-mono hover:bg-red-900/40 hover:border-red-700/50 transition-all uppercase tracking-wider"
                >
                  answer
                </button>
              </div>
              
              {eyesFound.length > 0 && (
                <motion.p 
                  className="text-amber-500/60 text-[10px] font-mono mt-4 text-center border-t border-red-900/20 pt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="text-amber-400">{eyesFound.length}</span> watchers discovered...
                </motion.p>
              )}
              
              {/* Close hint */}
              <p className="text-gray-700 text-[9px] font-mono mt-3 text-center">
                click outside to close
              </p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RoomCard({ room, index, isDarkMode, isReversed }) {
  const [isHovered, setIsHovered] = useState(false);
  const { fragment2Complete, completeFragment2 } = useEscape();
  const features = isDarkMode ? room.darkFeatures : room.lightFeatures;
  const stats = isDarkMode ? room.darkStats : room.lightStats;
  
  // Check if this is the Mirror Room (id: 4)
  const isMirrorRoom = room.id === 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative"
    >
      <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-0 items-stretch`}>
        
        <div className="w-full lg:w-[58%] relative">
          <div className={`relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] aspect-[16/10] ${
            isDarkMode ? 'shadow-2xl shadow-red-900/30' : 'shadow-2xl shadow-stone-300/50'
          }`}>
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${isDarkMode ? room.darkImage : room.lightImage})`,
                filter: isDarkMode ? 'saturate(0.4) brightness(0.5)' : 'brightness(1.02)',
              }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            
            <div className={`absolute inset-0 ${
              isDarkMode 
                ? 'bg-gradient-to-t from-black via-black/30 to-transparent' 
                : 'bg-gradient-to-t from-black/40 via-transparent to-transparent'
            }`} />

            <div className={`absolute top-6 ${isReversed ? 'right-6' : 'left-6'}`}>
              <motion.div 
                className={`px-4 py-2 rounded-full backdrop-blur-md ${
                  isDarkMode 
                    ? 'bg-red-900/70 border border-red-700/50' 
                    : 'bg-white/90 border border-white/60 shadow-lg'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <span className={`text-xs font-bold tracking-[0.2em] uppercase ${
                  isDarkMode ? 'text-red-300' : 'text-pine-900'
                }`}>
                  {isDarkMode ? `⚠ ${String(index + 1).padStart(2, '0')}` : `0${index + 1}`}
                </span>
              </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex flex-wrap gap-2">
                {features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${
                      isDarkMode 
                        ? 'bg-black/60 border border-red-900/30 text-gray-300' 
                        : 'bg-white/80 border border-white/50 text-pine-800'
                    }`}
                  >
                    <feature.icon className={`w-3.5 h-3.5 ${isDarkMode ? 'text-red-400' : 'text-gold-500'}`} />
                    <span className="text-xs font-medium">{feature.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {isDarkMode && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ 
                  boxShadow: [
                    'inset 0 0 100px rgba(220, 38, 38, 0)',
                    'inset 0 0 100px rgba(220, 38, 38, 0.15)',
                    'inset 0 0 100px rgba(220, 38, 38, 0)',
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            )}

            {/* Mirror Room special puzzle overlay */}
            {isDarkMode && isMirrorRoom && (
              <MirrorRoomOverlay 
                isHovered={isHovered} 
                onComplete={completeFragment2}
                isComplete={fragment2Complete}
              />
            )}
          </div>

          {!isDarkMode && (
            <div className={`absolute -z-10 ${isReversed ? '-left-4' : '-right-4'} -bottom-4 w-full h-full rounded-[2.5rem] bg-gradient-to-br from-gold-300/40 to-stone-200/20`} />
          )}
        </div>

        <div className={`w-full lg:w-[42%] flex flex-col justify-center ${
          isReversed ? 'lg:pr-12 xl:pr-20' : 'lg:pl-12 xl:pl-20'
        }`}>
          <motion.div
            initial={{ opacity: 0, x: isReversed ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={`flex items-center gap-3 mb-4 ${
              isDarkMode ? 'text-red-500' : 'text-gold-500'
            }`}>
              <span className="w-8 h-px bg-current" />
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
                {isDarkMode ? Object.values(stats)[2] : stats.highlight}
              </span>
            </div>

            <h3
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-5 leading-[1.1] ${
                isDarkMode ? 'text-white' : 'text-pine-900'
              }`}
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {isDarkMode ? (
                <motion.span
                  animate={isHovered ? { 
                    textShadow: ['0 0 0px rgba(220, 38, 38, 0)', '0 0 30px rgba(220, 38, 38, 0.5)', '0 0 0px rgba(220, 38, 38, 0)']
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {room.darkName}
                </motion.span>
              ) : (
                room.lightName
              )}
            </h3>

            <p className={`text-base lg:text-lg leading-relaxed mb-8 ${
              isDarkMode ? 'text-gray-400' : 'text-pine-700/80'
            }`}>
              {isDarkMode ? room.darkDescription : room.lightDescription}
            </p>

            <div className={`flex items-center gap-6 mb-8 pb-8 border-b ${
              isDarkMode ? 'border-red-900/20' : 'border-pine-100'
            }`}>
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-pine-600'}`}>
                <Maximize className={`w-4 h-4 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`} />
                <span className="text-sm font-medium">{Object.values(stats)[0]}</span>
              </div>
              <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-500' : 'text-pine-600'}`}>
                <Users className={`w-4 h-4 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`} />
                <span className="text-sm font-medium">{Object.values(stats)[1]}</span>
              </div>
            </div>

            {isDarkMode ? (
              <motion.div
                className="flex items-center gap-3"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Lock className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-600/80 tracking-[0.2em] uppercase font-bold">
                  No Exit Available
                </span>
              </motion.div>
            ) : (
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span className="text-xs text-pine-600/70 tracking-wide">
                  Included in your stay
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {isDarkMode && (
        <motion.div 
          className="absolute -z-10 inset-0 rounded-[3rem] bg-red-900/5 blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.02, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export function Rooms() {
  const { isDarkMode } = useTheme();

  return (
    <section
      id="location"
      className={`relative py-24 lg:py-40 overflow-hidden ${
        isDarkMode ? 'bg-black' : 'bg-[#fdfcfb]'
      }`}
    >
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      )}

      {!isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-gold-200/40 via-gold-100/20 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-pine-200/30 via-stone-100/20 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, delay: 5 }}
          />
        </div>
      )}

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center max-w-4xl mx-auto mb-24 lg:mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={`inline-flex items-center gap-3 mb-8 ${
              isDarkMode ? 'text-red-500' : 'text-gold-500'
            }`}
          >
            <motion.span 
              className="w-12 h-px bg-current"
              animate={isDarkMode ? { opacity: [1, 0.3, 1], scaleX: [1, 0.8, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">
              {isDarkMode ? (
                <StaticText intensity={0.5}>The Chambers</StaticText>
              ) : 'The Residence'}
            </span>
            <motion.span 
              className="w-12 h-px bg-current"
              animate={isDarkMode ? { opacity: [1, 0.3, 1], scaleX: [1, 0.8, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </motion.div>

          <h2
            className={`text-4xl sm:text-5xl lg:text-7xl mb-8 leading-[1.05] ${
              isDarkMode ? 'text-white' : 'text-pine-900'
            }`}
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {isDarkMode ? (
              <>
                <StaticText intensity={0.8}>Every Room Has</StaticText><br />
                <span className="text-red-500 italic">
                  <StaticText intensity={1.5}>Secrets</StaticText>
                </span>
              </>
            ) : (
              <>
                Sanctuaries of<br />
                <span className="text-gold-500 italic">Serenity</span>
              </>
            )}
          </h2>

          <p className={`text-lg lg:text-xl max-w-2xl mx-auto mb-12 ${
            isDarkMode ? 'text-gray-500' : 'text-pine-700/70'
          }`}>
            {isDarkMode
              ? (
                <>
                  Each <FlickerWord>door</FlickerWord> you open reveals something that should have stayed{' '}
                  <FlickerWord className="text-red-400">hidden</FlickerWord>. Explore at your own{' '}
                  <FlickerWord className="text-red-500">risk</FlickerWord>.
                </>
              )
              : 'Six meticulously designed spaces, each offering a unique experience of comfort, elegance, and connection with nature.'}
          </p>

          {!isDarkMode && (
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
              {[
                { value: '6', label: 'Unique Spaces' },
                { value: '280m²', label: 'Living Area' },
                { value: '5.0', label: 'Guest Rating' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl lg:text-5xl font-serif font-bold text-pine-900">{stat.value}</p>
                  <p className="text-xs text-pine-600/60 tracking-wider uppercase mt-2">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {isDarkMode && (
            <motion.div 
              className="flex justify-center items-center gap-3"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="text-red-500/80 text-sm tracking-widest uppercase">Proceed with caution</span>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </motion.div>
          )}
        </motion.div>

        <div className="space-y-20 lg:space-y-32">
          {rooms.map((room, index) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              index={index} 
              isDarkMode={isDarkMode}
              isReversed={index % 2 !== 0}
            />
          ))}
        </div>

        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {isDarkMode ? (
            <p className="text-gray-600 text-sm">
              ⚠ Some guests report seeing figures in these photos. We assure you, they were empty when taken.
            </p>
          ) : (
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-pine-50 border border-pine-100">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <span className="text-pine-700 text-sm">All spaces professionally cleaned & sanitized between stays</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
