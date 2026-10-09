export interface OptionTileProps {
  label: string
  selected?: boolean
  disabled?: boolean
  onSelect: () => void
}

/** Big single-choice tile: paper-deep, or blush with a wine border and a heart when selected. */
export function OptionTile({
  label,
  selected = false,
  disabled = false,
  onSelect,
}: OptionTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      disabled={disabled}
      className={`font-body text-ink flex min-h-14 w-full touch-manipulation items-center justify-between gap-3 rounded-card border-2 disabled:opacity-60 px-5 py-3 text-left text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine ${
        selected ? 'bg-blush border-wine' : 'bg-paper-deep border-transparent'
      }`}
    >
      <span>{label}</span>
      {selected ? (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          aria-hidden="true"
          className="text-wine shrink-0"
        >
          <path
            fill="currentColor"
            d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 2.8 5 6.2 5c2.1 0 3.9 1.2 5.8 3.4C13.900 6.200 15.700 5 17.800 5c3.400 0 5.200 3.600 3.800 6.800C19.500 16.400 12 21 12 21z"
          />
        </svg>
      ) : null}
    </button>
  )
}
