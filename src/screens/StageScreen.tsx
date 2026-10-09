import { useEffect, useState } from 'react'
import { STAGES, TIMELINE } from '../content/stages'
import { StageFrame } from '../components/ui/StageFrame'
import { petals } from '../lib/confetti'
import { useNow } from '../hooks/useNow'
import { useUnlockContext } from '../hooks/useUnlockContext'
import { STAGE_COMPONENTS } from '../stages'
import { useStore } from '../state/store'
import type { StageId } from '../state/types'
import { isOpen } from '../state/unlock'
import { Timeline } from './Timeline'

/** Routes a stage id to its frame and content. A locked id falls back to the timeline. */
export function StageScreen({ id }: { id: StageId }) {
  const now = useNow()
  const ctx = useUnlockContext()
  const stamped = useStore((s) => Boolean(s.stamps[id]))
  const { navigate, stamp, markOpened } = useStore.getState()
  const [justStamped, setJustStamped] = useState(false)
  const open = isOpen(id, ctx, now)

  useEffect(() => {
    if (open) markOpened(id)
  }, [open, id, markOpened])

  const stage = STAGES.find((s) => s.id === id)
  if (!stage || !open) return <Timeline />
  const Content = STAGE_COMPONENTS[id]
  const toTimeline = () => navigate({ name: 'timeline' })

  return (
    <StageFrame
      id={id}
      title={stage.title}
      message={stage.message}
      stamped={stamped}
      justStamped={justStamped}
      backLabel={TIMELINE.backLabel}
      stampedLabel={TIMELINE.stampedLabel}
      onBack={toTimeline}
      onDone={() => {
        stamp(id, new Date(now).toISOString())
        setJustStamped(true)
        petals()
      }}
    >
      <Content />
    </StageFrame>
  )
}
