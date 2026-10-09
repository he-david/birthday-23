// Pure unlock logic. No React, no zustand, no browser APIs; time is always passed in.
import { DRIVES, STAGES, type StageDef } from '../content/stages'
import type { AppState, DriveId, StageId } from './types'

export type UnlockContext = Pick<AppState, 'shiftMinutes' | 'forcedUnlocked' | 'opened'>

const MINUTE_MS = 60_000

export function parseIso(iso: string): number {
  return Date.parse(iso)
}

function findStage(id: StageId, stages: readonly StageDef[]): StageDef {
  const stage = stages.find((s) => s.id === id)
  if (!stage) throw new Error(`Unknown stage: ${id}`)
  return stage
}

/** The clock the UI uses: simulated time when preview mode is on, otherwise real time. */
export function currentNowMs(realNowMs: number, simulatedNow?: string): number {
  if (simulatedNow) {
    const sim = parseIso(simulatedNow)
    if (!Number.isNaN(sim)) return sim
  }
  return realNowMs
}

/**
 * Effective unlock time in ms. The shift only applies to stages that are not
 * open yet: once a stage has been opened (animation played) or forced open it
 * keeps its scheduled time.
 */
export function effectiveTime(
  id: StageId,
  ctx: UnlockContext,
  stages: readonly StageDef[] = STAGES,
): number {
  const base = parseIso(findStage(id, stages).unlockAt)
  const frozen = ctx.opened.includes(id) || ctx.forcedUnlocked.includes(id)
  return frozen ? base : base + ctx.shiftMinutes * MINUTE_MS
}

export function isOpen(
  id: StageId,
  ctx: UnlockContext,
  nowMs: number,
  stages: readonly StageDef[] = STAGES,
): boolean {
  if (ctx.forcedUnlocked.includes(id)) return true
  return nowMs >= effectiveTime(id, ctx, stages)
}

/** First stage (in schedule order) that is not open yet, or undefined when all are open. */
export function nextLockedStage(
  ctx: UnlockContext,
  nowMs: number,
  stages: readonly StageDef[] = STAGES,
): StageId | undefined {
  return stages.find((s) => !isOpen(s.id, ctx, nowMs, stages))?.id
}

/** Welcome screen is shown until `prep` opens. */
export function isWelcome(
  ctx: UnlockContext,
  nowMs: number,
  stages: readonly StageDef[] = STAGES,
): boolean {
  const first = stages[0]
  return first !== undefined && !isOpen(first.id, ctx, nowMs, stages)
}

/** Absolute ms at which each of the three hints of a drive stage opens. */
export function hintTimes(
  drive: DriveId,
  ctx: UnlockContext,
  stages: readonly StageDef[] = STAGES,
): [number, number, number] {
  const anchor = effectiveTime(drive, ctx, stages)
  const [a, b, c] = DRIVES[drive].hints
  return [
    anchor + a.offsetMin * MINUTE_MS,
    anchor + b.offsetMin * MINUTE_MS,
    anchor + c.offsetMin * MINUTE_MS,
  ]
}

/** How many hints (0..3) are open at `nowMs`. A locked stage has none. */
export function openHintCount(
  drive: DriveId,
  ctx: UnlockContext,
  nowMs: number,
  stages: readonly StageDef[] = STAGES,
): 0 | 1 | 2 | 3 {
  if (!isOpen(drive, ctx, nowMs, stages)) return 0
  const open = hintTimes(drive, ctx, stages).filter((t) => nowMs >= t).length
  return open as 0 | 1 | 2 | 3
}

/** Hungarian countdown, e.g. "2 óra 14 perc múlva nyílik". Minutes round up. */
export function countdownLabel(remainingMs: number): string {
  if (remainingMs <= 0) return 'most nyílik'
  const totalMin = Math.ceil(remainingMs / MINUTE_MS)
  const days = Math.floor(totalMin / 1440)
  const hours = Math.floor((totalMin % 1440) / 60)
  const minutes = totalMin % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days} nap`)
  if (hours > 0) parts.push(`${hours} óra`)
  if (minutes > 0 && days === 0) parts.push(`${minutes} perc`)
  return `${parts.join(' ')} múlva nyílik`
}

/** Countdown label for a not-yet-open stage. */
export function stageCountdownLabel(
  id: StageId,
  ctx: UnlockContext,
  nowMs: number,
  stages: readonly StageDef[] = STAGES,
): string {
  return countdownLabel(effectiveTime(id, ctx, stages) - nowMs)
}
