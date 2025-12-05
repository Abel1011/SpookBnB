'use client';

import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * useSoundEffects - Hook for playing horror sound effects
 * 
 * Sound files located in /public/sounds/:
 * - whisper.wav       : Ghostly whisper with voice formants
 * - heartbeat.wav     : Realistic heartbeat with sub-bass
 * - click.wav         : Glass crack/break sound
 * - jumpscare.wav     : Dramatic impact with sub-bass punch
 * - ambient-drone.wav : Deep unsettling atmosphere
 * - creak.wav         : Realistic creaking door
 * - breathing.wav     : Heavy respiratory sounds
 * - static.wav        : Radio interference/disturbance
 * - bell.wav          : Ominous church bell
 * - growl.wav         : Deep menacing creature sound
 */

// Global audio cache to share across all hook instances
const globalAudioCache = {};
const activeLoopingSounds = {}; // Track looping sounds to stop them later
let globalInitialized = false;

const SOUND_LIST = [
  'whisper',
  'heartbeat',
  'click',
  'jumpscare',
  'ambient-drone',
  'creak',
  'breathing',
  'static',
  'bell',
  'growl',
  'buzz',
  'piano-sting'
];

// Initialize audio globally once
function initializeAudio() {
  if (globalInitialized) return;
  
  SOUND_LIST.forEach(sound => {
    if (!globalAudioCache[sound]) {
      const audio = new Audio(`/sounds/${sound}.wav`);
      audio.preload = 'auto';
      globalAudioCache[sound] = audio;
    }
  });
  
  globalInitialized = true;
}

export function useSoundEffects() {
  const [isReady, setIsReady] = useState(globalInitialized);

  // Initialize audio on mount
  useEffect(() => {
    initializeAudio();
    setIsReady(true);
  }, []);

  // Play a sound effect
  const playSound = useCallback((soundName, options = {}) => {
    const audio = globalAudioCache[soundName];
    if (!audio) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    const { volume = 0.5, loop = false, playbackRate = 1 } = options;

    try {
      // For looping sounds, stop any existing loop first
      if (loop && activeLoopingSounds[soundName]) {
        activeLoopingSounds[soundName].pause();
        activeLoopingSounds[soundName].src = '';
        delete activeLoopingSounds[soundName];
      }

      // Clone audio for overlapping sounds
      const audioClone = audio.cloneNode();
      audioClone.volume = Math.max(0, Math.min(1, volume));
      audioClone.loop = loop;
      audioClone.playbackRate = playbackRate;
      
      // Track looping sounds so we can stop them
      if (loop) {
        activeLoopingSounds[soundName] = audioClone;
      }
      
      // Play the clone
      audioClone.play().catch(err => {
        // Silently fail if autoplay is blocked
        console.log('Audio playback blocked:', err.message);
      });
      
      // Auto cleanup non-looping sounds
      if (!loop) {
        audioClone.onended = () => {
          audioClone.src = '';
        };
      }
      
      return audioClone;
    } catch {
      // Silently fail - audio errors are non-critical
    }
  }, []);

  // Stop a specific sound (stops looping sounds and original cached audio)
  const stopSound = useCallback((soundName) => {
    // Stop any active looping sound
    if (activeLoopingSounds[soundName]) {
      activeLoopingSounds[soundName].pause();
      activeLoopingSounds[soundName].currentTime = 0;
      delete activeLoopingSounds[soundName];
    }
    // Also stop the original cached audio
    const audio = globalAudioCache[soundName];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    // Stop all active looping sounds
    Object.keys(activeLoopingSounds).forEach(soundName => {
      activeLoopingSounds[soundName].pause();
      activeLoopingSounds[soundName].currentTime = 0;
      delete activeLoopingSounds[soundName];
    });
    // Stop all cached audio
    Object.values(globalAudioCache).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  // Convenience methods for common sounds
  const playWhisper = useCallback((volume = 0.4) => {
    playSound('whisper', { volume });
  }, [playSound]);

  const playHeartbeat = useCallback((volume = 0.5, loop = false) => {
    playSound('heartbeat', { volume, loop });
  }, [playSound]);

  const playClick = useCallback((volume = 0.6) => {
    playSound('click', { volume });
  }, [playSound]);

  const playJumpscare = useCallback((volume = 0.7) => {
    playSound('jumpscare', { volume });
  }, [playSound]);

  const playStatic = useCallback((volume = 0.4, loop = false) => {
    playSound('static', { volume, loop });
  }, [playSound]);

  const playCreak = useCallback((volume = 0.5) => {
    playSound('creak', { volume });
  }, [playSound]);

  const playBreathing = useCallback((volume = 0.3, loop = false) => {
    playSound('breathing', { volume, loop });
  }, [playSound]);

  const playBell = useCallback((volume = 0.4) => {
    playSound('bell', { volume });
  }, [playSound]);

  const playGrowl = useCallback((volume = 0.5) => {
    playSound('growl', { volume });
  }, [playSound]);

  const playBuzz = useCallback((volume = 0.5) => {
    playSound('buzz', { volume });
  }, [playSound]);

  const playPianoSting = useCallback((volume = 0.5) => {
    playSound('piano-sting', { volume });
  }, [playSound]);

  const playDrone = useCallback((volume = 0.3, loop = true) => {
    playSound('ambient-drone', { volume, loop });
  }, [playSound]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    // Convenience methods
    playWhisper,
    playHeartbeat,
    playClick,
    playJumpscare,
    playStatic,
    playCreak,
    playBreathing,
    playBell,
    playGrowl,
    playBuzz,
    playPianoSting,
    playDrone,
  };
}
