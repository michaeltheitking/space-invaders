const Bullet = ({ bullet, canvasHeight }) => {
  if (bullet.y < 0 || bullet.y > canvasHeight) return null

  const bulletStyle = {
    position: 'absolute',
    left: `${bullet.x}px`,
    top: `${bullet.y}px`,
    width: `${bullet.width}px`,
    height: `${bullet.height}px`,
    backgroundColor: bullet.type === 'player' ? '#00ffff' : '#ff0000',
    borderRadius: '2px',
    boxShadow: bullet.type === 'player' 
      ? '0 0 10px #00ffff, 0 0 20px #00ffff' 
      : '0 0 10px #ff0000, 0 0 20px #ff0000',
  }

  return <div style={bulletStyle} />
}

export default Bullet

