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
import { TooltipModule } from 'primeng/tooltip'
import { SidebarModule } from 'primeng/sidebar'
import { TabViewModule } from 'primeng/tabview'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToastModule,
    TooltipModule,
  ],
  exports: [
    ButtonModule,
    CalendarModule,
    CardModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    SidebarModule,
    TableModule,
    TabViewModule,
    TagModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [MessageService],
})
export class PrimeNgModule {}
