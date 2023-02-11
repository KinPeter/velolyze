import { NgModule } from '@angular/core'
import { AuthComponent } from './auth.component'
import { RouterModule } from '@angular/router'
import { SharedModule } from '../shared/shared.module'

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AuthComponent }])],
  exports: [RouterModule],
})
class AuthRoutingModule {}

@NgModule({
  declarations: [AuthComponent],
  imports: [SharedModule, AuthRoutingModule],
})
export class AuthModule {}
