import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core'
import { StravaActivity } from '../strava.types'
import { addDays, isSameDay, startOfYear } from 'date-fns'
import { UserMetaService } from '../../shared/services/user-meta.service'
import { filter, Subject, takeUntil } from 'rxjs'
import { formatDate } from '../../../utils/utils'

@Component({
  selector: 'velo-strava-activities',
  template: `
    <div class="activities">
      <h2>Sync activities</h2>
      <section class="fetch-sync">
        <div class="fetch">
          <label for="range">Date range to sync:</label>
          <p-calendar
            [(ngModel)]="rangeDates"
            selectionMode="range"
            [readonlyInput]="true"
            [showIcon]="true"
            dateFormat="M d, yy"
            inputId="range"
          ></p-calendar>
          <i class="pi pi-info-circle" [pTooltip]="lastSyncTooltip" tooltipPosition="top"></i>
          <button
            pButton
            pRipple
            label="Fetch rides"
            icon="pi pi-cloud-download"
            iconPos="right"
            [disabled]="rangeDates.length !== 2 || !rangeDates[0] || !rangeDates[1]"
            (click)="onClickFetch()"
          ></button>
        </div>
        <div *ngIf="activities.length" class="sync">
          <span>
            {{ selectedActivities.length }} / {{ activities.length }} activities selected
          </span>
          <i
            *ngIf="selectedActivities.length <= 200"
            class="pi pi-info-circle"
            [pTooltip]="limitationsTooltip"
            tooltipPosition="top"
          ></i>
          <i
            *ngIf="selectedActivities.length > 200"
            class="pi pi-exclamation-triangle"
            [pTooltip]="limitationsTooltip"
            tooltipPosition="top"
          ></i>
          <button
            pButton
            pRipple
            label="Sync"
            icon="pi pi-cloud-upload"
            iconPos="right"
            [disabled]="!selectedActivities.length"
            (click)="onClickSync()"
          ></button>
        </div>
      </section>
      <section *ngIf="activities.length && !successfullySynced" class="list">
        <p-table
          [value]="activities"
          [(selection)]="selectedActivities"
          styleClass="p-datatable-striped"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>
                <p-tableHeaderCheckbox></p-tableHeaderCheckbox>
              </th>
              <th>Date</th>
              <th>Name</th>
              <th>Type</th>
              <th>Distance</th>
              <th>Elevation</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>
                <p-tableCheckbox [value]="item"></p-tableCheckbox>
              </td>
              <td>{{ item.start_date | date }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.sport_type | sportType }}</td>
              <td>{{ item.distance | metersToKms }} km</td>
              <td>{{ item.total_elevation_gain }} m</td>
            </tr>
          </ng-template>
        </p-table>
      </section>
      <section *ngIf="!activities.length && !successfullySynced && fetchNoResult" class="no-result">
        <p>There are no results for this search.</p>
        <p><em>Maybe you already synced everything?</em></p>
      </section>
      <section *ngIf="!activities.length && successfullySynced > 0" class="success">
        <i class="pi pi-check-circle"></i>
        <h2>Successfully synced {{ successfullySynced }} activities!</h2>
        <button
          pButton
          pRipple
          type="button"
          label="Go to Activities"
          class="p-button-outlined p-button-rounded p-button-success"
          routerLink="/main/activities"
        ></button>
      </section>
    </div>
  `,
  styles: [
    `
      .activities {
        section.fetch-sync {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;

          button {
            margin-left: 1rem;
          }

          i {
            font-size: 1.25rem;
            margin-left: 1rem;

            &.pi-exclamation-triangle {
              color: var(--color-warn);
            }
          }

          .fetch {
            label {
              margin-right: 1rem;
            }

            i {
              position: relative;
              top: 2px;
            }
          }

          .sync {
            display: flex;
            align-items: center;
          }
        }

        section.list {
          max-height: calc(100vh - 390px);
          overflow: auto;

          p-table tr {
            th:nth-child(1) {
              width: 50px;
            }

            th:nth-child(2) {
              min-width: 120px;
            }
          }
        }

        section.no-result,
        section.success {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 0;
        }

        section.success {
          color: var(--color-success);

          i {
            font-size: 4rem;
          }

          h2 {
            margin: 3rem 0;
          }
        }
      }
    `,
  ],
})
export class StravaActivitiesComponent implements OnDestroy {
  @Input() activities!: StravaActivity[]
  @Input() successfullySynced!: number
  @Input() fetchNoResult!: boolean

  @Output() fetch = new EventEmitter<Date[]>()
  @Output() sync = new EventEmitter<StravaActivity[]>()

  public rangeDates: Date[] = [startOfYear(new Date()), new Date()]
  public selectedActivities: StravaActivity[] = []

  public lastSyncTooltip =
    "You haven't synced your data yet. You will see your last sync date here."
  public limitationsTooltip =
    'There are limitations for both the Strava API and for the Velolyze database. Please try not to sync more than 200 activities at a time.'

  private unsubscribe$ = new Subject<boolean>()

  constructor(private userMetaService: UserMetaService) {
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ lastSyncDate }) => {
        if (lastSyncDate) {
          this.lastSyncTooltip = 'Last sync date: ' + formatDate(new Date(lastSyncDate))
          const isLastSyncToday = isSameDay(new Date(lastSyncDate), new Date())
          if (!isLastSyncToday) {
            this.rangeDates = [addDays(new Date(lastSyncDate), 1), new Date()]
          } else if (isLastSyncToday) {
            this.rangeDates = [new Date(), new Date()]
          }
        }
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true)
  }

  public onClickFetch(): void {
    this.fetch.emit(this.rangeDates)
    this.selectedActivities = []
  }

  public onClickSync(): void {
    this.sync.emit(this.selectedActivities)
  }
}
