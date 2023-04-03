import { Activity, ActivityFilterOptions } from '../modules/shared/types/activities'
import { SportType } from '../modules/strava/strava.types'
import { metersToKms, roundToOneDecimal } from './utils'

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
    types: Array.from(types),
    maxDistance: metersToKms(maxDistance),
    maxElevation: roundToOneDecimal(maxElevation),
  }
}
