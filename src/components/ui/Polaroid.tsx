import type { ReactNode } from 'react'

export interface PolaroidProps {
  children?: ReactNode
  caption?: string
  rotation?: number
}

/** Static polaroid look. Photo wiring comes with the photo tasks. */
export function Polaroid({ children, caption, rotation = -2 }: PolaroidProps) {
  return (
    <figure
      className="bg-paper shadow-card mx-auto w-full max-w-[16rem] rounded-sm p-3 pb-4"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="bg-paper-deep aspect-square w-full overflow-hidden rounded-sm">
        {children}
      </div>
      {caption ? (
        <figcaption className="font-hand text-ink mt-3 text-center text-2xl">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
