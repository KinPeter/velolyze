export interface StravaSettings {
  stravaClientId: string | null
  stravaClientSecret: string | null
  stravaOauthRedirectUrl: string | null
}

export interface StravaAuthResponse {
  access_token: string
  expires_at: number
  expires_in: number
  refresh_token: string
  athlete: {
    id: number
    weight: number
    firstname: string
    lastname: string
    profile: string // picture URL
  }
}

export interface StravaBikeDataResponse {
  distance: number // meters
  id: string
  name: string
  nickname: string
  primary: boolean
  retired: boolean
}

export interface StravaAthleteResponse {
  id: number
  bikes: StravaBikeDataResponse[]
}

export interface StravaRideStatsResponse {
  achievement_count?: number
  count: number
  distance: number // meters
  elapsed_time: number // seconds
  elevation_gain: number // meters
  moving_time: number // seconds
}

export interface StravaAthleteStatsResponse {
  biggest_ride_distance: number // meters
  ytd_ride_totals: StravaRideStatsResponse
  all_ride_totals: StravaRideStatsResponse
  recent_ride_totals: StravaRideStatsResponse
}

export type SportType = 'Ride' | 'MountainBikeRide' | 'VirtualRide' | 'EBikeRide' | 'GravelRide'

export interface StravaActivityResponse {
  upload_id: number
  distance: number // meters
  sport_type: SportType
  moving_time: number // seconds
  start_date: string // ISO string UTC
  total_elevation_gain: number // meters
}

export interface StravaRideStats {
  achievementCount?: number
  activityCount: number
  distance: number // kilometers
  movingTime: number // hours
  elevationGain: number // meters
}

export interface StravaBikeData {
  distance: number // kilometers
  id: string
  name: string
  nickname: string
}

export interface StravaAthleteData {
  id: number
  primaryBike: StravaBikeData
  longestRideEver: number // kilometers
  allRideTotals: StravaRideStats
  ytdRideTotals: StravaRideStats
  recentRideTotals: StravaRideStats
  thisWeek: StravaRideStats
  thisMonth: StravaRideStats
}
