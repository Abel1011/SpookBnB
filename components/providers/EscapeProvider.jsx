'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const EscapeContext = createContext(null);

export function EscapeProvider({ children }) {
  // Fragment 1: LIGHT word from reviews
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [fragment1Complete, setFragment1Complete] = useState(false);
  
  // Fragment 2: Mirror count
  const [fragment2Complete, setFragment2Complete] = useState(false);
  
  // Fragment 3: Name from flames
  const [fragment3Complete, setFragment3Complete] = useState(false);
  
  // Fragment 4: Final escape
  const [fragment4Complete, setFragment4Complete] = useState(false);
  
  // Track which letters have been collected (to prevent duplicates)
  const [collectedLetterIds, setCollectedLetterIds] = useState([]);

  // Collect a letter for Fragment 1
  const collectLetter = useCallback((letter, reviewId) => {
    // Prevent collecting the same letter twice
    if (collectedLetterIds.includes(reviewId)) return false;
    
    setCollectedLetterIds(prev => [...prev, reviewId]);
    setCollectedLetters(prev => {
      const newLetters = [...prev, letter];
      
      // Check if LIGHT is formed (in order: L, I, G, H, T)
      const targetWord = 'LIGHT';
      const collectedWord = newLetters.join('');
      
      // Check if all letters are collected (regardless of order for now)
      if (newLetters.length === 5) {
        const sortedCollected = [...newLetters].sort().join('');
        const sortedTarget = targetWord.split('').sort().join('');
        if (sortedCollected === sortedTarget) {
          setFragment1Complete(true);
        }
      }
      
      return newLetters;
    });
    
    return true;
  }, [collectedLetterIds]);

  // Complete Fragment 2
  const completeFragment2 = useCallback((answer) => {
    // The answer could be a number (e.g., count of eyes in mirror)
    if (answer === 7) { // or whatever the correct answer is
      setFragment2Complete(true);
      return true;
    }
    return false;
  }, []);

  // Complete Fragment 3
  const completeFragment3 = useCallback((phrase) => {
    // The hidden message in the corrupted contract
    if (phrase.toLowerCase() === 'stay forever') {
      setFragment3Complete(true);
      return true;
    }
    return false;
  }, []);

  // Complete Fragment 4
  const completeFragment4 = useCallback(() => {
    if (fragment1Complete && fragment2Complete && fragment3Complete) {
      setFragment4Complete(true);
      return true;
    }
    return false;
  }, [fragment1Complete, fragment2Complete, fragment3Complete]);

  // Check total progress
  const getProgress = useCallback(() => {
    let count = 0;
    if (fragment1Complete) count++;
    if (fragment2Complete) count++;
    if (fragment3Complete) count++;
    if (fragment4Complete) count++;
    return count;
  }, [fragment1Complete, fragment2Complete, fragment3Complete, fragment4Complete]);

  // Check if can escape
  const canEscape = fragment4Complete;

  // Reset everything
  const resetProgress = useCallback(() => {
    setCollectedLetters([]);
    setCollectedLetterIds([]);
    setFragment1Complete(false);
    setFragment2Complete(false);
    setFragment3Complete(false);
    setFragment4Complete(false);
  }, []);

  return (
    <EscapeContext.Provider value={{
      // Fragment 1
      collectedLetters,
      collectedLetterIds,
      collectLetter,
      fragment1Complete,
      
      // Fragment 2
      fragment2Complete,
      completeFragment2,
      
      // Fragment 3
      fragment3Complete,
      completeFragment3,
      
      // Fragment 4
      fragment4Complete,
      completeFragment4,
      
      // General
      getProgress,
      canEscape,
      resetProgress,
    }}>
      {children}
    </EscapeContext.Provider>
  );
}

export function useEscape() {
  const context = useContext(EscapeContext);
  if (!context) {
    throw new Error('useEscape must be used within an EscapeProvider');
  }
  return context;
}
