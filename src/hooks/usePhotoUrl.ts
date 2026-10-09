import { useEffect, useState } from 'react'
import { loadPhoto } from '../lib/photos'

/** Object URL for a stored photo, revoked on change/unmount. `version` forces a reload. */
export function usePhotoUrl(taskId: string, enabled: boolean, version = 0): string | null {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let made: string | null = null
    void loadPhoto(taskId)
      .then((blob) => {
        if (cancelled || !blob) return
        made = URL.createObjectURL(blob)
        setUrl(made)
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
      if (made) URL.revokeObjectURL(made)
    }
  }, [taskId, enabled, version])
  return enabled ? url : null
}
