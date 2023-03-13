import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { filter, Subject, Subscription, takeUntil } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { StravaApiService } from './strava-api.service'
import { addDays, startOfYear } from 'date-fns'
import { UserMetaService } from '../shared/services/user-meta.service'
import { tr } from 'date-fns/locale'

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
        <div>Strava works!</div>
        <label for="range">Range</label>
        <p-calendar
          [(ngModel)]="rangeDates"
          selectionMode="range"
          [readonlyInput]="true"
          inputId="range"
        ></p-calendar>
        <button (click)="fetch()">fetch</button>
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
  public loading$ = this.stravaAuthService.loading$
  public disabled$ = this.stravaAuthService.disabled$
  public needAuth$ = this.stravaAuthService.needAuth$
  public stravaOauthUrl = this.stravaAuthService.stravaOauthUrl
  public rangeDates: Date[] = [startOfYear(new Date()), new Date()]

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
        console.log('subscribe lastSyncDate', new Date(lastSyncDate ?? 0))
        if (lastSyncDate) {
          this.rangeDates = [addDays(new Date(lastSyncDate), 1), new Date()]
        }
      })
  }

  public ngOnDestroy() {
    this.unsubscribe$.next(true)
  }

  public async fetch(): Promise<void> {
    const [start, end] = this.rangeDates
    if (!start || !end) return
    console.log(start, end)
    const activities = await this.stravaApiService.fetchActivities(start, end)
    console.log(activities)
    await this.userMetaService.updateSyncDataInUserMeta(
      end,
      activities.map(({ upload_id }) => upload_id)
    )
  }
}
