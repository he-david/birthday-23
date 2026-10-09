import { useState } from 'react'
import { ADMIN, STAGES } from '../content/stages'
import { Button } from '../components/ui/Button'
import { Page } from '../components/ui/Page'
import { useNow } from '../hooks/useNow'
import { useUnlockContext } from '../hooks/useUnlockContext'
import { formatHm, formatShift, fromPickerValue, toPickerValue } from '../lib/clock'
import { clearAllPhotos } from '../lib/photos'
import { useStore } from '../state/store'
import { effectiveTime, isOpen, nextLockedStage } from '../state/unlock'

const SECTION = 'bg-paper-deep rounded-card flex flex-col gap-3 p-4'
const HEADING = 'font-display text-wine text-2xl font-semibold'

export function Admin() {
  const now = useNow()
  const ctx = useUnlockContext()
  const shiftMinutes = useStore((s) => s.shiftMinutes)
  const simulatedNow = useStore((s) => s.simulatedNow)
  const { navigate, forceNext, shiftBy, setSimulatedNow, reset } = useStore.getState()
  const [picked, setPicked] = useState(toPickerValue(now))
  const [confirming, setConfirming] = useState(false)
  const hasNext = nextLockedStage(ctx, now) !== undefined

  const applyPreview = () => {
    const iso = fromPickerValue(picked)
    if (iso) setSimulatedNow(iso)
  }

  const wipe = async () => {
    await clearAllPhotos()
    reset()
    setConfirming(false)
  }

  return (
    <Page className="gap-5">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-wine text-4xl font-semibold">{ADMIN.title}</h1>
        <Button
          className="!w-auto"
          variant="secondary"
          onClick={() => navigate({ name: 'timeline' })}
        >
          {ADMIN.back}
        </Button>
      </header>

      <Button onClick={() => forceNext(now)} disabled={!hasNext} className="disabled:opacity-50">
        {hasNext ? ADMIN.forceNext : ADMIN.forceNone}
      </Button>

      <section className={SECTION}>
        <h2 className={HEADING}>{ADMIN.shiftHeading}</h2>
        <p className="font-body text-ink text-base">
          {ADMIN.shiftNow}: <strong data-testid="shift">{formatShift(shiftMinutes)}</strong>
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => shiftBy(-15, now)}>
            {ADMIN.shiftMinus}
          </Button>
          <Button variant="secondary" onClick={() => shiftBy(15, now)}>
            {ADMIN.shiftPlus}
          </Button>
        </div>
        <ul className="font-body text-ink flex flex-col gap-1 text-base">
          {STAGES.map((s) => (
            <li key={s.id} className="flex justify-between">
              <span>{s.title}</span>
              <span>
                {formatHm(effectiveTime(s.id, ctx))}
                {isOpen(s.id, ctx, now) ? ' ✓' : ''}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className={SECTION}>
        <h2 className={HEADING}>{ADMIN.previewHeading}</h2>
        <input
          type="datetime-local"
          value={picked}
          onChange={(e) => setPicked(e.target.value)}
          aria-label={ADMIN.previewHeading}
          className="bg-paper font-body text-ink min-h-12 rounded-card border border-gold px-3 text-base"
        />
        <Button onClick={applyPreview}>{ADMIN.previewApply}</Button>
        <Button
          variant="secondary"
          onClick={() => setSimulatedNow(undefined)}
          disabled={!simulatedNow}
        >
          {ADMIN.realTime}
        </Button>
      </section>

      <section className={SECTION}>
        {confirming ? (
          <>
            <p className="font-body text-ink text-base">{ADMIN.resetConfirm}</p>
            <Button onClick={() => void wipe()}>{ADMIN.resetYes}</Button>
            <Button variant="secondary" onClick={() => setConfirming(false)}>
              {ADMIN.cancel}
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            {ADMIN.resetAll}
          </Button>
        )}
      </section>
    </Page>
  )
}
