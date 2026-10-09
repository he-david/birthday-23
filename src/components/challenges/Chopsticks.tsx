import { useEffect, useState } from 'react'
import { LUNCH } from '../../content/stages'
import { parseCount, remainingSeconds } from '../../lib/timer'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'

const DURATION_MS = LUNCH.chopstickSeconds * 1000

/** 30 s timer based on the start timestamp (so backgrounding cannot stall it) and a count field. */
export function Chopsticks() {
  const chopsticks = useStore((s) => s.lunch.chopsticks)
  const setLunch = useStore((s) => s.setLunch)
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined)
  const [now, setNow] = useState(() => Date.now())
  const [text, setText] = useState(chopsticks === undefined ? '' : String(chopsticks))

  const running = startedAt !== undefined && remainingSeconds(startedAt, now, DURATION_MS) > 0
  const done = startedAt !== undefined && !running
  const seconds =
    startedAt === undefined ? LUNCH.chopstickSeconds : remainingSeconds(startedAt, now, DURATION_MS)

  useEffect(() => {
    if (!running) return
    const tick = () => setNow(Date.now())
    const id = window.setInterval(tick, 250)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [running])

  const start = () => {
    const t = Date.now()
    setNow(t)
    setStartedAt(t)
  }

  const onCount = (value: string) => {
    setText(value)
    setLunch({ chopsticks: parseCount(value) })
  }

  return (
    <section className="mt-10">
      <h2 className="text-wine font-display text-3xl font-semibold">{LUNCH.chopstickTitle}</h2>
      <p className="font-body text-ink mt-2 text-base">{LUNCH.chopstickPrompt}</p>
      <div className="mt-4 flex items-center gap-4">
        <div
          role="timer"
          aria-label={LUNCH.timerAria}
          className="bg-blush text-wine font-display rounded-card flex h-20 min-w-24 items-center justify-center px-4 text-5xl font-semibold tabular-nums"
        >
          {seconds}
        </div>
        <Button onClick={start} disabled={running} className="disabled:opacity-60">
          {done ? LUNCH.timerAgain : LUNCH.timerStart}
        </Button>
      </div>
      <p role="status" className="font-body text-ink mt-2 min-h-6 text-base">
        {running ? LUNCH.timerRunning : done ? LUNCH.timerDone : ''}
      </p>
      <label htmlFor="chopsticks" className="font-body text-ink mt-3 block text-base font-bold">
        {LUNCH.chopstickCountLabel}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id="chopsticks"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={text}
          onChange={(e) => onCount(e.target.value)}
          className="bg-paper-deep rounded-card font-body text-ink min-h-12 w-full border-2 border-transparent px-4 text-base focus:border-wine focus:outline-none"
        />
        <span className="font-body text-ink text-base">{LUNCH.chopstickUnit}</span>
      </div>
    </section>
  )
}
