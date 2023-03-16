import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideMenuComponent } from './components/side-menu.component'
import { PrimeNgModule } from '../../prime-ng/prime-ng.module'
import { RouterModule } from '@angular/router'
import { RippleModule } from 'primeng/ripple'
import { FormsModule } from '@angular/forms'
import { MetersToKmsPipe } from '../../utils/meters-to-kms.pipe'
import { StravaAthleteComponent } from './components/strava-athlete.component'
import { SportTypePipe } from '../../utils/sport-type.pipe'

@NgModule({
  declarations: [SideMenuComponent, StravaAthleteComponent, MetersToKmsPipe, SportTypePipe],
  imports: [CommonModule, FormsModule, PrimeNgModule, RouterModule, RippleModule],
  exports: [
    FormsModule,
    MetersToKmsPipe,
    SideMenuComponent,
    SportTypePipe,
    StravaAthleteComponent,
    PrimeNgModule,
    RippleModule,
  ],
})
export class SharedModule {}
