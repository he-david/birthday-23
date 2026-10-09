import { PreviewBanner } from './components/admin/PreviewBanner'
import { Admin } from './screens/Admin'
import { InstallGate } from './screens/InstallGate'
import { StageScreen } from './screens/StageScreen'
import { Timeline } from './screens/Timeline'
import { Welcome } from './screens/Welcome'
import { isStandalone } from './lib/standalone'
import { useNow } from './hooks/useNow'
import { useUnlockContext } from './hooks/useUnlockContext'
import { useStore } from './state/store'
import { isWelcome } from './state/unlock'

function Screen() {
  const now = useNow()
  const ctx = useUnlockContext()
  const view = useStore((s) => s.view)

  // The install gate is off in dev; progress must never start in a Safari tab.
  if (!import.meta.env.DEV && !isStandalone()) return <InstallGate />
  if (view.name === 'admin') return <Admin />
  if (isWelcome(ctx, now)) return <Welcome />
  if (view.name === 'stage') return <StageScreen id={view.id} />
  return <Timeline />
}

export function App() {
  return (
    <>
      <PreviewBanner />
      <Screen />
    </>
  )
}
