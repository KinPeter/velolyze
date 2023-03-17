import { Component, Input } from '@angular/core'
import { Totals } from '../me/me.types'
import { SportType } from '../../strava/strava.types'
import { separateWords } from '../../../utils/utils'

@Component({
  selector: 'velo-totals-card',
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
      </section>
    </div>
  `,
  styles: [
    `
      .card {
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
export class TotalsCardComponent {
  @Input() title!: string
  @Input() set totals(values: Totals) {
    this.data = values
    this.hasRides = !!values.rides
    if (values.rides) {
      this.composeRidesByType(values.ridesByType)
    }
  }
  @Input() lineChartData: number[] | undefined

  public data!: Totals
  public hasRides = false
  public ridesByType = ''

  constructor() {}

  private composeRidesByType(rides: Record<SportType, number>): void {
    const types = Object.keys(rides)
    if (types.length === 1) {
      if (types[0] === 'Ride') {
        this.ridesByType = 'All Road Rides'
        return
      } else {
        this.ridesByType = `All ${separateWords(types[0])}s`
        return
      }
    }
    if (rides['Ride']) {
      this.ridesByType += `${rides['Ride']} Road Ride${rides['Ride'] > 1 ? 's' : ''}, `
    }
    Object.entries(rides).forEach(([type, count], index, array) => {
      if (type !== 'Ride') {
        this.ridesByType += `${count} ${separateWords(type)}${count > 1 ? 's' : ''}${
          index !== array.length - 1 ? ',' : ''
        } `
      }
    })
  }
}
