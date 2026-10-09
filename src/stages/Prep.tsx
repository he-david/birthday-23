import { useState } from 'react'
import { PACKING, PREP_QUESTIONS } from '../content/stages'
import { OptionTile } from '../components/challenges/OptionTile'
import { Button } from '../components/ui/Button'
import { firstUnanswered } from '../lib/prep'
import { useStore } from '../state/store'

function PackingList() {
  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{PACKING.title}</h2>
      <ul className="mt-4 flex flex-col gap-2">
        {PACKING.items.map((item) => (
          <li
            key={item}
            className="bg-paper-deep rounded-card font-body text-ink flex min-h-12 items-center gap-3 px-5 py-3 text-base"
          >
            <span aria-hidden="true" className="text-rose">
              ♥
            </span>
            {item}
          </li>
        ))}
      </ul>
      <p className="font-display text-wine mt-6 text-2xl leading-snug italic">{PACKING.teaser}</p>
    </section>
  )
}

export function Prep() {
  const answers = useStore((s) => s.prep)
  const answerPrep = useStore((s) => s.answerPrep)
  // Id of the question whose reveal is on screen right now.
  const [revealId, setRevealId] = useState<string | null>(null)

  const revealed = PREP_QUESTIONS.find((q) => q.id === revealId)
  if (revealed) {
    const chosen = answers[revealed.id]
    return (
      <section>
        <p className="font-body text-ink text-base font-bold">{chosen}</p>
        <p className="text-wine font-display mt-3 text-3xl leading-snug font-semibold">
          {revealed.reveal}
        </p>
        <div className="mt-6">
          <Button onClick={() => setRevealId(null)}>Tovább</Button>
        </div>
      </section>
    )
  }

  const index = firstUnanswered(PREP_QUESTIONS, answers)
  const question = PREP_QUESTIONS[index]
  if (!question) return <PackingList />

  return (
    <section>
      <p className="font-body text-ink text-base">
        {index + 1} / {PREP_QUESTIONS.length}
      </p>
      <h2 className="text-wine font-display mt-1 text-3xl leading-tight font-semibold">
        {question.question}
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option) => (
          <OptionTile
            key={option}
            label={option}
            onSelect={() => {
              answerPrep(question.id, option)
              setRevealId(question.id)
            }}
          />
        ))}
      </div>
    </section>
  )
}
