import type { ReactNode } from 'react'
import type { StageId } from '../../state/types'
import { Button } from './Button'
import { Page } from './Page'
import { Stamp } from './Stamp'

export interface StageFrameProps {
  id: StageId
  title: string
  message: string
  stamped: boolean
  /** True right after "Kész" so the stamp animates in. */
  justStamped?: boolean
  backLabel: string
  stampedLabel: string
  onBack: () => void
  onDone: () => void
  children?: ReactNode
}

/** Common frame of every open stage: back chevron, title, Dávid's message, content, Kész. */
export function StageFrame(props: StageFrameProps) {
  const { id, title, message, stamped, justStamped, backLabel, stampedLabel, children } = props
  return (
    <Page>
      <header className="flex items-center gap-1">
        <button
          type="button"
          onClick={props.onBack}
          aria-label={backLabel}
          className="text-wine -ml-3 flex size-12 items-center justify-center touch-manipulation"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
      </header>
      <div className="flex items-start justify-between gap-4 pt-2">
        <h1 className="text-wine font-display text-4xl leading-tight font-semibold">{title}</h1>
        {stamped ? <Stamp id={id} animate={justStamped} label={stampedLabel} /> : null}
      </div>
      {message ? (
        <blockquote className="bg-paper-deep border-gold font-hand text-ink mt-6 rounded-r-lg border-l-4 px-4 py-4 text-2xl leading-snug">
          {message}
        </blockquote>
      ) : null}
      <div className="mt-6 flex-1">{children}</div>
      <div className="mt-8 flex flex-col gap-3">
        {stamped ? (
          <Button variant="secondary" onClick={props.onBack}>
            {backLabel}
          </Button>
        ) : (
          <Button onClick={props.onDone}>Kész</Button>
        )}
      </div>
    </Page>
  )
}
