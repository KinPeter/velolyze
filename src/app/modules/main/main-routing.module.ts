import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { MainComponent } from './main.component'
import { MeComponent } from './me/me.component'
import { ActivitiesComponent } from './activities/activities.component'
import { RoutesComponent } from './routes/routes.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
        children: [
          { path: 'me', component: MeComponent },
          { path: 'activities', component: ActivitiesComponent },
          { path: 'routes', component: RoutesComponent },
          { path: '', redirectTo: 'me', pathMatch: 'full' },
        ],
      },
    ]),
  ],
  exports: [RouterModule],
  declarations: [],
})
export class MainRoutingModule {}
