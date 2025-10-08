import { useEffect, useRef, useState } from 'react'
import './App.css'
import videoSrc from './assets/back.mov'
import backImg from './assets/back.png'
import Terminal from './components/Terminal'
import Hero from './components/Hero'
import Game from './components/Game'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import StaggeredMenu from './components/StaggeredMenu'
import fabLogo from './assets/fab.png'

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '#home' },
  { label: 'About', ariaLabel: 'Learn about me', link: '#about' },
  { label: 'Projects', ariaLabel: 'View my projects', link: '#projects' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '#contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://x.com/SezFabian' },
  { label: 'GitHub', link: 'https://github.com/sezfabian' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/cheruiyot-fabian-4b9542142/' }
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const zoomRef = useRef(3)

  // Detect system theme preference
  const getSystemTheme = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [isDark, setIsDark] = useState(getSystemTheme())
  const [showGame, setShowGame] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleThemeChange)
    return () => mediaQuery.removeEventListener('change', handleThemeChange)
  }, [])

  // Track window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = ' .:-=+*#%@'.split('')
    const fontSize = isDark ? 8 : 4
    const padding = 200
    const cols = Math.floor((canvas.width + padding * 2) / fontSize)
    const rows = Math.floor((canvas.height + padding * 2) / fontSize)

    const handleMouseMove = (e: MouseEvent) => {
      // Only update mouse position when game is not active
      if (!showGame) {
        mouseRef.current = {
          x: -(e.clientX / window.innerWidth - 0.9) * 100,
          y: -(e.clientY / window.innerHeight - 0.9) * 100
        }
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Update zoom based on scroll position with auto reset
    let isResetting = false
    const handlePageScroll = () => {
      if (!showGame) {
        // Get total scrollable height
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        const scrollProgress = window.scrollY / maxScroll

        // Map scroll progress to zoom (3 at top, 2 at bottom)
        const newZoom = 3 - (scrollProgress * 2)
        const clampedZoom = Math.max(2, Math.min(3, newZoom))

        zoomRef.current = clampedZoom

        // Update URL hash based on visible section
        const sections = ['home', 'about', 'projects', 'contact']
        let currentSection = 'home'

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            // Check if section is in viewport (top of section is within top 40% of viewport)
            if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 0) {
              currentSection = section
            }
          }
        }

        // Update hash without triggering scroll
        if (window.location.hash !== `#${currentSection}`) {
          history.replaceState(null, '', `#${currentSection}`)
        }

        // Auto reset zoom when reaching bottom (without scrolling)
        if (scrollProgress >= 0.99 && !isResetting) {
          isResetting = true
          setTimeout(() => {
            // Smoothly reset zoom back to 3
            const resetInterval = setInterval(() => {
              if (zoomRef.current < 3) {
                zoomRef.current += 0.05
              } else {
                zoomRef.current = 3
                clearInterval(resetInterval)
                isResetting = false
              }
            }, 16)
          }, 500)
        }
      }
    }

    window.addEventListener('scroll', handlePageScroll, { passive: true })
    handlePageScroll() // Initial call

    // Load static background image
    const backImage = new Image()
    backImage.src = backImg
    let backImageLoaded = false
    backImage.onload = () => {
      backImageLoaded = true
    }

    // Play video only when game is not active
    if (!showGame) {
      video.play()
    } else {
      video.pause()
    }

    const videoCanvas = document.createElement('canvas')
    const videoCtx = videoCanvas.getContext('2d')
    if (!videoCtx) return

    let animationId: number

    const renderFrame = () => {
      // Use back.png when game is open, video when game is closed
      if (showGame && backImageLoaded) {
        // Render static image as ASCII
        videoCanvas.width = cols
        videoCanvas.height = rows
        videoCtx.drawImage(backImage, 0, 0, videoCanvas.width, videoCanvas.height)
        const imageData = videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

        ctx.fillStyle = isDark ? '#000' : '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const pixelIndex = (j * cols + i) * 4
            const r = imageData.data[pixelIndex]
            const g = imageData.data[pixelIndex + 1]
            const b = imageData.data[pixelIndex + 2]
            const brightness = (r + g + b) / 3

            const zoom = zoomRef.current
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            const baseX = (i * fontSize) - padding + mouseRef.current.x
            const baseY = (j * fontSize) - padding + mouseRef.current.y

            const x = centerX + (baseX - centerX) * zoom
            const y = centerY + (baseY - centerY) * zoom

            const charIndex = Math.floor((brightness / 255) * (chars.length - 1))
            const char = chars[charIndex]

            if (isDark) {
              ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, ${brightness * 0.6}, 0.8)`
            } else {
              const inverted = 255 - brightness
              ctx.fillStyle = `rgba(${inverted * 0.4}, ${inverted * 0.3}, ${inverted * 0.5}, 0.8)`
            }
            ctx.fillText(char, x, y)
          }
        }
      } else if (video.readyState === video.HAVE_ENOUGH_DATA && !showGame) {
        // Render video as ASCII when game is not open
        videoCanvas.width = cols
        videoCanvas.height = rows
        videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height)
        const imageData = videoCtx.getImageData(0, 0, videoCanvas.width, videoCanvas.height)

        ctx.fillStyle = isDark ? '#000' : '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = `${fontSize}px monospace`

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const pixelIndex = (j * cols + i) * 4
            const r = imageData.data[pixelIndex]
            const g = imageData.data[pixelIndex + 1]
            const b = imageData.data[pixelIndex + 2]
            const brightness = (r + g + b) / 3

            const zoom = zoomRef.current
            const centerX = canvas.width / 2
            const centerY = canvas.height / 2

            const baseX = (i * fontSize) - padding + mouseRef.current.x
            const baseY = (j * fontSize) - padding + mouseRef.current.y

            const x = centerX + (baseX - centerX) * zoom
            const y = centerY + (baseY - centerY) * zoom

            const charIndex = Math.floor((brightness / 255) * (chars.length - 1))
            const char = chars[charIndex]

            if (isDark) {
              ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, ${brightness * 0.6}, 0.8)`
            } else {
              const inverted = 255 - brightness
              ctx.fillStyle = `rgba(${inverted * 0.4}, ${inverted * 0.3}, ${inverted * 0.5}, 0.8)`
            }
            ctx.fillText(char, x, y)
          }
        }
      }
    }

    const animate = () => {
      renderFrame()
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handlePageScroll)
      cancelAnimationFrame(animationId)
    }
  }, [isDark, windowSize, showGame])

  // Set CSS variable on root for gradients
  useEffect(() => {
    document.documentElement.style.setProperty('--bg-color', isDark ? '#000' : '#fff')
  }, [isDark])

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', margin: 0 }}>
      <video
        ref={videoRef}
        src={videoSrc}
        loop
        muted
        style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundColor: isDark ? '#000' : '#fff',
          pointerEvents: 'none'
        }}
      />
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor={isDark ? '#fff' : '#000'}
        openMenuButtonColor={isDark ? '#fff' : '#000'}
        changeMenuColorOnOpen={false}
        colors={isDark ? ['#1a1a1a', '#2a2a2a'] : ['#e0e0e0', '#f0f0f0']}
        logoUrl={fabLogo}
        accentColor={isDark ? '#0f0' : '#00a'}
        isFixed={true}
        onThemeToggle={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <main style={{ position: 'relative', zIndex: 10 }}>
        {!showGame ? (
          <>
            <Hero isDark={isDark} />
            <About isDark={isDark} />
            <Projects isDark={isDark} />
            <Contact isDark={isDark} />
          </>
        ) : (
          <Game isDark={isDark} onClose={() => setShowGame(false)} />
        )}
      </main>

      <Terminal isDark={isDark} onGameLaunch={() => setShowGame(true)} />
    </div>
  )
}

export default App
