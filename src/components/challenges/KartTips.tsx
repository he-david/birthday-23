import { useState } from 'react'
import { KART } from '../../content/stages'
import { parseLap } from '../../lib/kart'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'
import { LapInput } from './LapInput'
import { OptionTile } from './OptionTile'

/** Predictions before the race. "Rajt" locks both. */
export function KartTips() {
  const setKart = useStore((s) => s.setKart)
  const [lap, setLap] = useState('')
  const [winner, setWinner] = useState<'her' | 'david' | undefined>()

  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{KART.tipsTitle}</h2>
      <div className="mt-4">
        <LapInput id="tip-lap" label={KART.lapPrompt} value={lap} onChange={setLap} />
      </div>
      <h3 className="font-body text-ink mt-6 text-base font-bold">{KART.winnerPrompt}</h3>
      <div className="mt-3 flex flex-col gap-3">
        {KART.winnerOptions.map((o) => (
          <OptionTile
            key={o.value}
            label={o.label}
            selected={winner === o.value}
            onSelect={() => setWinner(o.value)}
          />
        ))}
      </div>
      <div className="mt-6">
        <Button
          onClick={() =>
            setKart({ predictedLap: parseLap(lap), predictedWinner: winner, locked: true })
          }
        >
          {KART.startLabel}
        </Button>
      </div>
    </section>
  )
}
