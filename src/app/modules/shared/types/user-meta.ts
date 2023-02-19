export interface UserMeta {
  id: string
  userId: string
  athleteId: number | null
  firstName: string
  lastName: string
  stravaProfilePicUrl: string | null
  lastSyncDate: number | null
  uploadedActivities: number[]
}
