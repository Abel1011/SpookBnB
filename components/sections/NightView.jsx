'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useAudio } from '@/components/providers/AudioProvider';
import { Moon, Sparkles, Eye } from 'lucide-react';
import { useRef } from 'react';

export function NightView() {
  const { isDarkMode, toggleMode } = useTheme();
  const { playSwitch, startAmbient } = useAudio();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacitySection = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

  const handleActivate = () => {
    playSwitch();
    startAmbient();
    toggleMode();
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] lg:min-h-screen overflow-hidden flex items-center bg-[#0a0a0f]"
    >
      {/* Full background image with parallax */}
      <motion.div style={{ opacity: opacitySection }} className="absolute inset-0">
        <motion.div 
          className="absolute -top-[10%] left-0 w-full h-[120%] bg-cover bg-center"
          style={{ 
            y: backgroundY,
            backgroundImage: 'url(/nigth-view.png)',
            filter: 'brightness(0.4) saturate(0.7)',
          }}
        />
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-[#0a0a0f]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 via-transparent to-[#0a0a0f]/80" />
      </motion.div>

      {/* Floating stars/particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* Subtle glow effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-8 text-gold-400"
            >
              <span className="w-12 h-px bg-current" />
              <span className="text-xs font-bold tracking-[0.3em] uppercase">
                Night Experience
              </span>
            </motion.div>
            
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] mb-8 text-white"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              When the Sun<br />
              <span className="text-gold-400 italic">Sets</span>, Magic<br />
              Awakens
            </h2>
            
            <p className="text-lg lg:text-xl mb-10 max-w-lg leading-relaxed text-stone-300/80">
              Our mountain retreats transform under the starlight. 
              Discover the enchanting nocturnal atmosphere that makes 
              SpookBnB truly unforgettable. The night holds secrets 
              waiting to be revealed.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-10 text-stone-400">
              {[
                { icon: Moon, text: "Moonlit Views" },
                { icon: Sparkles, text: "Stargazing Deck" },
                { icon: Eye, text: "Night Wildlife" },
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <feature.icon className="w-4 h-4 text-gold-400" />
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                onClick={handleActivate}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-10 py-5 rounded-full text-base font-bold tracking-wide overflow-hidden transition-all bg-gradient-to-r from-gold-500 to-amber-500 text-pine-900 shadow-xl shadow-gold-500/20"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Moon className="w-5 h-5" />
                  Explore Night Mode
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-gold-400 to-amber-400"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.5, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ borderRadius: '100%', transformOrigin: 'center' }}
                />
              </motion.button>
            </div>

            <p className="mt-6 text-sm text-stone-500 tracking-wide">
              ✦ Activate for the full immersive experience
            </p>
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <img 
                src="/cabin-night-light.png" 
                alt="Night view of the cabin"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              
              {/* Floating badge */}
              <motion.div 
                className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                    <Moon className="w-6 h-6 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Night Mode Preview</p>
                    <p className="text-stone-400 text-sm">See the cabin after dark</p>
                  </div>
                </div>
              </motion.div>

              {/* Corner decoration */}
              <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-gold-400/30 rounded-tr-2xl" />
              <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-gold-400/30 rounded-bl-2xl" />
            </div>

            {/* Floating elements */}
            <motion.div 
              className="absolute -top-6 -right-6 px-5 py-3 bg-pine-900 rounded-2xl shadow-xl shadow-pine-900/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span className="text-white font-bold text-sm">Starlit Nights</span>
              </div>
            </motion.div>

            <motion.div 
              className="absolute -bottom-4 -left-4 px-4 py-2 bg-black border border-white/10 rounded-full shadow-xl"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              <span className="text-gold-400 text-xs font-bold tracking-wider">✦ EXCLUSIVE VIEW</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
