import { Component, Input } from '@angular/core'
import { StravaAthlete } from '../../strava/strava.types'

@Component({
  selector: 'velo-strava-athlete',
  template: `
    <section class="athlete">
      <div class="profile-pic">
        <div
          *ngIf="athlete.profile"
          [ngStyle]="{ backgroundImage: 'url(' + athlete.profile + ')' }"
          class="picture"
        ></div>
        <div *ngIf="!athlete.profile" class="pic-placeholder">
          {{ athlete.firstname?.charAt(0) }}{{ athlete.lastname?.charAt(0) }}
        </div>
      </div>
      <div class="name">
        <h2>{{ athlete.firstname }} {{ athlete.lastname }}</h2>
        <h3 *ngIf="athlete.city && athlete.country">{{ athlete.city }}, {{ athlete.country }}</h3>
        <h3 *ngIf="!athlete.city && athlete.country">{{ athlete.country }}</h3>
        <h3 *ngIf="athlete.city && !athlete.country">{{ athlete.city }}</h3>
      </div>
    </section>
  `,
  styles: [
    `
      .athlete {
        display: flex;
        align-items: center;
        gap: 1rem;

        .picture,
        .pic-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-size: contain;
        }

        .pic-placeholder {
          background: #fd4c02;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }
      }
    `,
  ],
})
export class StravaAthleteComponent {
  @Input() athlete!: Partial<StravaAthlete>
}
