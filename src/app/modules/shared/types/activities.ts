import { SportType, StravaActivity } from '../../strava/strava.types'

export interface Activity {
  id: string
  userId: string
  date: number
  activity: StravaActivity
}

export enum FilterPeriodType {
  RANGE = 'Date range',
  YEAR = 'Year',
  MONTH = 'Month',
}

export enum RideEnvironment {
  INDOOR = 'Indoor',
  OUTDOOR = 'Outdoor',
  ALL = 'All',
}

export interface ActivityFilters {
  periodType: FilterPeriodType
  dateRange: [Date, Date] | null
  year: number | null
  month: [number, number] | null
  city: string
  country: string
  type: SportType | 'ALL'
  environment: RideEnvironment
  bike: string | number
  distance: { min: number; max: number }
  elevation: { min: number; max: number }
}

export interface ActivityFilterOptions {
  startYear: number
  cities: string[]
  countries: string[]
  types: SportType[]
  hasIndoor: boolean
  maxDistance: number
  maxElevation: number
}
