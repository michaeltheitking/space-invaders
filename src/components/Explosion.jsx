import { useEffect } from 'react'

const Explosion = ({ x, y, size = 50, onComplete }) => {
  const explosionStyle = {
    position: 'absolute',
    left: `${x - size / 2}px`,
    top: `${y - size / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: 'radial-gradient(circle, #ff6600 0%, #ff0000 30%, #ffff00 60%, transparent 100%)',
    boxShadow: `
      0 0 20px #ff6600,
      0 0 40px #ff0000,
      0 0 60px #ffff00,
      inset 0 0 20px rgba(255, 255, 255, 0.5)
    `,
    animation: 'explosionAnimation 0.5s ease-out forwards',
    pointerEvents: 'none',
    zIndex: 1000,
  }

  // Call onComplete after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 500) // Match animation duration
    return () => clearTimeout(timer)
  }, [onComplete])

  return <div style={explosionStyle} />
}

export default Explosion

