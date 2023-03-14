import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core'
import { StravaActivity } from '../strava.types'
import { addDays, isSameDay, startOfYear } from 'date-fns'
import { UserMetaService } from '../../shared/services/user-meta.service'
import { filter, Subject, takeUntil } from 'rxjs'

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
      <section *ngIf="activities.length" class="list">
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
              <td>{{ item.sport_type }}</td>
              <td>{{ item.distance | metersToKms }} km</td>
              <td>{{ item.total_elevation_gain }} m</td>
            </tr>
          </ng-template>
        </p-table>
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

          .fetch {
            label {
              margin-right: 1rem;
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
      }
    `,
  ],
})
export class StravaActivitiesComponent implements OnDestroy {
  @Input() activities!: StravaActivity[]

  @Output() fetch = new EventEmitter<Date[]>()
  @Output() sync = new EventEmitter<StravaActivity[]>()

  public rangeDates: Date[] = [startOfYear(new Date()), new Date()]
  public selectedActivities: StravaActivity[] = []

  private unsubscribe$ = new Subject<boolean>()

  constructor(private userMetaService: UserMetaService) {
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ lastSyncDate }) => {
        const isLastSyncToday = lastSyncDate && isSameDay(new Date(lastSyncDate), new Date())
        if (lastSyncDate && !isLastSyncToday) {
          this.rangeDates = [addDays(new Date(lastSyncDate), 1), new Date()]
        } else if (lastSyncDate && isLastSyncToday) {
          this.rangeDates = [new Date(), new Date()]
        }
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true)
  }

  public onClickFetch(): void {
    this.fetch.emit(this.rangeDates)
  }

  public onClickSync(): void {
    this.sync.emit(this.selectedActivities)
  }
}
