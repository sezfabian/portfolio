import { useState, useRef, useEffect } from 'react'
import type { ReactElement } from 'react'
import './Terminal.css'
import cvPdf from '../assets/Fabian_CV.pdf'
import Glitch from './Glitch'

interface TerminalProps {
  isDark: boolean
  onGameLaunch: () => void
  isGameActive?: boolean
  showPDF: boolean
  setShowPDF: (show: boolean) => void
  isMaximized: boolean
  setIsMaximized: (maximized: boolean) => void
  isMinimized: boolean
  setIsMinimized: (minimized: boolean) => void
}

interface DirectoryStructure {
  [key: string]: string[] | DirectoryStructure
}

const fileSystem: DirectoryStructure = {
  home: ['about', 'projects', 'education', 'contact', 'cv.pdf'],
  about: ['skills', 'experience.txt', 'bio.txt'],
  projects: ['project1.md', 'project2.md', 'project3.md'],
  education: ['degrees.txt', 'certifications.txt'],
  skills: ['frontend.txt', 'backend.txt', 'tools.txt'],
  contact: ['info.txt']
}

const getBrowserData = async () => {
  const nav = navigator as any

  // Get plugins info
  const plugins = Array.from(nav.plugins || []).map((p: any) => p.name).join(', ') || 'None detected'

  // Get canvas fingerprint indication
  const canvas = document.createElement('canvas')
  const canvasSupported = !!canvas.getContext

  // Get WebGL info
  let webglVendor = 'Not available'
  let webglRenderer = 'Not available'
  try {
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (gl) {
      const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        webglVendor = (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        webglRenderer = (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
  } catch (e) {
    // WebGL not available
  }

  // Get IP and geolocation data
  let ipData = {
    ip: 'Fetching...',
    city: 'Fetching...',
    region: 'Fetching...',
    country: 'Fetching...',
    loc: 'Fetching...',
    org: 'Fetching...',
    postal: 'Fetching...'
  }

  try {
    const response = await fetch('https://ipapi.co/json/')
    if (response.ok) {
      const data = await response.json()
      ipData = {
        ip: data.ip || 'Not available',
        city: data.city || 'Not available',
        region: data.region || 'Not available',
        country: data.country_name || 'Not available',
        loc: data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : 'Not available',
        org: data.org || 'Not available',
        postal: data.postal || 'Not available'
      }
    }
  } catch (e) {
    ipData = {
      ip: 'Failed to fetch',
      city: 'Failed to fetch',
      region: 'Failed to fetch',
      country: 'Failed to fetch',
      loc: 'Failed to fetch',
      org: 'Failed to fetch',
      postal: 'Failed to fetch'
    }
  }

  return {
    ip: ipData,
    browser: {
      userAgent: nav.userAgent,
      appVersion: nav.appVersion,
      language: nav.language,
      languages: nav.languages?.join(', ') || nav.language,
      cookiesEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack || 'Not set',
      onLine: nav.onLine,
      platform: nav.platform,
      vendor: nav.vendor,
      productSub: nav.productSub,
      plugins: plugins
    },
    screen: {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || 'Not available'
    },
    device: {
      cores: nav.hardwareConcurrency || 'Not available',
      memory: nav.deviceMemory ? `${nav.deviceMemory}GB` : 'Not available',
      maxTouchPoints: nav.maxTouchPoints,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`,
      battery: nav.getBattery ? 'API available' : 'Not available'
    },
    connection: {
      type: nav.connection?.effectiveType || 'Not available',
      downlink: nav.connection?.downlink ? `${nav.connection.downlink} Mbps` : 'Not available',
      rtt: nav.connection?.rtt ? `${nav.connection.rtt}ms` : 'Not available',
      saveData: nav.connection?.saveData ? 'Enabled' : 'Disabled'
    },
    graphics: {
      canvas: canvasSupported ? 'Supported (fingerprinting possible)' : 'Not supported',
      webglVendor: webglVendor,
      webglRenderer: webglRenderer
    },
    features: {
      localStorage: typeof Storage !== 'undefined',
      sessionStorage: typeof Storage !== 'undefined',
      indexedDB: !!window.indexedDB,
      webWorkers: typeof Worker !== 'undefined',
      serviceWorker: 'serviceWorker' in nav,
      notifications: 'Notification' in window,
      geolocation: 'geolocation' in nav
    }
  }
}

const createCommands = (onGameLaunch: () => void, onOpenPDF?: () => void) => ({
  help: {
    description: 'Display available commands',
    usage: 'help [command]',
    execute: (args: string[]) => {
      if (args.length > 0) {
        const cmd = args[0]
        if (cmd in createCommands(onGameLaunch, onOpenPDF)) {
          return `${cmd}: ${createCommands(onGameLaunch, onOpenPDF)[cmd as keyof ReturnType<typeof createCommands>].description}\nUsage: ${createCommands(onGameLaunch, onOpenPDF)[cmd as keyof ReturnType<typeof createCommands>].usage}`
        }
        return `Command '${cmd}' not found. Type 'help' for available commands.`
      }
      return `Available commands:
  §CMD§ls§ [--help]      - List directory contents
  §CMD§cd§ [--help]      - Change directory
  §CMD§cat§ [--help]     - Display file contents
  §CMD§about§ [--help]   - Learn about browser data collection
  §CMD§game§             - Launch jump game
  §CMD§help§ [command]   - Show help for commands
  §CMD§clear§            - Clear terminal screen

Type 'command --help' for more information about a specific command.`
    }
  },
  game: {
    description: 'Launch the jump game',
    usage: 'game',
    execute: () => {
      onGameLaunch()
      return 'Launching game...'
    }
  },
  cat: {
    description: 'Display file contents',
    usage: 'cat <filename>',
    execute: (args: string[]) => {
      if (args.includes('--help')) {
        return `cat: Display file contents

Usage: cat <filename>

Options:
  --help    Display this help message

Examples:
  cat §FILE§cv.pdf§     Open CV PDF in viewer`
      }

      if (args.length === 0) {
        return '§ERROR§cat: missing file argument§. Type "cat --help" for usage.'
      }

      const filename = args[0]

      if (filename === 'cv.pdf') {
        if (onOpenPDF) {
          onOpenPDF()
          return 'Opening §FILE§CV§...'
        }
        return '§ERROR§Error: PDF viewer not available§'
      }

      if (filename === 'degrees.txt') {
        return `EDUCATION

Master of Science in Advanced Computing with Artificial Intelligence
University of Stirling | Stirling, Scotland | 2026
Focus: AI Engineering, Machine Learning, Deep Learning, Natural Language Processing

Bachelor of Science in Electrical and Electronics Engineering
University of Nairobi | Nairobi, Kenya | 2022`
      }

      if (filename === 'certifications.txt') {
        return `CERTIFICATIONS

AWS Cloud Practitioner
Amazon Web Services

ALX - Holberton School, Full-Stack Software Engineer
12-month intensive program covering system design, algorithms, and full-stack development`
      }

      if (filename === 'info.txt') {
        return `CONTACT INFORMATION

Location: Stirling, Scotland
Email:    cheruiyotfabian@gmail.com

LinkedIn: linkedin.com/in/cheruiyot-fabian-4b9542142
GitHub:   github.com/sezfabian

Feel free to reach out for collaborations, opportunities, or just to connect!`
      }

      if (filename === 'experience.txt') {
        return `Software Engineer, AI Training | Pareto AI | Stanford, California | January 2024 - August 2025
• Critically assessed algorithmic quality and functional integrity of AI-generated code
• Instrumental in boosting LLM accuracy in competitive programming from 30% to over 90% within one year
• Engineered and standardized structured rubrics and comprehensive training pathways for AI models
• Designed and developed in-house tools (AWS+FastAPI+React/Vue) optimizing contributor workflows
• Built gamified training/onboarding system and utilities for tracking tasks and managing submissions
• Recognized for exceptional quality and volume of AI training contributions

Full-Stack Software Engineer | Emmerce Ltd | Nairobi, Kenya | November 2023 - July 2024
• Defined and Led technical strategy, problem definition, and system architecture design for E-commerce and SaaS projects
• Engineered secure, scalable backend solutions (PostgreSQL, Django, FastAPI, Redis, REST APIs)
• Integrated critical third-party APIs: e-commerce (Amazon, Jumia), payments (Stripe, Mpesa, PesaPal), marketing (Brevo), ERP (SAPS)
• Designed responsive SaaS web-apps and dashboards in VueJS with focus on functionality and user experience
• Applied Test-Driven Development (TDD) with Pytest and comprehensive documentation (MkDocs)

Software Engineering Apprentice | ALX Africa | Nairobi, Kenya | October 2022 - October 2023
• Selected for rigorous 12-month program focusing on System Design, Data Structures & Algorithms
• Collaborated to build and deploy prototypes with founders under ALX Founders Program
• Developed custom C library and shell programs showcasing low-level systems expertise
• Cultivated leadership and soft skills through collaborative remote work with peers and mentors

Technical Assistant Manager & IT Systems Specialist | Value Chain Supplies | Eldoret, Kenya | February 2020 - April 2023
• Achieved 20% cost reduction by managing acquisition and maintenance of Retail Management Systems
• Developed e-commerce platform driving over 10% annual revenue growth
• Managed IT infrastructure and provided rapid technical support, minimizing downtime
• Led marketing campaigns contributing to 60% revenue growth in two years`
      }

      return `§ERROR§cat: ${filename}: No such file or directory§`
    }
  },
  about: {
    description: 'Learn about what websites can read from your browser',
    usage: 'about [-me|--help]',
    execute: async (args: string[]) => {
      if (args.includes('--help')) {
        return `about: Display information about browser data collection

Usage: about [option]

Options:
  -me       Show what data this website can read from your browser
  --help    Display this help message

This command educates users about browser fingerprinting and data collection.
Use 'about -me' to see what information websites can access about you.`
      }

      if (args.includes('-me')) {
        const data = await getBrowserData()
        return `What I know about you (Collected in Real-Time):

IP Address & Geolocation (No Permission Needed!):
  IP Address: ${data.ip.ip}
  City: ${data.ip.city}
  Region/State: ${data.ip.region}
  Country: ${data.ip.country}
  Postal Code: ${data.ip.postal}
  Coordinates: ${data.ip.loc}
  ISP/Organization: ${data.ip.org}

There is more:

Browser Information:
  User Agent: ${data.browser.userAgent}
  App Version: ${data.browser.appVersion}
  Platform: ${data.browser.platform}
  Vendor: ${data.browser.vendor}
  Language: ${data.browser.language}
  All Languages: ${data.browser.languages}
  Cookies Enabled: ${data.browser.cookiesEnabled}
  Do Not Track: ${data.browser.doNotTrack}
  Online Status: ${data.browser.onLine}
  Browser Plugins: ${data.browser.plugins.substring(0, 80)}${data.browser.plugins.length > 80 ? '...' : ''}

Screen & Display:
  Screen Size: ${data.screen.width}x${data.screen.height}px
  Available Size: ${data.screen.availWidth}x${data.screen.availHeight}px
  Color Depth: ${data.screen.colorDepth}-bit
  Pixel Depth: ${data.screen.pixelDepth}-bit
  Device Pixel Ratio: ${data.screen.pixelRatio}
  Orientation: ${data.screen.orientation}

Device Capabilities:
  CPU Cores: ${data.device.cores}
  Memory (RAM): ${data.device.memory}
  Max Touch Points: ${data.device.maxTouchPoints}
  Timezone: ${data.device.timezone}
  Timezone Offset: ${data.device.timezoneOffset}
  Battery API: ${data.device.battery}

Network Information:
  Connection Type: ${data.connection.type}
  Download Speed: ${data.connection.downlink}
  Round Trip Time: ${data.connection.rtt}
  Data Saver Mode: ${data.connection.saveData}

Graphics & Fingerprinting:
  Canvas: ${data.graphics.canvas}
  WebGL Vendor: ${data.graphics.webglVendor}
  WebGL Renderer: ${data.graphics.webglRenderer}

Available Features:
  Local Storage: ${data.features.localStorage ? 'Yes' : 'No'}
  Session Storage: ${data.features.sessionStorage ? 'Yes' : 'No'}
  IndexedDB: ${data.features.indexedDB ? 'Yes' : 'No'}
  Web Workers: ${data.features.webWorkers ? 'Yes' : 'No'}
  Service Worker: ${data.features.serviceWorker ? 'Yes' : 'No'}
  Notifications API: ${data.features.notifications ? 'Yes' : 'No'}
  Geolocation API: ${data.features.geolocation ? 'Yes' : 'No'}
`
      }

      return `Browser Data Collection & Fingerprinting

Websites can collect extensive data about you without asking permission.
This includes your IP address, location, browser type, screen size, and more.

Usage:
  about -me     See what data this website can read about you
  about --help  Show detailed help

Try: about -me`
    }
  },
  ls: {
    description: 'List directory contents',
    usage: 'ls [directory]',
    execute: (args: string[], currentDir: string) => {
      if (args.includes('--help')) {
        return `ls: List directory contents
Usage: ls [directory]

Options:
  --help    Display this help message

Examples:
  ls              List current directory
  ls §DIR§projects§     List contents of projects directory`
      }

      const dir = args[0] || currentDir
      const contents = fileSystem[dir as keyof typeof fileSystem]

      if (!contents) {
        return `§ERROR§ls: cannot access '${dir}': No such directory§`
      }

      if (Array.isArray(contents)) {
        // Separate directories and files
        const directories: string[] = []
        const files: string[] = []

        contents.forEach((item) => {
          // Check if item is a directory (exists as key in fileSystem)
          if (item in fileSystem) {
            directories.push(`§DIR§${item}§`)
          } else {
            files.push(`§FILE§${item}§`)
          }
        })

        let output = ''
        if (directories.length > 0) {
          output += directories.join('  ')
        }
        if (files.length > 0) {
          if (directories.length > 0) output += '\n'
          output += files.join('  ')
        }
        return output || 'Empty directory'
      }

      const keys = Object.keys(contents)
      return keys.map(k => `§DIR§${k}§`).join('  ')
    }
  },
  cd: {
    description: 'Change the current directory',
    usage: 'cd <directory>',
    execute: (args: string[]) => {
      if (args.includes('--help')) {
        return `cd: Change the current directory
Usage: cd <directory>

Options:
  --help    Display this help message

Examples:
  cd §DIR§projects§     Change to projects directory
  cd §DIR§about§        Change to about directory
  cd §DIR§education§    Change to education directory
  cd §DIR§home§         Change to home directory

Available directories: ${Object.keys(fileSystem).map(k => `§DIR§${k}§`).join(', ')}`
      }

      if (args.length === 0) {
        return '§ERROR§cd: missing directory argument§. Type "cd --help" for usage.'
      }

      const newDir = args[0]

      // Handle cd .. - currentDir will be passed as second parameter from handleCommand
      if (newDir === '..') {
        const currentDirectory = args[1] || 'home'
        // Map to go back to parent directory
        const parentMap: { [key: string]: string } = {
          'about': 'home',
          'projects': 'home',
          'education': 'home',
          'contact': 'home',
          'skills': 'about',
          'home': 'home'
        }
        const parent = parentMap[currentDirectory]
        if (parent && parent !== currentDirectory) {
          // Scroll to parent section
          const sectionMap: { [key: string]: string } = {
            'home': 'home',
            'about': 'about',
            'projects': 'projects',
            'education': 'education',
            'contact': 'contact'
          }

          if (sectionMap[parent]) {
            // Special handling for home - scroll to top
            if (parent === 'home') {
              window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
              const element = document.getElementById(sectionMap[parent])
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }
          }

          return `CD_PARENT:${parent}` // Special marker for parent directory
        }
        return '§ERROR§cd: already at root directory§'
      }

      if (!(newDir in fileSystem)) {
        return `§ERROR§cd: ${newDir}: No such directory§`
      }

      // Scroll to corresponding section
      const sectionMap: { [key: string]: string } = {
        'home': 'home',
        'about': 'about',
        'projects': 'projects',
        'education': 'education',
        'contact': 'contact'
      }

      if (sectionMap[newDir]) {
        // Special handling for home - scroll to top
        if (newDir === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          const element = document.getElementById(sectionMap[newDir])
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }

      return `Changed directory to §DIR§${newDir}§`
    }
  },
  clear: {
    description: 'Clear the terminal screen',
    usage: 'clear',
    execute: () => 'CLEAR'
  }
})

// Helper function to parse and colorize terminal output
const parseColoredOutput = (text: string, isDark: boolean) => {
  const colors = {
    dir: isDark ? '#00bfff' : '#0066cc',      // Cyan/Blue for directories
    file: isDark ? '#90ee90' : '#008800',     // Light green for files
    command: isDark ? '#0f0' : '#00a',        // Bright green/blue for commands
    text: isDark ? '#0f0' : '#000',           // Default text color
    error: isDark ? '#ff6b6b' : '#cc0000'     // Red for errors
  }

  // Split by markers and create colored spans
  const parts: ReactElement[] = []
  let currentIndex = 0
  const regex = /§(DIR|FILE|ERROR|CMD)§([^§]+)§/g
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      const beforeText = text.substring(currentIndex, match.index)
      if (beforeText) {
        parts.push(<span key={`text-${currentIndex}`}>{beforeText}</span>)
      }
    }

    // Add colored element
    const [, type, content] = match
    let color = colors.text
    if (type === 'DIR') color = colors.dir
    else if (type === 'FILE') color = colors.file
    else if (type === 'ERROR') color = colors.error
    else if (type === 'CMD') color = colors.command

    parts.push(
      <span key={`${type}-${match.index}`} style={{ color, fontWeight: 'bold' }}>
        {content}
      </span>
    )

    currentIndex = match.index + match[0].length
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(<span key={`text-${currentIndex}`}>{text.substring(currentIndex)}</span>)
  }

  return parts.length > 0 ? <>{parts}</> : text
}

export default function Terminal({ isDark, onGameLaunch, isGameActive = false, showPDF, setShowPDF, isMaximized, setIsMaximized, isMinimized, setIsMinimized }: TerminalProps) {
  const [history, setHistory] = useState<{ input: string; output: string }[]>([
    { input: '', output: 'Welcome to my Portfolio Terminal. Type "§CMD§help§" for available commands.\nTry "§CMD§cd§ §DIR§about§" or "§CMD§cd§ §DIR§projects§" to navigate sections.' }
  ])
  const [input, setInput] = useState('')
  const [currentDir, setCurrentDir] = useState('home')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Handle ESC key to close PDF viewer
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showPDF) {
        setShowPDF(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showPDF])

  const handleCommand = async (cmd: string) => {
    const parts = cmd.trim().split(' ')
    const command = parts[0].toLowerCase()
    const args = parts.slice(1)
    const commands = createCommands(onGameLaunch, () => {
      setShowPDF(true)
      setIsMaximized(true)
    })

    let output = ''

    if (command === '') {
      output = ''
    } else if (command in commands) {
      // For cd command, pass currentDir as additional argument
      const commandArgs = command === 'cd' ? [...args, currentDir] : args
      const result = await commands[command as keyof typeof commands].execute(commandArgs, currentDir)

      if (result === 'CLEAR') {
        setHistory([{ input: '', output: 'Welcome to my Portfolio Terminal. Type "§CMD§help§" for available commands.\nTry "§CMD§cd§ §DIR§about§" or "§CMD§cd§ §DIR§projects§" to navigate sections.' }])
        return
      }

      if (command === 'cd' && !result.startsWith('cd:')) {
        // Handle cd .. special case
        if (result.startsWith('CD_PARENT:')) {
          const parent = result.replace('CD_PARENT:', '')
          setCurrentDir(parent)
          output = `Changed directory to §DIR§${parent}§`
        } else {
          setCurrentDir(args[0])
        }
      }

      output = result
    } else {
      output = `§ERROR§Command not found: ${command}§. Type 'help' for available commands.`
    }

    setHistory([...history, { input: `${currentDir}$ ${cmd}`, output }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setCommandHistory([...commandHistory, input])
      setHistoryIndex(-1)
    }
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const parts = input.trim().split(' ')
      const command = parts[0]
      const partialArg = parts[1] || ''

      // Tab autocomplete for cd and cat commands
      if ((command === 'cd' || command === 'cat' || command === 'ls') && parts.length <= 2) {
        const currentContents = fileSystem[currentDir as keyof typeof fileSystem]
        if (Array.isArray(currentContents)) {
          const matches = currentContents.filter(item => item.startsWith(partialArg))
          if (matches.length === 1) {
            setInput(`${command} ${matches[0]}`)
          } else if (matches.length > 1) {
            // Show matches in terminal
            const output = matches.join('  ')
            setHistory([...history, { input: `${currentDir}$ ${input}`, output }])
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length === 0) return

      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1)

      setHistoryIndex(newIndex)
      setInput(commandHistory[newIndex])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return

      const newIndex = historyIndex + 1

      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      }
    }
  }

  const handleTerminalClick = () => {
    // Don't focus input when game is active
    if (!isGameActive) {
      inputRef.current?.focus()
    }
  }

  // Blur input when game becomes active
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.blur()
    }
  }, [isGameActive])

  // Update current directory based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'education', 'contact']
      const windowHeight = window.innerHeight
      const scrollY = window.scrollY

      // Check if at the very top (home)
      if (scrollY < 100) {
        setCurrentDir('home')
        return
      }

      // Find which section is most visible
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Check if section is in the top 40% of viewport
          if (rect.top <= windowHeight * 0.4 && rect.bottom >= 0) {
            if (currentDir !== section) {
              setCurrentDir(section)
            }
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentDir])

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (isMinimized) setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMaximized) setIsMaximized(false)
  }

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          width: '200px',
          height: '50px',
          backgroundColor: window.innerWidth > 1010
            ? (isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)')
            : (isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'),
          backdropFilter: window.innerWidth > 1010 ? 'blur(10px)' : 'none',
          border: `1px solid ${isDark ? '#333' : '#ccc'}`,
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: isDark ? '#0f0' : '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          zIndex: 10000
        }}
        onClick={handleMinimize}
      >
        <span>Terminal</span>
        <span style={{ fontSize: '1.2rem' }}>⤢</span>
      </div>
    )
  }

  return (
    <div
      onClick={handleTerminalClick}
      className={`terminal-wrapper ${isGameActive ? 'game-active' : ''} ${isMaximized ? 'terminal-maximized' : ''}`}
      style={{
        position: 'fixed',
        top: isMaximized ? '2rem' : 'auto',
        bottom: '2rem',
        left: '2rem',
        right: isMaximized ? '2rem' : 'auto',
        width: isMaximized ? 'auto' : '600px',
        height: isMaximized ? 'auto' : '400px',
        maxWidth: isMaximized ? 'none' : '600px',
        backgroundColor: window.innerWidth > 1010
          ? (isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)')
          : (isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'),
        backdropFilter: window.innerWidth > 1010 ? 'blur(10px)' : 'none',
        border: `1px solid ${isDark ? '#333' : '#ccc'}`,
        borderRadius: isMaximized ? '0' : '8px',
        padding: '1rem',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: isDark ? '#0f0' : '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
        zIndex: isMaximized ? 10000 : 100,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Control buttons */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '0.5rem',
          paddingBottom: '0.5rem',
          justifyContent: 'flex-end',
          borderBottom: `1px solid ${isDark ? '#333' : '#ccc'}`
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMinimize()
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#0f0' : '#00a',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              lineHeight: 1
            }}
            title="Minimize"
          >
            −
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleMaximize()
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: isDark ? '#0f0' : '#00a',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem',
              lineHeight: 1
            }}
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? '⤡' : '⤢'}
          </button>
        </div>
      </div>

      <div
        ref={terminalRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          marginBottom: '0.5rem',
          background: 'transparent',
          minHeight: 0
        }}
      >
        <Glitch glitchOn={['hover']} interval={7000} glitchDuration={1000} intensity="high"
        glitchColors={{color1: isDark ? '0, 255, 0' : '0, 0, 0', color2: isDark ? '255, 255, 255' : '0, 0, 170'}} >
        <div>
        {history.map((item, idx) => (
          <div key={idx}>
            {item.input && <div style={{ color: isDark ? '#0f0' : '#00a', fontWeight: 'bold' }}>{item.input}</div>}
            {item.output && (
              <div style={{
                whiteSpace: 'pre-wrap',
                marginBottom: '0.5rem',
                color: isDark ? '#0f0' : '#000',
                background: 'transparent'
              }}>
                {parseColoredOutput(item.output, isDark)}
              </div>
            )}
          </div>
        ))}
        </div>
        </Glitch>
      </div>

      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        alignItems: 'center',
        background: 'transparent',
        margin: 0,
        padding: 0
      }}>
        <span style={{ marginRight: '0.5rem', color: isDark ? '#0f0' : '#00a' }}>
          {currentDir}$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={!isGameActive}
          readOnly={isGameActive}
          style={{
            flex: 1,
            background: 'transparent',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            color: isDark ? '#0f0' : '#000',
            fontFamily: 'monospace',
            fontSize: '14px',
            WebkitAppearance: 'none'
          }}
        />
      </form>
      {showPDF && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: isDark ? '#000' : '#fff',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '0rem',
              alignItems: 'center',
              padding: '1rem 2rem',
              backgroundColor: isDark ? 'rgba(15, 15, 15, 0.95)' : 'rgba(240, 240, 240, 0.95)',
              borderBottom: `2px solid ${isDark ? '#0f0' : '#00a'}`,
              color: isDark ? '#0f0' : '#00a',
              fontFamily: 'monospace'
            }}
          >
            
            <button
              onClick={() => setShowPDF(false)}
              style={{
                background: 'transparent',
                marginTop: '1rem',
                border: `2px solid ${isDark ? '#0f0' : '#00a'}`,
                color: isDark ? '#0f0' : '#00a',
                fontSize: '0.7rem',
                cursor: 'pointer',
                fontFamily: 'monospace',
                padding: '0.5rem 0.5rem',
                borderRadius: '5px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#0f0' : '#00a'
                e.currentTarget.style.color = isDark ? '#000' : '#fff'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = isDark ? '#0f0' : '#00a'
              }}
            >
              CLOSE (ESC)
            </button>
          </div>
          <iframe
            src={cvPdf}
            style={{
              flex: 1,
              border: 'none',
              width: '100%',
              height: '100%'
            }}
            title="CV PDF Viewer"
          />
        </div>
      )}
    </div>
  )
}
