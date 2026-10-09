// Formatting and parsing of Budapest wall-clock times for the admin panel.
// The trip day is before the 25 Oct clock change, so Budapest is +02:00.

const TZ = 'Europe/Budapest'
const OFFSET = '+02:00'

function parts(ms: number): Record<string, string> {
  const fmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const out: Record<string, string> = {}
  for (const p of fmt.formatToParts(new Date(ms))) out[p.type] = p.value
  return out
}

/** "14:30" in Budapest time. */
export function formatHm(ms: number): string {
  const p = parts(ms)
  return `${p.hour}:${p.minute}`
}

/** Value for <input type="datetime-local">: "2026-10-10T14:30". */
export function toPickerValue(ms: number): string {
  const p = parts(ms)
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`
}

/** Picker value (Budapest wall clock) to the ISO string stored as `simulatedNow`. */
export function fromPickerValue(value: string): string | undefined {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return undefined
  const iso = `${value}:00${OFFSET}`
  return Number.isNaN(Date.parse(iso)) ? undefined : iso
}

/** "+15 perc", "-30 perc", "0 perc". */
export function formatShift(minutes: number): string {
  const sign = minutes > 0 ? '+' : minutes < 0 ? '−' : ''
  return `${sign}${Math.abs(minutes)} perc`
}
