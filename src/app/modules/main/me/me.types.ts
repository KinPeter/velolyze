import { SportType } from '../../strava/strava.types'

export interface DistancePerDay {
  date: Date
  distance: number
}

export interface CalendarHeatmapData extends DistancePerDay {
  rides: number
  dayOfWeek: number
  dayOfMonth: number
  month: string
  class: string
  tooltip: string
  empty?: boolean
}

export interface Totals {
  rides: number
  distance: number
  elevationGain: number
  movingTime: number
  achievementCount: number
  prCount: number
  ridesByType: Record<SportType, number>
  longestRide: number
  biggestClimb: number
}

export interface TotalsPerPeriod {
  thisWeek: Totals
  thisMonth: Totals
  thisYear: Totals
  allTimes: Totals
}

export interface DaysPerPeriods {
  thisWeek: DistancePerDay[]
  thisMonth: DistancePerDay[]
  thisYear: DistancePerDay[]
}
