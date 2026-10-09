import type { StageId } from '../../state/types'
import { Countdown } from './Countdown'
import { Stamp, StampSlot } from './Stamp'
import { UnlockOverlay } from './UnlockOverlay'
import { WaxSeal } from './WaxSeal'

export interface LockedEnvelopeProps {
  state: 'locked'
  /** Only the next envelope to open gets a countdown. */
  remainingMs?: number
  lockedLabel: string
}

export interface OpenEnvelopeProps {
  state: 'open'
  id: StageId
  title: string
  stamped: boolean
  stampedLabel: string
  onOpen: () => void
  /** Newly open and not seen yet: play the unlock animation once. */
  fresh?: boolean
  onUnlocked?: () => void
}

export type EnvelopeCardProps = LockedEnvelopeProps | OpenEnvelopeProps

function Flap({ up }: { up: boolean }) {
  return (
    <svg
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`absolute inset-x-0 h-12 w-full ${up ? 'top-0 -scale-y-100' : 'top-0'}`}
    >
      <path
        d="M0 0H100L50 38Z"
        className={up ? 'fill-paper-deep' : 'fill-blush'}
        stroke="currentColor"
        strokeWidth="0.6"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function EnvelopeCard(props: EnvelopeCardProps) {
  if (props.state === 'locked') {
    return (
      <div className="bg-blush shadow-card rounded-card text-gold relative flex min-h-36 flex-col items-center justify-center gap-3 overflow-hidden px-5 pt-10 pb-4">
        <Flap up={false} />
        <span className="sr-only">{props.lockedLabel}</span>
        <div className="relative z-10 -mt-2">
          <WaxSeal size={64} mark="question" />
        </div>
        {props.remainingMs !== undefined ? (
          <div className="relative z-10">
            <Countdown remainingMs={props.remainingMs} />
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={props.onOpen}
      className="bg-paper-deep shadow-card rounded-card text-gold relative flex min-h-36 w-full items-end justify-between gap-3 overflow-hidden px-5 pt-14 pb-5 text-left touch-manipulation motion-safe:active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine"
    >
      <Flap up />
      {props.fresh && props.onUnlocked ? <UnlockOverlay onDone={props.onUnlocked} /> : null}
      <span className="text-wine font-display relative z-10 text-3xl leading-tight font-semibold">
        {props.title}
      </span>
      <span className="relative z-10 shrink-0">
        {props.stamped ? <Stamp id={props.id} label={props.stampedLabel} /> : <StampSlot />}
      </span>
    </button>
  )
}
