'use client';

import { useState, useEffect } from 'react';

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = Math.max(0, Math.min(e.clientX, window.innerWidth));
      const y = Math.max(0, Math.min(e.clientY, window.innerHeight));
      setPosition({ x, y });
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX, window.innerWidth));
        const y = Math.max(0, Math.min(touch.clientY, window.innerHeight));
        setPosition({ x, y });
      }
    };

    setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return position;
}
