import { getHighScore } from '../utils/storage'

const GameUI = ({ score, lives, wave, powerUps, gameOver, onRestart, onMenu }) => {
  const highScore = getHighScore()
  const isNewHighScore = score > 0 && score >= highScore

  if (gameOver) {
    return (
      <div className="game-over-overlay">
        <div className="game-over-content">
          <h1>GAME OVER</h1>
          <div className="final-stats">
            <p>Final Score: {score}</p>
            <p>Wave Reached: {wave}</p>
            {isNewHighScore && <p className="new-high-score">NEW HIGH SCORE!</p>}
            <p>High Score: {Math.max(score, highScore)}</p>
          </div>
          <div className="game-over-buttons">
            <button onClick={onRestart}>Play Again</button>
            <button onClick={onMenu}>Main Menu</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="game-ui">
      <div className="ui-top">
        <div className="score">Score: {score}</div>
        <div className="wave">Wave: {wave}</div>
        <div className="high-score">High: {highScore}</div>
      </div>
      <div className="ui-bottom">
        <div className="lives">
          Lives: {Array(lives).fill(0).map((_, i) => (
            <span key={i} className="life-icon">🚀</span>
          ))}
        </div>
        <div className="power-ups">
          {powerUps.rapidFire && (
            <span className="power-up-indicator" title="Rapid Fire">⚡</span>
          )}
          {powerUps.multiShot && (
            <span className="power-up-indicator" title="Multi Shot">🔫</span>
          )}
          {powerUps.shield && (
            <span className="power-up-indicator" title="Shield">🛡️</span>
          )}
          {powerUps.scoreMultiplier > 1 && (
            <span className="power-up-indicator" title={`${powerUps.scoreMultiplier}x Score`}>
              ✨ {powerUps.scoreMultiplier}x
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameUI

