import { FINALE, TRIVIA } from '../../content/stages'
import { finaleStats, formatLap, type Stat } from '../../lib/finale'
import { useStore } from '../../state/store'

function describe(stat: Stat): { label: string; value: string } {
  switch (stat.key) {
    case 'drive1':
    case 'drive2':
      return { label: FINALE.driveNames[stat.key], value: FINALE.hintStat(Number(stat.value)) }
    case 'trivia':
      return { label: FINALE.triviaStat, value: `${stat.value}/${stat.of ?? 0}` }
    case 'chopsticks':
      return { label: FINALE.chopsticksStat, value: String(stat.value) }
    case 'bestBite':
      return { label: FINALE.bestBiteStat, value: String(stat.value) }
    case 'herLap':
      return {
        label: FINALE.herLapStat,
        value: `${formatLap(Number(stat.value))} ${FINALE.lapUnit}`,
      }
    case 'davidLap':
      return {
        label: FINALE.davidLapStat,
        value: `${formatLap(Number(stat.value))} ${FINALE.lapUnit}`,
      }
  }
}

/** "A nap számokban": only values she actually produced. */
export function DayStats() {
  const guesses = useStore((s) => s.guesses)
  const trivia = useStore((s) => s.trivia)
  const lunch = useStore((s) => s.lunch)
  const kart = useStore((s) => s.kart)
  const stats = finaleStats({ guesses, trivia, lunch, kart }, TRIVIA)

  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{FINALE.statsTitle}</h2>
      {stats.length === 0 ? (
        <p className="font-body text-ink mt-3 text-base">{FINALE.noStats}</p>
      ) : (
        <dl className="mt-3 flex flex-col gap-2">
          {stats.map((stat) => {
            const { label, value } = describe(stat)
            return (
              <div
                key={stat.key}
                className="bg-paper-deep rounded-card flex items-baseline justify-between gap-4 px-4 py-3"
              >
                <dt className="font-body text-ink text-base">{label}</dt>
                <dd className="text-wine font-display text-2xl font-semibold">{value}</dd>
              </div>
            )
          })}
        </dl>
      )}
    </section>
  )
}
