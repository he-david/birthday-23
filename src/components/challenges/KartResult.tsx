import { useState } from 'react'
import { KART } from '../../content/stages'
import { formatLap, kartResult, parseLap, type Racer } from '../../lib/kart'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'
import { LapInput } from './LapInput'

const name = (who: Racer) => (who === 'her' ? KART.you : KART.david)

function TipSummary() {
  const { predictedLap, predictedWinner } = useStore((s) => s.kart)
  return (
    <div className="bg-paper-deep rounded-card font-body text-ink px-5 py-4 text-base">
      <p className="font-bold">{KART.locked}</p>
      <p className="mt-2">
        {KART.tipLapLabel}:{' '}
        {predictedLap === undefined ? KART.noTip : `${formatLap(predictedLap)} ${KART.lapUnit}`}
      </p>
      <p>
        {KART.tipWinnerLabel}: {predictedWinner === undefined ? KART.noTip : name(predictedWinner)}
      </p>
    </div>
  )
}

function Podium({ herLap, davidLap }: { herLap: number; davidLap: number }) {
  const { predictedLap, predictedWinner } = useStore((s) => s.kart)
  const result = kartResult({ herLap, davidLap, predictedLap, predictedWinner })
  return (
    <div className="mt-6">
      <h3 className="text-wine font-display text-3xl font-semibold">{KART.podiumTitle}</h3>
      <p className="text-wine font-display mt-2 text-4xl font-semibold">
        {result.winner === 'tie' ? KART.tieLine : `${KART.winnerLine} ${name(result.winner)}`}
      </p>
      <ol className="mt-4 flex flex-col gap-2">
        {result.podium.map((p) => (
          <li
            key={p.who}
            className="bg-paper-deep rounded-card font-body text-ink flex min-h-12 items-center justify-between px-5 py-3 text-base"
          >
            <span className="font-bold">
              {p.place}. {name(p.who)}
            </span>
            <span>
              {formatLap(p.lap)} {KART.lapUnit}
            </span>
          </li>
        ))}
      </ol>
      <div className="font-body text-ink mt-4 text-base">
        {predictedLap !== undefined ? (
          <>
            <p>
              {KART.predicted}: {formatLap(predictedLap)} {KART.lapUnit}
            </p>
            <p>
              {KART.real}: {formatLap(herLap)} {KART.lapUnit}
            </p>
            {result.lapDiff !== undefined ? (
              <p>
                {KART.diff}: {result.lapDiff > 0 ? '+' : ''}
                {formatLap(result.lapDiff)} {KART.lapUnit}
              </p>
            ) : null}
          </>
        ) : null}
        {result.winnerHit !== undefined ? (
          <p className="mt-1 font-bold">{result.winnerHit ? KART.winnerHit : KART.winnerMiss}</p>
        ) : null}
      </div>
    </div>
  )
}

/** After the race: both best laps, then the podium. */
export function KartResult() {
  const { herLap, davidLap } = useStore((s) => s.kart)
  const setKart = useStore((s) => s.setKart)
  const [her, setHer] = useState('')
  const [david, setDavid] = useState('')
  const herParsed = parseLap(her)
  const davidParsed = parseLap(david)

  return (
    <section>
      <TipSummary />
      <h2 className="text-wine font-display mt-6 text-3xl font-semibold">{KART.resultTitle}</h2>
      {herLap !== undefined && davidLap !== undefined ? (
        <Podium herLap={herLap} davidLap={davidLap} />
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <LapInput id="her-lap" label={KART.herLapLabel} value={her} onChange={setHer} />
          <LapInput id="david-lap" label={KART.davidLapLabel} value={david} onChange={setDavid} />
          <Button
            disabled={herParsed === undefined || davidParsed === undefined}
            className="disabled:opacity-60"
            onClick={() => setKart({ herLap: herParsed, davidLap: davidParsed })}
          >
            {KART.showResult}
          </Button>
        </div>
      )}
    </section>
  )
}
