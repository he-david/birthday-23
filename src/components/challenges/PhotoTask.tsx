import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { PhotoTaskDef } from '../../content/stages'
import { PHOTO_UI } from '../../content/stages'
import { usePhotoUrl } from '../../hooks/usePhotoUrl'
import { compressPhoto, savePhoto } from '../../lib/photos'
import { useStore } from '../../state/store'
import { Button } from '../ui/Button'
import { Polaroid } from '../ui/Polaroid'

/** One optional photo task: camera input, polaroid once taken, retake overwrites. */
export function PhotoTask({ task }: { task: PhotoTaskDef }) {
  const has = useStore((s) => s.photos.includes(task.id))
  const addPhoto = useStore((s) => s.addPhoto)
  const [version, setVersion] = useState(0)
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const url = usePhotoUrl(task.id, has, version)

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    setFailed(false)
    try {
      await savePhoto(task.id, await compressPhoto(file))
      addPhoto(task.id)
      setVersion((v) => v + 1)
    } catch {
      setFailed(true)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-paper-deep rounded-card flex flex-col gap-4 px-5 py-4">
      <p className="font-body text-ink text-base font-bold">{task.prompt}</p>
      {has && url ? <Polaroid src={url} alt={PHOTO_UI.alt} caption={task.caption} /> : null}
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture={task.facing}
        className="hidden"
        data-testid={`photo-input-${task.id}`}
        onChange={(e) => void onChange(e)}
      />
      <Button
        variant={has ? 'secondary' : 'primary'}
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        {busy ? PHOTO_UI.saving : has ? PHOTO_UI.retake : PHOTO_UI.take}
      </Button>
      {failed ? (
        <p role="status" className="font-body text-wine text-sm">
          {PHOTO_UI.error}
        </p>
      ) : null}
    </div>
  )
}
