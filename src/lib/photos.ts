import { clear } from 'idb-keyval'

/** Remove every stored photo blob (the default idb-keyval store only holds photos). */
export async function clearAllPhotos(): Promise<void> {
  await clear()
}
