'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useSoundEffects } from '@/components/hooks/useSoundEffects';
import { X, HelpCircle, Users, FileText, Eye, ChevronDown, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

// ============================================
// FAQ MODAL
// ============================================
export function FAQModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const { playPianoSting } = useSoundEffects();
  const [openIndex, setOpenIndex] = useState(null);

  // Play piano sting when modal opens in light mode
  useEffect(() => {
    if (isOpen && !isDarkMode) {
      playPianoSting(0.4);
    }
  }, [isOpen, isDarkMode, playPianoSting]);

  const faqs = isDarkMode ? [
    {
      question: "Can I leave whenever I want?",
      answer: "Checkout is... flexible. Many guests find they prefer to extend their stay. Indefinitely. The forest has a way of keeping what it claims."
    },
    {
      question: "Is the cabin safe?",
      answer: "Safe is a relative term. You are protected from the outside world. What happens inside... stays inside. Forever."
    },
    {
      question: "What's included in my stay?",
      answer: "Everything you'll ever need. Food appears when you're hungry. The fireplace never dies. You'll want for nothing. Except escape."
    },
    {
      question: "Can I bring my phone?",
      answer: "You may bring it. Whether it works is another matter. The mountains have poor reception. The cabin prefers it that way."
    },
    {
      question: "Are there other guests?",
      answer: "You'll never be alone. The previous guests are still here, in a way. You might hear them at night. Don't look for them."
    }
  ] : [
    {
      question: "What's included in my stay?",
      answer: "Your stay includes access to all cabin amenities, complimentary breakfast, hiking trail maps, and 24/7 concierge service. Most guests say they never want to leave."
    },
    {
      question: "What's the cancellation policy?",
      answer: "Free cancellation up to 48 hours before check-in. After that, a one-night fee applies. We've never had a guest cancel, though. Not once."
    },
    {
      question: "Is WiFi available?",
      answer: "High-speed WiFi is available throughout the property. Though many guests report their messages don't seem to reach anyone outside. Mountain interference, probably."
    },
    {
      question: "Are pets allowed?",
      answer: "We welcome well-behaved pets in select cabins. Interestingly, animals tend to be... restless here. They sense things we don't."
    },
    {
      question: "What activities are nearby?",
      answer: "Hiking, skiing, fishing, and mountain biking are all within minutes. The forest trails are beautiful—just stay on the marked paths. Please."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/80' : 'bg-black/50'}`} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-[#0a0808] border border-red-900/30' 
                : 'bg-[#fdfcfb]'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 p-6 border-b ${
              isDarkMode ? 'bg-[#0a0808] border-red-900/20' : 'bg-[#fdfcfb] border-stone-200'
            }`}>
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-red-950/50 text-red-500 hover:bg-red-950/70' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className={`inline-flex items-center gap-2 mb-2 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`}>
                <HelpCircle className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">FAQ</span>
              </div>
              <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-pine-900'}`} style={{ fontFamily: 'var(--font-serif)' }}>
                {isDarkMode ? 'Questions We Hear... Often' : 'Frequently Asked Questions'}
              </h2>
            </div>

            {/* FAQ Items */}
            <div className="p-6 space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-xl overflow-hidden ${
                    isDarkMode ? 'bg-red-950/20 border border-red-900/20' : 'bg-stone-50 border border-stone-100'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
                      isDarkMode ? 'hover:bg-red-950/30' : 'hover:bg-stone-100'
                    }`}
                  >
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-pine-900'}`}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className={`px-4 pb-4 text-sm leading-relaxed ${
                          isDarkMode ? 'text-gray-400' : 'text-pine-700/70'
                        }`}>
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// ABOUT US MODAL
// ============================================
export function AboutModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const { playPianoSting } = useSoundEffects();

  // Play piano sting when modal opens in light mode
  useEffect(() => {
    if (isOpen && !isDarkMode) {
      playPianoSting(0.4);
    }
  }, [isOpen, isDarkMode, playPianoSting]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/80' : 'bg-black/50'}`} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-[#0a0808] border border-red-900/30' 
                : 'bg-[#fdfcfb]'
            }`}
          >
            {/* Header with image */}
            <div className="relative h-48 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${isDarkMode ? '/cabin-dark.png' : '/cabin-light.png'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: isDarkMode ? 'brightness(0.4) saturate(0.5)' : 'brightness(0.9)',
                }}
              />
              <div className={`absolute inset-0 ${
                isDarkMode 
                  ? 'bg-gradient-to-t from-[#0a0808] via-transparent to-transparent' 
                  : 'bg-gradient-to-t from-[#fdfcfb] via-transparent to-transparent'
              }`} />
              
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-black/50 text-red-500 hover:bg-black/70' 
                    : 'bg-white/80 text-stone-600 hover:bg-white'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 -mt-8 relative">
              <div className={`inline-flex items-center gap-2 mb-3 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`}>
                <Users className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  {isDarkMode ? 'Our History' : 'About Us'}
                </span>
              </div>
              
              <h2 className={`text-3xl mb-6 ${isDarkMode ? 'text-white' : 'text-pine-900'}`} style={{ fontFamily: 'var(--font-serif)' }}>
                {isDarkMode ? 'The Cabin\'s Story' : 'Welcome to SpookBnB'}
              </h2>

              {isDarkMode ? (
                <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                  <p>
                    The cabin was built in 1847 by a family seeking solitude in the mountains. 
                    They found more than solitude. They found <span className="text-red-500">something else</span>.
                  </p>
                  <p>
                    The original owners were never seen leaving. Neither were the next owners. 
                    Or the ones after that. The property records show seventeen different families 
                    have "owned" this cabin. None of them appear in any records after their arrival.
                  </p>
                  <p>
                    In 2019, we decided to share this unique experience with the world. 
                    SpookBnB was born—a sanctuary for those seeking a <span className="text-red-500">permanent escape</span> from 
                    modern life.
                  </p>
                  <p className="text-red-900 italic">
                    We've hosted 2,847 guests. Our reviews speak for themselves. 
                    Though, interestingly, none of our guests have ever left a review after checkout.
                  </p>
                  <p className="text-red-500 text-xs tracking-widest mt-6">
                    PERHAPS YOU'LL BE DIFFERENT.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-pine-700/80 text-sm leading-relaxed">
                  <p>
                    SpookBnB was founded with a simple mission: to create extraordinary mountain 
                    retreat experiences that reconnect people with nature's beauty and tranquility.
                    The cabin has been in operation since 1847—longer than most realize.
                  </p>
                  <p>
                    Our hand-selected cabins combine rustic charm with modern luxury, offering 
                    the perfect balance of adventure and comfort. Each property has its own... 
                    <span className="text-pine-900 italic">character</span>. Guests often say 
                    the cabin feels alive.
                  </p>
                  <p>
                    Our team of hospitality experts and local guides are dedicated to making 
                    your mountain escape truly special. Many of our staff have been here for 
                    decades. Some say they've always been here.
                  </p>
                  <p className="text-pine-900">
                    Join thousands of guests who have discovered their perfect retreat with SpookBnB. 
                    <span className="text-pine-600/60 text-xs block mt-1">
                      (We keep their memories close.)
                    </span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// TERMS MODAL
// ============================================
export function TermsModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const { playPianoSting } = useSoundEffects();

  // Play piano sting when modal opens in light mode
  useEffect(() => {
    if (isOpen && !isDarkMode) {
      playPianoSting(0.4);
    }
  }, [isOpen, isDarkMode, playPianoSting]);

  const lightTerms = [
    { title: "Booking Agreement", content: "By completing a reservation, you agree to our standard terms of service and house rules. Once confirmed, your booking creates a connection between you and the property that cannot be easily severed." },
    { title: "Payment", content: "Full payment is required at the time of booking. We accept all major credit cards. Your transaction will appear as 'SPOOKBNB HOLDINGS' on your statement—please don't be alarmed." },
    { title: "Cancellation", content: "Free cancellation up to 48 hours before check-in. After that, a one-night fee applies. We should mention: no guest has ever successfully cancelled. They always end up coming." },
    { title: "Check-in/Check-out", content: "Check-in: 3:00 PM. Check-out: 11:00 AM. Early check-in or late checkout may be available upon request. Many guests request late checkout. Indefinitely late." },
    { title: "House Rules", content: "No smoking indoors. Quiet hours 10PM-7AM. If you hear footsteps during quiet hours, please remain in your room. It's nothing to worry about." },
  ];

  const darkTerms = [
    { title: "Binding Agreement", content: "By entering these premises, you enter into a binding contract with forces beyond your comprehension. This agreement supersedes all earthly laws." },
    { title: "Payment", content: "Payment is collected in advance. Additional... costs may be incurred during your stay. These cannot be measured in currency." },
    { title: "Cancellation", content: "There is no cancellation. Once booked, your reservation is sealed. The cabin has already begun preparing for your arrival." },
    { title: "Check-in/Check-out", content: "Check-in: When the sun sets. Check-out: There is no check-out. Departure is not guaranteed nor recommended." },
    { title: "House Rules", content: "Do not enter the basement. Do not answer the door after midnight. Do not look in the mirrors for too long. Do not try to leave." },
    { title: "Liability", content: "SpookBnB is not responsible for: nightmares, disappearances, temporal anomalies, conversations with previous guests, or existential dread." },
  ];

  const terms = isDarkMode ? darkTerms : lightTerms;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/80' : 'bg-black/50'}`} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-[#0a0808] border border-red-900/30' 
                : 'bg-[#fdfcfb]'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 p-6 border-b ${
              isDarkMode ? 'bg-[#0a0808] border-red-900/20' : 'bg-[#fdfcfb] border-stone-200'
            }`}>
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-red-950/50 text-red-500 hover:bg-red-950/70' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className={`inline-flex items-center gap-2 mb-2 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`}>
                <FileText className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">Legal</span>
              </div>
              <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-pine-900'}`} style={{ fontFamily: 'var(--font-serif)' }}>
                {isDarkMode ? 'Terms of Eternal Service' : 'Terms of Service'}
              </h2>
              {isDarkMode && (
                <p className="text-red-900 text-xs mt-2 italic">Last updated: When time still mattered</p>
              )}
            </div>

            {/* Terms */}
            <div className="p-6 space-y-6">
              {terms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-red-400' : 'text-pine-900'}`}>
                    {index + 1}. {term.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-pine-700/70'}`}>
                    {term.content}
                  </p>
                </motion.div>
              ))}
              
              {isDarkMode && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-red-900 text-xs tracking-widest pt-6 border-t border-red-900/20"
                >
                  BY READING THESE TERMS, YOU HAVE ALREADY AGREED.
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// PRIVACY MODAL - Contains Fragment III Puzzle
// Glitched/corrupted text puzzle - find the hidden message
// ============================================

// Glitched word component - text that flickers between corrupted and readable
function GlitchedWord({ word, isKey, onSelect, isSelected, isComplete }) {
  const [isHovered, setIsHovered] = useState(false);
  const [glitchText, setGlitchText] = useState(word);
  
  const glitchChars = '█▓▒░╔╗╚╝║═╬▲▼◄►☼♠♣♥♦';
  
  // Generate corrupted version of the word
  useEffect(() => {
    if (!isKey || isComplete || isSelected) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        const corrupted = word.split('').map((char, i) => {
          // Keep some letters visible, corrupt others
          if (Math.random() > 0.4) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        }).join('');
        setGlitchText(corrupted);
      } else {
        setGlitchText(word);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [word, isHovered, isKey, isComplete, isSelected]);

  if (!isKey) {
    return <span className="text-gray-500">{word}</span>;
  }

  if (isComplete || isSelected) {
    return (
      <span className={`font-bold ${isComplete ? 'text-amber-500' : 'text-red-400'}`}>
        {word}
      </span>
    );
  }

  return (
    <motion.span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      className={`cursor-pointer font-mono transition-all duration-150 ${
        isHovered 
          ? 'text-red-400 bg-red-900/20 px-1 -mx-1' 
          : 'text-red-800/60'
      }`}
      style={{ 
        textShadow: isHovered ? 'none' : '0 0 8px rgba(220,38,38,0.5)',
        letterSpacing: isHovered ? 'normal' : '0.05em'
      }}
    >
      {glitchText}
    </motion.span>
  );
}

export function PrivacyModal({ isOpen, onClose }) {
  const { isDarkMode } = useTheme();
  const { fragment3Complete, completeFragment3 } = useEscape();
  const { playPianoSting, playClick, playBuzz, playGrowl, playBell, playWhisper } = useSoundEffects();
  const [selectedWords, setSelectedWords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Play piano sting when modal opens in light mode
  useEffect(() => {
    if (isOpen && !isDarkMode) {
      playPianoSting(0.4);
    }
  }, [isOpen, isDarkMode, playPianoSting]);

  // Reset selected words when modal opens (but keep attempts count)
  useEffect(() => {
    if (isOpen && !fragment3Complete) {
      setSelectedWords([]);
      setShowFailure(false);
    }
  }, [isOpen, fragment3Complete]);

  // The secret phrase: "STAY FOREVER" - hidden across the corrupted policy
  const secretPhrase = ['STAY', 'FOREVER'];
  
  const handleWordSelect = (word) => {
    if (fragment3Complete || showFailure) return;
    
    const upperWord = word.toUpperCase();
    
    // Already selected this word
    if (selectedWords.includes(upperWord)) return;
    
    // Play click sound on selection
    playClick(0.4);
    
    // First word selection
    if (selectedWords.length === 0) {
      // Check if it's a correct first word (STAY)
      if (upperWord === secretPhrase[0]) {
        playWhisper(0.3); // Subtle whisper for correct first word
        setSelectedWords([upperWord]);
      } else {
        // Wrong first word - just highlight it as selected, wait for second
        setSelectedWords([upperWord]);
      }
      return;
    }
    
    // Second word selection - this is where we validate the full phrase
    const firstWord = selectedWords[0];
    const newSelected = [firstWord, upperWord];
    
    // Check if the combination is correct
    const isCorrectPhrase = 
      (firstWord === 'STAY' && upperWord === 'FOREVER') ||
      (firstWord === 'FOREVER' && upperWord === 'STAY');
    
    if (isCorrectPhrase) {
      // Success!
      playBell(0.5); // Victory bell!
      setSelectedWords(['STAY', 'FOREVER']);
      setTimeout(() => {
        completeFragment3('stay forever');
      }, 500);
    } else {
      // FAILURE - dramatic effect and close modal
      playBuzz(0.7); // Error buzz
      playGrowl(0.5); // Menacing growl
      setShowFailure(true);
      setAttempts(prev => prev + 1);
      
      // Close modal after failure animation
      setTimeout(() => {
        setShowFailure(false);
        setSelectedWords([]);
        onClose();
      }, 2000);
    }
  };

  const renderDarkContent = () => {
    // Privacy policy with corrupted key words
    const sections = [
      {
        title: "Data Collection Protocol",
        content: [
          { text: "We collect everything. Your ", normal: true },
          { text: "STAY", key: true },
          { text: " here means we own your memories, your fears, the sound of your breathing at 3 AM. The walls absorb your whispers. Nothing escapes.", normal: true },
        ]
      },
      {
        title: "Retention Period",  
        content: [
          { text: "Your data is kept ", normal: true },
          { text: "FOREVER", key: true },
          { text: ". Deletion is impossible. Once recorded, always remembered. The cabin's memory is eternal, carved into wood older than your bloodline.", normal: true },
        ]
      },
      {
        title: "Your Consent",
        content: [
          { text: "By reading this, you've already agreed. By breathing this air, you've signed. There is no opt-out. There is no ", normal: true },
          { text: "ESCAPE", key: false, decoy: true },
          { text: ". The contract was sealed the moment you ", normal: true },
          { text: "ARRIVED", key: false, decoy: true },
          { text: ".", normal: true },
        ]
      },
      {
        title: "Third Party Disclosure",
        content: [
          { text: "We share nothing. What enters these walls ", normal: true },
          { text: "REMAINS", key: false, decoy: true },
          { text: ". No government, no court, no force can extract what we've collected. Your secrets are ", normal: true },
          { text: "OURS", key: false, decoy: true },
          { text: " now.", normal: true },
        ]
      },
      {
        title: "Your Rights",
        content: [
          { text: "You have the right to ", normal: true },
          { text: "SILENCE", key: false, decoy: true },
          { text: ". You have the right to fear. You have the right to realize, too late, that checking in was checking out of everything you knew.", normal: true },
        ]
      }
    ];

    return (
      <div className="space-y-6 text-sm">
        {/* Corrupted header warning */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-3 border border-red-900/30 rounded-lg bg-red-950/20"
        >
          <p className="text-red-800 text-xs tracking-widest font-mono">
            ⚠ DOCUMENT CORRUPTION DETECTED ⚠
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Some text appears unstable... hover to stabilize
          </p>
        </motion.div>

        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h3 className="text-red-400 font-bold mb-2">{section.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {section.content.map((part, pIdx) => {
                if (part.normal) {
                  return <span key={pIdx}>{part.text}</span>;
                }
                if (part.key) {
                  return (
                    <GlitchedWord
                      key={pIdx}
                      word={part.text}
                      isKey={true}
                      isSelected={selectedWords.includes(part.text)}
                      isComplete={fragment3Complete}
                      onSelect={() => handleWordSelect(part.text)}
                    />
                  );
                }
                if (part.decoy) {
                  return (
                    <GlitchedWord
                      key={pIdx}
                      word={part.text}
                      isKey={true}
                      isSelected={selectedWords.includes(part.text)}
                      isComplete={fragment3Complete}
                      onSelect={() => handleWordSelect(part.text)}
                    />
                  );
                }
                return null;
              })}
            </p>
          </div>
        ))}

        {/* FAILURE OVERLAY - Shows when wrong combination selected */}
        <AnimatePresence>
          {showFailure && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: [0.5, 1.1, 1],
                  opacity: 1,
                }}
                className="text-center"
              >
                <motion.div
                  animate={{ 
                    x: [0, -10, 10, -10, 10, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <p className="text-red-600 text-6xl font-bold tracking-widest mb-4" 
                     style={{ fontFamily: 'var(--font-serif)', textShadow: '0 0 30px rgba(220,38,38,0.8)' }}>
                    WRONG
                  </p>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 text-sm tracking-wider"
                >
                  The contract rejects your interpretation...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-red-900 text-xs mt-4 tracking-widest"
                >
                  TRY AGAIN
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle status */}
        {!fragment3Complete ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-6 border-t border-red-900/20"
          >
            <div className="text-center">
              <p className="text-red-900 text-xs tracking-widest mb-3">
                THE CONTRACT HIDES A MESSAGE
              </p>
              
              {/* Progress display - shows what user has selected */}
              <div className="flex justify-center gap-3 mb-4">
                <div 
                  className={`px-3 py-1 rounded border transition-all ${
                    selectedWords.length >= 1
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-red-900/30 bg-black/30'
                  }`}
                >
                  <span className={`text-sm font-mono tracking-wider ${
                    selectedWords.length >= 1 ? 'text-red-400' : 'text-gray-700'
                  }`}>
                    {selectedWords[0] || '??????'}
                  </span>
                </div>
                <div 
                  className={`px-3 py-1 rounded border transition-all ${
                    selectedWords.length >= 2
                      ? 'border-red-500/50 bg-red-500/10'
                      : 'border-red-900/30 bg-black/30'
                  }`}
                >
                  <span className={`text-sm font-mono tracking-wider ${
                    selectedWords.length >= 2 ? 'text-red-400' : 'text-gray-700'
                  }`}>
                    {selectedWords[1] || '??????'}
                  </span>
                </div>
              </div>
              
              {selectedWords.length === 1 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600 text-xs mb-3"
                >
                  Select the second word to complete the phrase...
                </motion.p>
              )}
              
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-gray-700 text-xs hover:text-gray-500 transition-colors"
              >
                {showHint ? '[ hide hint ]' : '[ the text bleeds... ]'}
              </button>
              
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-black/30 rounded-lg border border-red-900/20"
                >
                  <p className="text-gray-500 text-xs italic">
                    "The corrupted words flicker with truth. Not all that glitches matters—
                    only two words form the cabin's command. What does it want you to do... 
                    {attempts >= 3 && <span className="text-red-700"> Look at the first two sections."</span>}
                    {attempts < 3 && " and for how long?\""}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-6 border-t border-amber-500/30 text-center"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-3 bg-amber-500/10 
                        border border-amber-500/30 rounded-lg mb-4"
            >
              <Check className="w-5 h-5 text-amber-500" />
              <span className="text-amber-500 font-bold tracking-widest text-lg">
                STAY FOREVER
              </span>
            </motion.div>
            <p className="text-amber-600/70 text-xs">
              You've decoded the cabin's true contract. This was always the agreement.
            </p>
            <p className="text-gray-700 text-xs mt-2 italic">
              Fragment III Complete
            </p>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/80' : 'bg-black/50'}`} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl ${
              isDarkMode 
                ? 'bg-[#0a0808] border border-red-900/30' 
                : 'bg-[#fdfcfb]'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 p-6 border-b ${
              isDarkMode ? 'bg-[#0a0808] border-red-900/20' : 'bg-[#fdfcfb] border-stone-200'
            }`}>
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-red-950/50 text-red-500 hover:bg-red-950/70' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className={`inline-flex items-center gap-2 mb-2 ${isDarkMode ? 'text-red-500' : 'text-gold-500'}`}>
                <Eye className="w-4 h-4" />
                <span className="text-xs font-bold tracking-wider uppercase">
                  {isDarkMode ? 'Binding Contract' : 'Privacy'}
                </span>
              </div>
              <h2 className={`text-2xl ${isDarkMode ? 'text-white' : 'text-pine-900'}`} style={{ fontFamily: 'var(--font-serif)' }}>
                {isDarkMode ? 'Terms of Eternal Residence' : 'Privacy Policy'}
              </h2>
              
              {/* Fragment III completion badge */}
              {isDarkMode && fragment3Complete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 
                             bg-amber-500/20 border border-amber-500/50 rounded-full"
                >
                  <Check className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-500 text-xs font-bold tracking-wider">FRAGMENT III</span>
                </motion.div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {isDarkMode ? renderDarkContent() : (
                <div className="space-y-6 text-sm">
                  <div>
                    <h3 className="text-pine-900 font-bold mb-2">Information We Collect</h3>
                    <p className="text-pine-700/70">
                      We collect information you provide during booking: name, email, phone number, 
                      and payment details. We also collect usage data to improve our services.
                      <span className="text-pine-600/50 italic"> We remember every guest.</span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-pine-900 font-bold mb-2">How We Use Your Data</h3>
                    <p className="text-pine-700/70">
                      Your information is used to process reservations, communicate about your stay, 
                      and personalize your experience. We notice patterns. Preferences. 
                      <span className="text-pine-600/50 italic"> The things you don't say out loud.</span>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-pine-900 font-bold mb-2">Data Security</h3>
                    <p className="text-pine-700/70">
                      We employ industry-standard security measures to protect your personal information.
                      Your data is stored securely on-site. We've never had a breach. 
                      Nothing leaves this place.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-pine-900 font-bold mb-2">Your Rights</h3>
                    <p className="text-pine-700/70">
                      You may request access to, correction of, or deletion of your personal data.
                      However, some records cannot be deleted. 
                      <span className="text-pine-600/50 italic"> Some things are permanent.</span>
                    </p>
                  </div>

                  <p className="text-center text-pine-600/50 text-xs pt-6 border-t border-stone-200">
                    Questions? Contact privacy@spookbnb.com 
                    <span className="block mt-1 text-pine-500/40">(Response times may vary. Significantly.)</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
