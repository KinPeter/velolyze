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
  year: Date | null
  month: Date | null
  cities: string[] | null
  countries: string[] | null
  types: SportType[] | null
  environment: RideEnvironment
  bikes: string[] | null
  distance: [number, number]
  elevation: [number, number]
}

export interface SportTypeOption {
  name: string
  type: SportType
}

export interface ActivityFilterOptions {
  startYear: number
  cities: string[]
  countries: string[]
  types: SportTypeOption[]
  hasIndoor: boolean
  maxDistance: number
  maxElevation: number
}
