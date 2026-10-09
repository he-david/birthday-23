import { TRIVIA, TRIVIA_UI } from '../../content/stages'
import { useStore } from '../../state/store'
import { OptionTile } from './OptionTile'

/** Two questions; a wrong answer simply shows the right one. */
export function Trivia() {
  const answers = useStore((s) => s.trivia)
  const answerTrivia = useStore((s) => s.answerTrivia)

  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{TRIVIA_UI.title}</h2>
      <div className="mt-4 flex flex-col gap-8">
        {TRIVIA.map((q) => {
          const chosen = answers[q.id]
          const done = chosen !== undefined
          return (
            <div key={q.id}>
              <h3 className="font-body text-ink text-lg font-bold">{q.question}</h3>
              <div className="mt-3 flex flex-col gap-3">
                {q.options.map((option) => (
                  <OptionTile
                    key={option}
                    label={option}
                    selected={chosen === option}
                    disabled={done}
                    onSelect={() => answerTrivia(q.id, option)}
                  />
                ))}
              </div>
              {done ? (
                <p role="status" className="font-body text-wine mt-3 text-base font-bold">
                  {chosen === q.answer ? TRIVIA_UI.correct : `${TRIVIA_UI.wrong} ${q.answer}`}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
