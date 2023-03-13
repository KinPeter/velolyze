import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SideMenuComponent } from './components/side-menu/side-menu.component'
import { PrimeNgModule } from '../../prime-ng/prime-ng.module'
import { RouterModule } from '@angular/router'
import { RippleModule } from 'primeng/ripple'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [SideMenuComponent],
  imports: [CommonModule, FormsModule, PrimeNgModule, RouterModule, RippleModule],
  exports: [FormsModule, SideMenuComponent, PrimeNgModule, RippleModule],
})
export class SharedModule {}
