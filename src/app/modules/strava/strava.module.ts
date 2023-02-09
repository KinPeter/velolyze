import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { StravaComponent } from './strava.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: StravaComponent }])],
  exports: [RouterModule],
})
class StravaRoutingModule {}

@NgModule({
  declarations: [StravaComponent],
  imports: [CommonModule, StravaRoutingModule],
})
export class StravaModule {}

/**
 * userMeta: lastSyncDate, uploadIds[]
 */
