import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { LocalStore } from '../../utils/store'
import { StravaSettings } from './strava.types'
import { StorageKeys } from '../../constants/storage-keys'

const initialState: StravaSettings = {
  stravaClientId: null,
  stravaClientSecret: null,
  stravaOauthRedirectUrl: null,
}

@Injectable({ providedIn: 'root' })
export class StravaSettingsStore extends LocalStore<StravaSettings> {
  constructor() {
    super(StorageKeys.STRAVA_SETTINGS, { ...initialState })
  }

  public get stravaSettings(): Observable<StravaSettings> {
    return this.select(state => {
      return {
        stravaClientId: state.stravaClientId,
        stravaClientSecret: state.stravaClientSecret,
        stravaOauthRedirectUrl: state.stravaOauthRedirectUrl,
      }
    })
  }

  public setSettings(settings: StravaSettings): void {
    this.setState({
      stravaClientId: settings.stravaClientId,
      stravaClientSecret: settings.stravaClientSecret,
      stravaOauthRedirectUrl: settings.stravaOauthRedirectUrl,
    })
  }

  public clearSettings(): void {
    this.setState({ ...initialState })
  }
}
