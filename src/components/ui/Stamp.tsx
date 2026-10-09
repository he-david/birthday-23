import type { StageId } from '../../state/types'
import { StampIcon } from './StampIcon'

const ROTATIONS: Record<StageId, number> = {
  prep: -3,
  drive1: 2,
  siofok: -4,
  lunch: 3,
  drive2: -2,
  kart: 4,
  finale: -1,
}

export interface StampProps {
  id: StageId
  /** Play the press-down animation (only under motion-safe). */
  animate?: boolean
  label?: string
}

/** Postage stamp with a perforated edge, gold frame and one line icon per stage. */
export function Stamp({ id, animate = false, label }: StampProps) {
  const rot = ROTATIONS[id]
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block ${animate ? 'motion-safe:animate-stamp' : ''}`}
      style={{ transform: `rotate(${rot}deg)`, ['--stamp-rot' as string]: `${rot}deg` }}
    >
      <div className="stamp-perf bg-paper h-[100px] w-20 p-[9px]">
        <div className="border-gold text-wine flex h-full w-full items-center justify-center border">
          <StampIcon id={id} />
        </div>
      </div>
    </div>
  )
}

/** Empty slot shown on an open envelope that has no stamp yet. */
export function StampSlot() {
  return (
    <div
      aria-hidden="true"
      className="border-gold/60 h-[70px] w-14 rounded-sm border border-dashed"
    />
  )
}
