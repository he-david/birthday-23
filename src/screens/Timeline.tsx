import { STAGES, TIMELINE } from '../content/stages'
import { SealTrigger } from '../components/admin/SealTrigger'
import { EnvelopeCard } from '../components/ui/EnvelopeCard'
import { Page } from '../components/ui/Page'
import { useNow } from '../hooks/useNow'
import { useUnlockContext } from '../hooks/useUnlockContext'
import { useStore } from '../state/store'
import { effectiveTime, isOpen, nextLockedStage } from '../state/unlock'

export function Timeline() {
  const now = useNow()
  const ctx = useUnlockContext()
  const stamps = useStore((s) => s.stamps)
  const navigate = useStore((s) => s.navigate)
  const next = nextLockedStage(ctx, now)

  return (
    <Page>
      <header className="flex flex-col items-center pb-6">
        <SealTrigger />
        <h1 className="font-display text-wine text-center text-4xl font-semibold">
          {TIMELINE.heading}
        </h1>
      </header>
      <ol className="flex flex-col gap-4">
        {STAGES.map((stage) => (
          <li key={stage.id}>
            {isOpen(stage.id, ctx, now) ? (
              <EnvelopeCard
                state="open"
                id={stage.id}
                title={stage.title}
                stamped={Boolean(stamps[stage.id])}
                stampedLabel={TIMELINE.stampedLabel}
                onOpen={() => navigate({ name: 'stage', id: stage.id })}
              />
            ) : (
              <EnvelopeCard
                state="locked"
                lockedLabel={TIMELINE.lockedHint}
                remainingMs={stage.id === next ? effectiveTime(stage.id, ctx) - now : undefined}
              />
            )}
          </li>
        ))}
      </ol>
    </Page>
  )
}
