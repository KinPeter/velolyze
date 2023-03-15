export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  }).format(date)
}

export function metersToKms(meters: number): number {
  return Math.round(meters / 100) / 10
}
