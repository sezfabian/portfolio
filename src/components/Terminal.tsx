import { useState, useRef, useEffect } from 'react'
import './Terminal.css'
import cvPdf from '../assets/cv.pdf'

interface TerminalProps {
  isDark: boolean
  onGameLaunch: () => void
  isGameActive?: boolean
}

interface DirectoryStructure {
  [key: string]: string[] | DirectoryStructure
}

const fileSystem: DirectoryStructure = {
  home: ['about', 'projects', 'contact', 'cv.pdf'],
  about: ['skills', 'experience.txt', 'bio.txt'],
  projects: ['project1.md', 'project2.md', 'project3.md'],
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
  ls [--help]      - List directory contents
  cd [--help]      - Change directory
  cat [--help]     - Display file contents
  about [--help]   - Learn about browser data collection
  game             - Launch jump game
  help [command]   - Show help for commands
  clear            - Clear terminal screen

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
  cat cv.pdf     Open CV PDF in viewer`
      }

      if (args.length === 0) {
        return 'cat: missing file argument. Type "cat --help" for usage.'
      }

      const filename = args[0]

      if (filename === 'cv.pdf') {
        if (onOpenPDF) {
          onOpenPDF()
          return 'Opening CV...'
        }
        return 'Error: PDF viewer not available'
      }

      if (filename === 'info.txt') {
        return `CONTACT INFORMATION

Location: Stirling, Scotland
Phone:    +44 734 9688 242
Email:    cheruiyotfabian@gmail.com

LinkedIn: linkedin.com/in/cheruiyot-fabian-4b9542142
GitHub:   github.com/sezfabian

Feel free to reach out for collaborations, opportunities, or just to connect!`
      }

      if (filename === 'experience.txt') {
        return `AI Trainer & Code Evaluator | Scale AI | Remote | August 2024 - Present
• Contributing to OpenAI's SWE-Lancer and SWE-Bench Verified benchmarks
• Assessing AI-generated code quality in Python, JavaScript, Vue3, React, TypeScript, SQL
• Training AI Agents to improve logic and efficiency in computing tasks
• Developing comprehensive tests and structured rubrics for AI training
• Built in-house web application for gamifying training and onboarding

Full-Stack Software Engineer | Emmerce Ltd | Nairobi, Kenya | Nov 2023 - Jul 2024
• Led problem definition, software solutions architecting, and project execution
• Implemented secure, scalable backend solutions using Django and FastAPI microservices
• Developed responsive SaaS web-apps and dashboards using Vue.js and Vuetify
• Collaborated with mobile teams to enhance native app functionality with AI integration

Full-Stack Engineering Apprentice | ALX Africa | Remote | Oct 2022 - Oct 2023
• Completed 12-month rigorous program focused on programming and design principles
• Built multiple projects: Freelance Platform API, e-commerce web-app, Airbnb clone
• Developed custom C library and shell programs
• Strengthened leadership, communication, teamwork, and problem-solving skills

IT Support Specialist | Value Chain Supplies | Eldoret, Kenya | Feb 2020 - Apr 2023
• Cut costs by 20% through strategic acquisition and maintenance of management systems
• Increased sales by 10% by developing e-commerce platform and online presence
• Provided technical support to 100+ users, resolving hardware, software, network issues
• Implemented remote access system via VPN, reducing response time`
      }

      return `cat: ${filename}: No such file or directory`
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

      return `What I know about you (Collected in Real-Time):`
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
  ls projects     List contents of projects directory`
      }

      const dir = args[0] || currentDir
      const contents = fileSystem[dir as keyof typeof fileSystem]

      if (!contents) {
        return `ls: cannot access '${dir}': No such directory`
      }

      if (Array.isArray(contents)) {
        // Separate directories and files
        const directories: string[] = []
        const files: string[] = []

        contents.forEach((item) => {
          // Check if item is a directory (exists as key in fileSystem)
          if (item in fileSystem) {
            directories.push(item)
          } else {
            files.push(item)
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

      return Object.keys(contents).join('  ')
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
  cd projects     Change to projects directory
  cd about        Change to about directory
  cd home         Change to home directory

Available directories: ${Object.keys(fileSystem).join(', ')}`
      }

      if (args.length === 0) {
        return 'cd: missing directory argument. Type "cd --help" for usage.'
      }

      const newDir = args[0]

      // Handle cd .. - currentDir will be passed as second parameter from handleCommand
      if (newDir === '..') {
        const currentDirectory = args[1] || 'home'
        // Map to go back to parent directory
        const parentMap: { [key: string]: string } = {
          'about': 'home',
          'projects': 'home',
          'contact': 'home',
          'skills': 'about',
          'home': 'home'
        }
        const parent = parentMap[currentDirectory]
        if (parent && parent !== currentDirectory) {
          return `CD_PARENT:${parent}` // Special marker for parent directory
        }
        return 'cd: already at root directory'
      }

      if (!(newDir in fileSystem)) {
        return `cd: ${newDir}: No such directory`
      }

      // Scroll to corresponding section
      const sectionMap: { [key: string]: string } = {
        'home': 'home',
        'about': 'about',
        'projects': 'projects',
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

      return `Changed directory to ${newDir}`
    }
  },
  clear: {
    description: 'Clear the terminal screen',
    usage: 'clear',
    execute: () => 'CLEAR'
  }
})

export default function Terminal({ isDark, onGameLaunch, isGameActive = false }: TerminalProps) {
  const [history, setHistory] = useState<{ input: string; output: string }[]>([
    { input: '', output: 'Welcome to my Portfolio Terminal. Type "help" for available commands.\nTry "cd about" or "cd projects" to navigate sections.' }
  ])
  const [input, setInput] = useState('')
  const [currentDir, setCurrentDir] = useState('home')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showPDF, setShowPDF] = useState(false)
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
    const commands = createCommands(onGameLaunch, () => setShowPDF(true))

    let output = ''

    if (command === '') {
      output = ''
    } else if (command in commands) {
      // For cd command, pass currentDir as additional argument
      const commandArgs = command === 'cd' ? [...args, currentDir] : args
      const result = await commands[command as keyof typeof commands].execute(commandArgs, currentDir)

      if (result === 'CLEAR') {
        setHistory([{ input: '', output: 'Welcome to my Portfolio Terminal. Type "help" for available commands.\nTry "cd about" or "cd projects" to navigate sections.' }])
        return
      }

      if (command === 'cd' && !result.startsWith('cd:')) {
        // Handle cd .. special case
        if (result.startsWith('CD_PARENT:')) {
          const parent = result.replace('CD_PARENT:', '')
          setCurrentDir(parent)
          output = `Changed directory to ${parent}`
        } else {
          setCurrentDir(args[0])
        }
      }

      output = result
    } else {
      output = `Command not found: ${command}. Type 'help' for available commands.`
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
      const sections = ['home', 'about', 'projects', 'contact']
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

  return (
    <div
      onClick={handleTerminalClick}
      className={`terminal-wrapper ${isGameActive ? 'game-active' : ''}`}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        width: '600px',
        height: '400px',
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${isDark ? '#333' : '#ccc'}`,
        borderRadius: '8px',
        padding: '1rem',
        fontFamily: 'monospace',
        fontSize: '14px',
        color: isDark ? '#0f0' : '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
        zIndex: window.innerWidth > 1010 ? 1 : 100
      }}
    >
      <div
        ref={terminalRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '0.5rem'
        }}
      >
        {history.map((item, idx) => (
          <div key={idx}>
            {item.input && <div style={{ color: isDark ? '#0f0' : '#00a' }}>{item.input}</div>}
            {item.output && (
              <div style={{
                whiteSpace: 'pre-wrap',
                marginBottom: '0.5rem',
                color: isDark ? '#0f0' : '#000'
              }}>
                {item.output}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
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
            border: 'none',
            outline: 'none',
            color: isDark ? '#0f0' : '#000',
            fontFamily: 'monospace',
            fontSize: '14px'
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
            zIndex: 1000,
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
