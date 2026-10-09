import { PhotoPlaceholder } from '../components/challenges/PhotoPlaceholder'
import { Trivia } from '../components/challenges/Trivia'
import { SIOFOK_PHOTOS, TRIVIA_UI } from '../content/stages'

export function Siofok() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-wine font-display text-3xl font-semibold">{TRIVIA_UI.photosTitle}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {SIOFOK_PHOTOS.map((task) => (
            <PhotoPlaceholder key={task.id} task={task} />
          ))}
        </div>
      </section>
      <Trivia />
    </div>
  )
}
