import { useEffect, useRef, useState } from 'react'
import { LUNCH } from '../../content/stages'
import { pickSegment, spinsLeft, targetRotation } from '../../lib/wheel'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'

const COUNT = LUNCH.wheelSegments.length
const R = 100
const SPIN_MS = 3200

const point = (deg: number, r: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180
  return [R + r * Math.cos(a), R + r * Math.sin(a)]
}

function slicePath(i: number): string {
  const seg = 360 / COUNT
  const [x1, y1] = point(i * seg, R - 2)
  const [x2, y2] = point((i + 1) * seg, R - 2)
  return `M ${R} ${R} L ${x1} ${y1} A ${R - 2} ${R - 2} 0 0 1 ${x2} ${y2} Z`
}

/** Wraps a label into at most two lines near the middle. */
function wrap(label: string): string[] {
  const words = label.split(' ')
  if (words.length < 2) return [label]
  let best = 1
  let diff = Infinity
  for (let k = 1; k < words.length; k++) {
    const d = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length)
    if (d < diff) {
      diff = d
      best = k
    }
  }
  return [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

const reducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Six-segment sushi wheel, two spins at most; every spin is saved at once. */
export function Wheel() {
  const spins = useStore((s) => s.lunch.spins)
  const setLunch = useStore((s) => s.setLunch)
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const left = spinsLeft(spins.length, LUNCH.maxSpins)
  const result = spinning ? undefined : spins[spins.length - 1]

  const spin = () => {
    if (left === 0 || spinning) return
    const index = pickSegment(Math.random(), COUNT)
    const label = LUNCH.wheelSegments[index] ?? ''
    setLunch({ spins: [...spins, label] })
    setRotation((prev) => targetRotation(prev, index, COUNT))
    if (reducedMotion()) return
    setSpinning(true)
    timer.current = window.setTimeout(() => setSpinning(false), SPIN_MS)
  }

  const seg = 360 / COUNT
  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{LUNCH.wheelTitle}</h2>
      <div className="relative mx-auto mt-4 w-64 max-w-full">
        <svg
          viewBox="0 0 200 212"
          role="img"
          aria-label={LUNCH.wheelAria}
          className="block w-full overflow-visible"
        >
          <g transform="translate(0 12)">
            <g
              className="motion-safe:transition-transform motion-safe:duration-[3200ms] motion-safe:ease-out"
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${R}px ${R}px` }}
            >
              {LUNCH.wheelSegments.map((label, i) => {
                const mid = (i + 0.5) * seg
                const lines = wrap(label)
                return (
                  <g key={label}>
                    <path
                      d={slicePath(i)}
                      className={i % 2 === 0 ? 'fill-blush' : 'fill-paper-deep'}
                      stroke="var(--color-gold)"
                      strokeWidth="1"
                    />
                    <text
                      transform={`rotate(${mid} ${R} ${R})`}
                      className="fill-ink font-body"
                      fontSize="6.5"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {lines.map((line, k) => (
                        <tspan key={line} x={R} y={R - 62 + k * 8}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  </g>
                )
              })}
              <circle cx={R} cy={R} r="9" className="fill-wine" />
            </g>
            <path d={`M ${R - 9} -8 L ${R + 9} -8 L ${R} 12 Z`} className="fill-wine" />
          </g>
        </svg>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Button onClick={spin} disabled={left === 0 || spinning}>
          {LUNCH.spinLabel}
        </Button>
        <p className="font-body text-ink text-base">
          {left > 0 ? `${LUNCH.spinsLeft} ${left}` : LUNCH.noSpinsLeft}
        </p>
      </div>

      <div role="status" className="mt-4">
        {result ? (
          <>
            <p className="font-body text-ink text-base">{LUNCH.resultLabel}</p>
            <p className="text-wine font-display text-4xl leading-tight font-semibold">{result}</p>
          </>
        ) : null}
      </div>
      {spins.length > 1 && !spinning ? (
        <p className="font-body text-ink mt-2 text-sm">{spins.join(' · ')}</p>
      ) : null}
    </section>
  )
}
