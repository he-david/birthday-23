import { Collage } from '../components/challenges/Collage'
import { DayStats } from '../components/challenges/DayStats'
import { Stamp } from '../components/ui/Stamp'
import { FINALE, STAGES, TIMELINE } from '../content/stages'
import { useStore } from '../state/store'

export function Finale() {
  const stamps = useStore((s) => s.stamps)
  const earned = STAGES.filter((s) => stamps[s.id])

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h2 className="text-wine font-display text-3xl font-semibold">{FINALE.stampsTitle}</h2>
        {earned.length === 0 ? (
          <p className="font-body text-ink mt-3 text-base">{FINALE.noStamps}</p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-4">
            {earned.map((s) => (
              <li key={s.id}>
                <Stamp id={s.id} label={`${TIMELINE.stampedLabel}: ${s.title}`} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <DayStats />

      <Collage />

      {FINALE.letter ? (
        <section>
          <h2 className="text-wine font-display text-3xl font-semibold">{FINALE.letterTitle}</h2>
          <div className="bg-paper-deep border-gold rounded-card mt-3 border px-5 py-6 shadow-card">
            <p className="font-hand text-ink text-3xl leading-snug whitespace-pre-line">
              {FINALE.letter}
            </p>
          </div>
        </section>
      ) : null}

      <p className="text-wine font-display text-center text-4xl leading-tight font-semibold">
        {FINALE.closingLine}
      </p>
    </div>
  )
}
