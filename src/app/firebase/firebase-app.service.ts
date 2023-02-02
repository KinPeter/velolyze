import { Injectable } from '@angular/core'
import { FirebaseConfig } from './firebase.types'
import { environment } from '../../environments/environment'
import { FirebaseApp, initializeApp } from 'firebase/app'
import { Analytics, getAnalytics } from 'firebase/analytics'

@Injectable({ providedIn: 'root' })
export class FirebaseAppService {
  private readonly config: FirebaseConfig
  private _app: FirebaseApp | undefined
  private _analytics: Analytics | undefined

  constructor() {
    this.config = {
      apiKey: environment.FIREBASE_API_KEY,
      authDomain: environment.FIREBASE_AUTH_DOMAIN,
      projectId: environment.FIREBASE_PROJECT_ID,
      storageBucket: environment.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
      appId: environment.FIREBASE_APP_ID,
      measurementId: environment.FIREBASE_MEASUREMENT_ID,
    }
  }

  public get app(): FirebaseApp {
    if (!this._app) throw new Error('No FirebaseApp found')
    return this._app
  }
  public get analytics(): Analytics {
    if (!this._analytics) throw new Error('No Firebase Analytics instance found')
    return this._analytics
  }

  public initializeFirebaseApp(): void {
    this._app = initializeApp(this.config)
    this._analytics = getAnalytics(this._app)
    console.log('Firebase app is initialized:', this._app.name)
  }
}
