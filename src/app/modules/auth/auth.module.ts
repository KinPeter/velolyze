import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthComponent } from './auth.component'
import { RouterModule } from '@angular/router'

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: AuthComponent }])],
  exports: [RouterModule],
})
class AuthRoutingModule {}

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
