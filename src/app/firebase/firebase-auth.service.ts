import { Injectable } from '@angular/core'
import {
  Auth,
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth'
import { FirebaseAppService } from './firebase-app.service'
import { NotificationService } from '../modules/shared/services/notification.service'
import { UserMetaService } from '../modules/shared/services/user-meta.service'
import { AuthStore } from '../modules/shared/services/auth.store'

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private readonly provider: GoogleAuthProvider
  private readonly auth: Auth

  // FirebaseAppService is injected here just to make sure it initializes first
  constructor(
    private _firebaseAppService: FirebaseAppService,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private userMetaService: UserMetaService
  ) {
    this.provider = new GoogleAuthProvider()
    this.auth = getAuth()
    this.authStore.setAuthState({ user: this.auth.currentUser })
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.authStore.setAuthState({ user, isLoggedIn: true })
        this.userMetaService.registerUserMeta(user).then()
      } else {
        this.authStore.setAuthState({ user: null, token: undefined, isLoggedIn: false })
      }
      console.log('auth state changed', user)
    })
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      this.authStore.setAuthState({ token: credential?.accessToken })
      //eslint-disable-next-line
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const fullMessage = `Login for ${email} failed: ${errorCode} - ${errorMessage}`
      this.notificationService.showError(fullMessage)
      throw new Error(fullMessage)
    }
  }

  public async signOutFromFirebase(): Promise<void> {
    try {
      await signOut(this.auth)
    } catch (e) {
      this.notificationService.showError('Could not sign out')
    }
  }
}
