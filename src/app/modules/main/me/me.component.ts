import { Component, OnDestroy } from '@angular/core'
import { ActivitiesService } from '../../shared/services/activities.service'
import { UserMetaService } from '../../shared/services/user-meta.service'
import { combineLatest, filter, Subject, takeUntil } from 'rxjs'
import { map } from 'rxjs/operators'
import { StravaAthlete } from '../../strava/strava.types'
import { Activity } from '../../shared/types/activities'
import {
  getCalendarHeatmapData,
  getDaysForPeriods,
  getTotalsForPeriods,
} from '../../../utils/me-data.utils'
import { CalendarHeatmapData, DistancePerPeriods, TotalsPerPeriod } from './me.types'

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
      <section class="totals">
        <velo-totals-card
          [totals]="totals.thisWeek"
          [lineChartData]="daysForPeriods.thisWeek"
          title="This week"
        ></velo-totals-card>
        <velo-totals-card
          [totals]="totals.thisMonth"
          [lineChartData]="daysForPeriods.thisMonth"
          title="This month"
        ></velo-totals-card>
        <velo-totals-card
          [totals]="totals.thisYear"
          [lineChartData]="daysForPeriods.thisYear"
          title="This year"
        ></velo-totals-card>
        <velo-totals-card [totals]="totals.allTimes" title="All times"></velo-totals-card>
      </section>
    </ng-template>
  `,
  styles: [
    `
      section.totals {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: repeat(1, 1fr);
        grid-gap: 1rem;
        max-width: 1500px;
      }
    `,
  ],
})
export class MeComponent implements OnDestroy {
  public loading$ = combineLatest([
    this.activitiesService.loading$,
    this.userMetaService.loading$,
  ]).pipe(map(([a, b]) => a || b))

  public athlete: Partial<StravaAthlete> | undefined
  public activities: Activity[] = []
  public calendarHeatmapDays: CalendarHeatmapData[] = []
  public daysForPeriods: DistancePerPeriods = {} as DistancePerPeriods
  public totals!: TotalsPerPeriod

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private activitiesService: ActivitiesService,
    private userMetaService: UserMetaService
  ) {
    this.activitiesService.activities$.pipe(takeUntil(this.unsubscribe$)).subscribe(activities => {
      this.activities = activities
      this.calendarHeatmapDays = getCalendarHeatmapData(activities)
      this.daysForPeriods = getDaysForPeriods(this.calendarHeatmapDays)
      console.log(this.daysForPeriods)
      this.totals = getTotalsForPeriods(activities)
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
