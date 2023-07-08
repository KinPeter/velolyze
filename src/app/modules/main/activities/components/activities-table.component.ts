import { Component, Input } from '@angular/core'
import { Activity } from '../../../shared/types/activities'

@Component({
  selector: 'velo-activities-table',
  template: `
    <div class="list">
      <p-table [value]="activities" styleClass="p-datatable-striped">
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Type</th>
            <th>Distance</th>
            <th>Elevation</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item>
          <tr>
            <td>{{ item.activity.start_date | date }}</td>
            <td class="activity-name">
              <a [href]="'https://www.strava.com/activities/' + item.activity.id" target="_blank">
                {{ item.activity.name }}
                <i class="pi pi-external-link"></i>
              </a>
            </td>
            <td>{{ item.activity.sport_type | sportType }}</td>
            <td>{{ item.activity.distance | metersToKms }} km</td>
            <td>{{ item.activity.total_elevation_gain }} m</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [
    `
      div.list {
        max-height: calc(100vh - 375px);
        overflow: auto;
      }

      .activity-name {
        a {
          text-decoration: none;
          color: inherit;

          i {
            display: none;
            margin-left: 0.5rem;
          }

          &:hover {
            color: var(--primary-color);

            i {
              color: var(--text-color);
              display: initial;
            }
          }
        }
      }
    `,
  ],
})
export class ActivitiesTableComponent {
  @Input() activities!: Activity[]
}
