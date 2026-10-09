import { clear, del, get, set } from 'idb-keyval'

export const MAX_EDGE = 1600
export const JPEG_QUALITY = 0.82

/** Target size so the long edge is at most `max`; never upscales. */
export function downscaleSize(
  width: number,
  height: number,
  max: number = MAX_EDGE,
): { width: number; height: number } {
  const long = Math.max(width, height)
  if (long <= max || long <= 0) return { width, height }
  const k = max / long
  return { width: Math.max(1, Math.round(width * k)), height: Math.max(1, Math.round(height * k)) }
}

/** Centered square crop of a width x height image (for polaroid frames). */
export function squareCrop(
  width: number,
  height: number,
): { sx: number; sy: number; size: number } {
  const size = Math.min(width, height)
  return { sx: Math.round((width - size) / 2), sy: Math.round((height - size) / 2), size }
}

/** Decode, downscale to 1600 px long edge and re-encode as JPEG 0.82. */
export async function compressPhoto(file: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  try {
    const { width, height } = downscaleSize(bitmap.width, bitmap.height)
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no 2d context')
    ctx.drawImage(bitmap, 0, 0, width, height)
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('encode failed'))),
        'image/jpeg',
        JPEG_QUALITY,
      )
    })
  } finally {
    bitmap.close()
  }
}

/** Store (or overwrite) the photo for a task id in the default idb-keyval store. */
export async function savePhoto(taskId: string, blob: Blob): Promise<void> {
  await set(taskId, blob)
}

export async function loadPhoto(taskId: string): Promise<Blob | undefined> {
  return get<Blob>(taskId)
}

export async function deletePhoto(taskId: string): Promise<void> {
  await del(taskId)
}

/** Remove every stored photo blob (the default idb-keyval store only holds photos). */
export async function clearAllPhotos(): Promise<void> {
  await clear()
}
