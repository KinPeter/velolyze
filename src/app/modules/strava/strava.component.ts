import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { filter, Subject, takeUntil, combineLatest, take } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { StravaApiService } from './strava-api.service'
import { UserMetaService } from '../shared/services/user-meta.service'
import { map } from 'rxjs/operators'
import { StravaActivity, StravaAthlete, StravaBikeData } from './strava.types'

@Component({
  selector: 'velo-strava',
  template: `
    <ng-container *ngIf="disabled$ | async">
      <p-messages severity="warn">
        <ng-template pTemplate>
          <i class="pi pi-exclamation-triangle warning-icon"></i>
          <span>Sorry, it seems Strava service is not available.</span>
        </ng-template>
      </p-messages>
    </ng-container>
    <ng-container *ngIf="loading$ | async">
      <p-progressSpinner class="velo-spinner"></p-progressSpinner>
    </ng-container>
    <ng-container *ngIf="(loading$ | async) === false && (disabled$ | async) === false">
      <div *ngIf="needAuth$ | async; else stravaContainer">
        <a pButton [href]="stravaOauthUrl">Log in to Strava</a>
      </div>
      <ng-template #stravaContainer>
        <velo-strava-athlete *ngIf="athlete" [athlete]="athlete"></velo-strava-athlete>
        <velo-strava-bikes *ngIf="athlete && bikes" [bikes]="bikes"></velo-strava-bikes>
        <velo-strava-activities
          [activities]="activities"
          (fetch)="fetchActivities($event)"
          (sync)="syncActivities($event)"
        ></velo-strava-activities>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      i.warning-icon {
        font-size: 1.3rem;
        margin-right: 1rem;
      }
    `,
  ],
})
export class StravaComponent implements OnDestroy {
  public loading$ = combineLatest([
    this.stravaAuthService.loading$,
    this.stravaApiService.loading$,
  ]).pipe(map(([a, b]) => a || b))
  public disabled$ = this.stravaAuthService.disabled$
  public needAuth$ = this.stravaAuthService.needAuth$
  public stravaOauthUrl = this.stravaAuthService.stravaOauthUrl
  public athlete: StravaAthlete | null = null
  public bikes: StravaBikeData[] = []
  public activities: StravaActivity[] = []

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private stravaAuthService: StravaAuthService,
    private stravaApiService: StravaApiService,
    private route: ActivatedRoute,
    private router: Router,
    private userMetaService: UserMetaService
  ) {
    this.route.queryParams.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      if (params?.['code']) {
        this.stravaAuthService.exchangeOauthCodeToToken(params['code']).subscribe()
        this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} }).then()
      }
    })
    this.fetchAthleteData()
  }

  public ngOnDestroy() {
    this.unsubscribe$.next(true)
  }

  private fetchAthleteData(): void {
    combineLatest([this.loading$, this.disabled$, this.needAuth$])
      .pipe(
        filter(
          ([loading, disabled, needAuth]) => !loading && !disabled && !needAuth && !this.athlete
        ),
        take(1)
      )
      .subscribe(async () => {
        this.athlete = await this.stravaApiService.fetchAthleteData()
        console.log(this.athlete)
        const { bikes } = this.athlete
        const primaryIndex = bikes.findIndex(({ primary }) => primary)
        const primaryBike = bikes[primaryIndex]
        bikes.splice(primaryIndex, 1)
        bikes.sort((a, b) => b.converted_distance - a.converted_distance)
        this.bikes = [primaryBike, ...bikes]
      })
  }

  public async fetchActivities(dates: Date[]): Promise<void> {
    const [start, end] = dates
    if (!start || !end) return
    this.activities = await this.stravaApiService.fetchActivities(start, end)
    console.log(this.activities)
  }

  public async syncActivities(activities: StravaActivity[]): Promise<void> {
    console.log(activities)
    // await this.userMetaService.updateSyncDataInUserMeta(
    //   end,
    //   activities.map(({ upload_id }) => upload_id)
    // )
  }
}
