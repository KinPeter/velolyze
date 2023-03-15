import { Component } from '@angular/core'
import { AuthStore } from '../shared/services/auth.store'
import { filter, take } from 'rxjs'
import { ActivitiesService } from '../shared/services/activities.service'

@Component({
  selector: 'velo-main',
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class MainComponent {
  constructor(private authStore: AuthStore, private activitiesService: ActivitiesService) {
    this.authStore.user$.pipe(filter(Boolean), take(1)).subscribe(user => {
      this.activitiesService.fetchAllForUser(user.uid).then()
    })
  }
}
