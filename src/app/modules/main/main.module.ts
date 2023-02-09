import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MainComponent } from './main.component'
import { MeComponent } from './me/me.component'
import { MainRoutingModule } from './main-routing.module'

@NgModule({
  declarations: [MainComponent, MeComponent],
  imports: [CommonModule, MainRoutingModule],
})
export class MainModule {}
