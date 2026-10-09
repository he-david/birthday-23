import { STAGES, WELCOME } from '../content/stages'
import { Countdown } from '../components/ui/Countdown'
import { Page } from '../components/ui/Page'
import { SealTrigger } from '../components/admin/SealTrigger'
import { useNow } from '../hooks/useNow'
import { useUnlockContext } from '../hooks/useUnlockContext'
import { effectiveTime } from '../state/unlock'

/** Before `prep` opens: one countdown and nothing else. */
export function Welcome() {
  const now = useNow()
  const ctx = useUnlockContext()
  const first = STAGES[0]
  const remaining = first ? effectiveTime(first.id, ctx) - now : 0
  return (
    <Page className="items-center justify-center gap-6 text-center">
      <SealTrigger size={80} />
      <h1 className="font-display text-wine text-4xl font-semibold">{WELCOME.heading}</h1>
      <p className="font-body text-ink text-base">{WELCOME.countdownLabel}</p>
      <Countdown remainingMs={remaining} size="lg" />
    </Page>
  )
}
