import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'

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

  private subscription = new Subscription()

  constructor(
    private stravaAuthService: StravaAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        if (params?.['code']) {
          this.stravaAuthService.exchangeOauthCodeToToken(params['code']).subscribe()
          this.router.navigate(['.'], { relativeTo: this.route, queryParams: {} }).then()
        }
      })
    )
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
