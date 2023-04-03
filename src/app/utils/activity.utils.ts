import {
  Activity,
  ActivityFilterOptions,
  ActivityFilters,
  FilterPeriodType,
  RideEnvironment,
} from '../modules/shared/types/activities'
import { SportType } from '../modules/strava/strava.types'
import { getSportType, metersToKms, roundToOneDecimal } from './utils'
import { endOfMonth, endOfYear, startOfMonth, startOfYear } from 'date-fns'

export function getFilterOptions(activities: Activity[]): ActivityFilterOptions {
  const cities: Set<string> = new Set<string>()
  const countries: Set<string> = new Set<string>()
  const types: Set<SportType> = new Set<SportType>()
  let hasIndoor = false
  let maxDistance = 0
  let maxElevation = 0
  let startYear = 9999

  activities.forEach(({ date, activity }) => {
    const year = new Date(date).getFullYear()
    const { location_city, location_country, sport_type, distance, total_elevation_gain, trainer } =
      activity
    if (year < startYear) startYear = year
    if (distance > maxDistance) maxDistance = distance
    if (total_elevation_gain > maxElevation) maxElevation = total_elevation_gain
    if (!hasIndoor) hasIndoor = trainer || sport_type === 'VirtualRide'
    cities.add(location_city)
    countries.add(location_country)
    types.add(sport_type)
  })

  return {
    startYear,
    hasIndoor,
    cities: Array.from(cities).filter(Boolean),
    countries: Array.from(countries).filter(Boolean),
    types: Array.from(types).map(type => ({ name: getSportType(type), type })),
    maxDistance: metersToKms(maxDistance),
    maxElevation: roundToOneDecimal(maxElevation),
  }
}

export function filterActivities(activities: Activity[], filters: ActivityFilters): Activity[] {
  let result = activities

  if (filters.environment === RideEnvironment.INDOOR) {
    result = result.filter(({ activity }) => activity.type === 'VirtualRide' || activity.trainer)
  } else if (filters.environment === RideEnvironment.OUTDOOR) {
    result = result.filter(({ activity }) => activity.type !== 'VirtualRide' && !activity.trainer)
  }

  if (filters.periodType === FilterPeriodType.RANGE && filters.dateRange) {
    result = result.filter(
      ({ date }) =>
        date >= (filters.dateRange as Date[])[0].getTime() &&
        date <= (filters.dateRange as Date[])[1].getTime()
    )
  } else if (filters.periodType === FilterPeriodType.YEAR && filters.year) {
    const start = startOfYear(filters.year).getTime()
    const end = endOfYear(filters.year).getTime()
    result = result.filter(({ date }) => date >= start && date <= end)
  } else if (filters.periodType === FilterPeriodType.MONTH && filters.month) {
    const start = startOfMonth(filters.month).getTime()
    const end = endOfMonth(filters.month).getTime()
    result = result.filter(({ date }) => date >= start && date <= end)
  }

  if (filters.types?.length) {
    result = result.filter(({ activity }) => {
      const { sport_type } = activity
      return filters.types?.includes(sport_type)
    })
  }

  if (filters.cities?.length) {
    result = result.filter(({ activity }) => {
      const { location_city } = activity
      return filters.cities?.includes(location_city)
    })
  }

  if (filters.countries?.length) {
    result = result.filter(({ activity }) => {
      const { location_country } = activity
      return filters.countries?.includes(location_country)
    })
  }

  if (filters.bikes?.length) {
    result = result.filter(({ activity }) => {
      const { gear_id } = activity
      return filters.bikes?.includes(gear_id)
    })
  }

  return result.filter(({ activity }) => {
    const { distance, total_elevation_gain: elevation } = activity
    const distanceKm = metersToKms(distance)
    const [minDistance, maxDistance] = filters.distance
    const [minElevation, maxElevation] = filters.elevation
    return (
      distanceKm >= minDistance &&
      distanceKm <= maxDistance &&
      elevation >= minElevation &&
      elevation <= maxElevation
    )
  })
}
