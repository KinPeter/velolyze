import { Activity } from '../modules/shared/types/activities'
import { CalendarHeatmapData } from '../modules/main/me/me.types'
import { addDays, isSameDay, startOfDay, subDays } from 'date-fns'
import { StravaActivity } from '../modules/strava/strava.types'
import { metersToKms } from './utils'

export function getCalendarHeatmapData(activities: Activity[]): CalendarHeatmapData[] {
  const dates = []
  const oneYearAgo = subDays(startOfDay(new Date()), 364)

  for (let i = 0; i < 365; i++) {
    dates.push(addDays(oneYearAgo, i))
  }

  return dates.map(date => {
    const activitiesOnDay = activities.filter(activity => isSameDay(date, new Date(activity.date)))
    return {
      date,
      distance: metersToKms(activitiesOnDay.reduce((acc, curr) => acc + curr.activity.distance, 0)),
      rides: activitiesOnDay.length,
      dayOfWeek: date.getDay() === 0 ? 7 : date.getDay(),
      dayOfMonth: date.getDate(),
      month: Intl.DateTimeFormat('en-US', { month: 'short' }).format(date),
    }
  })
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
