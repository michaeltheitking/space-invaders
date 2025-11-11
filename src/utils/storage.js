const HIGH_SCORE_KEY = 'spaceInvadersHighScore'

export const getHighScore = () => {
  const score = localStorage.getItem(HIGH_SCORE_KEY)
  return score ? parseInt(score, 10) : 0
}

export const setHighScore = (score) => {
  const currentHigh = getHighScore()
  if (score > currentHigh) {
    localStorage.setItem(HIGH_SCORE_KEY, score.toString())
    return true
  }
  return false
}

