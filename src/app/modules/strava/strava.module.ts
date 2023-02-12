import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StravaComponent } from './strava.component'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: StravaComponent }])],
  exports: [RouterModule],
})
class StravaRoutingModule {}

@NgModule({
  declarations: [StravaComponent],
  imports: [CommonModule, SharedModule, StravaRoutingModule],
})
export class StravaModule {}

/**
 * userMeta: lastSyncDate, uploadIds[]
 */
