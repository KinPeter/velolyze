import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'

@NgModule({
  declarations: [],
  imports: [CommonModule, ButtonModule, MenuModule, ToastModule, MessageModule],
  exports: [ButtonModule, MenuModule, ToastModule, MessageModule],
  providers: [MessageService],
})
export class PrimeNgModule {}
