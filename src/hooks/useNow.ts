import { useEffect, useState } from 'react'
import { useStore } from '../state/store'
import { currentNowMs } from '../state/unlock'

const TICK_MS = 15_000

/** The only clock for UI. Ticks every 15 s and on visibilitychange; honours preview mode. */
export function useNow(): number {
  const simulatedNow = useStore((s) => s.simulatedNow)
  const [real, setReal] = useState(() => Date.now())

  useEffect(() => {
    const update = () => setReal(Date.now())
    const id = window.setInterval(update, TICK_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible') update()
    }
    document.addEventListener('visibilitychange', onVisible)
    update()
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return currentNowMs(real, simulatedNow)
}
