// Wine wax disc with an irregular edge, gold highlight and a heart or "?" in the middle.

function edgePath(): string {
  const n = 18
  const pts: string[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    // deterministic wobble, no randomness so renders are stable
    const r = 44 + Math.sin(i * 2.7) * 2.2 + Math.cos(i * 1.3) * 1.6
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`)
  }
  return `M${pts.join('L')}Z`
}

const EDGE = edgePath()

export interface WaxSealProps {
  size?: number
  mark?: 'heart' | 'question'
  className?: string
}

export function WaxSeal({ size = 64, mark = 'heart', className = '' }: WaxSealProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`shadow-seal rounded-full ${className}`}
    >
      <path d={EDGE} className="fill-wine" />
      <circle cx="50" cy="50" r="31" className="fill-none stroke-gold" strokeOpacity="0.45" />
      <path
        d="M24 36 A30 30 0 0 1 46 21"
        className="fill-none stroke-gold"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      {mark === 'heart' ? (
        <path
          d="M50 67 C28 52 33 36 43 36 C47 36 50 39 50 42 C50 39 53 36 57 36 C67 36 72 52 50 67Z"
          className="fill-paper-deep"
          fillOpacity="0.9"
        />
      ) : (
        <text
          x="50"
          y="64"
          textAnchor="middle"
          fontSize="40"
          className="fill-paper-deep font-display"
          fontWeight="600"
        >
          ?
        </text>
      )}
    </svg>
  )
}
