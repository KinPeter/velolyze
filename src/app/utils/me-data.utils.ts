import { Activity } from '../modules/shared/types/activities'
import { CalendarHeatmapData } from '../modules/main/me/me.types'
import { addDays, isSameDay, startOfDay, subDays } from 'date-fns'
import { StravaActivity } from '../modules/strava/strava.types'
import { formatDate, metersToKms } from './utils'

export function getCalendarHeatmapData(activities: Activity[]): CalendarHeatmapData[] {
  const dates = []
  const oneYearAgo = subDays(startOfDay(new Date()), 364)

  for (let i = 0; i < 365; i++) {
    dates.push(addDays(oneYearAgo, i))
  }

  return dates.map(date => {
    const activitiesOnDay = activities.filter(activity => isSameDay(date, new Date(activity.date)))
    const distance = metersToKms(
      activitiesOnDay.reduce((acc, curr) => acc + curr.activity.distance, 0)
    )
    return {
      date,
      distance,
      rides: activitiesOnDay.length,
      dayOfWeek: date.getDay() === 0 ? 7 : date.getDay(),
      dayOfMonth: date.getDate(),
      month: Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
      class: getClass(distance),
      tooltip: getTooltip(date, activitiesOnDay.length, distance),
    }
  })
}

function getClass(distance: number): string {
  if (distance === 0) {
    return ''
  } else if (distance < 20) {
    return 'low'
  } else if (distance < 40) {
    return 'medium'
  } else if (distance < 60) {
    return 'high'
  } else {
    return 'extreme'
  }
}

function getTooltip(date: Date, rides: number, distance: number): string {
  if (rides === 0) return `${formatDate(date)}\nNo rides`
  return `${formatDate(date)}\n${rides} ride${rides > 1 ? 's' : ''}, ${distance} km`
}

export function getActivitiesPerDay(activities: Activity[]): Record<number, StravaActivity[]> {
  const result: Record<number, StravaActivity[]> = {}

  activities.forEach(({ date, activity }) => {
    const dayOfActivity = startOfDay(new Date(date)).getTime()
    if (result[dayOfActivity]) {
      result[dayOfActivity] = [...result[dayOfActivity], activity]
    } else {
      result[dayOfActivity] = [activity]
    }
  })

  return result
}
