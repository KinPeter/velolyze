import { Component, OnInit } from '@angular/core'
import { PrimeNGConfig } from 'primeng/api'
import { FirestoreService } from './firebase/firestore.service'

@Component({
  selector: 'velo-root',
  template: `
    <aside [ngClass]="{ open: isMenuOpen }">
      <velo-side-menu
        [ngClass]="{ open: isMenuOpen }"
        (menuToggle)="onToggleMenu()"
      ></velo-side-menu>
    </aside>
    <main [ngClass]="{ open: isMenuOpen }">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      :host {
        --sidebar-width: 200px;
        --sidebar-closed-width: 20px;
        --sidebar-left-closed: calc(var(--sidebar-closed-width) - var(--sidebar-width));
      }

      aside {
        position: fixed;
        left: var(--sidebar-left-closed);
        top: 0;
        height: 100%;
        width: var(--sidebar-width);
        background-color: var(--surface-overlay);

        &.open {
          left: 0;
        }
      }

      main {
        margin-left: var(--sidebar-closed-width);
        padding: 1.5rem 1.5rem 1.5rem 2rem;

        &.open {
          margin-left: var(--sidebar-width);
          padding: 1.5rem;
        }
      }

      aside,
      main {
        transition: all 0.3s ease;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  public isMenuOpen = true

  constructor(private primeNgConfig: PrimeNGConfig, private _firestoreService: FirestoreService) {}

  public ngOnInit() {
    this.primeNgConfig.ripple = true
  }

  public onToggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen
  }
}
