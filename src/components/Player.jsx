import { forwardRef } from 'react'

const Player = forwardRef(({ player, hasShield }, ref) => {
  const playerStyle = {
    position: 'absolute',
    left: `${player.x}px`,
    top: `${player.y}px`,
    width: `${player.width}px`,
    height: `${player.height}px`,
    backgroundColor: hasShield ? '#00ffff' : '#ffffff',
    clipPath: 'polygon(50% 0%, 0% 100%, 50% 80%, 100% 100%)',
    boxShadow: hasShield
      ? '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff'
      : '0 0 10px #ffffff, 0 0 20px #ffffff',
    // Removed transition for immediate response
  }

  return (
    <div ref={ref} style={playerStyle}>
      {hasShield && (
        <div
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            right: '-10px',
            bottom: '-10px',
            border: '3px solid #00ffff',
            borderRadius: '50%',
            animation: 'shieldPulse 1s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
})

Player.displayName = 'Player'

export default Player

