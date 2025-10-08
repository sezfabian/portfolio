import { useEffect, useRef, useState } from 'react'
import { parseGIF, decompressFrames } from 'gifuct-js'
import alienGif from '../assets/alien.gif'
import crateImg from '../assets/ice.png'
import './Game.css'

interface GameProps {
  isDark: boolean
  onClose: () => void
}

export default function Game({ isDark, onClose }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('jumpGameHighScore')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isGameOver, setIsGameOver] = useState(false)
  const isDarkRef = useRef(isDark)
  const gameSpeedRef = useRef(1)
  const levelRef = useRef(1)
  const failedLevelRef = useRef(1)
  const spawnRateRef = useRef(400)
  const jumpTriggerRef = useRef<() => void>(() => {})
  const resetGameRef = useRef<() => void>(() => {})

  // Update ref when isDark changes
  useEffect(() => {
    isDarkRef.current = isDark
  }, [isDark])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    // Load and parse GIF frames
    const frames: ImageData[] = []
    let framesLoaded = false

    fetch(alienGif)
      .then(resp => resp.arrayBuffer())
      .then(buff => {
        const gif = parseGIF(buff)
        const parsedFrames = decompressFrames(gif, true)

        parsedFrames.forEach((frame: any) => {
          const imageData = new ImageData(
            new Uint8ClampedArray(frame.patch),
            frame.dims.width,
            frame.dims.height
          )
          frames.push(imageData)
        })
        framesLoaded = true
      })

    // Load crate image
    const crateImage = new Image()
    crateImage.src = crateImg
    const crateSize = 30

    // Game state
    const player = {
      x: 50,
      y: 160,
      width: 90,
      height: 90,
      velocityY: 0,
      jumping: false,
      doubleJumpAvailable: false,
      hasDoubleJumped: false
    }

    // Physics values that scale with level for forgiveness
    const getGravity = () => {
      // Very low gravity for slow-motion effect
      const baseGravity = 0.12
      const levelIncrease = Math.min(levelRef.current - 1, 5) * 0.015
      return baseGravity + levelIncrease
    }

    const getJumpStrength = () => {
      return -5
    }

    const doubleJumpStrength = -6
    const groundY = 160

    const obstacles: Array<{ x: number; width: number; height: number }> = []
    let frameCount = 0
    let gameOver = false
    let currentScore = 0
    let currentFrame = 0
    let animationCounter = 0
    const maxLevel = 10
    let cityScapeOffset = 0

    // Create cityscape background with fixed seed for consistency
    const drawCityscape = () => {
      const buildingCount = 20
      const buildings: Array<{ height: number; windows: number[][] }> = []

      // Use seeded random for consistent buildings
      let seed = 12345
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }

      for (let i = 0; i < buildingCount; i++) {
        const height = 80 + seededRandom() * 100
        const windowRows = Math.floor(height / 15)
        const windowCols = 3
        const windows: number[][] = []

        // Reduce window density in dark mode for better performance
        const windowChance = isDarkRef.current ? 0.65 : 0.3 // 35% vs 70% chance

        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            if (seededRandom() > windowChance) {
              windows.push([col, row])
            }
          }
        }

        buildings.push({ height, windows })
      }

      return buildings
    }

    const cityscape = drawCityscape()
    const buildingWidth = 80

    const spawnObstacle = () => {
      // At level 1-2: only 1 ice block, level 3-5: 1-2 ice blocks, level 6+: 1-3 ice blocks
      let maxCrates = 1
      if (levelRef.current >= 3) maxCrates = 2
      if (levelRef.current >= 6) maxCrates = 3

      const numCrates = Math.floor(Math.random() * maxCrates) + 1
      const height = numCrates * crateSize
      obstacles.push({
        x: canvas.width,
        width: 30,
        height
      })

      // Spawn additional obstacles based on level
      if (levelRef.current >= 4 && Math.random() < 0.25) {
        // 25% chance for double obstacle at level 4+
        const numCrates2 = Math.floor(Math.random() * Math.min(2, maxCrates)) + 1
        obstacles.push({
          x: canvas.width + 120 + Math.random() * 60,
          width: 30,
          height: numCrates2 * crateSize
        })
      }

      if (levelRef.current >= 7 && Math.random() < 0.2) {
        // 20% chance for triple obstacle at level 7+
        const numCrates3 = Math.floor(Math.random() * 2) + 1
        obstacles.push({
          x: canvas.width + 250 + Math.random() * 70,
          width: 30,
          height: numCrates3 * crateSize
        })
      }
    }

    const performJump = () => {
      if (gameOver) return

      const jumpStrength = getJumpStrength()

      // First jump - full height
      if (!player.jumping) {
        player.velocityY = jumpStrength
        player.jumping = true
        player.doubleJumpAvailable = true
        player.hasDoubleJumped = false
      }
      // Second jump (double jump) - smaller boost
      else if (player.doubleJumpAvailable && !player.hasDoubleJumped) {
        player.velocityY = doubleJumpStrength
        player.hasDoubleJumped = true
        player.doubleJumpAvailable = false
      }
    }

    // Store jump function in ref for external access
    jumpTriggerRef.current = performJump

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === ' ' || e.key === 'ArrowUp') && !gameOver) {
        performJump()
      }
      if (e.key === 'r' && gameOver) {
        resetGame()
      }
    }

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault()
      if (gameOver) {
        resetGame()
      } else {
        performJump()
      }
    }

    const resetGame = () => {
      player.y = 160
      player.velocityY = 0
      player.jumping = false
      player.doubleJumpAvailable = false
      player.hasDoubleJumped = false
      obstacles.length = 0
      gameOver = false
      setIsGameOver(false)
      frameCount = 0
      cityScapeOffset = 0

      // Restart at the level they failed
      levelRef.current = failedLevelRef.current
      currentScore = (failedLevelRef.current - 1) * 100

      // Set appropriate speed and spawn rate for the level
      gameSpeedRef.current = 2.5 + (failedLevelRef.current - 1) * 0.4
      spawnRateRef.current = Math.max(100, 900 - (failedLevelRef.current - 1) * 12)

      setScore(currentScore)
    }

    // Store reset function in ref for external access
    resetGameRef.current = resetGame

    window.addEventListener('keydown', handleKeyDown)
    canvas.addEventListener('touchstart', handleTouch)

    const gameLoop = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!gameOver) {
        // Update player with dynamic gravity
        const currentGravity = getGravity()
        player.velocityY += currentGravity
        player.y += player.velocityY

        if (player.y >= groundY) {
          player.y = groundY
          player.velocityY = 0
          player.jumping = false
          player.doubleJumpAvailable = false
          player.hasDoubleJumped = false
        }

        // Update cityscape offset for parallax effect
        cityScapeOffset -= gameSpeedRef.current * 0.3

        // Spawn obstacles
        frameCount++
        if (frameCount % spawnRateRef.current === 0) {
          spawnObstacle()
        }

        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
          obstacles[i].x -= gameSpeedRef.current

          if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1)
            currentScore += 10
            setScore(currentScore)

            // Update high score if current score is higher
            if (currentScore > highScore) {
              setHighScore(currentScore)
              localStorage.setItem('jumpGameHighScore', currentScore.toString())
            }

            // Level up every 50 points (max level 10)
            const newLevel = Math.min(maxLevel, Math.floor(currentScore / 50) + 1)
            if (newLevel > levelRef.current) {
              levelRef.current = newLevel
              gameSpeedRef.current += 0.4
              spawnRateRef.current = Math.max(200, spawnRateRef.current - 12)
            }
          }
        }

        // Collision detection with level-based forgiveness
        // More forgiving at lower levels
        const getCollisionMargin = () => {
          const baseMargin = 15
          const levelPenalty = Math.min(levelRef.current - 1, 5) * 1.5
          return Math.max(5, baseMargin - levelPenalty)
        }

        const collisionMargin = getCollisionMargin()
        for (const obstacle of obstacles) {
          if (
            player.x + collisionMargin < obstacle.x + obstacle.width &&
            player.x - 50 + player.width - collisionMargin > obstacle.x - 40 &&
            (player.y - 50) + player.height - collisionMargin > groundY + 30 - obstacle.height
          ) {
            gameOver = true
            // Delay showing restart button by 1 second
            setTimeout(() => {
              setIsGameOver(true)
            }, 1000)
            failedLevelRef.current = levelRef.current // Save the level they failed at
          }
        }

        // Draw cityscape background
        ctx.fillStyle = isDarkRef.current ? 'rgba(30, 30, 50, 0.6)' : 'rgba(200, 200, 220, 0.6)'

        // Calculate how many buildings to draw to fill screen plus overflow
        const numBuildingsToDraw = Math.ceil(canvas.width / buildingWidth) + 3

        for (let i = 0; i < numBuildingsToDraw; i++) {
          // Calculate building index that wraps around (negative offset means scrolling left)
          const scrolledBuildings = Math.floor(-cityScapeOffset / buildingWidth)
          const buildingIndex = ((scrolledBuildings + i) % cityscape.length + cityscape.length) % cityscape.length
          const building = cityscape[buildingIndex]

          // Calculate x position with proper offset
          const baseOffset = (scrolledBuildings * buildingWidth)
          const x = (i * buildingWidth) + cityScapeOffset + baseOffset

          // Draw building
          ctx.fillRect(x, groundY + 30 - building.height, buildingWidth - 5, building.height)

          // Draw windows
          ctx.fillStyle = isDarkRef.current ? 'rgba(255, 220, 100, 0.8)' : 'rgba(255, 200, 50, 0.8)'
          for (const [col, row] of building.windows) {
            const windowX = x + 15 + col * 20
            const windowY = groundY + 30 - building.height + 10 + row * 15
            ctx.fillRect(windowX, windowY, 12, 10)
          }

          // Reset building color
          ctx.fillStyle = isDarkRef.current ? 'rgba(30, 30, 50, 0.6)' : 'rgba(200, 200, 220, 0.6)'
        }

        // Draw ground
        ctx.fillStyle = isDarkRef.current ? '#333' : '#ccc'
        ctx.fillRect(0, groundY + 32, canvas.width, 2)

        // Draw player (alien) with animated frames
        if (framesLoaded && frames.length > 0) {
          // Only animate when not jumping (pause on jump)
          if (!player.jumping) {
            animationCounter++
            if (animationCounter >= 10) {
              currentFrame = (currentFrame + 1) % frames.length
              animationCounter = 0
            }
          }

          // Create temporary canvas for frame
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (tempCtx) {
            tempCanvas.width = frames[currentFrame].width
            tempCanvas.height = frames[currentFrame].height

            // Get the frame data
            const frameData = frames[currentFrame]
            tempCtx.putImageData(frameData, 0, 0)

            // In dark mode, brighten green pixels
            if (isDarkRef.current) {
              const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
              const data = imageData.data

              for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const alpha = data[i + 3]

                // Only modify pixels that are already green (green > red and green > blue)
                if (alpha > 50 && g > r && g > b) {
                  // Brighten the green to maximum
                  data[i] = 0       // R - keep low
                  data[i + 1] = 255 // G - max brightness
                  data[i + 2] = 0   // B - keep low
                  // Keep original alpha
                }
              }

              tempCtx.putImageData(imageData, 0, 0)
            }

            ctx.drawImage(tempCanvas, player.x, player.y - 50, player.width, player.height)
          }
        }

        // Draw obstacles (stacked crates)
        for (const obstacle of obstacles) {
          const numCrates = Math.ceil(obstacle.height / crateSize)
          for (let i = 0; i < numCrates; i++) {
            ctx.drawImage(
              crateImage,
              obstacle.x,
              groundY + 30 - (i + 1) * crateSize,
              crateSize,
              crateSize
            )
          }
        }
      } else {
        // Game over screen
        ctx.fillStyle = isDarkRef.current ? '#fff' : '#000'
        ctx.font = '24px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20)
        ctx.font = '16px monospace'
        ctx.fillText('Press R or tap to restart', canvas.width / 2, canvas.height / 2 + 10)
      }

      requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      canvas.removeEventListener('touchstart', handleTouch)
    }
  }, [])

  return (
    <div
      className="game-wrapper"
      style={{
        position: 'fixed',
        right: '5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '600px',
        backgroundColor: 'transparent',
        padding: '1.5rem',
        zIndex: 100
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              color: isDark ? '#0f0' : '#00a',
              fontFamily: 'monospace'
            }}
          >
            ALIEN vs ICE
          </h2>
          <p
            style={{
              margin: '0.5rem 0 0 0',
              fontSize: '0.9rem',
              color: isDark ? '#fff' : '#000',
              fontFamily: 'monospace'
            }}
          >
            Score: {score} | High: {highScore} | Level: {Math.min(10, Math.floor(score / 100) + 1)}
          </p>
          <p
            style={{
              margin: '0.25rem 0 0 0',
              fontSize: '0.8rem',
              color: isDark ? '#fff' : '#000',
              opacity: 0.8,
              fontFamily: 'monospace'
            }}
          >
            Press SPACE/↑ or tap to jump and avoid the ice blocks
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#000',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />

      {/* Large touch area for mobile screens */}
      <div
        className="mobile-touch-area"
        onClick={() => isGameOver ? resetGameRef.current() : jumpTriggerRef.current()}
        style={{
          marginTop: '1rem',
          padding: '2rem',
          backgroundColor: isDark ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 170, 0.1)',
          border: `2px dashed ${isDark ? '#0f0' : '#00a'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
          color: isDark ? '#0f0' : '#00a',
          userSelect: 'none',
          transition: 'all 0.2s ease'
        }}
        onMouseDown={(e) => {
          const target = e.currentTarget
          target.style.transform = 'scale(0.98)'
          target.style.backgroundColor = isDark ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 0, 170, 0.2)'
        }}
        onMouseUp={(e) => {
          const target = e.currentTarget
          target.style.transform = 'scale(1)'
          target.style.backgroundColor = isDark ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 170, 0.1)'
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget
          target.style.transform = 'scale(1)'
          target.style.backgroundColor = isDark ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 170, 0.1)'
        }}
        onTouchStart={(e) => {
          e.preventDefault()
          const target = e.currentTarget
          target.style.transform = 'scale(0.98)'
          target.style.backgroundColor = isDark ? 'rgba(0, 255, 0, 0.2)' : 'rgba(0, 0, 170, 0.2)'
        }}
        onTouchEnd={(e) => {
          e.preventDefault()
          const target = e.currentTarget
          target.style.transform = 'scale(1)'
          target.style.backgroundColor = isDark ? 'rgba(0, 255, 0, 0.1)' : 'rgba(0, 0, 170, 0.1)'
        }}
      >
        {isGameOver ? 'TAP TO RESTART LEVEL' : 'TAP HERE TO JUMP'}
      </div>
    </div>
  )
}
