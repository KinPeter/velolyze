import { Component } from '@angular/core'

@Component({
  selector: 'velo-no-data',
  template: `
    <section class="no-data">
      <i class="pi pi-info-circle"></i>
      <h2>It looks like you haven't synced your data with Strava yet</h2>
      <button
        pButton
        pRipple
        type="button"
        label="Go to sync with Strava"
        class="p-button-outlined p-button-rounded p-button-info"
        routerLink="/strava"
      ></button>
    </section>
  `,
  styles: [
    `
      section.no-data {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 3rem 0;
        color: var(--color-info);

        i {
          font-size: 4rem;
        }

        h2 {
          margin: 3rem 0;
        }
      }
    `,
  ],
})
export class NoDataComponent {
  constructor() {}
}
