import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { rideSportTypes, StravaActivity, StravaAthlete } from './strava.types'
import { Store } from '../../utils/store'
import { NotificationService } from '../shared/services/notification.service'
import { firstValueFrom } from 'rxjs'
import { StravaAuthService } from './strava-auth.service'
import { startOfDay, endOfDay } from 'date-fns'

interface StravaApiState {
  loading: boolean
}

const initialState: StravaApiState = {
  loading: false,
}

@Injectable({ providedIn: 'root' })
export class StravaApiService extends Store<StravaApiState> {
  private readonly stravaApiBaseUrl = 'https://www.strava.com/api/v3'
  private apiOptions = { headers: { Authorization: '' } }

  constructor(
    private http: HttpClient,
    private stravaAuthService: StravaAuthService,
    private notificationService: NotificationService
  ) {
    super(initialState)
    this.stravaAuthService.accessToken$.subscribe(token => {
      this.apiOptions.headers.Authorization = `Bearer ${token}`
    })
  }

  public loading$ = this.select(state => state.loading)

  public async fetchActivities(startDate: Date, endDate: Date): Promise<StravaActivity[]> {
    this.setState({ loading: true })
    const start = Math.floor(startOfDay(startDate).getTime() / 1000)
    const end = Math.floor(endOfDay(endDate).getTime() / 1000)
    let activities: StravaActivity[] = []
    let page = 1
    let done = false
    try {
      while (!done) {
        const url = `${this.stravaApiBaseUrl}/athlete/activities?per_page=100&page=${page}&after=${start}&before=${end}`
        const response = await firstValueFrom(this.http.get<StravaActivity[]>(url, this.apiOptions))
        if (!response) {
          throw new Error()
        } else if (response?.length < 100) {
          done = true
        } else {
          page++
        }
        activities = [...activities, ...response]
      }
      return activities.filter(({ sport_type }) => rideSportTypes.includes(sport_type))
    } catch (e) {
      this.notificationService.showError('Could not fetch activities')
      return []
    } finally {
      this.setState({ loading: false })
    }
  }

  public async fetchAthleteData(): Promise<StravaAthlete> {
    this.setState({ loading: true })
    try {
      const url = `${this.stravaApiBaseUrl}/athlete`
      return await firstValueFrom(this.http.get<StravaAthlete>(url, this.apiOptions))
    } catch (e) {
      this.notificationService.showError('Could not fetch athlete data')
      return {} as StravaAthlete
    } finally {
      this.setState({ loading: false })
    }
  }
}
