import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { FirebaseAuthService } from './firebase/firebase-auth.service'
import { FirestoreService } from './firebase/firestore.service'
import { filter } from 'rxjs'
import { Router } from '@angular/router'

@Component({
  selector: 'velo-root',
  template: `
    <!--The content below is only a placeholder and can be replaced.-->
    <div style="text-align:center" class="content">
      <h1>Welcome to {{ title }}!</h1>
      <span style="display: block">{{ title }} app is running!</span>
      <img
        width="300"
        alt="Angular Logo"
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg=="
      />
    </div>
    <div class="avatar" #avatar></div>
    <p-button *ngIf="!isLoggedIn" label="Log in" (onClick)="login()"></p-button>
    <p-button *ngIf="isLoggedIn" label="Log out" (onClick)="logOut()"></p-button>
    <a routerLink="/strava">Strava</a><br />
    <a routerLink="/main">main</a><br />
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: grey;
        background-position: center;
        background-size: contain;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  title = 'velolyze'

  @ViewChild('avatar') avatar!: ElementRef<HTMLDivElement>

  public isLoggedIn = false

  constructor(
    private primeNgConfig: PrimeNGConfig,
    private firebaseAuthService: FirebaseAuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.firebaseAuthService.user$.subscribe(user => {
      this.isLoggedIn = !!user
      this.setAvatarImage(user?.photoURL)
    })
    this.firebaseAuthService.isLoggedIn$
      .pipe(filter(value => value !== undefined))
      .subscribe(isLoggedIn => {
        this.router.navigate([isLoggedIn ? '/main' : '/login']).then()
      })
  }

  public ngOnInit() {
    this.primeNgConfig.ripple = true
  }

  public login() {
    this.firebaseAuthService.loginWithGoogle().then()
  }

  public logOut() {
    this.firebaseAuthService.signOutFromFirebase().then()
  }

  private setAvatarImage(photoUrl: string | null | undefined) {
    if (!this.avatar?.nativeElement) return
    const avatarDiv = this.avatar.nativeElement
    avatarDiv.style.backgroundImage = photoUrl ? `url("${photoUrl}")` : ''
  }
}
