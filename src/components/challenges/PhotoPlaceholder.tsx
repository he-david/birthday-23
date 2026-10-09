import type { PhotoTaskDef } from '../../content/stages'
import { TRIVIA_UI } from '../../content/stages'

/** Plain stand-in for the photo task card until the photo tasks land (M3). */
export function PhotoPlaceholder({ task }: { task: PhotoTaskDef }) {
  return (
    <div className="bg-paper-deep rounded-card px-5 py-4">
      <p className="font-body text-ink text-base font-bold">{task.prompt}</p>
      <p className="font-body text-ink mt-1 text-sm">{TRIVIA_UI.photoSoon}</p>
    </div>
  )
}
