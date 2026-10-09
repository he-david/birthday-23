import type { ReactNode } from 'react'
import type { StageId } from '../../state/types'

const ICONS: Record<StageId, ReactNode> = {
  // folded shirt
  prep: <path d="M8 6 4 9l2 4 2-1v8h8v-8l2 1 2-4-4-3c-.5 1.5-2 2-4 2S8.5 7.5 8 6Z" />,
  // road in perspective
  drive1: (
    <>
      <path d="M9 3 4 21M15 3l5 18" />
      <path d="M12 5v3M12 11v3M12 17v3" />
    </>
  ),
  // tower
  siofok: (
    <>
      <path d="M9 21V10l-2-3h10l-2 3v11" />
      <path d="M8 7V4h8v3M10 14h4" />
    </>
  ),
  // bowl with chopsticks
  lunch: (
    <>
      <path d="M4 12h16a8 8 0 0 1-16 0Z" />
      <path d="m9 10 7-7M12 10l6-6" />
    </>
  ),
  drive2: (
    <>
      <path d="M9 3 4 21M15 3l5 18" />
      <path d="M12 5v3M12 11v3M12 17v3" />
    </>
  ),
  // chequered flag
  kart: (
    <>
      <path d="M6 21V4M6 5h12v8H6" />
      <path d="M10 5v8M14 5v8M6 9h12" />
    </>
  ),
  // envelope with heart
  finale: (
    <>
      <path d="M3 6h18v12H3zM3 7l9 7 9-7" />
    </>
  ),
}

export function StampIcon({ id }: { id: StageId }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="36"
      height="36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[id]}
    </svg>
  )
}
