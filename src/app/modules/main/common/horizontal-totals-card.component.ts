import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Totals } from '../me/me.types'
import { composeRidesByType } from '../../../utils/me-data.utils'

@Component({
  selector: 'velo-horizontal-totals-card',
  template: `
    <div class="card velo-card">
      <section class="totals">
        <header class="row align-center">
          <h1>{{ title }}</h1>
          <button
            pButton
            pRipple
            type="button"
            label="Filter rides"
            class="p-button-outlined"
            icon="pi pi-sliders-h"
            iconPos="right"
            (click)="openFilters.emit()"
          ></button>
        </header>
        <div class="row align-center">
          <p>
            <span>{{ data.rides }}</span>
            Ride<ng-container *ngIf="data.rides !== 1">s</ng-container>
          </p>
          <p *ngIf="hasRides">
            {{ ridesByType }}
          </p>
        </div>
        <div class="row">
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
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          &.align-center {
            align-items: center;
          }
        }
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
export class HorizontalTotalsCardComponent {
  @Input() title!: string
  @Input() set totals(values: Totals) {
    this.data = values
    this.hasRides = !!values.rides
    if (values.rides) {
      this.ridesByType = composeRidesByType(values.ridesByType)
    }
  }
  @Output() openFilters = new EventEmitter<void>()

  public data!: Totals
  public hasRides = false
  public ridesByType = ''

  constructor() {}
}
