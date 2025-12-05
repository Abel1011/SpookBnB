# Requirements Document

## Introduction

SpookBnB is a horror-themed vacation rental landing page that transforms from a professional Airbnb-style interface into a terrifying escape room experience when the user activates "Dark Mode." The dark mode features a flashlight mechanic controlled by the cursor, revealing disturbing content and interactive puzzles that players must solve to "escape." The application is a frontend-only Next.js application with Tailwind CSS and Framer Motion.

## Glossary

- **SpookBnB**: The vacation rental landing page application
- **Light Mode**: The normal, professional vacation rental interface
- **Dark Mode**: The horror experience with flashlight mechanic and escape puzzles
- **Flashlight Effect**: A circular illuminated area following the cursor
- **Mode Toggle**: The sun/moon icon that switches between modes
- **Fragment**: One of four puzzle pieces players must complete to escape
- **Escape System**: The puzzle mechanic requiring completion of all fragments
- **Jumpscare**: Sudden scary visual/audio effects triggered by interactions

## Requirements

### Requirement 1: Mode Toggle System

**User Story:** As a user, I want to toggle between light and dark modes to experience both the normal landing page and the horror experience.

#### Acceptance Criteria

1. WHEN the user views the header THEN the application SHALL display a sun/moon toggle icon
2. WHEN the user clicks the mode toggle THEN the application SHALL animate the transition with a terrifying visual effect (DarkModeTransition)
3. WHEN the user toggles to Dark Mode THEN the application SHALL play ambient horror audio
4. WHEN the user changes the mode THEN the application SHALL persist the state to localStorage
5. WHEN the user returns to the page THEN the application SHALL restore the previously selected mode

### Requirement 2: Light Mode Landing Page

**User Story:** As a user, I want to see a professional vacation rental landing page in light mode.

#### Acceptance Criteria

1. WHEN in Light Mode THEN the application SHALL display a clean, modern design with warm earth tones
2. WHEN viewing the hero section THEN the application SHALL display a cabin image with welcoming headline and reservation button
3. WHEN viewing the Rooms section THEN the application SHALL display 6 room cards with features and descriptions
4. WHEN viewing the Features section THEN the application SHALL display 4 amenity cards (WiFi, Pool, Fireplace, Bedroom)
5. WHEN viewing the Reviews section THEN the application SHALL display scrolling testimonials with 5-star ratings
6. WHEN viewing the CTA section THEN the application SHALL display pricing and "Reserve Your Stay" button
7. WHEN viewing the NightView section THEN the application SHALL tease the dark mode experience

### Requirement 3: Dark Mode Horror Experience

**User Story:** As a user, I want to experience a horror transformation with interactive escape puzzles.

#### Acceptance Criteria

1. WHEN Dark Mode is activated THEN the application SHALL transform the cursor into a flashlight effect
2. WHEN the user moves the mouse THEN the flashlight SHALL track cursor movement smoothly
3. WHEN Dark Mode is active THEN content outside the flashlight radius SHALL be completely dark
4. WHEN viewing sections in Dark Mode THEN the application SHALL display terror variants of all content
5. WHEN in Dark Mode THEN the application SHALL reveal hidden horror elements (handprints, symbols, text)
6. WHEN clicking hidden horror icons THEN the application SHALL trigger jumpscare effects with sound
7. WHEN in Dark Mode THEN the NightView section SHALL be hidden

### Requirement 4: Escape Room Puzzle System

**User Story:** As a user, I want to solve puzzles to "escape" the haunted cabin.

#### Acceptance Criteria

1. WHEN in Dark Mode THEN the Features section SHALL display 4 cryptic clue cards (Fragments I-IV)
2. WHEN viewing Fragment I THEN the user SHALL collect letters (L-I-G-H-T) from marked reviews to complete it
3. WHEN viewing Fragment II THEN the user SHALL count hidden eyes (7) in the Bathroom room card
4. WHEN viewing Fragment III THEN the user SHALL decipher the glitching contract text in the Reservation Modal
5. WHEN Fragments I-III are complete THEN Fragment IV SHALL become active in the CTA section
6. WHEN completing Fragment IV THEN the application SHALL trigger the escape sequence and Victory Modal
7. WHEN escaped THEN the application SHALL switch to Light Mode and display celebration effects

### Requirement 5: Flashlight Mechanics

**User Story:** As a user, I want the flashlight effect to feel realistic and expand as I progress.

#### Acceptance Criteria

1. WHEN the flashlight follows the cursor THEN the application SHALL apply smooth tracking with easing
2. WHEN the flashlight illuminates content THEN the application SHALL apply a gradient edge for realistic falloff
3. WHEN the user completes fragments THEN the flashlight radius SHALL increase (50px per fragment)
4. WHEN in debug mode (?debug=true) THEN the flashlight overlay SHALL be disabled

### Requirement 6: Audio System

**User Story:** As a user, I want ambient audio and sound effects to enhance the horror atmosphere.

#### Acceptance Criteria

1. WHEN toggling to Dark Mode THEN the application SHALL play ambient horror drone audio
2. WHEN toggling to Light Mode THEN the application SHALL stop ambient audio
3. WHEN triggering jumpscares THEN the application SHALL play jumpscare sound effects
4. WHEN clicking horror icons THEN the application SHALL play growl sounds
5. WHEN finding puzzle elements THEN the application SHALL play click/bell sounds
6. WHEN whispers appear THEN the application SHALL play whisper sounds
7. WHEN audio is blocked by browser THEN the application SHALL handle errors gracefully

### Requirement 7: Interactive Horror Elements

**User Story:** As a user, I want interactive horror elements that respond to my actions.

#### Acceptance Criteria

1. WHEN clicking "Book Now" in Dark Mode THEN the application SHALL trigger a jumpscare with random scary message
2. WHEN clicking "Try to Escape" without completing puzzles THEN the application SHALL trigger a scare
3. WHEN clicking "Accept Fate" THEN the application SHALL trigger a menacing response
4. WHEN attempting to call THEN the application SHALL show progressively creepy "no signal" messages
5. WHEN the Reservation Modal opens in Dark Mode THEN the application SHALL show glitching contract text

### Requirement 8: Responsive Design

**User Story:** As a user, I want the application to work on both mobile and desktop devices.

#### Acceptance Criteria

1. WHEN on desktop THEN the application SHALL display optimized layouts for larger screens
2. WHEN on mobile THEN the application SHALL display optimized layouts with touch interactions
3. WHEN on mobile in Dark Mode THEN the flashlight SHALL respond to touch events
4. WHEN the viewport changes THEN the application SHALL adapt responsively
