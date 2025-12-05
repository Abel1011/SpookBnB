'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeProvider';
import { 
  Wifi, SignalZero, 
  Waves, Skull, 
  Flame, Ghost, 
  BedDouble, Eye,
  Wind, CloudFog
} from 'lucide-react';

const iconMap = {
  wifi: { light: Wifi, dark: SignalZero },
  pool: { light: Waves, dark: Skull },
  fireplace: { light: Flame, dark: Ghost },
  bedroom: { light: BedDouble, dark: Eye },
};

export function FeatureCard({ feature, index }) {
  const { isDarkMode } = useTheme();
  const Icon = iconMap[feature.id]?.[isDarkMode ? 'dark' : 'light'] || (isDarkMode ? CloudFog : Wind);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className={`group relative p-8 rounded-[2.5rem] overflow-hidden h-full flex flex-col justify-between ${
        isDarkMode 
          ? 'bg-black border border-red-900/30' 
          : 'bg-white border border-stone-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]'
      }`}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-500 group-hover:opacity-[0.06] ${
        isDarkMode 
          ? 'bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]' 
          : 'bg-[radial-gradient(#b08968_1px,transparent_1px)] [background-size:16px_16px]'
      }`} />

      {/* Glow effect on hover */}
      <motion.div 
        className={`absolute -right-20 -top-20 w-60 h-60 rounded-full blur-[100px] transition-opacity duration-700 ${
          isDarkMode 
            ? 'bg-red-900/20 opacity-0 group-hover:opacity-40' 
            : 'bg-gold-400/20 opacity-0 group-hover:opacity-30'
        }`}
      />
      
      <div>
        {/* Icon container */}
        <div className="mb-8 relative inline-block">
          <motion.div 
            whileHover={{ rotate: isDarkMode ? [0, -5, 5, -5, 0] : 10, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDarkMode 
                ? 'bg-red-950/30 text-red-500 border border-red-900/30' 
                : 'bg-stone-50 text-pine-900 border border-stone-100'
            }`}
          >
            <Icon size={32} strokeWidth={1.5} className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]" : ""} />
          </motion.div>
          
          {/* Decorative dot */}
          <motion.div 
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
              isDarkMode 
                ? 'bg-red-500 border-black' 
                : 'bg-gold-500 border-white'
            }`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
          isDarkMode ? 'text-red-500' : 'text-pine-900'
        }`} style={{ fontFamily: 'var(--font-serif)' }}>
          {isDarkMode ? feature.darkTitle : feature.lightTitle}
        </h3>
        
        <p className={`text-sm leading-relaxed font-medium ${
          isDarkMode ? 'text-red-900/60' : 'text-pine-800/50'
        }`}>
          {isDarkMode ? feature.darkDescription : feature.lightDescription}
        </p>
      </div>
      
      {/* Bottom Action / Indicator */}
      <div className={`mt-8 flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase ${
        isDarkMode ? 'text-red-900/60' : 'text-gold-500/80'
      }`}>
        <span className={`w-8 h-[1px] ${isDarkMode ? 'bg-red-900/40' : 'bg-gold-500/40'}`} />
        {isDarkMode ? feature.darkTag : feature.lightTag}
      </div>
    </motion.div>
  );
}
