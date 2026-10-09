import { DRIVES, DRIVE_NEXT_STAGE, DRIVE_UI } from '../../content/stages'
import { useNow } from '../../hooks/useNow'
import { useUnlockContext } from '../../hooks/useUnlockContext'
import { driveOutcome, guessesLeft, hintNumber, isCorrectGuess } from '../../lib/hints'
import { useStore } from '../../state/store'
import type { DriveId } from '../../state/types'
import { isOpen, openHintCount } from '../../state/unlock'
import { OptionTile } from './OptionTile'

/** Hint game: hints open at offsets from the stage time, one guess per hint. */
export function HintGuess({ drive }: { drive: DriveId }) {
  const def = DRIVES[drive]
  const now = useNow()
  const ctx = useUnlockContext()
  const { tries, solvedAtHint } = useStore((s) => s.guesses[drive])
  const addGuess = useStore((s) => s.addGuess)

  const openHints = openHintCount(drive, ctx, now)
  const outcome = driveOutcome(solvedAtHint, isOpen(DRIVE_NEXT_STAGE[drive], ctx, now))
  const left = guessesLeft(openHints, tries.length)
  // One line only, and only while no new hint has opened since the last guess.
  const waitLine =
    openHints > 0 && left === 0 ? (openHints < 3 ? def.wrongGuess : DRIVE_UI.noMoreGuesses) : null

  const guess = (option: string) => {
    if (left === 0 || outcome !== 'playing') return
    addGuess(drive, option, isCorrectGuess(option, def.answer) ? hintNumber(openHints) : undefined)
  }

  return (
    <section>
      <h2 className="text-wine font-display text-3xl leading-tight font-semibold">{def.title}</h2>

      <div className="mt-4">
        <h3 className="font-body text-ink text-base font-bold">{DRIVE_UI.hintsTitle}</h3>
        {openHints === 0 ? (
          <p className="font-body text-ink mt-2 text-base">{DRIVE_UI.noHint}</p>
        ) : (
          <ol className="mt-2 flex flex-col gap-2">
            {def.hints.slice(0, openHints).map((hint, i) => (
              <li
                key={hint.text}
                className="bg-paper-deep border-gold font-hand text-ink rounded-r-lg border-l-4 px-4 py-3 text-2xl leading-snug"
              >
                <span className="font-body text-ink mr-2 text-sm font-bold">
                  {DRIVE_UI.hintLabel} {i + 1}
                </span>
                {hint.text}
              </li>
            ))}
          </ol>
        )}
      </div>

      {outcome === 'playing' ? (
        <div className="mt-6">
          <div className="flex flex-col gap-3">
            {def.tiles.map((tile) => (
              <OptionTile
                key={tile}
                label={tile}
                selected={tries.includes(tile)}
                disabled={left === 0 || tries.includes(tile)}
                onSelect={() => guess(tile)}
              />
            ))}
          </div>
          {waitLine ? (
            <p role="status" className="font-body text-wine mt-4 text-base font-bold">
              {waitLine}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="mt-6" role="status">
          {outcome === 'solved' ? (
            <p className="font-body text-ink text-base font-bold">{DRIVE_UI.solved}</p>
          ) : null}
          <p className="font-body text-ink mt-1 text-base">{DRIVE_UI.answerLabel}</p>
          <p className="text-wine font-display text-5xl font-semibold">{def.answer}</p>
        </div>
      )}
    </section>
  )
}
