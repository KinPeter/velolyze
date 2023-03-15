import { SportType } from '../../strava/strava.types'

export interface CalendarHeatmapData {
  date: Date
  distance: number
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
