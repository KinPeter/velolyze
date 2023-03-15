import { Injectable } from '@angular/core'
import { UserMetaService } from '../shared/services/user-meta.service'
import { StravaActivity, StravaBikeData } from './strava.types'
import { Store } from '../../utils/store'
import { FirestoreService } from '../../firebase/firestore.service'
import { AuthStore } from '../shared/services/auth.store'
import { FirestoreCollection } from '../../constants/firestore-collections'
import { NotificationService } from '../shared/services/notification.service'

@Injectable({ providedIn: 'root' })
export class StravaSyncService extends Store<{ loading: boolean }> {
  public loading$ = this.select(state => state.loading)

  constructor(
    private authStore: AuthStore,
    private firestoreService: FirestoreService,
    private notificationService: NotificationService,
    private userMetaService: UserMetaService
  ) {
    super({ loading: false })
  }

  public async syncActivities(
    bikes: StravaBikeData[],
    activities: StravaActivity[]
  ): Promise<number> {
    this.setState({ loading: true })
    const activityIds = activities.map(({ id }) => id)
    const payload = activities.map(activity => ({
      id: this.authStore.currentUser?.uid + '_' + activity.id,
      userId: this.authStore.currentUser?.uid,
      date: new Date(activity.start_date).getTime(),
      activity,
    }))
    const synced = await this.firestoreService.createMany(FirestoreCollection.ACTIVITIES, payload)
    if (synced > 0) {
      await this.userMetaService.updateSyncDataInUserMeta(bikes, activityIds)
      this.setState({ loading: false })
      return synced
    } else {
      this.setState({ loading: false })
      this.notificationService.showError('Failed to sync activities')
      return 0
    }
  }
}
