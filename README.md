# 🎃 SpookBnB - Kiroween Hackathon 2025 👻

> *"Your Perfect Mountain Getaway... or is it?"*

SpookBnB is a vacation rental landing page with a dual-mode experience that transforms a luxury cabin website into an interactive horror escape room.

## 🦇 About This Project

Built for the **Kiroween Hackathon** — Kiro's first-ever Halloween hackathon. SpookBnB demonstrates how Kiro can help bring creative, monstrous ideas to life. In this case: a UI that will give your users nightmares.

### The Dual Experience

- **☀️ Light Mode**: A welcoming, luxury cabin rental with warm aesthetics
- **🌙 Dark Mode**: A terrifying horror experience with an escape room puzzle hidden within

## ✨ Features

- 🔦 **Flashlight Effect**: In dark mode, your cursor becomes a flashlight revealing content
- 👻 **Ghost Text**: Messages that appear and vanish mysteriously
- 🎵 **Ambient Horror Audio**: Whispers, creaks, heartbeats, and jump scares
- 🧩 **Escape Room Puzzle**: Four fragments to collect and escape the cabin
- 💀 **Transforming Reviews**: Happy testimonials become haunting messages
- 🎬 **Dramatic Transitions**: Terrifying animations when toggling modes

## 🔮 Can You Escape?

The cabin holds four soul fragments. Those who gather them all may find a way out...

**Fragment I** — *"The voices of the lost speak in broken tongues..."*
> Some guests left more than reviews. Look for those marked by fate. Their final screams spell something... illuminating.

**Fragment II** — *"Eyes watch from the shadows..."*
> In the room where water cleanses, darkness reveals watchers. How many observe your vulnerability?

**Fragment III** — *"Words flicker between truth and chaos..."*
> The contract corrupts. Read between the glitches. What message hides in the static?

**Fragment IV** — *"Where hope seems lost, the light awaits..."*
> Only when the first three fragments are bound can the final path reveal itself. Scroll to where they say there is no escape.

## 🐛 Debug Mode

SpookBnB includes a debug mode to help you explore the dark mode experience without the flashlight effect obscuring the content.

### How to Enable

Add `?debug=true` to the URL:
```
http://localhost:3000?debug=true
```

### What It Does

- **Disables the flashlight overlay**: See the entire dark mode layout without cursor restrictions
- **Shows a debug indicator**: A red badge appears in the top-left corner confirming debug mode is active
- **Reveals all hidden elements**: Perfect for testing, development, or exploring all the horror details
- **Accessible from Victory Modal**: After escaping, click the "Debug Mode" button to reload with debug enabled

### Use Cases

- 🎨 **Design Review**: Inspect the full dark mode aesthetic without the flashlight limitation
- 🧪 **Testing**: Verify all horror elements, ghost text, and hidden clues are working
- 🔍 **Fragment Hunting**: Find all escape room clues without the challenge
- 🛠️ **Development**: Build and debug dark mode features more efficiently

## 🛠️ Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** for animations
- **Lucide React** for icons

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) and toggle dark mode... if you dare 🦇

## 🎃 Built with Kiro

This project showcases Kiro's features:
- **Specs**: Structured design with requirements, design docs, and tasks
- **Steering**: Custom rules to guide development patterns
- **Chat**: Natural conversation for brainstorming and implementation

---

*"The doors locked behind you. The windows show only darkness. You are not alone."*

**git commit to the darkness** 🖤
