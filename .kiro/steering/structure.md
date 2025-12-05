# Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Main landing page
│   ├── globals.css        # Global styles & Tailwind
│   └── favicon.ico
│
├── components/
│   ├── effects/           # Visual effects (dark mode specific)
│   │   ├── CursorTrail.jsx
│   │   ├── DarkModeAudio.jsx
│   │   ├── DarkModeTransition.jsx
│   │   ├── FlashlightOverlay.jsx
│   │   ├── GhostText.jsx
│   │   └── HiddenElements.jsx
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── useMousePosition.js
│   │   ├── useReservationPersistence.js
│   │   └── useSoundEffects.js
│   │
│   ├── layout/            # Header, Footer
│   │
│   ├── providers/         # React Context providers
│   │   ├── AudioProvider.jsx
│   │   ├── EscapeProvider.jsx
│   │   └── ThemeProvider.jsx
│   │
│   ├── sections/          # Page sections
│   │   ├── CTA.jsx
│   │   ├── Features.jsx
│   │   ├── Hero.jsx
│   │   ├── NightView.jsx
│   │   ├── Reviews.jsx
│   │   └── Rooms.jsx
│   │
│   └── ui/                # Reusable UI components
│       ├── FeatureCard.jsx
│       ├── FooterModals.jsx
│       ├── GalleryModal.jsx
│       ├── ModeToggle.jsx
│       ├── ReservationModal.jsx
│       ├── ReviewCard.jsx
│       └── VictoryModal.jsx
│
├── data/
│   └── content.js         # All text content (light/dark variants)
│
├── public/
│   ├── icons/             # Horror icons (skull, doll, etc.)
│   ├── music/             # Background audio
│   ├── sounds/            # Sound effects
│   └── *.png              # Room and cabin images
│
└── scripts/
    └── generateSounds.js  # Audio generation utility
```

## Component Conventions
- Sections are full-width page blocks rendered in `page.js`
- UI components are reusable, receive props for light/dark content
- Effects components are conditionally rendered based on `isDarkMode`
- All components use `'use client'` when using hooks or browser APIs
