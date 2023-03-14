import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StravaComponent } from './strava.component'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'
import { StravaAthleteComponent } from './components/strava-athlete.component'
import { StravaBikesComponent } from './components/strava-bikes.component'
import { StravaActivitiesComponent } from './components/strava-activities.component'

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: StravaComponent }])],
  exports: [RouterModule],
})
class StravaRoutingModule {}

@NgModule({
  declarations: [
    StravaComponent,
    StravaAthleteComponent,
    StravaBikesComponent,
    StravaActivitiesComponent,
  ],
  imports: [CommonModule, SharedModule, StravaRoutingModule],
})
export class StravaModule {}

/**
 * userMeta: lastSyncDate, uploadIds[]
 */
