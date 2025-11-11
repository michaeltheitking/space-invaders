const Enemy = ({ enemy }) => {
  const healthPercentage = (enemy.health / enemy.maxHealth) * 100

  // Different alien shapes based on enemy type
  const getAlienShape = (type) => {
    switch (type) {
      case 'fast':
        // Small, pointy alien (top row)
        return {
          clipPath: 'polygon(50% 0%, 60% 20%, 80% 25%, 70% 40%, 80% 50%, 60% 60%, 40% 60%, 20% 50%, 30% 40%, 20% 25%, 40% 20%)',
        }
      case 'armored':
        // Medium, rounded alien (bottom rows)
        return {
          clipPath: 'polygon(50% 0%, 70% 10%, 85% 30%, 90% 50%, 85% 70%, 70% 85%, 30% 85%, 15% 70%, 10% 50%, 15% 30%, 30% 10%)',
        }
      case 'boss':
        // Large boss alien
        return {
          clipPath: 'polygon(50% 0%, 75% 5%, 90% 20%, 95% 40%, 95% 60%, 90% 75%, 75% 90%, 50% 95%, 25% 90%, 10% 75%, 5% 60%, 5% 40%, 10% 20%, 25% 5%)',
        }
      default:
        // Basic alien - classic Space Invaders shape
        return {
          clipPath: 'polygon(50% 0%, 65% 15%, 80% 20%, 75% 35%, 85% 45%, 70% 60%, 50% 70%, 30% 60%, 15% 45%, 25% 35%, 20% 20%, 35% 15%)',
        }
    }
  }

  const alienShape = getAlienShape(enemy.type)

  const enemyStyle = {
    position: 'absolute',
    left: `${enemy.x}px`,
    top: `${enemy.y}px`,
    width: `${enemy.width}px`,
    height: `${enemy.height}px`,
    backgroundColor: enemy.color,
    ...alienShape,
    boxShadow: `0 0 10px ${enemy.color}, 0 0 20px ${enemy.color}, inset 0 0 10px rgba(255, 255, 255, 0.2)`,
    border: 'none',
  }

  return (
    <div style={enemyStyle}>
      {/* Alien "eyes" - two small circles */}
      <div
        style={{
          position: 'absolute',
          left: '30%',
          top: '35%',
          width: '12%',
          height: '12%',
          backgroundColor: '#000000',
          borderRadius: '50%',
          boxShadow: `0 0 5px ${enemy.color}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '30%',
          top: '35%',
          width: '12%',
          height: '12%',
          backgroundColor: '#000000',
          borderRadius: '50%',
          boxShadow: `0 0 5px ${enemy.color}`,
        }}
      />
      {/* Health bar for damaged enemies */}
      {enemy.health < enemy.maxHealth && (
        <div
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '10%',
            width: `${healthPercentage * 0.8}%`,
            height: '4px',
            backgroundColor: '#00ff00',
            transition: 'width 0.2s',
            borderRadius: '2px',
          }}
        />
      )}
    </div>
  )
}

export default Enemy

