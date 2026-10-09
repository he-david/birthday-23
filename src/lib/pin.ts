// Pure PIN helpers for the admin pad.

export const PIN_LENGTH = 4

export function appendDigit(current: string, digit: string, length: number = PIN_LENGTH): string {
  if (!/^\d$/.test(digit) || current.length >= length) return current
  return current + digit
}

export function removeDigit(current: string): string {
  return current.slice(0, -1)
}

export function isPinCorrect(entered: string, expected: string): boolean {
  return entered.length === expected.length && entered === expected
}
