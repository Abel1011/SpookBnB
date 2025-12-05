'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(undefined);

export function AudioProvider({ children }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const switchAudioRef = useRef(null);
  const ambientAudioRef = useRef(null);
  const staticAudioRef = useRef(null);
  const victoryAudioRef = useRef(null);

  useEffect(() => {
    switchAudioRef.current = new Audio('/sounds/click.wav');
    ambientAudioRef.current = new Audio('/music/ambient.mp3');
    staticAudioRef.current = new Audio('/sounds/static.wav');
    victoryAudioRef.current = new Audio('/music/save.mp3');
    if (ambientAudioRef.current) {
      ambientAudioRef.current.loop = true;
    }
    if (victoryAudioRef.current) {
      victoryAudioRef.current.loop = true;
    }
  }, []);

  const playSwitch = async () => {
    if (!switchAudioRef.current || !isAudioEnabled) return;
    
    try {
      switchAudioRef.current.currentTime = 0;
      await switchAudioRef.current.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setIsAudioEnabled(false);
      }
    }
  };

  // Start ambient with static intro effect
  const startAmbient = async (withStaticIntro = true) => {
    if (!isAudioEnabled) return;
    
    try {
      // Play static sound first for creepy transition
      if (withStaticIntro && staticAudioRef.current) {
        staticAudioRef.current.currentTime = 0;
        staticAudioRef.current.volume = 0.5;
        await staticAudioRef.current.play();
        
        // Start ambient after static plays for a bit (1.5 seconds)
        setTimeout(async () => {
          if (ambientAudioRef.current) {
            ambientAudioRef.current.currentTime = 0;
            ambientAudioRef.current.volume = 0.3;
            await ambientAudioRef.current.play();
          }
          // Fade out static
          if (staticAudioRef.current) {
            let vol = 0.5;
            const fadeOut = setInterval(() => {
              vol -= 0.05;
              if (vol <= 0) {
                staticAudioRef.current.pause();
                staticAudioRef.current.currentTime = 0;
                clearInterval(fadeOut);
              } else {
                staticAudioRef.current.volume = vol;
              }
            }, 100);
          }
        }, 1500);
      } else {
        // Direct ambient start without static
        if (ambientAudioRef.current) {
          ambientAudioRef.current.currentTime = 0;
          ambientAudioRef.current.volume = 0.3;
          await ambientAudioRef.current.play();
        }
      }
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setIsAudioEnabled(false);
      }
    }
  };

  const stopAmbient = () => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.pause();
      ambientAudioRef.current.currentTime = 0;
    }
    if (staticAudioRef.current) {
      staticAudioRef.current.pause();
      staticAudioRef.current.currentTime = 0;
    }
  };

  // Play victory/save music when escaping dark mode
  const playVictory = async () => {
    if (!victoryAudioRef.current || !isAudioEnabled) return;
    
    try {
      victoryAudioRef.current.currentTime = 0;
      victoryAudioRef.current.volume = 0.5;
      await victoryAudioRef.current.play();
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        setIsAudioEnabled(false);
      }
    }
  };

  // Stop victory music (when closing victory modal)
  const stopVictory = () => {
    if (victoryAudioRef.current) {
      victoryAudioRef.current.pause();
      victoryAudioRef.current.currentTime = 0;
    }
  };

  return (
    <AudioContext.Provider value={{ playSwitch, startAmbient, stopAmbient, playVictory, stopVictory, isAudioEnabled }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
