import { squareCrop } from './photos'

export const COLLAGE_WIDTH = 1080
const MARGIN = 60
const GAP = 44
const HEADER = 230
const PAD = 26
const CAPTION = 96
const ROTATIONS = [-2.2, 1.6, 1.2, -1.8]

export interface CollageSlot {
  x: number
  y: number
  /** Frame width/height. */
  w: number
  h: number
  /** Photo square inside the frame, relative to the frame. */
  photo: { x: number; y: number; size: number }
  /** Degrees. */
  rotation: number
}

export interface CollageLayout {
  width: number
  height: number
  slots: CollageSlot[]
}

/** Two polaroids per row, a lone last one centered. Pure. */
export function collageLayout(count: number, width: number = COLLAGE_WIDTH): CollageLayout {
  const w = Math.floor((width - 2 * MARGIN - GAP) / 2)
  const size = w - 2 * PAD
  const h = PAD + size + CAPTION
  const slots: CollageSlot[] = []
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / 2)
    const inRow = Math.min(2, count - row * 2)
    const col = i % 2
    const rowWidth = inRow * w + (inRow - 1) * GAP
    const x = Math.round((width - rowWidth) / 2) + col * (w + GAP)
    const y = HEADER + row * (h + GAP)
    slots.push({
      x,
      y,
      w,
      h,
      photo: { x: PAD, y: PAD, size },
      rotation: ROTATIONS[i % ROTATIONS.length] ?? 0,
    })
  }
  const rows = Math.ceil(count / 2)
  const height = HEADER + rows * h + Math.max(0, rows - 1) * GAP + MARGIN
  return { width, height, slots }
}

export interface CollageItem {
  blob: Blob
  caption: string
}

export interface CollageColors {
  paper: string
  paperDeep: string
  wine: string
  ink: string
  gold: string
}

export interface CollageText {
  title: string
  date: string
}

/** Draw the collage on a canvas and return it as a JPEG blob. Browser only. */
export async function renderCollage(
  items: readonly CollageItem[],
  text: CollageText,
  colors: CollageColors,
): Promise<Blob> {
  const layout = collageLayout(items.length)
  const canvas = document.createElement('canvas')
  canvas.width = layout.width
  canvas.height = layout.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('no 2d context')

  ctx.fillStyle = colors.paperDeep
  ctx.fillRect(0, 0, layout.width, layout.height)

  ctx.textAlign = 'center'
  ctx.fillStyle = colors.wine
  ctx.font = '600 84px "Cormorant Garamond", serif'
  ctx.fillText(text.title, layout.width / 2, 110)
  ctx.fillStyle = colors.ink
  ctx.font = '500 56px "Caveat", cursive'
  ctx.fillText(text.date, layout.width / 2, 180)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const slot = layout.slots[i]
    if (!item || !slot) continue
    const bitmap = await createImageBitmap(item.blob)
    ctx.save()
    ctx.translate(slot.x + slot.w / 2, slot.y + slot.h / 2)
    ctx.rotate((slot.rotation * Math.PI) / 180)
    ctx.translate(-slot.w / 2, -slot.h / 2)
    ctx.shadowColor = 'rgba(59, 42, 47, 0.28)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 8
    ctx.fillStyle = colors.paper
    ctx.fillRect(0, 0, slot.w, slot.h)
    ctx.shadowColor = 'transparent'
    const crop = squareCrop(bitmap.width, bitmap.height)
    ctx.drawImage(
      bitmap,
      crop.sx,
      crop.sy,
      crop.size,
      crop.size,
      slot.photo.x,
      slot.photo.y,
      slot.photo.size,
      slot.photo.size,
    )
    ctx.fillStyle = colors.ink
    ctx.font = '500 52px "Caveat", cursive'
    ctx.fillText(item.caption, slot.w / 2, slot.photo.y + slot.photo.size + 66, slot.w - 2 * PAD)
    ctx.restore()
    bitmap.close()
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', 0.9)
  })
}

/** Share the collage as a file; fall back to a download link. Returns what happened. */
export async function shareOrDownload(
  blob: Blob,
  filename: string,
): Promise<'shared' | 'downloaded'> {
  const file = new File([blob], filename, { type: blob.type })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file] })
      return 'shared'
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'shared'
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
  return 'downloaded'
}
