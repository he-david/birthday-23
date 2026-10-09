import { useMemo } from 'react'
import { useStore } from '../state/store'
import type { UnlockContext } from '../state/unlock'

/** Unlock-relevant slice of the store, stable between unrelated updates. */
export function useUnlockContext(): UnlockContext {
  const shiftMinutes = useStore((s) => s.shiftMinutes)
  const forcedUnlocked = useStore((s) => s.forcedUnlocked)
  const opened = useStore((s) => s.opened)
  return useMemo(
    () => ({ shiftMinutes, forcedUnlocked, opened }),
    [shiftMinutes, forcedUnlocked, opened],
  )
}
