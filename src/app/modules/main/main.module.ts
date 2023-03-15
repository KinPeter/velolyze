import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MainComponent } from './main.component'
import { MeComponent } from './me/me.component'
import { MainRoutingModule } from './main-routing.module'
import { ActivitiesComponent } from './activities/activities.component'
import { RoutesComponent } from './routes/routes.component'
import { SharedModule } from '../shared/shared.module'
import { NoDataComponent } from './common/no-data.component'
import { CalendarHeatmapComponent } from './me/components/calendar-heatmap.component'

@NgModule({
  declarations: [
    MainComponent,
    MeComponent,
    NoDataComponent,
    ActivitiesComponent,
    RoutesComponent,
    CalendarHeatmapComponent,
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
