import { Component, Input } from '@angular/core'
import { StravaBikeData } from '../strava.types'

@Component({
  selector: 'velo-strava-bikes',
  template: `
    <section class="bikes">
      <h2>Bikes</h2>
      <div class="bike-cards">
        <p-card *ngIf="!bikes.length" class="bike-card">
          <h4>No bikes registered</h4>
        </p-card>
        <p-card *ngFor="let bike of bikes" class="bike-card">
          <h4>{{ bike.name }}</h4>
          <p>Distance: {{ bike.converted_distance }} km</p>
        </p-card>
      </div>
    </section>
  `,
  styles: [
    `
      .bike-cards {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;

        p-card {
          padding: 0;
          width: 250px;
          position: relative;

          ::ng-deep .p-card-content {
            padding: 0;
          }

          p-tag {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
          }

          h4 {
            margin: 0 0 0.5rem;
          }

          p {
            margin: 0;
          }
        }
      }
    `,
  ],
})
export class StravaBikesComponent {
  @Input() bikes!: StravaBikeData[]
}
