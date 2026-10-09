import { useEffect, useState } from 'react'
import { ALL_PHOTO_TASKS, FINALE, PHOTO_UI } from '../../content/stages'
import { renderCollage, shareOrDownload } from '../../lib/collage'
import type { CollageColors } from '../../lib/collage'
import { loadPhoto } from '../../lib/photos'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'

function themeColors(): CollageColors {
  const css = getComputedStyle(document.documentElement)
  const pick = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
  return {
    paper: pick('--color-paper', '#fbf5ec'),
    paperDeep: pick('--color-paper-deep', '#f3e7d8'),
    wine: pick('--color-wine', '#6e2435'),
    ink: pick('--color-ink', '#3b2a2f'),
    gold: pick('--color-gold', '#b5915a'),
  }
}

/** Finale collage of her photos. Renders nothing when there are none. */
export function Collage() {
  const photos = useStore((s) => s.photos)
  const tasks = ALL_PHOTO_TASKS.filter((t) => photos.includes(t.id))
  const key = tasks.map((t) => t.id).join(',')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [note, setNote] = useState<string | null>(null)

  useEffect(() => {
    if (!key) return
    let cancelled = false
    let made: string | null = null
    void (async () => {
      try {
        const items = []
        for (const t of ALL_PHOTO_TASKS.filter((x) => key.split(',').includes(x.id))) {
          const b = await loadPhoto(t.id)
          if (b) items.push({ blob: b, caption: t.caption })
        }
        if (items.length === 0) return
        await document.fonts?.ready
        const out = await renderCollage(
          items,
          { title: PHOTO_UI.collageHeading, date: PHOTO_UI.collageDate },
          themeColors(),
        )
        if (cancelled) return
        made = URL.createObjectURL(out)
        setBlob(out)
        setUrl(made)
      } catch {
        // No collage is better than a broken finale.
      }
    })()
    return () => {
      cancelled = true
      if (made) URL.revokeObjectURL(made)
      setBlob(null)
      setUrl(null)
    }
  }, [key])

  if (tasks.length === 0) return null

  async function onShare() {
    if (!blob) return
    const result = await shareOrDownload(blob, PHOTO_UI.collageFile)
    setNote(result === 'downloaded' ? PHOTO_UI.downloaded : null)
  }

  return (
    <section>
      <h2 className="text-wine font-display text-3xl font-semibold">{PHOTO_UI.collageTitle}</h2>
      {url ? (
        <img src={url} alt={PHOTO_UI.collageAlt} className="rounded-card shadow-card mt-4 w-full" />
      ) : null}
      <div className="mt-4">
        <Button disabled={!blob} onClick={() => void onShare()}>
          {FINALE.shareLabel}
        </Button>
      </div>
      {note ? (
        <p role="status" className="font-body text-ink mt-2 text-sm">
          {note}
        </p>
      ) : null}
    </section>
  )
}
