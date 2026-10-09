import { LUNCH } from '../../content/stages'
import { bestBite } from '../../lib/finale'
import { addRating, MAX_HEARTS, setRatingHearts, setRatingName } from '../../lib/ratings'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" focusable="false">
      <path
        d="M12 20.5C4 15 3 10.5 5 7.8c1.8-2.4 5-1.9 7 .7 2-2.6 5.2-3.1 7-.7 2 2.7 1 7.2-7 12.7Z"
        className={filled ? 'fill-rose stroke-rose' : 'fill-none stroke-rose'}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Name what she ate and give it 1-5 hearts; the best one becomes "A nap falatja". */
export function Ratings() {
  const stored = useStore((s) => s.lunch.ratings)
  const setLunch = useStore((s) => s.setLunch)
  const rows = stored.length > 0 ? stored : [{ name: '', hearts: 0 }]
  const best = bestBite(stored)

  return (
    <section className="mt-10">
      <h2 className="text-wine font-display text-3xl font-semibold">{LUNCH.ratingTitle}</h2>
      <p className="font-body text-ink mt-2 text-base">{LUNCH.ratingHint}</p>
      <ul className="mt-4 flex flex-col gap-4">
        {rows.map((row, i) => (
          <li key={i} className="bg-paper-deep rounded-card px-4 py-3">
            <label htmlFor={`rating-${i}`} className="sr-only">
              {LUNCH.ratingNameLabel}
            </label>
            <input
              id={`rating-${i}`}
              type="text"
              autoComplete="off"
              placeholder={LUNCH.ratingNamePlaceholder}
              value={row.name}
              onChange={(e) => setLunch({ ratings: setRatingName(stored, i, e.target.value) })}
              className="bg-paper rounded-card font-body text-ink min-h-12 w-full border-2 border-transparent px-4 text-base focus:border-wine focus:outline-none"
            />
            <div className="mt-2 flex">
              {Array.from({ length: MAX_HEARTS }, (_, k) => k + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} ${LUNCH.heartLabel}`}
                  aria-pressed={row.hearts >= n}
                  onClick={() => setLunch({ ratings: setRatingHearts(stored, i, n) })}
                  className="flex size-12 items-center justify-center touch-manipulation focus-visible:outline-2 focus-visible:outline-wine"
                >
                  <Heart filled={row.hearts >= n} />
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        className="mt-4"
        onClick={() => setLunch({ ratings: addRating(rows) })}
      >
        {LUNCH.ratingAdd}
      </Button>
      {best ? (
        <p role="status" className="font-body text-ink mt-4 text-base">
          {LUNCH.bestBiteLine} <span className="font-bold">{best}</span>
        </p>
      ) : null}
    </section>
  )
}
