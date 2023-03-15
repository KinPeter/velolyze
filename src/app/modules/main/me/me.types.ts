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
