import { Component, OnDestroy } from '@angular/core'
import { combineLatest, filter, Subject, takeUntil } from 'rxjs'
import { map } from 'rxjs/operators'
import { StravaBikeData } from '../../strava/strava.types'
import { Activity } from '../../shared/types/activities'
import { ActivitiesService } from '../../shared/services/activities.service'
import { UserMetaService } from '../../shared/services/user-meta.service'

@Component({
  selector: 'velo-activities',
  template: `
    <ng-container *ngIf="loading$ | async; else outerContainer">
      <p-progressSpinner class="velo-spinner"></p-progressSpinner>
    </ng-container>
    <ng-template #outerContainer>
      <velo-no-data *ngIf="!activities.length; else activitiesContainer"></velo-no-data>
      <ng-template #activitiesContainer>
        <p>You have {{ activities.length }} activities! Yeey</p>
      </ng-template>
    </ng-template>
  `,
  styles: [],
})
export class ActivitiesComponent implements OnDestroy {
  public loading$ = combineLatest([
    this.activitiesService.loading$,
    this.userMetaService.loading$,
  ]).pipe(map(([a, b]) => a || b))

  public bikes: StravaBikeData[] = []
  public activities: Activity[] = []

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private activitiesService: ActivitiesService,
    private userMetaService: UserMetaService
  ) {
    this.activitiesService.activities$.pipe(takeUntil(this.unsubscribe$)).subscribe(activities => {
      this.activities = activities
    })
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ bikes }) => {
        this.bikes = bikes
      })
  }

  public ngOnDestroy(): void {
    this.unsubscribe$.next(true)
  }
}
