'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

/**
 * DarkModeAudio - Plays ambient music when dark mode is active
 * 
 * This component handles the ambient audio for dark mode:
 * - Starts playing when entering dark mode (after user interaction)
 * - Stops when returning to light mode
 * - Loops continuously
 * - Handles browser autoplay restrictions gracefully
 */
export default function DarkModeAudio() {
  const { isDarkMode } = useTheme();
  const audioRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio('/music/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3; // Set volume to 30%

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Listen for first user interaction to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // Control audio based on dark mode state
  useEffect(() => {
    if (!audioRef.current) return;

    const playAudio = async () => {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        // Autoplay blocked - will play after user interaction
      }
    };

    const stopAudio = () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    };

    if (isDarkMode && hasInteracted) {
      playAudio();
    } else if (!isDarkMode && isPlaying) {
      stopAudio();
    }
  }, [isDarkMode, hasInteracted, isPlaying]);

  // Try to play when user first interacts while in dark mode
  useEffect(() => {
    if (isDarkMode && hasInteracted && !isPlaying && audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [hasInteracted, isDarkMode, isPlaying]);

  // This component doesn't render anything
  return null;
}
