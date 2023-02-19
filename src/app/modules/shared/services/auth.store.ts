import { Injectable } from '@angular/core'
import { Store } from '../../../utils/store'
import { User } from 'firebase/auth'

interface AuthState {
  user: User | null
  isLoggedIn: boolean | undefined
  token: string | undefined
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<AuthState> {
  public isLoggedIn$ = this.select(state => state.isLoggedIn)
  public user$ = this.select(state => state.user)

  public get currentUser(): User | null {
    return this.state.user
  }

  constructor() {
    super({
      user: null,
      isLoggedIn: undefined,
      token: undefined,
    })
  }

  public setAuthState(value: Partial<AuthState>): void {
    this.setState(value)
  }
}
