# Tech Stack & Build System

## Framework
- **Next.js 16** with App Router
- **React 19** with client components (`'use client'` directive)

## Styling
- **Tailwind CSS 4** with PostCSS
- Custom CSS variables for fonts (Crimson Text serif, Space Grotesk sans)
- Custom color palette: `pine-*`, `gold-*`, `cabin-*`

## Key Libraries
- **framer-motion**: All animations, transitions, and gesture handling
- **lucide-react**: Icon components

## Project Patterns
- React Context for global state (ThemeProvider, AudioProvider, EscapeProvider)
- Custom hooks in `components/hooks/` for reusable logic
- Content data centralized in `data/content.js`
- Static assets in `public/` (images, sounds, music, icons)

## Commands
```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Path Aliases
- `@/` maps to project root (configured in jsconfig.json)

## Audio Assets
- Background music: `/public/music/`
- Sound effects: `/public/sounds/` (whispers, creaks, jumpscare, heartbeat, etc.)
