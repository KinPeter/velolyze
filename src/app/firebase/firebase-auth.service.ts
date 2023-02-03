import { Injectable } from '@angular/core'
import {
  Auth,
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { Store } from '../utils/store'
import { FirebaseAppService } from './firebase-app.service'

interface FirebaseAuthState {
  user: User | null
  isLoggedIn: boolean
  token: string | undefined
}

const initialState: FirebaseAuthState = {
  user: null,
  isLoggedIn: false,
  token: undefined,
}

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService extends Store<FirebaseAuthState> {
  private readonly provider: GoogleAuthProvider
  private readonly auth: Auth

  public isLoggedIn$ = this.select(state => state.isLoggedIn)
  public user$ = this.select(state => state.user)

  public get currentUser(): User | null {
    return this.state.user
  }

  // FirebaseAppService is injected here just to make sure it initializes first
  constructor(private _firebaseAppService: FirebaseAppService) {
    super(initialState)
    this.provider = new GoogleAuthProvider()
    this.auth = getAuth()
    onAuthStateChanged(this.auth, user => {
      if (user) {
        this.setState({ user, isLoggedIn: true })
      } else {
        this.setState({ user: null, token: undefined, isLoggedIn: false })
      }
      console.log('auth state changed', this.state)
    })
  }

  public async loginWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      this.setState({ token: credential?.accessToken })
      //eslint-disable-next-line
    } catch (error: any) {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      throw new Error(`Login for ${email} failed: ${errorCode} - ${errorMessage}`)
    }
  }

  public async signOutFromFirebase(): Promise<void> {
    try {
      await signOut(this.auth)
    } catch (e) {
      console.log('Could not sign out')
    }
  }
}
