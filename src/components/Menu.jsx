import { getHighScore } from '../utils/storage'

const Menu = ({ onStart }) => {
  const highScore = getHighScore()

  return (
    <div className="menu">
      <div className="menu-content">
        <h1 className="game-title">SPACE INVADERS</h1>
        <div className="menu-info">
          <p>High Score: {highScore}</p>
        </div>
        <button className="start-button" onClick={onStart}>
          START GAME
        </button>
        <div className="controls-info">
          <h2>Controls</h2>
          <p>← → Arrow Keys or A/D: Move</p>
          <p>Spacebar: Shoot</p>
          <p>P: Pause</p>
          <p>ESC: Exit to Menu</p>
        </div>
      </div>
    </div>
  )
}

export default Menu

