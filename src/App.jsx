import { useState } from 'react'
import Menu from './components/Menu'
import Game from './components/Game'

function App() {
  const [gameState, setGameState] = useState('menu') // 'menu', 'playing'

  const startGame = () => {
    setGameState('playing')
  }

  const returnToMenu = () => {
    setGameState('menu')
  }

  return (
    <div className="app">
      {gameState === 'menu' && <Menu onStart={startGame} />}
      {gameState === 'playing' && <Game onGameOver={returnToMenu} />}
    </div>
  )
}

export default App

