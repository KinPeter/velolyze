import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonModule } from 'primeng/button'
import { MenuModule } from 'primeng/menu'
import { ToastModule } from 'primeng/toast'
import { MessageModule } from 'primeng/message'
import { MessageService } from 'primeng/api'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { MessagesModule } from 'primeng/messages'
import { CalendarModule } from 'primeng/calendar'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    MenuModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
  ],
  exports: [
    ButtonModule,
    CalendarModule,
    MenuModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
