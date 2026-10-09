import 'fake-indexeddb/auto'
import '@testing-library/jest-dom/vitest'

// Node 25 ships a half-working global localStorage that shadows jsdom's. Use a simple in-memory one.
if (typeof localStorage === 'undefined' || typeof localStorage.clear !== 'function') {
  const data = new Map<string, string>()
  const memory: Storage = {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  }
  Object.defineProperty(globalThis, 'localStorage', { value: memory, configurable: true })
  Object.defineProperty(window, 'localStorage', { value: memory, configurable: true })
}
