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
import { VerticalTotalsCardComponent } from './common/vertical-totals-card.component'
import { SimpleLineChartComponent } from './common/simple-line-chart.component'
import { DonutChartComponent } from './common/donut-chart.component'
import { HorizontalTotalsCardComponent } from './common/horizontal-totals-card.component'
import { FiltersComponent } from './common/filters.component'

@NgModule({
  declarations: [
    MainComponent,
    MeComponent,
    NoDataComponent,
    ActivitiesComponent,
    RoutesComponent,
    CalendarHeatmapComponent,
    VerticalTotalsCardComponent,
    HorizontalTotalsCardComponent,
    SimpleLineChartComponent,
    DonutChartComponent,
    FiltersComponent,
  ],
  imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule {}
