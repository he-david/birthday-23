import { countdownLabel } from '../../state/unlock'

export interface CountdownProps {
  remainingMs: number
  size?: 'sm' | 'lg'
}

/** Blush chip with display-font text, e.g. "2 óra 14 perc múlva nyílik". */
export function Countdown({ remainingMs, size = 'sm' }: CountdownProps) {
  const sizeClass = size === 'lg' ? 'px-6 py-3 text-3xl' : 'px-3 py-1 text-xl'
  return (
    <span
      className={`bg-blush text-wine font-display inline-block rounded-full text-center font-semibold ${sizeClass}`}
    >
      {countdownLabel(remainingMs)}
    </span>
  )
}
