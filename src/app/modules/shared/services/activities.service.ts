import { Injectable } from '@angular/core'
import { Store } from '../../../utils/store'
import { FirestoreService } from '../../../firebase/firestore.service'
import { NotificationService } from './notification.service'
import { AuthStore } from './auth.store'
import { FirestoreCollection } from '../../../constants/firestore-collections'
import { Activity } from '../types/activities'

interface ActivitiesState {
  loading: boolean
  activities: Activity[]
}

const initialState: ActivitiesState = {
  loading: false,
  activities: [],
}

@Injectable({ providedIn: 'root' })
export class ActivitiesService extends Store<ActivitiesState> {
  public activities$ = this.select(state => state.activities)
  public loading$ = this.select(state => state.loading)

  constructor(
    private firestoreService: FirestoreService,
    private notificationService: NotificationService,
    private authStore: AuthStore
  ) {
    super(initialState)
  }

  public async fetchAllForUser(userId: string): Promise<void> {
    this.setState({ loading: true })
    try {
      const response = await this.firestoreService.query<Activity>(FirestoreCollection.ACTIVITIES, {
        field: 'userId',
        operator: '==',
        value: userId,
      })
      console.log(response)
      // const response = JSON.parse(localStorage.getItem('temp') as string)
      // localStorage.setItem('temp', JSON.stringify(response))
      this.setState({ activities: response })
    } catch (e) {
      this.notificationService.showError('Could not fetch activities.')
    } finally {
      this.setState({ loading: false })
    }
  }

  public async fetchAllForCurrentUser(): Promise<void> {
    await this.fetchAllForUser(this.authStore.currentUser?.uid ?? '')
  }
}
