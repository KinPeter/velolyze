import { Component } from '@angular/core'
import { FirebaseAuthService } from '../../firebase/firebase-auth.service'

@Component({
  selector: 'velo-auth',
  template: `
    <h1>Welcome to Velolyze</h1>
    <h4>Analyze your cycling data from Strava</h4>
    <p-button label="Log in with Google" icon="pi pi-google" (click)="login()"></p-button>
  `,
  styles: [
    `
      :host {
        width: 100%;
        padding-top: 25vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      h4 {
        color: var(--text-color-secondary);
        margin-bottom: 3rem;
      }
    `,
  ],
})
export class AuthComponent {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  public login() {
    this.firebaseAuthService.loginWithGoogle().then()
  }
}
