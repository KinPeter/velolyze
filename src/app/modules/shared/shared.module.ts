import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideMenuComponent } from './components/side-menu/side-menu.component'
import { PrimeNgModule } from '../../prime-ng/prime-ng.module'
import { RouterModule } from '@angular/router'
import { RippleModule } from 'primeng/ripple'

@NgModule({
  declarations: [SideMenuComponent],
  imports: [CommonModule, PrimeNgModule, RouterModule, RippleModule],
  exports: [SideMenuComponent, PrimeNgModule, RippleModule],
})
export class SharedModule {}
