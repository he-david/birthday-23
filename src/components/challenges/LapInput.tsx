import { KART } from '../../content/stages'

export interface LapInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

/** Seconds field: decimal keypad, 16px+ so iOS does not zoom. */
export function LapInput({ id, label, value, onChange }: LapInputProps) {
  return (
    <div>
      <label htmlFor={id} className="font-body text-ink block text-base font-bold">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-3">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={KART.lapPlaceholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-paper-deep rounded-card font-body text-ink min-h-12 w-full border-2 border-transparent px-4 text-base focus:border-wine focus:outline-none"
        />
        <span className="font-body text-ink text-base">{KART.lapUnit}</span>
      </div>
    </div>
  )
}
