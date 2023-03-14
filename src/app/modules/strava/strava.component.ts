import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { filter, Subject, takeUntil, combineLatest, take } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { StravaApiService } from './strava-api.service'
import { addDays, isSameDay, startOfYear } from 'date-fns'
import { UserMetaService } from '../shared/services/user-meta.service'
import { map } from 'rxjs/operators'
import { StravaAthlete, StravaBikeData } from './strava.types'

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
        <div *ngIf="athlete" class="athlete">
          <div class="profile-pic">
            <div
              *ngIf="athlete.profile"
              [ngStyle]="{ backgroundImage: 'url(' + athlete.profile + ')' }"
              class="picture"
            ></div>
            <div *ngIf="!athlete.profile" class="pic-placeholder">
              {{ athlete.firstname.charAt(0) }}{{ athlete.lastname.charAt(0) }}
            </div>
          </div>
          <div class="name">
            <h2>{{ athlete.firstname }} {{ athlete.lastname }}</h2>
            <h3 *ngIf="athlete.city && athlete.country">
              {{ athlete.city }}, {{ athlete.country }}
            </h3>
            <h3 *ngIf="!athlete.city && athlete.country">{{ athlete.country }}</h3>
            <h3 *ngIf="athlete.city && !athlete.country">{{ athlete.city }}</h3>
          </div>
        </div>
        <div *ngIf="athlete && bikes" class="bikes">
          <h2>Bikes</h2>
          <div class="bike-cards">
            <p-card *ngFor="let bike of bikes" class="bike-card">
              <h4>{{ bike.name }} <p-tag *ngIf="bike.primary" value="Primary"></p-tag></h4>
              <p>Distance: {{ bike.converted_distance }}km</p>
            </p-card>
          </div>
        </div>
        <div class="activities">
          <h2>Sync activities</h2>
          <label for="range">Range</label>
          <p-calendar
            [(ngModel)]="rangeDates"
            selectionMode="range"
            [readonlyInput]="true"
            [showIcon]="true"
            inputId="range"
          ></p-calendar>
          <button (click)="fetchActivities()">fetch</button>
        </div>
      </ng-template>
    </ng-container>
  `,
  styles: [
    `
      i.warning-icon {
        font-size: 1.3rem;
        margin-right: 1rem;
      }

      .athlete {
        display: flex;
        align-items: center;
        gap: 1rem;

        .picture,
        .pic-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-size: contain;
        }

        .pic-placeholder {
          background: #fd4c02;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
        }
      }

      .bike-cards {
        display: flex;
        gap: 1rem;

        p-card {
          padding: 0;
          width: 250px;
          height: 100px;

          h4,
          p {
            margin: 0;
          }
        }
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
  public rangeDates: Date[] = [startOfYear(new Date()), new Date()]
  public athlete: StravaAthlete | null = null
  public bikes: StravaBikeData[] = []

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
    this.userMetaService.userMeta$
      .pipe(filter(Boolean), takeUntil(this.unsubscribe$))
      .subscribe(({ lastSyncDate }) => {
        if (lastSyncDate && !isSameDay(new Date(lastSyncDate), new Date())) {
          this.rangeDates = [addDays(new Date(lastSyncDate), 1), new Date()]
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

  public async fetchActivities(): Promise<void> {
    const [start, end] = this.rangeDates
    if (!start || !end) return
    const activities = await this.stravaApiService.fetchActivities(start, end)
    console.log(activities)
    // await this.userMetaService.updateSyncDataInUserMeta(
    //   end,
    //   activities.map(({ upload_id }) => upload_id)
    // )
  }
}
