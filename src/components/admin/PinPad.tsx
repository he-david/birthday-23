import { useState } from 'react'
import { ADMIN, ADMIN_PIN } from '../../content/stages'
import { appendDigit, isPinCorrect, PIN_LENGTH, removeDigit } from '../../lib/pin'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const

const KEY_CLASS =
  'min-h-14 rounded-full bg-paper-deep font-body text-ink text-2xl touch-manipulation motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-wine'

export function PinPad({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)

  const press = (digit: string) => {
    const next = appendDigit(value, digit)
    if (next === value) return
    if (next.length === PIN_LENGTH) {
      if (isPinCorrect(next, ADMIN_PIN)) {
        onSuccess()
      } else {
        setWrong(true)
        setValue('')
      }
      return
    }
    setWrong(false)
    setValue(next)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ADMIN.pinPrompt}
      className="bg-ink/40 fixed inset-0 z-50 flex items-center justify-center px-5"
    >
      <div className="bg-paper shadow-card w-full max-w-xs rounded-card p-6 text-center">
        <p className="font-body text-ink text-base">{ADMIN.pinPrompt}</p>
        <div className="flex justify-center gap-3 py-4" aria-hidden="true">
          {Array.from({ length: PIN_LENGTH }, (_, i) => (
            <span
              key={i}
              className={`size-3 rounded-full border border-wine ${i < value.length ? 'bg-wine' : ''}`}
            />
          ))}
        </div>
        <p role="alert" className="font-body text-wine min-h-6 text-base">
          {wrong ? ADMIN.pinWrong : ''}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {KEYS.map((k) => (
            <button key={k} type="button" className={KEY_CLASS} onClick={() => press(k)}>
              {k}
            </button>
          ))}
          <button type="button" className={KEY_CLASS} onClick={onCancel}>
            ✕
          </button>
          <button type="button" className={KEY_CLASS} onClick={() => press('0')}>
            0
          </button>
          <button
            type="button"
            className={KEY_CLASS}
            aria-label="Törlés"
            onClick={() => setValue(removeDigit(value))}
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  )
}
