import { StravaBikeData } from '../../strava/strava.types'

export interface UserMeta {
  id: string
  userId: string
  athleteId: number | null
  firstName: string
  lastName: string
  city: string
  country: string
  stravaProfilePicUrl: string | null
  lastSyncDate: number | null
  uploadedActivities: number[]
  bikes: StravaBikeData[]
}
