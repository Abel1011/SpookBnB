'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { DynamicFavicon } from '@/components/effects/DynamicFavicon';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('spookbnb-mode');
    if (stored !== null) {
      setIsDarkMode(stored === 'dark');
    }
    setMounted(true);
  }, []);

  const toggleMode = () => {
    setIsTransitioning(true);
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('spookbnb-mode', newMode ? 'dark' : 'light');
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleMode, isTransitioning }}>
      <DynamicFavicon />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
