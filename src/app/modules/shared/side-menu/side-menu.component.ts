import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core'
import { FirebaseAuthService } from '../../../firebase/firebase-auth.service'
import { Router } from '@angular/router'
import { filter } from 'rxjs'
import { MenuItem } from 'primeng/api'
import { environment } from '../../../../environments/environment'
import { StravaAuthService } from '../../strava/strava-auth.service'

@Component({
  selector: 'velo-side-menu',
  template: `
    <div class="menu">
      <p-menu [model]="items" styleClass="p-menu-width-100"></p-menu>
      <div class="user" *ngIf="isLoggedIn">
        <div class="avatar" #avatar></div>
        <button
          pButton
          pRipple
          type="button"
          label="Log out"
          class="p-button-secondary p-button-sm p-button-text"
          (click)="logOut()"
        ></button>
        <div *ngIf="isOpen" class="credits">
          v{{ version }} | With ❤️ by <a href="https://p-kin.com" target="_blank">P-Kin.com</a>
        </div>
      </div>
    </div>
    <button
      *ngIf="this.isOpen"
      pButton
      pRipple
      type="button"
      icon="pi pi-chevron-left"
      class="p-button-rounded p-button-text close-button"
      (click)="toggleMenu()"
    ></button>
    <button
      *ngIf="!this.isOpen"
      pButton
      pRipple
      type="button"
      icon="pi pi-chevron-right"
      class="p-button-rounded p-button-outlined open-button"
      (click)="toggleMenu()"
    ></button>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        position: relative;
        transition: all 0.3s ease;
        top: 0;
        left: -180px;

        &.open {
          left: 0;
        }
      }

      .menu {
        padding: 5rem 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }

      .open-button {
        position: fixed;
        top: 1rem;
        left: 0.3rem;
        height: 2rem !important;
        width: 2rem !important;
        font-size: 0.5rem;
        padding: 1rem;
      }

      .close-button {
        position: absolute;
        top: 1rem;
        left: 10.5rem;
      }

      .user {
        display: flex;
        flex-direction: column;
        align-items: center;

        &:hover .credits {
          opacity: 1;
        }
      }

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: grey;
        background-position: center;
        background-size: contain;
      }

      .credits {
        position: fixed;
        left: 0.5rem;
        bottom: 0.5rem;
        font-size: 0.8rem;
        color: var(--text-color-secondary);
        opacity: 0;
        transition: all 0.2s ease;
      }
    `,
  ],
})
export class SideMenuComponent {
  @ViewChild('avatar') avatar!: ElementRef<HTMLDivElement>

  @Output() menuToggle = new EventEmitter<void>()

  public version = environment.VERSION
  public isOpen = true
  public isLoggedIn = false

  public items: MenuItem[] = []

  private authenticatedMenuItems: MenuItem[] = [
    {
      label: 'Velolyze',
      items: [
        { label: 'Me', icon: 'pi pi-user', routerLink: ['/main/me'] },
        { label: 'Activities', icon: 'pi pi-sliders-h', routerLink: ['/main/activities'] },
        { label: 'Routes', icon: 'pi pi-map', routerLink: ['/main/routes'] },
      ],
    },
    {
      label: 'Strava',
      items: [{ label: 'Sync with Strava', icon: 'pi pi-sync', routerLink: ['/strava'] }],
    },
  ]

  private loginMenuItems: MenuItem[] = [
    {
      label: 'Velolyze',
      items: [{ label: 'Login', icon: 'pi pi-sign-in', routerLink: ['/login'] }],
    },
  ]

  constructor(
    private firebaseAuthService: FirebaseAuthService,
    private stravaAuthService: StravaAuthService,
    private router: Router
  ) {
    this.firebaseAuthService.user$.subscribe(user => {
      this.isLoggedIn = !!user
      this.setAvatarImage(user?.photoURL)
    })
    this.firebaseAuthService.isLoggedIn$
      .pipe(filter(value => value !== undefined))
      .subscribe(isLoggedIn => {
        this.items = isLoggedIn ? this.authenticatedMenuItems : this.loginMenuItems
      })
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen
    this.menuToggle.emit()
  }

  public logOut(): void {
    this.firebaseAuthService.signOutFromFirebase().then(() => {
      this.stravaAuthService.logOut()
      this.router.navigate(['/login']).then()
    })
  }

  private setAvatarImage(photoUrl: string | null | undefined): void {
    setTimeout(() => {
      if (!this.avatar?.nativeElement) return
      const avatarDiv = this.avatar.nativeElement
      avatarDiv.style.backgroundImage = photoUrl ? `url("${photoUrl}")` : ''
    }, 200)
  }
}
