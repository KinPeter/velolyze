import { Component } from '@angular/core'
import { NotificationService } from '../../shared/services/notification.service'

@Component({
  selector: 'velo-me',
  template: ` <p>me works!</p>
    <p-button label="error" (click)="showError()"></p-button>`,
  styles: [],
})
export class MeComponent {
  constructor(private notificationService: NotificationService) {}

  public showError() {
    this.notificationService.showError('Oops', 'something bad happened... try again later')
  }
}
