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
import { CardModule } from 'primeng/card'
import { TagModule } from 'primeng/tag'
import { TableModule } from 'primeng/table'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    MenuModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
  ],
  exports: [
    ButtonModule,
    CalendarModule,
    CardModule,
    MenuModule,
    ToastModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    TableModule,
    TagModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
