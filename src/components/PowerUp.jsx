const POWER_UP_TYPES = {
  RAPID_FIRE: 'rapidFire',
  MULTI_SHOT: 'multiShot',
  SHIELD: 'shield',
  SCORE_MULTIPLIER: 'scoreMultiplier',
}

const POWER_UP_CONFIG = {
  [POWER_UP_TYPES.RAPID_FIRE]: {
    color: '#ffff00',
    symbol: '⚡',
    name: 'Rapid Fire',
  },
  [POWER_UP_TYPES.MULTI_SHOT]: {
    color: '#00ffff',
    symbol: '🔫',
    name: 'Multi Shot',
  },
  [POWER_UP_TYPES.SHIELD]: {
    color: '#00ff00',
    symbol: '🛡️',
    name: 'Shield',
  },
  [POWER_UP_TYPES.SCORE_MULTIPLIER]: {
    color: '#ff00ff',
    symbol: '✨',
    name: 'Score x2',
  },
}

const PowerUp = ({ powerUp }) => {
  const config = POWER_UP_CONFIG[powerUp.type]

  const powerUpStyle = {
    position: 'absolute',
    left: `${powerUp.x}px`,
    top: `${powerUp.y}px`,
    width: `${powerUp.width}px`,
    height: `${powerUp.height}px`,
    backgroundColor: config.color,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: `0 0 15px ${config.color}, 0 0 30px ${config.color}`,
    animation: 'powerUpPulse 1s ease-in-out infinite',
  }

  return (
    <div style={powerUpStyle} title={config.name}>
      {config.symbol}
    </div>
  )
}

export default PowerUp
export { POWER_UP_TYPES }

