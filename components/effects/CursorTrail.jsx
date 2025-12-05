'use client';

import { useState, useEffect, useRef } from 'react';
import { useMousePosition } from '@/components/hooks/useMousePosition';

export function CursorTrail({ isActive }) {
  const currentPos = useMousePosition();
  const [trail, setTrail] = useState([]);
  const lastUpdateRef = useRef(0);
  const posRef = useRef({ x: 0, y: 0 });

  // Update position ref without causing re-renders
  useEffect(() => {
    posRef.current = currentPos;
  }, [currentPos]);

  // Throttled trail update
  useEffect(() => {
    if (!isActive) {
      setTrail([]);
      return;
    }

    const updateTrail = () => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 50) { // Throttle to 20fps
        lastUpdateRef.current = now;
        setTrail((prev) => {
          const newTrail = [{ ...posRef.current }, ...prev].slice(0, 8);
          return newTrail;
        });
      }
    };

    const intervalId = setInterval(updateTrail, 50);
    return () => clearInterval(intervalId);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {trail.map((pos, index) => (
        <div
          key={index}
          className="absolute w-3 h-3 rounded-full bg-red-500/20"
          style={{
            left: pos.x - 6,
            top: pos.y - 6,
            opacity: (1 - index / trail.length) * 0.5,
            transform: `scale(${1 - index / trail.length})`,
          }}
        />
      ))}
    </div>
  );
}
