import { Component, OnDestroy } from '@angular/core'
import { ActivitiesService } from '../../shared/services/activities.service'
import { UserMetaService } from '../../shared/services/user-meta.service'
import { combineLatest, filter, Subject, takeUntil } from 'rxjs'
import { map } from 'rxjs/operators'
import { StravaAthlete } from '../../strava/strava.types'
import { Activity } from '../../shared/types/activities'
import { getCalendarHeatmapData } from '../../../utils/me-data.utils'
import { CalendarHeatmapData } from './me.types'

@Component({
  selector: 'velo-me',
  template: `
    <ng-container *ngIf="loading$ | async; else meContainer">
      <p-progressSpinner class="velo-spinner"></p-progressSpinner>
    </ng-container>
    <ng-template #meContainer>
      <velo-strava-athlete
        *ngIf="athlete && (athlete?.firstname || athlete?.lastname)"
        [athlete]="athlete"
      ></velo-strava-athlete>
      <velo-no-data
        *ngIf="!athlete?.firstname || !athlete?.lastname || !activities.length"
      ></velo-no-data>
      <velo-calendar-heatmap [days]="calendarHeatmapDays"></velo-calendar-heatmap>
    </ng-template>
  `,
  styles: [],
})
export class MeComponent implements OnDestroy {
  public loading$ = combineLatest([
    this.activitiesService.loading$,
    this.userMetaService.loading$,
  ]).pipe(map(([a, b]) => a || b))

  public athlete: Partial<StravaAthlete> | undefined
  public activities: Activity[] = []
  public calendarHeatmapDays: CalendarHeatmapData[] = []

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private activitiesService: ActivitiesService,
    private userMetaService: UserMetaService
  ) {
    this.activitiesService.activities$.pipe(takeUntil(this.unsubscribe$)).subscribe(activities => {
      this.activities = activities
      // console.log(getActivitiesPerDay(activities))
      // console.log(getCalendarHeatmapData(activities))
      this.calendarHeatmapDays = getCalendarHeatmapData(activities)
    })
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ firstName, lastName, stravaProfilePicUrl, city, country }) => {
        this.athlete = {
          firstname: firstName,
          lastname: lastName,
          city,
          country,
          profile: stravaProfilePicUrl || undefined,
        }
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true)
  }
}
