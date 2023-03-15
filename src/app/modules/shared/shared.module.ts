import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideMenuComponent } from './components/side-menu.component'
import { PrimeNgModule } from '../../prime-ng/prime-ng.module'
import { RouterModule } from '@angular/router'
import { RippleModule } from 'primeng/ripple'
import { FormsModule } from '@angular/forms'
import { MetersToKmsPipe } from '../../utils/meters-to-kms.pipe'
import { StravaAthleteComponent } from './components/strava-athlete.component'

@NgModule({
  declarations: [SideMenuComponent, StravaAthleteComponent, MetersToKmsPipe],
  imports: [CommonModule, FormsModule, PrimeNgModule, RouterModule, RippleModule],
  exports: [
    FormsModule,
    MetersToKmsPipe,
    SideMenuComponent,
    StravaAthleteComponent,
    PrimeNgModule,
    RippleModule,
  ],
})
export class SharedModule {}
