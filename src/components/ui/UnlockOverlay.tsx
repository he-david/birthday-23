import { useEffect } from 'react'
import { WaxSeal } from './WaxSeal'

export const UNLOCK_MS = 700

export interface UnlockOverlayProps {
  /** Called once the animation has played, so it never plays again for this stage. */
  onDone: () => void
}

/**
 * Closed blush envelope laid over a freshly opened card: the seal cracks in two,
 * the flap lifts, the cover fades away (about 600 ms). Hidden under reduced motion.
 */
export function UnlockOverlay({ onDone }: UnlockOverlayProps) {
  useEffect(() => {
    const id = window.setTimeout(onDone, UNLOCK_MS)
    return () => window.clearTimeout(id)
  }, [onDone])

  return (
    <div
      aria-hidden="true"
      className="rounded-card pointer-events-none absolute inset-0 z-20 hidden motion-safe:block"
    >
      <div className="bg-blush rounded-card motion-safe:animate-unlock-cover absolute inset-0" />
      <div className="text-gold absolute inset-x-0 top-0 h-12 origin-top [perspective:600px]">
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          focusable="false"
          className="motion-safe:animate-unlock-flap h-12 w-full origin-top"
        >
          <path
            d="M0 0H100L50 38Z"
            className="fill-blush"
            stroke="currentColor"
            strokeWidth="0.6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
      <div className="absolute top-8 left-1/2 -ml-8 size-16">
        <div className="motion-safe:animate-unlock-seal-left absolute inset-0 [clip-path:inset(0_50%_0_0)]">
          <WaxSeal size={64} mark="heart" />
        </div>
        <div className="motion-safe:animate-unlock-seal-right absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          <WaxSeal size={64} mark="heart" />
        </div>
      </div>
    </div>
  )
}
