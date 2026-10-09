import { describe, expect, it } from 'vitest'
import { collageLayout } from '../src/lib/collage'
import { downscaleSize, loadPhoto, savePhoto, squareCrop, clearAllPhotos } from '../src/lib/photos'

describe('downscaleSize', () => {
  it.each([
    [4032, 3024, 1600, 1200],
    [3024, 4032, 1200, 1600],
    [1000, 800, 1000, 800],
    [1600, 1600, 1600, 1600],
    [3200, 100, 1600, 50],
  ])('%i x %i -> %i x %i', (w, h, ew, eh) => {
    expect(downscaleSize(w, h)).toEqual({ width: ew, height: eh })
  })
  it('never returns zero', () => {
    expect(downscaleSize(10000, 1).height).toBe(1)
  })
})

describe('squareCrop', () => {
  it('centers on landscape and portrait', () => {
    expect(squareCrop(400, 300)).toEqual({ sx: 50, sy: 0, size: 300 })
    expect(squareCrop(300, 400)).toEqual({ sx: 0, sy: 50, size: 300 })
  })
})

describe('collageLayout', () => {
  it('has one slot per photo and grows by row', () => {
    const one = collageLayout(1)
    const two = collageLayout(2)
    const three = collageLayout(3)
    expect(one.slots).toHaveLength(1)
    expect(two.height).toBe(one.height)
    expect(three.height).toBeGreaterThan(two.height)
  })
  it('centers a lone last photo and keeps slots inside the canvas', () => {
    const l = collageLayout(5)
    const last = l.slots[4]!
    expect(last.x + last.w / 2).toBeCloseTo(l.width / 2, 0)
    for (const s of l.slots) {
      expect(s.x).toBeGreaterThanOrEqual(0)
      expect(s.x + s.w).toBeLessThanOrEqual(l.width)
      expect(s.y + s.h).toBeLessThanOrEqual(l.height)
    }
  })
  it('does not overlap rows', () => {
    const [a, , c] = collageLayout(3).slots
    expect(c!.y).toBeGreaterThan(a!.y + a!.h)
  })
})

describe('photo storage', () => {
  it('overwrites on retake and clears', async () => {
    await savePhoto('t1', new Blob(['a']))
    await savePhoto('t1', new Blob(['bb']))
    expect(await loadPhoto('t1')).toBeDefined()
    await clearAllPhotos()
    expect(await loadPhoto('t1')).toBeUndefined()
  })
})
