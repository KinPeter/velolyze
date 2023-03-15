import { Component, Input } from '@angular/core'
import { Totals } from '../me/me.types'
import { SportType } from '../../strava/strava.types'
import { separateWords } from '../../../utils/utils'

@Component({
  selector: 'velo-totals-card',
  template: `
    <p-card [header]="title">
      <p>
        <span>{{ data.rides }}</span> Rides
      </p>
      <p *ngIf="hasRides && !hasOnlyRoadRides" class="p-text-secondary">
        {{ ridesByType }}
      </p>
      <p *ngIf="hasRides && hasOnlyRoadRides" class="p-text-secondary">All Road Rides</p>
      <p>
        <span>{{ data.distance }}</span> km
      </p>
    </p-card>
  `,
  styles: [``],
})
export class TotalsCardComponent {
  @Input() title!: string
  @Input() set totals(values: Totals) {
    this.data = values
    this.hasRides = !!values.rides
    this.hasOnlyRoadRides =
      Object.keys(values.ridesByType).length === 1 &&
      Object.keys(values.ridesByType).includes('Ride')
    if (!this.hasOnlyRoadRides) {
      this.composeRidesByType(values.ridesByType)
    }
  }

  public data!: Totals
  public hasRides = false
  public hasOnlyRoadRides = false
  public ridesByType = ''

  constructor() {}

  private composeRidesByType(rides: Record<SportType, number>): void {
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
