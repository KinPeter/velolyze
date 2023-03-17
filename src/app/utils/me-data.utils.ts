import { Activity } from '../modules/shared/types/activities'
import {
  CalendarHeatmapData,
  DistancePerPeriods,
  DistancePerDay,
  Totals,
  TotalsPerPeriod,
} from '../modules/main/me/me.types'
import {
  addDays,
  isSameDay,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
} from 'date-fns'
import { SportType, StravaActivity } from '../modules/strava/strava.types'
import { formatDate, metersToKms, roundToOneDecimal, secondsToHours } from './utils'

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

export function getTotals(activities: StravaActivity[]): Totals {
  let distance = 0
  let elevationGain = 0
  let movingTime = 0
  let achievementCount = 0
  let prCount = 0
  const ridesByType = {} as Record<SportType, number>
  let longestRide = activities[0]?.distance ?? 0
  let biggestClimb = activities[0]?.total_elevation_gain ?? 0

  activities.forEach(item => {
    distance += item.distance
    elevationGain += item.total_elevation_gain
    movingTime += item.moving_time
    achievementCount += item.achievement_count
    prCount += item.pr_count
    if (item.trainer) {
      if (ridesByType['VirtualRide']) {
        ridesByType['VirtualRide']++
      } else {
        ridesByType['VirtualRide'] = 1
      }
    } else {
      if (ridesByType[item.sport_type]) {
        ridesByType[item.sport_type]++
      } else {
        ridesByType[item.sport_type] = 1
      }
    }
    if (item.distance > longestRide) {
      longestRide = item.distance
    }
    if (item.total_elevation_gain > biggestClimb) {
      biggestClimb = item.total_elevation_gain
    }
  })

  return {
    rides: activities.length,
    distance: metersToKms(distance),
    elevationGain: roundToOneDecimal(elevationGain),
    movingTime: secondsToHours(movingTime),
    achievementCount,
    prCount,
    ridesByType,
    longestRide: metersToKms(longestRide),
    biggestClimb: roundToOneDecimal(biggestClimb),
  }
}

export function getTotalsForPeriods(activities: Activity[]): TotalsPerPeriod {
  const now = new Date()
  const startOfWeekTime = startOfWeek(now, { weekStartsOn: 1 }).getTime()
  const startOfMonthTime = startOfMonth(now).getTime()
  const startOfYearTime = startOfYear(now).getTime()
  const weekActivities: StravaActivity[] = []
  const monthActivities: StravaActivity[] = []
  const yearActivities: StravaActivity[] = []

  activities.forEach(({ date, activity }) => {
    if (date >= startOfYearTime) yearActivities.push(activity)
    if (date >= startOfMonthTime) monthActivities.push(activity)
    if (date >= startOfWeekTime) weekActivities.push(activity)
  })

  return {
    thisWeek: getTotals(weekActivities),
    thisMonth: getTotals(monthActivities),
    thisYear: getTotals(yearActivities),
    allTimes: getTotals(activities.map(({ activity }) => activity)),
  }
}

export function getDaysForPeriods(distancePerDays: DistancePerDay[]): DistancePerPeriods {
  const now = new Date()
  const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 })
  const startOfMonthDate = startOfMonth(now)
  const startOfYearDate = startOfYear(now)

  const yearData = distancePerDays
    .slice(distancePerDays.findIndex(({ date }) => isSameDay(date, startOfYearDate)))
    .map(({ distance }) => distance)
  const monthData = distancePerDays
    .slice(distancePerDays.findIndex(({ date }) => isSameDay(date, startOfMonthDate)))
    .map(({ distance }) => distance)
  const weekData = distancePerDays
    .slice(distancePerDays.findIndex(({ date }) => isSameDay(date, startOfWeekDate)))
    .map(({ distance }) => distance)

  return {
    thisWeek: [...weekData, ...new Array(7 - weekData.length).fill(0)],
    thisMonth: [...monthData, ...new Array(31 - monthData.length).fill(0)],
    thisYear: getWeeklyDistance(
      [...yearData, ...new Array(365 - yearData.length).fill(0)],
      startOfYearDate.getDay()
    ),
  }
}

function getWeeklyDistance(days: number[], startingDay: number): number[] {
  if (startingDay === 0) {
    startingDay = 7 // Let Sunday be 7
  }
  let firstWeek = 0
  const daysInFirstWeek = 7 - startingDay
  for (let i = 0; i <= daysInFirstWeek; i++) {
    firstWeek += days[i]
  }
  const result: number[] = [roundToOneDecimal(firstWeek)]
  let currentWeek = 0
  for (let i = 0; i < days.length; i++) {
    if (i <= daysInFirstWeek) continue
    currentWeek += days[i]
    if (i % 7 === 0) {
      result.push(roundToOneDecimal(currentWeek))
      currentWeek = 0
    }
  }
  return result
}
