import { INSTALL_GATE } from '../content/stages'
import { Page } from '../components/ui/Page'
import { WaxSeal } from '../components/ui/WaxSeal'

/** Shown instead of the app when it is opened in a browser tab. Nothing else. */
export function InstallGate() {
  return (
    <Page className="items-center justify-center gap-8 text-center">
      <WaxSeal size={72} />
      <p className="font-display text-wine text-3xl leading-snug font-semibold">
        {INSTALL_GATE.instructions}
      </p>
    </Page>
  )
}
