import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MainComponent } from './main.component'
import { MeComponent } from './me/me.component'
import { MainRoutingModule } from './main-routing.module'
import { ActivitiesComponent } from './activities/activities.component'
import { RoutesComponent } from './routes/routes.component'
import { ButtonModule } from 'primeng/button'

@NgModule({
  declarations: [MainComponent, MeComponent, ActivitiesComponent, RoutesComponent],
  imports: [CommonModule, MainRoutingModule, ButtonModule],
})
export class MainModule {}
