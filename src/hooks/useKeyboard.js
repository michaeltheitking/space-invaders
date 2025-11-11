import { useRef, useEffect } from 'react'

export const useKeyboard = () => {
  const keysRef = useRef({})
  const keysStateRef = useRef({})

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase()
      keysRef.current[key] = true
      keysStateRef.current[key] = true
    }

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase()
      keysRef.current[key] = false
      keysStateRef.current[key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Return both ref and state for compatibility
  return { keysRef, keys: keysStateRef.current }
}

