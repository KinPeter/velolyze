import { SportType } from '../modules/strava/strava.types'

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date)
}

export function metersToKms(meters: number): number {
  return Math.round(meters / 100) / 10
}

export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 60 / 60) * 10) / 10
}

export function roundToOneDecimal(number: number): number {
  return Math.round(number * 10) / 10
}

export function separateWords(string: string): string {
  return string.replace(/([A-Z])/g, ' $1').trim()
}

export function getSportType(sportType: SportType): string {
  if (sportType === 'Ride') return 'Road Ride'
  return separateWords(sportType)
}
