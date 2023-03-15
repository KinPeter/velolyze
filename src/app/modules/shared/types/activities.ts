import { StravaActivity } from '../../strava/strava.types'

export interface Activity {
  id: string
  userId: string
  date: number
  activity: StravaActivity
}
