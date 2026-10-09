import { KartResult } from '../components/challenges/KartResult'
import { KartTips } from '../components/challenges/KartTips'
import { PhotoTask } from '../components/challenges/PhotoTask'
import { KART } from '../content/stages'
import { useStore } from '../state/store'

export function Kart() {
  const locked = useStore((s) => s.kart.locked === true)
  return (
    <div className="flex flex-col gap-8">
      {locked ? <KartResult /> : <KartTips />}
      <PhotoTask task={KART.photo} />
    </div>
  )
}
