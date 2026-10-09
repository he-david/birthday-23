import confetti from 'canvas-confetti'

const FALLBACK = { rose: '#c96f7b', blush: '#f2d5d0', gold: '#b5915a' }

const reducedMotion = (): boolean =>
  typeof window === 'undefined' ||
  typeof window.matchMedia !== 'function' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function themeColors(): string[] {
  const css = getComputedStyle(document.documentElement)
  const pick = (name: keyof typeof FALLBACK) =>
    css.getPropertyValue(`--color-${name}`).trim() || FALLBACK[name]
  return [pick('rose'), pick('blush'), pick('gold')]
}

/** Petal burst in rose, blush and gold. Does nothing under prefers-reduced-motion. */
export function petals(origin: { x: number; y: number } = { x: 0.5, y: 0.6 }): void {
  if (reducedMotion()) return
  try {
    const petal = confetti.shapeFromPath({ path: 'M0 10 C0 0 10 0 10 10 C10 20 0 20 0 10Z' })
    void confetti({
      particleCount: 60,
      spread: 75,
      startVelocity: 32,
      gravity: 0.7,
      ticks: 220,
      scalar: 1.2,
      origin,
      colors: themeColors(),
      shapes: [petal],
      disableForReducedMotion: true,
    })
  } catch {
    // Decoration only: never let it break the app.
  }
}
