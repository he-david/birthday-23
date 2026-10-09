import type { ReactNode } from 'react'

export interface PolaroidProps {
  children?: ReactNode
  /** Photo URL; takes precedence over children. */
  src?: string | null
  alt?: string
  caption?: string
  rotation?: number
}

/** Polaroid frame: off-white, slight rotation, handwritten caption. */
export function Polaroid({ children, src, alt = '', caption, rotation = -2 }: PolaroidProps) {
  return (
    <figure
      className="bg-paper shadow-card mx-auto w-full max-w-[16rem] rounded-sm p-3 pb-4"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="bg-paper-deep aspect-square w-full overflow-hidden rounded-sm">
        {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : children}
      </div>
      {caption ? (
        <figcaption className="font-hand text-ink mt-3 text-center text-2xl">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
