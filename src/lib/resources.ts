import { fetchProfileRecord } from './fakeApi'
import type { ProfileRecord } from '../types'

const profilePromiseCache = new Map<string, Promise<ProfileRecord>>()

export function getProfileResource(profileId: string, revision: number) {
  const key = `${profileId}:${revision}`

  if (!profilePromiseCache.has(key)) {
    profilePromiseCache.set(key, fetchProfileRecord(profileId))
  }

  return profilePromiseCache.get(key)!
}

export function getProfileCacheKeys() {
  return Array.from(profilePromiseCache.keys())
}
