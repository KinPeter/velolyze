import { Activity } from '../modules/shared/types/activities'

export class Caching {
  private static readonly validKey = 'velo-cache-valid'
  private static readonly dataKey = 'velo-cache'
  private static readonly expiry = 8 * 60 * 60 * 1000 // 8 hours

  public static get isValid(): boolean {
    const storedData = localStorage.getItem(this.dataKey)
    const storedValidity = localStorage.getItem(this.validKey)
    if (!storedData || !storedValidity) return false

    const { valid, expiry } = JSON.parse(storedValidity) as { valid: boolean; expiry: number }
    return valid && expiry > Date.now()
  }

  public static get data(): Activity[] {
    const stored = localStorage.getItem(this.dataKey)
    if (!stored) throw new Error('Missing cache data')
    return JSON.parse(stored)
  }

  public static cacheData(activities: Activity[]): void {
    localStorage.setItem(this.dataKey, JSON.stringify(activities))
    localStorage.setItem(
      this.validKey,
      JSON.stringify({ valid: true, expires: Date.now() + this.expiry })
    )
  }

  public static invalidate(): void {
    localStorage.setItem(this.validKey, JSON.stringify({ valid: false, expires: 0 }))
    localStorage.removeItem(this.dataKey)
  }
}
