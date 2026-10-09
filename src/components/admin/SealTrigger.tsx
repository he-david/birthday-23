import { useRef, useState } from 'react'
import { registerTap } from '../../lib/tapCounter'
import { useStore } from '../../state/store'
import { WaxSeal } from '../ui/WaxSeal'
import { PinPad } from './PinPad'

/** The wax seal in a header. Five quick taps open the admin (PIN pad, or straight in under DEV). */
export function SealTrigger({ size = 48 }: { size?: number }) {
  const navigate = useStore((s) => s.navigate)
  const taps = useRef<number[]>([])
  const [pinOpen, setPinOpen] = useState(false)

  const onTap = () => {
    const result = registerTap(taps.current, Date.now())
    taps.current = result.taps
    if (!result.triggered) return
    if (import.meta.env.DEV) navigate({ name: 'admin' })
    else setPinOpen(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={onTap}
        aria-label="Pecsét"
        className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full touch-manipulation"
      >
        <WaxSeal size={size} />
      </button>
      {pinOpen && (
        <PinPad
          onCancel={() => setPinOpen(false)}
          onSuccess={() => {
            setPinOpen(false)
            navigate({ name: 'admin' })
          }}
        />
      )}
    </>
  )
}
