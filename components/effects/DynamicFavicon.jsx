'use client';

import { useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

// Pine tree SVG for light mode (base64 encoded)
const lightFaviconSvg = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="pineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#2d5016"/>
      <stop offset="100%" style="stop-color:#1a3409"/>
    </linearGradient>
  </defs>
  <!-- Pine tree -->
  <polygon points="16,2 8,12 11,12 6,20 10,20 4,28 28,28 22,20 26,20 21,12 24,12" fill="url(#pineGrad)"/>
  <!-- Tree trunk -->
  <rect x="14" y="28" width="4" height="3" fill="#5c4033"/>
</svg>
`)}`;

export function DynamicFavicon() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Remove existing favicons
    const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
    existingFavicons.forEach(favicon => favicon.remove());

    // Create new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    
    if (isDarkMode) {
      // Dark mode: use skull icon
      link.type = 'image/png';
      link.href = '/icons/skull.png';
    } else {
      // Light mode: use pine tree SVG
      link.type = 'image/svg+xml';
      link.href = lightFaviconSvg;
    }
    
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [isDarkMode]);

  return null;
}
