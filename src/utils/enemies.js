import { GAME_CONFIG } from './gameState'

export const ENEMY_TYPES = {
  BASIC: 'basic',
  FAST: 'fast',
  ARMORED: 'armored',
  BOSS: 'boss',
}

export const createEnemy = (x, y, type = ENEMY_TYPES.BASIC, wave = 1) => {
  const baseSpeed = 1 + (wave - 1) * 0.1
  const configs = {
    [ENEMY_TYPES.BASIC]: {
      width: 40,
      height: 30,
      speed: baseSpeed,
      health: 1,
      points: 10,
      color: '#00ff00',
    },
    [ENEMY_TYPES.FAST]: {
      width: 35,
      height: 25,
      speed: baseSpeed * 2,
      health: 1,
      points: 20,
      color: '#ffff00',
    },
    [ENEMY_TYPES.ARMORED]: {
      width: 45,
      height: 35,
      speed: baseSpeed * 0.7,
      health: 3,
      points: 50,
      color: '#ff6600',
    },
    [ENEMY_TYPES.BOSS]: {
      width: 80,
      height: 60,
      speed: baseSpeed * 0.5,
      health: 10,
      points: 500,
      color: '#ff0000',
    },
  }

  const config = configs[type]
  return {
    id: Math.random().toString(36).substr(2, 9),
    x,
    y,
    type,
    width: config.width,
    height: config.height,
    speed: config.speed,
    health: config.health,
    maxHealth: config.health,
    points: config.points,
    color: config.color,
    direction: 1, // 1 for right, -1 for left
    canShoot: type === ENEMY_TYPES.BOSS || Math.random() < 0.3,
    shootCooldown: 0,
  }
}

export const createWave = (wave, canvasWidth) => {
  const enemies = []
  const isBossWave = wave % 5 === 0

  if (isBossWave) {
    // Boss wave - single large enemy
    const boss = createEnemy(
      canvasWidth / 2 - 40,
      GAME_CONFIG.ENEMY_START_Y,
      ENEMY_TYPES.BOSS,
      wave
    )
    enemies.push(boss)
  } else {
    // Regular wave - grid formation
    const rows = GAME_CONFIG.ENEMY_ROWS
    const cols = GAME_CONFIG.ENEMY_COLS
    const spacing = GAME_CONFIG.ENEMY_SPACING
    const startX = (canvasWidth - (cols - 1) * spacing) / 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let type = ENEMY_TYPES.BASIC
        if (row === 0) type = ENEMY_TYPES.FAST
        else if (row >= rows - 2) type = ENEMY_TYPES.ARMORED

        const x = startX + col * spacing
        const y = GAME_CONFIG.ENEMY_START_Y + row * 40

        enemies.push(createEnemy(x, y, type, wave))
      }
    }
  }

  return enemies
}

export const updateEnemies = (enemies, canvasWidth, deltaTime) => {
  let shouldMoveDown = false
  let newDirection = 1

  // Check if any enemy hits the boundary
  enemies.forEach(enemy => {
    if (
      (enemy.x + enemy.width >= canvasWidth && enemy.direction === 1) ||
      (enemy.x <= 0 && enemy.direction === -1)
    ) {
      shouldMoveDown = true
      newDirection = -enemy.direction
    }
  })

  // Update enemy positions
  return enemies.map(enemy => {
    let newX = enemy.x
    let newY = enemy.y

    if (shouldMoveDown) {
      enemy.direction = newDirection
      newY += 20
    } else {
      newX += enemy.speed * enemy.direction
    }

    // Update shoot cooldown
    const newShootCooldown = Math.max(0, enemy.shootCooldown - deltaTime)

    return {
      ...enemy,
      x: newX,
      y: newY,
      shootCooldown: newShootCooldown,
    }
  })
}

