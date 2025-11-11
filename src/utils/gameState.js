export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 600,
  PLAYER_SPEED: 5,
  BULLET_SPEED: 8,
  ENEMY_BULLET_SPEED: 4,
  ENEMY_ROWS: 5,
  ENEMY_COLS: 10,
  ENEMY_SPACING: 60,
  ENEMY_START_Y: 50,
  POWER_UP_DROP_CHANCE: 0.15,
  WAVE_DIFFICULTY_MULTIPLIER: 1.2,
}

export const createInitialState = () => ({
  score: 0,
  lives: 3,
  wave: 1,
  gameOver: false,
  paused: false,
  powerUps: {
    rapidFire: false,
    multiShot: false,
    shield: false,
    scoreMultiplier: 1,
  },
  powerUpTimers: {
    rapidFire: 0,
    multiShot: 0,
    shield: 0,
  },
})

export const updateGameState = (state, updates) => {
  return { ...state, ...updates }
}

