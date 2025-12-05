'use client';

import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'spookbnb-reservation-state';
const THEME_STORAGE_KEY = 'spookbnb-theme';

/**
 * Hook to detect if there's a persisted reservation state
 * that should auto-open the modal on page load
 */
export function useReservationPersistence() {
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Prevent running multiple times in the same session
    if (hasTriggeredRef.current) return;
    
    // Don't auto-open if already in dark mode - modal's purpose is complete
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark') {
      // Clean up any leftover reservation state
      localStorage.removeItem(STORAGE_KEY);
      setHasChecked(true);
      return;
    }
    
    // Check localStorage for saved state on mount
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Only auto-open if saved within last 30 minutes
        const thirtyMinutes = 30 * 60 * 1000;
        const isRecent = Date.now() - parsed.timestamp < thirtyMinutes;
        // Has progress if: step > 0, OR attempted to close, OR has meaningful form data
        const hasProgress = parsed.currentStep > 0 || 
                           parsed.attemptedClose > 0 || 
                           (parsed.formData && (
                             parsed.formData.checkIn || 
                             parsed.formData.name || 
                             parsed.formData.email
                           ));
        
        if (isRecent && hasProgress) {
          hasTriggeredRef.current = true;
          // Small delay for creepy effect - modal appears after page loads
          setTimeout(() => {
            setShouldAutoOpen(true);
          }, 1500); // 1.5 second delay - unsettling timing
        } else if (!isRecent) {
          // Clean up old state
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (e) {
      // Invalid state, clean up
      localStorage.removeItem(STORAGE_KEY);
    }
    setHasChecked(true);
  }, []);

  // Clear the auto-open flag after it's been used
  const clearAutoOpen = () => {
    setShouldAutoOpen(false);
  };

  return { shouldAutoOpen, clearAutoOpen, hasChecked };
}
