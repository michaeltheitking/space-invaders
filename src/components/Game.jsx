import { useState, useEffect, useCallback, useRef } from 'react'
import { useGameLoop } from '../hooks/useGameLoop'
import { useKeyboard } from '../hooks/useKeyboard'
import { useCollision } from '../hooks/useCollision'
import { GAME_CONFIG, createInitialState, updateGameState } from '../utils/gameState'
import { createWave, updateEnemies, ENEMY_TYPES } from '../utils/enemies'
import { setHighScore } from '../utils/storage'
import { soundManager } from '../utils/sounds'
import { POWER_UP_TYPES } from './PowerUp'
import Player from './Player'
import Enemy from './Enemy'
import Bullet from './Bullet'
import PowerUp from './PowerUp'
import Explosion from './Explosion'
import GameUI from './GameUI'

const Game = ({ onGameOver }) => {
  const [state, setState] = useState(createInitialState())
  const [player, setPlayer] = useState({
    x: GAME_CONFIG.CANVAS_WIDTH / 2 - 25,
    y: GAME_CONFIG.CANVAS_HEIGHT - 60,
    width: 50,
    height: 50,
  })
  const [enemies, setEnemies] = useState([])
  const [bullets, setBullets] = useState([])
  const [powerUps, setPowerUps] = useState([])
  const [explosions, setExplosions] = useState([])
  const [playerExploding, setPlayerExploding] = useState(false)

  const { keysRef, keys } = useKeyboard()
  const { checkBulletEnemyCollision, checkBulletPlayerCollision, checkPlayerEnemyCollision, checkPlayerPowerUpCollision } = useCollision()
  
  const lastShotTime = useRef(0)
  const shootCooldown = useRef(500) // Base cooldown in ms
  const playerRef = useRef(player)
  const stateRef = useRef(state)
  const explosionTimeoutRef = useRef(null)
  
  // Keep refs in sync with state
  useEffect(() => {
    playerRef.current = player
  }, [player])
  
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Initialize first wave
  useEffect(() => {
    setEnemies(createWave(1, GAME_CONFIG.CANVAS_WIDTH))
  }, [])

  const handleMenu = useCallback(() => {
    onGameOver()
  }, [onGameOver])

  // Handle pause and exit
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'p' && !state.gameOver) {
        setState(prev => ({ ...prev, paused: !prev.paused }))
      }
      if (e.key === 'Escape') {
        // Exit to menu at any time
        handleMenu()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [state.gameOver, state.paused, handleMenu])

  // Handle player movement separately for immediate response
  const playerElementRef = useRef(null)
  const lastStateUpdateRef = useRef(0)
  
  useEffect(() => {
    if (state.paused || state.gameOver || playerExploding) return

    let animationFrameId
    
    const movePlayer = () => {
      const keys = keysRef.current
      const currentPlayer = playerRef.current
      let moved = false
      let newX = currentPlayer.x

      if (keys['a'] || keys['arrowleft']) {
        newX = Math.max(0, currentPlayer.x - GAME_CONFIG.PLAYER_SPEED)
        moved = true
      }
      if (keys['d'] || keys['arrowright']) {
        newX = Math.min(GAME_CONFIG.CANVAS_WIDTH - currentPlayer.width, currentPlayer.x + GAME_CONFIG.PLAYER_SPEED)
        moved = true
      }

      if (moved && newX !== currentPlayer.x) {
        const updatedPlayer = { ...currentPlayer, x: newX }
        playerRef.current = updatedPlayer
        
        // Update visual position immediately via DOM
        if (playerElementRef.current) {
          playerElementRef.current.style.left = `${newX}px`
        }
        
        // Batch state updates - only update React state every 16ms (60fps)
        const now = performance.now()
        if (now - lastStateUpdateRef.current > 16) {
          setPlayer(updatedPlayer)
          lastStateUpdateRef.current = now
        }
      }

      animationFrameId = requestAnimationFrame(movePlayer)
    }

    animationFrameId = requestAnimationFrame(movePlayer)
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [state.paused, state.gameOver, playerExploding])

  // Game loop
  const gameLoop = useCallback((deltaTime) => {
    const currentState = stateRef.current
    const currentPlayer = playerRef.current
    
    if (currentState.paused || currentState.gameOver || playerExploding) return

    // Handle shooting (immediate response, no polling delay)
    const now = Date.now()
    const cooldown = currentState.powerUps.rapidFire ? shootCooldown.current * 0.3 : shootCooldown.current
    
    if (keys[' '] && now - lastShotTime.current > cooldown) {
      lastShotTime.current = now
      soundManager.play('shoot')
      
      const playerPos = playerRef.current
      if (currentState.powerUps.multiShot) {
        // Multi-shot: fire 3 bullets
        const newBullets = [
          { x: playerPos.x + playerPos.width / 2 - 3, y: playerPos.y, type: 'player', width: 6, height: 15 },
          { x: playerPos.x + playerPos.width / 2 - 3 - 20, y: playerPos.y, type: 'player', width: 6, height: 15 },
          { x: playerPos.x + playerPos.width / 2 - 3 + 20, y: playerPos.y, type: 'player', width: 6, height: 15 },
        ]
        setBullets(prev => [...prev, ...newBullets])
      } else {
        // Single shot
        setBullets(prev => [...prev, {
          x: playerPos.x + playerPos.width / 2 - 3,
          y: playerPos.y,
          type: 'player',
          width: 6,
          height: 15,
        }])
      }
    }

    // Update bullets
    setBullets(prev => prev.map(bullet => {
      const speed = bullet.type === 'player' 
        ? -GAME_CONFIG.BULLET_SPEED 
        : GAME_CONFIG.ENEMY_BULLET_SPEED
      return {
        ...bullet,
        y: bullet.y + speed,
      }
    }).filter(bullet => 
      bullet.y > -20 && bullet.y < GAME_CONFIG.CANVAS_HEIGHT + 20
    ))

    // Update enemies
    setEnemies(prev => {
      const updated = updateEnemies(prev, GAME_CONFIG.CANVAS_WIDTH, deltaTime)
      
      // Enemy shooting
      const newEnemies = updated.map(enemy => {
        if (enemy.canShoot && enemy.shootCooldown <= 0 && Math.random() < 0.001) {
          setBullets(prevBullets => [...prevBullets, {
            x: enemy.x + enemy.width / 2 - 3,
            y: enemy.y + enemy.height,
            type: 'enemy',
            width: 6,
            height: 15,
          }])
          return { ...enemy, shootCooldown: 2000 + Math.random() * 2000 }
        }
        return enemy
      })

      return newEnemies
    })

    // Update power-ups
    setPowerUps(prev => prev.map(powerUp => ({
      ...powerUp,
      y: powerUp.y + 2,
    })).filter(powerUp => powerUp.y < GAME_CONFIG.CANVAS_HEIGHT + 20))

    // Update power-up timers
    setState(prev => {
      const newTimers = { ...prev.powerUpTimers }
      const newPowerUps = { ...prev.powerUps }

      Object.keys(newTimers).forEach(key => {
        if (newTimers[key] > 0) {
          newTimers[key] -= deltaTime
          if (newTimers[key] <= 0) {
            newPowerUps[key] = false
          }
        }
      })

      if (newTimers.shield <= 0) {
        newPowerUps.shield = false
      }

      const newState = {
        ...prev,
        powerUpTimers: newTimers,
        powerUps: newPowerUps,
      }
      stateRef.current = newState
      return newState
    })

    // Check collisions
    const bulletEnemyCollisions = checkBulletEnemyCollision(bullets, enemies)
    bulletEnemyCollisions.forEach(({ bulletIndex, enemyIndex }) => {
      setBullets(prev => prev.filter((_, i) => i !== bulletIndex))
      setEnemies(prev => {
        const newEnemies = [...prev]
        if (newEnemies[enemyIndex]) {
          newEnemies[enemyIndex] = { ...newEnemies[enemyIndex], health: newEnemies[enemyIndex].health - 1 }
          if (newEnemies[enemyIndex].health <= 0) {
            // Enemy destroyed
            soundManager.play('explosion')
            const points = newEnemies[enemyIndex].points
            setState(prev => {
              const newState = { 
                ...prev, 
                score: prev.score + points * prev.powerUps.scoreMultiplier 
              }
              stateRef.current = newState
              return newState
            })

            // Chance to drop power-up
            if (Math.random() < GAME_CONFIG.POWER_UP_DROP_CHANCE) {
              const powerUpTypes = Object.values(POWER_UP_TYPES)
              const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
              setPowerUps(prev => [...prev, {
                id: Math.random().toString(36).substr(2, 9),
                x: newEnemies[enemyIndex].x + newEnemies[enemyIndex].width / 2 - 15,
                y: newEnemies[enemyIndex].y,
                width: 30,
                height: 30,
                type: randomType,
              }])
            }

            return newEnemies.filter((_, i) => i !== enemyIndex)
          }
        }
        return newEnemies
      })
    })

    // Check player bullet collisions
    const bulletPlayerCollisions = checkBulletPlayerCollision(bullets, currentPlayer)
    if (bulletPlayerCollisions.length > 0 && !playerExploding) {
      const currentState = stateRef.current
      if (!currentState.powerUps.shield) {
        // Trigger explosion animation
        setPlayerExploding(true)
        soundManager.play('explosion')
        
        // Remove all bullets
        setBullets([])
        
        // Clear any existing timeout
        if (explosionTimeoutRef.current) {
          clearTimeout(explosionTimeoutRef.current)
        }
        
        // After explosion animation, reset player and decrease lives
        explosionTimeoutRef.current = setTimeout(() => {
          explosionTimeoutRef.current = null
          setState(prev => {
            const newLives = prev.lives - 1
            if (newLives <= 0) {
              setHighScore(prev.score)
              soundManager.play('gameover')
              const newState = { ...prev, lives: 0, gameOver: true }
              stateRef.current = newState
              return newState
            }
            const newState = { ...prev, lives: newLives }
            stateRef.current = newState
            return newState
          })
          
          // Reset player to center
          const centerX = GAME_CONFIG.CANVAS_WIDTH / 2 - 25
          const centerY = GAME_CONFIG.CANVAS_HEIGHT - 60
          setPlayer({
            x: centerX,
            y: centerY,
            width: 50,
            height: 50,
          })
          playerRef.current = {
            x: centerX,
            y: centerY,
            width: 50,
            height: 50,
          }
          
          setPlayerExploding(false)
        }, 500) // Match explosion animation duration
      } else {
        // Shield active, just remove the bullets
        setBullets(prevBullets => prevBullets.filter((_, i) => !bulletPlayerCollisions.includes(i)))
      }
    }

    // Check player-enemy collisions
    if (checkPlayerEnemyCollision(currentPlayer, enemies) && !playerExploding) {
      const currentState = stateRef.current
      if (!currentState.powerUps.shield) {
        // Trigger explosion animation
        setPlayerExploding(true)
        soundManager.play('explosion')
        
        // Remove all bullets
        setBullets([])
        
        // Clear any existing timeout
        if (explosionTimeoutRef.current) {
          clearTimeout(explosionTimeoutRef.current)
        }
        
        // After explosion animation, reset player and decrease lives
        explosionTimeoutRef.current = setTimeout(() => {
          explosionTimeoutRef.current = null
          setState(prev => {
            const newLives = prev.lives - 1
            if (newLives <= 0) {
              setHighScore(prev.score)
              soundManager.play('gameover')
              const newState = { ...prev, lives: 0, gameOver: true }
              stateRef.current = newState
              return newState
            }
            const newState = { ...prev, lives: newLives }
            stateRef.current = newState
            return newState
          })
          
          // Reset player to center
          const centerX = GAME_CONFIG.CANVAS_WIDTH / 2 - 25
          const centerY = GAME_CONFIG.CANVAS_HEIGHT - 60
          setPlayer({
            x: centerX,
            y: centerY,
            width: 50,
            height: 50,
          })
          playerRef.current = {
            x: centerX,
            y: centerY,
            width: 50,
            height: 50,
          }
          
          setPlayerExploding(false)
        }, 500) // Match explosion animation duration
      }
    }

    // Check power-up collisions
    const powerUpCollisions = checkPlayerPowerUpCollision(currentPlayer, powerUps)
    powerUpCollisions.forEach(index => {
      setPowerUps(prev => {
        const collected = prev[index]
        setState(prevState => {
          const newPowerUps = { ...prevState.powerUps }
          const newTimers = { ...prevState.powerUpTimers }

          soundManager.play('powerup')
          switch (collected.type) {
            case POWER_UP_TYPES.RAPID_FIRE:
              newPowerUps.rapidFire = true
              newTimers.rapidFire = 10000 // 10 seconds
              break
            case POWER_UP_TYPES.MULTI_SHOT:
              newPowerUps.multiShot = true
              newTimers.multiShot = 15000 // 15 seconds
              break
            case POWER_UP_TYPES.SHIELD:
              newPowerUps.shield = true
              newTimers.shield = 8000 // 8 seconds
              break
            case POWER_UP_TYPES.SCORE_MULTIPLIER:
              newPowerUps.scoreMultiplier = 2
              newTimers.scoreMultiplier = 12000 // 12 seconds
              break
          }

          const newState = {
            ...prevState,
            powerUps: newPowerUps,
            powerUpTimers: newTimers,
          }
          stateRef.current = newState
          return newState
        })
        return prev.filter((_, i) => i !== index)
      })
    })

    // Check if wave is complete
    if (enemies.length === 0) {
      setState(prev => {
        const newWave = prev.wave + 1
        setEnemies(createWave(newWave, GAME_CONFIG.CANVAS_WIDTH))
        setBullets([])
        const newState = { ...prev, wave: newWave }
        stateRef.current = newState
        return newState
      })
    }

    // Check if enemies reached player
    const enemiesReachedBottom = enemies.some(enemy => enemy.y + enemy.height >= currentPlayer.y)
    if (enemiesReachedBottom) {
      setState(prev => {
        setHighScore(prev.score)
        soundManager.play('gameover')
        const newState = { ...prev, gameOver: true }
        stateRef.current = newState
        return newState
      })
    }
  }, [enemies, bullets, powerUps, playerExploding, checkBulletEnemyCollision, checkBulletPlayerCollision, checkPlayerEnemyCollision, checkPlayerPowerUpCollision])

  useGameLoop(gameLoop, !state.paused && !state.gameOver)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (explosionTimeoutRef.current) {
        clearTimeout(explosionTimeoutRef.current)
      }
    }
  }, [])

  const handleRestart = () => {
    setState(createInitialState())
    setPlayer({
      x: GAME_CONFIG.CANVAS_WIDTH / 2 - 25,
      y: GAME_CONFIG.CANVAS_HEIGHT - 60,
      width: 50,
      height: 50,
    })
    setEnemies(createWave(1, GAME_CONFIG.CANVAS_WIDTH))
    setBullets([])
    setPowerUps([])
    lastShotTime.current = 0
  }

  return (
    <div className="game-container">
      <div 
        className="game-canvas"
        style={{
          width: `${GAME_CONFIG.CANVAS_WIDTH}px`,
          height: `${GAME_CONFIG.CANVAS_HEIGHT}px`,
          position: 'relative',
          backgroundColor: '#000011',
          border: '2px solid #00ffff',
          margin: '0 auto',
          overflow: 'hidden',
        }}
      >
        {!playerExploding && (
          <Player ref={playerElementRef} player={player} hasShield={state.powerUps.shield} />
        )}
        {playerExploding && (
          <Explosion
            x={player.x + player.width / 2}
            y={player.y + player.height / 2}
            size={60}
          />
        )}
        {enemies.map(enemy => (
          <Enemy key={enemy.id} enemy={enemy} />
        ))}
        {bullets.map((bullet, index) => (
          <Bullet key={index} bullet={bullet} canvasHeight={GAME_CONFIG.CANVAS_HEIGHT} />
        ))}
        {powerUps.map(powerUp => (
          <PowerUp key={powerUp.id} powerUp={powerUp} />
        ))}
        {state.paused && (
          <div className="pause-overlay">
            <div className="pause-content">
              <h2>PAUSED</h2>
              <p>Press P to resume</p>
              <div className="pause-buttons">
                <button onClick={() => setState(prev => ({ ...prev, paused: false }))}>
                  Resume
                </button>
                <button onClick={handleMenu}>
                  Exit to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <GameUI
        score={state.score}
        lives={state.lives}
        wave={state.wave}
        powerUps={state.powerUps}
        gameOver={state.gameOver}
        onRestart={handleRestart}
        onMenu={handleMenu}
      />
    </div>
  )
}

export default Game

