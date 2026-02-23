import { useEffect, useState } from 'react'

export function useIsLandscape(): boolean {
  const [landscape, setLandscape] = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia('(orientation: landscape)').matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(orientation: landscape)')
    const handler = (e: MediaQueryListEvent) => setLandscape(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return landscape
}
