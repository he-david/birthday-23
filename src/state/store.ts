import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STAGES } from '../content/stages'
import type { AppState, DriveId, StageId, View } from './types'
import { isOpen, nextLockedStage } from './unlock'

export const STORAGE_KEY = 'kuldetes-v1'

export function initialState(): AppState {
  return {
    v: 1,
    shiftMinutes: 0,
    forcedUnlocked: [],
    opened: [],
    stamps: {},
    prep: {},
    guesses: { drive1: { tries: [] }, drive2: { tries: [] } },
    trivia: {},
    lunch: { spins: [], ratings: [] },
    kart: {},
    photos: [],
  }
}

interface Actions {
  view: View // not persisted
  navigate: (view: View) => void
  /** Mark a stage as seen (unlock animation played). */
  markOpened: (id: StageId) => void
  /** Earn the stamp (idempotent, keeps the first time). */
  stamp: (id: StageId, atIso: string) => void
  /** Leave a stage without a stamp: it is still marked as opened. */
  skip: (id: StageId) => void
  /** Admin: force the next locked stage open. Returns the id, if any. */
  forceNext: (nowMs: number) => StageId | undefined
  /** Admin: change the shift. Stages that are already open keep their time. */
  shiftBy: (deltaMin: number, nowMs: number) => void
  setSimulatedNow: (iso: string | undefined) => void
  answerPrep: (questionId: string, option: string) => void
  addGuess: (drive: DriveId, option: string, solvedAtHint?: 1 | 2 | 3) => void
  answerTrivia: (questionId: string, option: string) => void
  addPhoto: (taskId: string) => void
  setLunch: (patch: Partial<AppState['lunch']>) => void
  setKart: (patch: Partial<AppState['kart']>) => void
  reset: () => void
}

export type Store = AppState & Actions

const unique = <T>(list: readonly T[], item: T): T[] =>
  list.includes(item) ? [...list] : [...list, item]

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState(),
      view: { name: 'timeline' },
      navigate: (view) => set({ view }),
      markOpened: (id) => set((s) => ({ opened: unique(s.opened, id) })),
      stamp: (id, atIso) =>
        set((s) => ({
          stamps: s.stamps[id] ? s.stamps : { ...s.stamps, [id]: atIso },
          opened: unique(s.opened, id),
        })),
      skip: (id) => set((s) => ({ opened: unique(s.opened, id) })),
      forceNext: (nowMs) => {
        const next = nextLockedStage(get(), nowMs)
        if (next) set((s) => ({ forcedUnlocked: unique(s.forcedUnlocked, next) }))
        return next
      },
      shiftBy: (deltaMin, nowMs) =>
        set((s) => {
          // Freeze stages that are open right now so the shift only moves locked ones.
          const open = STAGES.filter((st) => isOpen(st.id, s, nowMs)).map((st) => st.id)
          return {
            shiftMinutes: s.shiftMinutes + deltaMin,
            opened: open.reduce((acc, id) => unique(acc, id), s.opened),
          }
        }),
      setSimulatedNow: (iso) => set({ simulatedNow: iso }),
      answerPrep: (questionId, option) =>
        set((s) => ({ prep: { ...s.prep, [questionId]: option } })),
      addGuess: (drive, option, solvedAtHint) =>
        set((s) => {
          const g = s.guesses[drive]
          return {
            guesses: {
              ...s.guesses,
              [drive]: {
                tries: [...g.tries, option],
                solvedAtHint: g.solvedAtHint ?? solvedAtHint,
              },
            },
          }
        }),
      answerTrivia: (questionId, option) =>
        set((s) => ({ trivia: { ...s.trivia, [questionId]: option } })),
      addPhoto: (taskId) => set((s) => ({ photos: unique(s.photos, taskId) })),
      setLunch: (patch) => set((s) => ({ lunch: { ...s.lunch, ...patch } })),
      setKart: (patch) => set((s) => ({ kart: { ...s.kart, ...patch } })),
      reset: () => set({ ...initialState(), view: { name: 'timeline' }, simulatedNow: undefined }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Persist only AppState, never the view or actions.
      partialize: (s): AppState => ({
        v: s.v,
        shiftMinutes: s.shiftMinutes,
        forcedUnlocked: s.forcedUnlocked,
        opened: s.opened,
        stamps: s.stamps,
        prep: s.prep,
        guesses: s.guesses,
        trivia: s.trivia,
        lunch: s.lunch,
        kart: s.kart,
        photos: s.photos,
        simulatedNow: s.simulatedNow,
      }),
    },
  ),
)
