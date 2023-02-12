import { Component, OnDestroy } from '@angular/core'
import { StravaAuthService } from './strava-auth.service'
import { Subscription } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'velo-strava',
  template: `<div>
    <div *ngIf="needAuth$ | async">
      <a pButton [href]="stravaOauthUrl">Log in to Strava</a>
    </div>
  </div>`,
  styles: [],
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
