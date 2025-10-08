# Portfolio Website

A modern, interactive portfolio website built with React, TypeScript, and Vite. Features an ASCII video background, interactive terminal, and a fun jump game.

## 🚀 Features

### Visual Effects
- **ASCII Video Background**: Real-time video converted to ASCII art with mouse tracking and scroll-based zoom
- **Theme Support**: Dark and light modes with system preference detection
- **Responsive Design**: Optimized for all screen sizes (mobile, tablet, desktop)

### Interactive Components

#### Terminal Interface
- Navigate sections using terminal commands (`cd`, `ls`, `cat`)
- View contact information, experience, and CV
- Browser fingerprinting education (`about -me`)
- Launch the jump game with `game` command

#### Jump Game: Alien vs Ice
- Side-scrolling platformer with double-jump mechanics
- 10 progressive difficulty levels
- High score persistence
- Mobile-friendly touch controls
- Adaptive physics and collision detection

#### Staggered Menu
- Smooth animations with GSAP
- Adaptive width based on screen size
- Social media links integration

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Animations**: GSAP (GreenSock Animation Platform)
- **Styling**: CSS with responsive media queries
- **GIF Processing**: gifuct-js for animated sprites

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/sezfabian/portfolio.git

# Navigate to project directory
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

### Development
```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Terminal Commands
- `help` - Display available commands
- `ls [directory]` - List directory contents
- `cd <directory>` - Navigate to a section (home, about, projects, contact)
- `cat <file>` - View file contents (cv.pdf, info.txt, experience.txt)
- `about -me` - See what data websites can collect from your browser
- `game` - Launch the Alien vs Ice jump game
- `clear` - Clear terminal screen

### Game Controls
- **Desktop**: SPACE or Arrow Up to jump
- **Mobile**: Tap the screen or use the "TAP TO JUMP" button
- **Restart**: Press R or tap when game over

## 📱 Responsive Breakpoints

- **Small screens**: ≤1010px (Mobile/Tablet)
  - Full-width menu (≤600px)
  - Half-width menu (601-1010px)
  - Compact terminal
  - Touch-friendly game controls

- **Large screens**: >1010px (Desktop)
  - Fixed-width menu panel
  - Full-featured terminal
  - Keyboard controls

## 🎨 Color Scheme

### Dark Mode
- Primary: `#0f0` (Bright Green)
- Background: `#000` (Black)
- Text: `#fff` (White)

### Light Mode
- Primary: `#00a` (Blue)
- Background: `#fff` (White)
- Text: `#000` (Black)

## 📁 Project Structure

```
src/
├── components/
│   ├── About.tsx/css         # About section
│   ├── Contact.tsx/css       # Contact section
│   ├── Game.tsx/css          # Jump game component
│   ├── Hero.tsx/css          # Landing section
│   ├── Projects.tsx/css      # Projects showcase
│   ├── StaggeredMenu.tsx/css # Navigation menu
│   └── Terminal.tsx/css      # Terminal interface
├── assets/
│   ├── alien.gif             # Player sprite
│   ├── ice.png               # Obstacle sprite
│   ├── back.mov              # Background video
│   ├── back.png              # Game background
│   └── cv.pdf                # Resume/CV
├── App.tsx                   # Main application component
└── main.tsx                  # Application entry point
```

## 🎯 Key Features Implementation

### ASCII Video Rendering
- Canvas-based real-time video processing
- Character mapping based on pixel brightness
- Mouse tracking for interactive pan effect
- Scroll-based zoom with smooth transitions

### Game Mechanics
- Physics-based movement with gravity and jump strength
- Progressive difficulty with 10 levels
- Dynamic obstacle spawning patterns
- Collision detection with level-based forgiveness
- Score persistence using localStorage

### Menu System
- GSAP-powered animations with staggered reveals
- Layered background transitions
- Responsive width calculations
- Touch and keyboard navigation support

## 🌐 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Fabian Cheruiyot**
- Twitter: [@SezFabian](https://x.com/SezFabian)
- GitHub: [@sezfabian](https://github.com/sezfabian)
- LinkedIn: [Fabian Cheruiyot](https://www.linkedin.com/in/cheruiyot-fabian-4b9542142/)

## 🙏 Acknowledgments

- ASCII art inspiration from classic terminal effects
- GSAP for smooth animations
- React and Vite communities
