import { Store } from '../../../utils/store'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NotificationService } from '../../shared/services/notification.service'
import { switchMap, tap } from 'rxjs/operators'
import {
  StravaActivityResponse,
  StravaAthleteData,
  StravaAthleteResponse,
  StravaAthleteStatsResponse,
} from './cycling.types'
import { convertRideStats, getPrimaryBikeData, getStats, metersToKms } from './cycling.utils'
import { startOfWeek } from 'date-fns'

interface StravaApiState {
  loading: boolean
  data: StravaAthleteData | null
}

const initialState: StravaApiState = {
  loading: false,
  data: null,
}

@Injectable({ providedIn: 'root' })
export class StravaApiService extends Store<StravaApiState> {
  private readonly stravaApiBaseUrl = 'https://www.strava.com/api/v3'

  constructor(private http: HttpClient, private notificationService: NotificationService) {
    super(initialState)
  }

  public loading$ = this.select(state => state.loading)
  public data$ = this.select(state => state.data)

  public getAthleteData(token: string): void {
    const newData: Partial<StravaAthleteData> = {}
    this.setState({ loading: true })
    this.http
      .get<StravaAthleteResponse>(`${this.stravaApiBaseUrl}/athlete`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        tap({
          next: res => {
            newData.id = res.id
            newData.primaryBike = getPrimaryBikeData(res.bikes)
          },
          error: () => {
            this.notificationService.showError('Could not fetch Athlete data from Strava')
            this.setState({ loading: false })
          },
        }),
        switchMap(({ id }) => {
          return this.http.get<StravaAthleteStatsResponse>(
            `${this.stravaApiBaseUrl}/athletes/${id}/stats`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
        }),
        tap({
          next: res => {
            newData.longestRideEver = metersToKms(res.biggest_ride_distance)
            newData.allRideTotals = convertRideStats(res.all_ride_totals)
            newData.ytdRideTotals = convertRideStats(res.ytd_ride_totals)
            newData.recentRideTotals = convertRideStats(res.recent_ride_totals)
          },
          error: () => {
            this.notificationService.showError('Could not fetch Athlete stats from Strava')
            this.setState({ loading: false })
          },
        }),
        switchMap(() => {
          const nowDate = new Date()
          const monthStart = Math.floor(
            new Date(nowDate.getFullYear(), nowDate.getMonth(), 1).getTime() / 1000
          )
          const now = Math.floor(nowDate.getTime() / 1000)
          return this.http.get<StravaActivityResponse[]>(
            `${this.stravaApiBaseUrl}/athlete/activities?per_page=100&after=${monthStart}&before=${now}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        }),
        tap({
          next: res => {
            newData.thisMonth = getStats(res)
          },
          error: () => {
            this.notificationService.showError(
              'Could not fetch Athlete month activities from Strava'
            )
            this.setState({ loading: false })
          },
        }),
        switchMap(() => {
          const nowDate = new Date()
          const weekStart = Math.floor(
            startOfWeek(new Date(), { weekStartsOn: 1 }).getTime() / 1000
          )
          const now = Math.floor(nowDate.getTime() / 1000)
          return this.http.get<StravaActivityResponse[]>(
            `${this.stravaApiBaseUrl}/athlete/activities?per_page=100&after=${weekStart}&before=${now}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
        }),
        tap({
          next: res => {
            newData.thisWeek = getStats(res)
          },
          error: () => {
            this.notificationService.showError(
              'Could not fetch Athlete week activities from Strava'
            )
            this.setState({ loading: false })
          },
        }),
        tap(() => {
          this.setState({ loading: false, data: newData as StravaAthleteData })
        })
      )
      .subscribe()
  }
}
