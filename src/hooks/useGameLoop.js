import { useEffect, useRef } from 'react'

export const useGameLoop = (callback, isRunning) => {
  const frameRef = useRef()
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    if (!isRunning) return

    const loop = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      callback(deltaTime)

      frameRef.current = requestAnimationFrame(loop)
    }

    frameRef.current = requestAnimationFrame(loop)

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [callback, isRunning])
}

