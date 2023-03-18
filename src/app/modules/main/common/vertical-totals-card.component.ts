import { Component, Input } from '@angular/core'
import { Totals } from '../me/me.types'
import { composeRidesByType } from '../../../utils/me-data.utils'

@Component({
  selector: 'velo-vertical-totals-card',
  template: `
    <div class="card velo-card">
      <section class="totals">
        <h1>{{ title }}</h1>
        <p>
          <span>{{ data.rides }}</span> Ride<ng-container *ngIf="data.rides !== 1">s</ng-container>
        </p>
        <p *ngIf="hasRides">
          {{ ridesByType }}
        </p>
        <p>
          <span>{{ data.distance }}</span> <b>km</b> of distance <br />
          <span>{{ data.elevationGain }}</span> <b>m</b> of elevation gain <br />
          <span>{{ data.movingTime }}</span> <b>hrs</b> of moving
        </p>
        <p *ngIf="data.achievementCount">
          <span>{{ data.achievementCount }}</span> new achievements
          <ng-container *ngIf="data.prCount">
            <br />with <span>{{ data.prCount }}</span> personal records
          </ng-container>
        </p>
        <p *ngIf="data.rides > 1">
          Longest ride: <span>{{ data.longestRide }}</span> <b>km</b> <br />
          Biggest climb: <span>{{ data.biggestClimb }}</span> <b>m</b>
        </p>
      </section>
      <section class="chart">
        <velo-simple-line-chart
          *ngIf="lineChartData"
          [lineChartData]="lineChartData"
        ></velo-simple-line-chart>
        <velo-donut-chart
          *ngIf="donutChartData"
          [donutChartData]="donutChartData"
        ></velo-donut-chart>
      </section>
    </div>
  `,
  styles: [
    `
      .card {
        min-height: calc(100vh - 370px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      p {
        color: var(--text-color-secondary);
      }

      span {
        color: var(--text-color);
        font-size: 1.5rem;
        font-weight: bold;
      }

      b {
        color: var(--text-color);
        margin-left: 4px;
      }
    `,
  ],
})
export class VerticalTotalsCardComponent {
  @Input() title!: string
  @Input() set totals(values: Totals) {
    this.data = values
    this.hasRides = !!values.rides
    if (values.rides) {
      this.ridesByType = composeRidesByType(values.ridesByType)
    }
  }
  @Input() lineChartData: number[] | undefined
  @Input() donutChartData: Record<string, number> | undefined

  public data!: Totals
  public hasRides = false
  public ridesByType = ''

  constructor() {}
}
