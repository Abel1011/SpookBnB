# Implementation Plan

## Phase 1: Project Foundation

- [x] 1. Set up project foundation and providers

  - [x] 1.1 Configure custom typography in globals.css
    - Added Google Fonts import for Crimson Text (serif) and Space Grotesk (sans-serif)
    - Defined CSS custom properties for font families
    - _Requirements: 7.1_

  - [x] 1.2 Create ThemeProvider with context and localStorage persistence
    - Implemented ThemeContext with isDarkMode, toggleMode, isTransitioning states
    - Added localStorage read/write for mode persistence
    - Implemented transition timing with DarkModeTransition effect
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [x] 1.3 Create AudioProvider with context for sound management
    - Implemented AudioContext with ambient audio control
    - Handles browser autoplay restrictions gracefully
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 1.4 Create EscapeProvider for puzzle state management
    - Tracks fragment completion (fragment1-4Complete)
    - Manages collected letters for Fragment I
    - Persists escape progress
    - _Requirements: 4.1, 4.6_

  - [x] 1.5 Update app layout to wrap with providers
    - Wrapped application with ThemeProvider, AudioProvider, and EscapeProvider
    - _Requirements: 1.1_

## Phase 2: Flashlight Effect System

- [x] 2. Implement flashlight effect system

  - [x] 2.1 Create useMousePosition hook for cursor/touch tracking
    - Tracks mouse position with smooth interpolation
    - Supports touch events for mobile devices
    - Clamps positions to viewport boundaries
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 2.2 Create FlashlightOverlay component
    - Implemented full-screen overlay with CSS mask-image radial gradient
    - Applied gradient edge for realistic light falloff
    - Dynamic radius expansion based on fragments completed (+50px per fragment)
    - Debug mode support (?debug=true)
    - _Requirements: 3.1, 3.2, 3.3, 5.1, 5.2, 5.3_

  - [x] 2.3 Create CursorTrail component for subtle trail effect
    - Tracks previous cursor positions
    - Renders fading trail elements behind flashlight
    - _Requirements: 5.1_

  - [x] 2.4 Create DarkModeTransition component
    - Terrifying visual transition animation when toggling modes
    - _Requirements: 1.2_

## Phase 3: Header and Navigation

- [x] 3. Build Header with mode toggle

  - [x] 3.1 Create ModeToggle component with sun/moon icon
    - Displays sun icon in light mode, moon icon in dark mode
    - Animated icon transition on toggle
    - Triggers mode change
    - _Requirements: 1.1, 1.2_

  - [x] 3.2 Create Header component with navigation and toggle
    - Positioned toggle prominently in header
    - SpookBnB logo with TreePine icon
    - Navigation links that change in dark mode (Rooms → The Chambers, etc.)
    - "Book Now" button triggers jumpscare in dark mode
    - Mobile menu support
    - _Requirements: 1.1, 7.1_

## Phase 4: Content Sections

- [x] 4. Implement dual-content sections

  - [x] 4.1 Create content data files with light/dark variants
    - Defined heroContent with light and dark images/text
    - Defined features array with terror variants
    - Defined darkClues array for puzzle riddles
    - Defined reviews with distress message variants and clue letters
    - _Requirements: 2.2, 2.3, 2.4, 3.4, 3.5, 3.6_

  - [x] 4.2 Create Hero section component
    - Displays bright cabin image in light mode
    - Displays corrupted image with glitch effects in dark mode
    - Progressive text corruption effect
    - Exit scare button functionality
    - System message panel with clue navigation
    - _Requirements: 2.2, 3.4_

  - [x] 4.3 Create Rooms section with 6 room cards
    - Master Suite, Living Room, Kitchen, Bathroom, Deck, Basement
    - Each room has light/dark variants with features
    - Bathroom card contains Fragment II puzzle (hidden eyes)
    - MirrorRoomOverlay component for eye-counting puzzle
    - _Requirements: 2.3, 4.2_

  - [x] 4.4 Create Features section with amenity/clue cards
    - Light mode: 4 amenity cards (WiFi, Pool, Fireplace, Bedroom)
    - Dark mode: 4 cryptic clue cards (Fragments I-IV)
    - ClueCard component with riddle reveal mechanics
    - TV static shuffle effect every 30 seconds
    - Letter collection progress display for Fragment I
    - _Requirements: 2.3, 3.5, 4.1, 4.2_

  - [x] 4.5 Create Reviews section with scrolling testimonials
    - 15 reviews with light/dark variants
    - 3-column infinite scroll layout
    - 5 reviews contain clue letters (L-I-G-H-T) for Fragment I
    - GhostText and SoulWisps effects in dark mode
    - Whisper overlay with sound effects
    - _Requirements: 2.4, 3.6, 4.2_

  - [x] 4.6 Create ReviewCard component with dual content
    - Displays star rating (5 stars light, 0 in dark)
    - Switches author and text based on mode
    - Clickable clue letters that trigger collection
    - _Requirements: 2.4, 3.6, 4.2_

  - [x] 4.7 Create NightView section (light mode only)
    - Teases the dark mode experience
    - Hidden when dark mode is active
    - _Requirements: 2.7_

  - [x] 4.8 Create CTA section with escape portal
    - Light mode: Pricing card with "Reserve Your Stay" button
    - Dark mode: Horror text effects, "Try to Escape" and "Accept Fate" buttons
    - Fragment IV escape portal (appears when I-III complete)
    - Multi-phase escape sequence animation
    - Victory modal trigger on successful escape
    - _Requirements: 2.5, 2.6, 3.7, 4.4, 4.5, 4.6_

## Phase 5: UI Components

- [x] 5. Build UI components

  - [x] 5.1 Create FeatureCard component
    - Accepts light and dark title/description props
    - Displays appropriate variant based on mode
    - Includes icon for each feature
    - _Requirements: 2.3, 3.5_

  - [x] 5.2 Create ReservationModal component
    - Booking form in light mode
    - Glitching contract text in dark mode (Fragment III puzzle)
    - "STAY FOREVER" hidden message reveal
    - Persistence hook for creepy "it remembers" effect
    - _Requirements: 4.3_

  - [x] 5.3 Create GalleryModal component
    - Image gallery for property photos
    - _Requirements: 2.2_

  - [x] 5.4 Create VictoryModal component
    - Celebration effects on successful escape
    - Confetti and light burst animations
    - _Requirements: 4.6_

  - [x] 5.5 Create FooterModals component
    - About, Contact, Terms, Privacy modals
    - _Requirements: 2.6_

## Phase 6: Horror Effects

- [x] 6. Add hidden horror elements

  - [x] 6.1 Create HiddenElements component
    - Renders horror icons (hand, skull, doll, knife, witch, book)
    - Dynamic repositioning of icons
    - Static text elements (HELP US, RUN, DON'T LOOK, etc.)
    - Symbols, scratches, and blood drip effects
    - Clickable icons trigger jumpscares with sound
    - Random jumpscare flashes
    - _Requirements: 3.5, 3.6, 7.1, 7.2, 7.3_

  - [x] 6.2 Create GhostText component
    - Ghostly text fade effects for Reviews section
    - SoulWisps rising animation
    - _Requirements: 3.4_

  - [x] 6.3 Create DarkModeAudio component
    - Manages ambient audio playback
    - Syncs with dark mode state
    - _Requirements: 6.1, 6.2_

## Phase 7: Sound Effects

- [x] 7. Implement audio system

  - [x] 7.1 Create useSoundEffects hook
    - playJumpscare() - Sudden scare sound
    - playGrowl() - Menacing growl
    - playWhisper() - Ghostly whisper
    - playCreak() - Door creak
    - playClick() - UI click
    - playBell() - Success bell
    - playBuzz() - Error buzz
    - playStatic() - TV static
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7_

  - [x] 7.2 Add audio files to public folder
    - Added ambient horror drone
    - Added all sound effect files
    - _Requirements: 6.1, 6.2_

## Phase 8: Footer and Responsive Design

- [x] 8. Build Footer component

  - [x] 8.1 Create Footer with standard links
    - Includes About, Contact, Terms, Privacy links
    - Consistent styling in both modes
    - Modal triggers for each link
    - _Requirements: 2.6_

- [x] 9. Implement responsive design

  - [x] 9.1 Add responsive breakpoints and mobile styles
    - Optimized header for mobile with hamburger menu
    - Stacked layouts on mobile
    - Adjusted sections for smaller screens
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 9.2 Ensure touch events work for flashlight on mobile
    - Touch tracking in FlashlightOverlay
    - Smooth tracking on touch devices
    - _Requirements: 8.3_

## Phase 9: Final Assembly

- [x] 10. Assemble main page

  - [x] 10.1 Compose all sections in page.js
    - Imported and arranged Header, Hero, Rooms, Features, NightView, Reviews, CTA, Footer
    - Added FlashlightOverlay, HiddenElements, CursorTrail
    - Added DarkModeTransition and DarkModeAudio
    - Ambient particles for light mode
    - _Requirements: 2.1_

- [x] 11. Final verification
  - All sections implemented with dual content
  - Escape puzzle system fully functional
  - Audio system working with all sound effects
  - Responsive design complete
  - Horror effects and jumpscares implemented
