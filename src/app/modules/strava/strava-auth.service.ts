import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { tap } from 'rxjs/operators'
import { Injectable } from '@angular/core'
import { LocalStore } from '../../utils/store'
import { StorageKeys } from '../../constants/storage-keys'
import { StravaSettingsStore } from './strava-settings.store'
import { StravaAuthResponse, StravaSettings } from './strava.types'
import { FirestoreService } from '../../firebase/firestore.service'
import { FirestoreCollection } from '../../firebase/firebase.types'
import { NotificationService } from '../shared/services/notification.service'

interface StravaAuthState {
  loading: boolean
  disabled: boolean
  needAuth: boolean
  accessToken: string | null
  refreshToken: string | null
  tokenExpiresAt: number | null
  athleteId: number | null
}

const initialState: StravaAuthState = {
  loading: true,
  disabled: true,
  needAuth: false,
  accessToken: null,
  refreshToken: null,
  tokenExpiresAt: null,
  athleteId: null,
}

@Injectable({ providedIn: 'root' })
export class StravaAuthService extends LocalStore<StravaAuthState> {
  private readonly stravaAuthBaseUrl = 'https://www.strava.com/oauth/authorize'
  private readonly stravaAuthTokenUrl = 'https://www.strava.com/oauth/token'

  private stravaSettings: StravaSettings | undefined

  constructor(
    private http: HttpClient,
    private firestoreService: FirestoreService,
    private notificationService: NotificationService,
    private settingsStore: StravaSettingsStore
  ) {
    super(StorageKeys.STRAVA_AUTH, initialState)
    this.firestoreService
      .queryOne<StravaSettings>(FirestoreCollection.COMMON, {
        field: 'name',
        operator: '==',
        value: 'stravaClient',
      })
      .then(result => {
        if (!result) return
        this.settingsStore.setSettings(result)
      })
    this.settingsStore.stravaSettings.subscribe(settings => {
      if (!settings.stravaClientId || !settings.stravaClientSecret) {
        this.setState({
          loading: false,
          disabled: true,
          accessToken: null,
          refreshToken: null,
          tokenExpiresAt: null,
          athleteId: null,
        })
        return
      }
      this.stravaSettings = settings
      if (this.state.accessToken && !this.isLoggedInToStrava) {
        this.refreshStravaToken().subscribe()
      } else if (!this.state.accessToken) {
        this.setState({ disabled: false, needAuth: true, loading: false })
      } else if (this.isLoggedInToStrava) {
        this.setState({ disabled: false, needAuth: false, loading: false })
      }
    })
  }

  public loading$ = this.select(state => state.loading)
  public disabled$ = this.select(state => state.disabled)
  public needAuth$ = this.select(state => state.needAuth)
  public accessToken$ = this.select(state => state.accessToken)

  public get stravaOauthUrl(): string {
    if (!this.stravaSettings) return ''
    const { stravaClientId, stravaOauthRedirectUrl } = this.stravaSettings
    let stravaRedirectUri = stravaOauthRedirectUrl
    if (window.location.hostname === 'localhost') {
      stravaRedirectUri = 'http://localhost:4000/strava'
    }
    return `${this.stravaAuthBaseUrl}?client_id=${stravaClientId}&redirect_uri=${stravaRedirectUri}&response_type=code&scope=read_all,activity:read_all,profile:read_all`
  }

  public exchangeOauthCodeToToken(code: string): Observable<StravaAuthResponse | null> {
    if (!this.stravaSettings) return of(null)
    const { stravaClientId, stravaClientSecret } = this.stravaSettings
    this.setState({ loading: true })
    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&code=${code}&grant_type=authorization_code`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava auth', res)
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              athleteId: res.athlete.id,
              loading: false,
              needAuth: false,
            })
          },
          error: () => {
            this.notificationService.showError('Could not get auth token from Strava')
            this.setState({ loading: false, disabled: true })
          },
        })
      )
  }

  public refreshStravaToken(): Observable<StravaAuthResponse> {
    if (!this.stravaSettings) throw new Error('No Strava settings found')
    const { stravaClientId, stravaClientSecret } = this.stravaSettings

    const refreshToken = this.state.refreshToken
    this.setState({ loading: true })

    return this.http
      .post<StravaAuthResponse>(
        `${this.stravaAuthTokenUrl}?client_id=${stravaClientId}&client_secret=${stravaClientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,
        null
      )
      .pipe(
        tap({
          next: res => {
            console.log('strava token refresh', res)
            this.setState({
              accessToken: res.access_token,
              refreshToken: res.refresh_token,
              tokenExpiresAt: res.expires_at,
              loading: false,
              needAuth: false,
            })
          },
          error: () => {
            this.notificationService.showError('Could not refresh token with Strava')
            this.setState({ loading: false, disabled: true })
          },
        })
      )
  }

  public get isLoggedInToStrava(): boolean {
    const { accessToken, tokenExpiresAt } = this.state
    if (!accessToken || !tokenExpiresAt) return false
    const now = new Date()
    const expiry = new Date(tokenExpiresAt * 1000)
    return now < expiry
  }

  public logOut(): void {
    this.setState({ ...initialState, needAuth: true })
  }
}
