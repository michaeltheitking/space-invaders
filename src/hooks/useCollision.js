export const checkCollision = (rect1, rect2) => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  )
}

export const useCollision = () => {
  const checkBulletEnemyCollision = (bullets, enemies) => {
    const collisions = []
    
    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.type !== 'player') return
      
      enemies.forEach((enemy, enemyIndex) => {
        if (checkCollision(bullet, enemy)) {
          collisions.push({ bulletIndex, enemyIndex })
        }
      })
    })
    
    return collisions
  }

  const checkBulletPlayerCollision = (bullets, player) => {
    const collisions = []
    
    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.type !== 'enemy') return
      
      if (checkCollision(bullet, player)) {
        collisions.push(bulletIndex)
      }
    })
    
    return collisions
  }

  const checkPlayerEnemyCollision = (player, enemies) => {
    return enemies.some(enemy => checkCollision(player, enemy))
  }

  const checkPlayerPowerUpCollision = (player, powerUps) => {
    const collisions = []
    
    powerUps.forEach((powerUp, index) => {
      if (checkCollision(player, powerUp)) {
        collisions.push(index)
      }
    })
    
    return collisions
  }

  return {
    checkBulletEnemyCollision,
    checkBulletPlayerCollision,
    checkPlayerEnemyCollision,
    checkPlayerPowerUpCollision,
  }
}

