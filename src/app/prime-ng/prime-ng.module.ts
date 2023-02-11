import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'

@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonModule, MenuModule],
  exports: [ButtonModule, MenuModule],
})
export class PrimeNgModule {}
