'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Bug, Github, Trophy, Sparkles, Moon, Mountain, TreePine } from 'lucide-react';
import { useEscape } from '@/components/providers/EscapeProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';

export function VictoryModal({ isOpen, onClose }) {
  const { resetProgress } = useEscape();
  const { toggleMode } = useTheme();
  const { stopVictory } = useAudio();

  const handleClose = () => {
    stopVictory(); // Stop victory music when closing
    onClose();
  };

  const handleReset = () => {
    stopVictory(); // Stop victory music when resetting
    resetProgress();
    onClose();
  };

  const handleDebug = () => {
    // Add debug parameter to URL
    const url = new URL(window.location.href);
    url.searchParams.set('debug', 'true');
    window.location.href = url.toString();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header decoration */}
            <div className="relative h-32 bg-gradient-to-br from-pine-800 via-pine-700 to-pine-900 overflow-hidden">
              {/* Mountain scene */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 opacity-30">
                <TreePine className="w-8 h-8 text-pine-950" />
                <Mountain className="w-16 h-16 text-pine-950" />
                <TreePine className="w-6 h-6 text-pine-950" />
                <Mountain className="w-12 h-12 text-pine-950" />
                <TreePine className="w-10 h-10 text-pine-950" />
              </div>
              
              {/* Trophy badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(255,255,255,0.1)',
                      '0 0 40px rgba(255,255,255,0.2)',
                      '0 0 20px rgba(255,255,255,0.1)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-10 h-10 text-amber-300" />
                </motion.div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-pine-900 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  🎃 Congratulations, Survivor!
                </h2>
                <p className="text-pine-600 text-sm">
                  You've escaped SpookBnB!
                </p>
              </div>

              {/* Hackathon info */}
              <div className="bg-stone-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold tracking-wider text-pine-600 uppercase">
                    About This Project
                  </span>
                </div>
                
                <p className="text-pine-700 text-sm leading-relaxed mb-4">
                  <strong>SpookBnB</strong> was created for the{' '}
                  <span className="text-amber-600 font-semibold">Kiroween Hackathon</span>{' '}
                  in the <span className="font-semibold">"Costume Contest"</span> category.
                </p>

                <div className="bg-white rounded-xl p-4 border border-stone-200">
                  <p className="text-pine-600 text-xs italic leading-relaxed">
                    "Build any app but show us a <strong>haunting user interface</strong> that's polished and unforgettable. 
                    Bring in spooky design elements that enhance your app's function."
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-pine-500">
                  <Moon className="w-3 h-3" />
                  <span>Toggle dark mode to experience the horror transformation</span>
                </div>
              </div>

              {/* Features summary */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-red-50 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">🔦</p>
                  <p className="text-xs text-red-700 font-medium">Flashlight Effect</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">🧩</p>
                  <p className="text-xs text-amber-700 font-medium">4 Escape Puzzles</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">👻</p>
                  <p className="text-xs text-purple-700 font-medium">Hidden Horrors</p>
                </div>
                <div className="bg-pine-50 rounded-xl p-3 text-center">
                  <p className="text-2xl mb-1">🏔️</p>
                  <p className="text-xs text-pine-700 font-medium">Dual Personality</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-pine-700 rounded-xl font-medium text-sm transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Progress
                </motion.button>
                
                <motion.button
                  onClick={handleDebug}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pine-900 hover:bg-pine-800 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  <Bug className="w-4 h-4" />
                  Debug Mode
                </motion.button>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-stone-400 mt-6">
                Debug mode reveals the full dark experience without the flashlight effect
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
