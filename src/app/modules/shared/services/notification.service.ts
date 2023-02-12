import { Injectable } from '@angular/core'
import { MessageService } from 'primeng/api'

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private messageService: MessageService) {}

  public showSuccess(detail: string, summary = 'Yeey!'): void {
    this.messageService.add({ severity: 'success', summary, detail })
  }

  public showInfo(detail: string, summary = 'Note:'): void {
    this.messageService.add({ severity: 'info', summary, detail })
  }

  public showWarning(detail: string, summary = 'Beware!'): void {
    this.messageService.add({ severity: 'warn', summary, detail })
  }

  public showError(detail: string, summary = 'Ooops!'): void {
    this.messageService.add({ severity: 'error', summary, detail, sticky: true })
  }
}
