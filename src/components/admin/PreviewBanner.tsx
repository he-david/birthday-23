import { ADMIN } from '../../content/stages'
import { useStore } from '../../state/store'

/** Fixed banner on every screen while preview mode is active. The in-flow spacer keeps content visible. */
export function PreviewBanner() {
  const active = useStore((s) => Boolean(s.simulatedNow))
  if (!active) return null
  const bar =
    'bg-wine text-paper font-body w-full pt-[env(safe-area-inset-top)] text-center text-xs font-bold tracking-widest'
  return (
    <>
      <div aria-hidden="true" className={`${bar} invisible`}>
        <div className="h-6 leading-6">{ADMIN.previewBanner}</div>
      </div>
      <div role="status" className={`${bar} pointer-events-none fixed inset-x-0 top-0 z-50`}>
        <div className="h-6 leading-6">{ADMIN.previewBanner}</div>
      </div>
    </>
  )
}
