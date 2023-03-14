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

export interface StravaAthlete {
  id: number
  bikes: StravaBikeData[]
  username: string
  resource_state: number
  firstname: string
  lastname: string
  city: string
  state: string
  country: string
  sex: string
  premium: boolean
  created_at: string
  updated_at: string
  badge_type_id: number
  profile_medium: string
  profile: string
  friend: number
  follower: number
  follower_count: number
  friend_count: number
  mutual_friend_count: number
  athlete_type: number
  date_preference: string
  measurement_preference: string
  ftp: number
  weight: number
}

export interface StravaActivity {
  id: number
  upload_id: number
  external_id: string
  sport_type: SportType
  distance: number // meters
  moving_time: number // seconds
  start_date: string // ISO string UTC
  total_elevation_gain: number // meters
  resource_state: number
  athlete: {
    id: number
    resource_state: number
  }
  name: string
  elapsed_time: number // seconds
  type: SportType // deprecated
  workout_type: number
  start_date_local: string // ISO string UTC
  timezone: string
  utc_offset: number
  start_latlng: LatLng
  end_latlng: LatLng
  location_city: string
  location_state: string
  location_country: string
  achievement_count: number
  kudos_count: number
  comment_count: number
  athlete_count: number
  photo_count: number
  map: PolylineMap
  trainer: boolean
  commute: boolean
  manual: boolean
  private: boolean
  flagged: boolean
  gear_id: string
  from_accepted_tag: boolean
  average_speed: number
  max_speed: number
  average_cadence: number
  average_watts: number
  weighted_average_watts: number
  kilojoules: number
  device_watts: boolean
  has_heartrate: boolean
  average_heartrate: number
  max_heartrate: number
  max_watts: number
  pr_count: number
  total_photo_count: number
  has_kudoed: boolean
  suffer_score: number
}

export type LatLng = [number, number]

export interface PolylineMap {
  id: string
  summary_polyline: string
  polyline?: string
  resource_state: number
}

export interface StravaBikeData {
  distance: number // meters
  converted_distance: number // kilometers
  id: string
  name: string
  nickname: string
  primary: boolean
  retired: boolean
}

export type SportType =
  | 'AlpineSki'
  | 'BackcountrySki'
  | 'Badminton'
  | 'Canoeing'
  | 'Crossfit'
  | 'EBikeRide'
  | 'Elliptical'
  | 'EMountainBikeRide'
  | 'Golf'
  | 'GravelRide'
  | 'Handcycle'
  | 'HighIntensityIntervalTraining'
  | 'Hike'
  | 'IceSkate'
  | 'InlineSkate'
  | 'Kayaking'
  | 'Kitesurf'
  | 'MountainBikeRide'
  | 'NordicSki'
  | 'Pickleball'
  | 'Pilates'
  | 'Racquetball'
  | 'Ride'
  | 'RockClimbing'
  | 'RollerSki'
  | 'Rowing'
  | 'Run'
  | 'Sail'
  | 'Skateboard'
  | 'Snowboard'
  | 'Snowshoe'
  | 'Soccer'
  | 'Squash'
  | 'StairStepper'
  | 'StandUpPaddling'
  | 'Surfing'
  | 'Swim'
  | 'TableTennis'
  | 'Tennis'
  | 'TrailRun'
  | 'Velomobile'
  | 'VirtualRide'
  | 'VirtualRow'
  | 'VirtualRun'
  | 'Walk'
  | 'WeightTraining'
  | 'Wheelchair'
  | 'Windsurf'
  | 'Workout'
  | 'Yoga'

export const rideSportTypes: SportType[] = [
  'Ride',
  'MountainBikeRide',
  'VirtualRide',
  'EBikeRide',
  'GravelRide',
  'EMountainBikeRide',
  'Handcycle',
]
