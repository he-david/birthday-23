import { STAGES } from '../content/stages'
import type { StageId } from '../state/types'

/** Stub content shared by all stages until their real challenges land. */
export function Reveal({ id }: { id: StageId }) {
  const stage = STAGES.find((s) => s.id === id)
  if (!stage) return null
  return (
    <p className="font-display text-wine text-3xl leading-snug font-semibold">{stage.reveal}</p>
  )
}
