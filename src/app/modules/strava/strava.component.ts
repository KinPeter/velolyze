import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { filter, Subject, takeUntil, combineLatest, take } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { StravaApiService } from './strava-api.service'
import { UserMetaService } from '../shared/services/user-meta.service'
import { map } from 'rxjs/operators'
import { StravaActivity, StravaAthlete, StravaBikeData } from './strava.types'
import { StravaSyncService } from './strava-sync.service'

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
      <section *ngIf="needAuth$ | async; else stravaContainer" class="need-auth">
        <p>In order to sync with Strava, you have to authorize Velolyze to access your data.</p>
        <a pButton [href]="stravaOauthUrl">Log in to Strava</a>
      </section>
      <ng-template #stravaContainer>
        <velo-strava-athlete *ngIf="athlete" [athlete]="athlete"></velo-strava-athlete>
        <velo-strava-bikes *ngIf="athlete && bikes" [bikes]="bikes"></velo-strava-bikes>
        <velo-strava-activities
          [activities]="activities"
          [successfullySynced]="successfullySynced"
          [fetchNoResult]="fetchButNoResult"
          (fetch)="fetchActivities($event)"
          (sync)="syncActivities($event)"
        ></velo-strava-activities>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      section.need-auth {
        width: 100%;
        padding-top: 25vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p {
          color: var(--text-color-secondary);
          margin-bottom: 3rem;
        }
      }

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
    this.stravaSyncService.loading$,
  ]).pipe(map(([a, b, c]) => a || b || c))
  public disabled$ = this.stravaAuthService.disabled$
  public needAuth$ = this.stravaAuthService.needAuth$
  public stravaOauthUrl = this.stravaAuthService.stravaOauthUrl
  public athlete: StravaAthlete | null = null
  public bikes: StravaBikeData[] = []
  public uploadedActivityIds: number[] = []
  public activities: StravaActivity[] = []
  public successfullySynced = 0
  public fetchButNoResult = false

  private unsubscribe$ = new Subject<boolean>()

  constructor(
    private stravaAuthService: StravaAuthService,
    private stravaApiService: StravaApiService,
    private stravaSyncService: StravaSyncService,
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
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ uploadedActivities }) => {
        this.uploadedActivityIds = [...uploadedActivities]
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
        const { bikes } = this.athlete
        bikes.sort((a, b) => b.converted_distance - a.converted_distance)
        this.bikes = bikes
      })
  }

  public async fetchActivities(dates: Date[]): Promise<void> {
    this.successfullySynced = 0
    this.fetchButNoResult = false
    const [start, end] = dates
    if (!start || !end) return
    const response = await this.stravaApiService.fetchActivities(start, end)
    this.activities = response.filter(({ id }) => !this.uploadedActivityIds.includes(id))
    this.fetchButNoResult = !this.activities.length
  }

  public async syncActivities(activities: StravaActivity[]): Promise<void> {
    if (!this.athlete) return
    const successfullySynced = await this.stravaSyncService.syncActivities(
      this.athlete,
      this.bikes,
      activities
    )
    this.successfullySynced = successfullySynced
    if (successfullySynced > 0) {
      this.activities = []
    }
  }
}
