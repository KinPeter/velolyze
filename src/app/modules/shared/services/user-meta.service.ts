import { Injectable } from '@angular/core'
import { FirestoreService } from '../../../firebase/firestore.service'
import { NotificationService } from './notification.service'
import { User } from 'firebase/auth'
import { FirestoreCollection } from '../../../constants/firestore-collections'
import { UserMeta } from '../types'
import { Store } from '../../../utils/store'
import { StravaBikeData } from '../../strava/strava.types'

const initialUserMeta: UserMeta = {
  userId: null,
  athleteId: null,
  firstName: '',
  lastName: '',
  lastSyncDate: null,
  stravaProfilePicUrl: null,
  uploadedActivities: [] as number[],
  bikes: [] as StravaBikeData[],
} as unknown as UserMeta

@Injectable({ providedIn: 'root' })
export class UserMetaService extends Store<{ data: UserMeta | null }> {
  constructor(
    private firestoreService: FirestoreService,
    private notificationService: NotificationService
  ) {
    super({ data: null })
  }

  public userMeta$ = this.select(state => state.data)

  public async registerUserMeta(user: User): Promise<void> {
    try {
      const existing = await this.firestoreService.queryOne<UserMeta>(
        FirestoreCollection.USER_META,
        {
          field: 'userId',
          operator: '==',
          value: user.uid,
        }
      )
      if (!existing) {
        const data = {
          ...initialUserMeta,
          userId: user.uid,
        }
        this.setState({ data })
        await this.firestoreService.createOne<UserMeta>(FirestoreCollection.USER_META, data)
      } else {
        this.setState({ data: existing })
        console.log('existing user in meta table:', existing)
      }
    } catch (e) {
      this.notificationService.showError('Could not register user metadata')
    }
  }

  public async updateStravaDataInUserMeta(
    userId: string,
    athleteId: number,
    firstName: string,
    lastName: string,
    stravaProfilePicUrl: string | null
  ): Promise<void> {
    try {
      const userData = await this.firestoreService.queryOne<UserMeta>(
        FirestoreCollection.USER_META,
        {
          field: 'userId',
          operator: '==',
          value: userId,
        }
      )
      if (!userData) throw new Error()
      await this.firestoreService.updateById<UserMeta>(FirestoreCollection.USER_META, userData.id, {
        athleteId,
        firstName,
        lastName,
        stravaProfilePicUrl,
      })
    } catch (e) {
      this.notificationService.showError('Could not update user metadata')
    }
  }

  public async updateSyncDataInUserMeta(
    lastSyncDate: Date,
    syncedIds: number[],
    bikes: StravaBikeData[]
  ): Promise<void> {
    try {
      const userData = await this.firestoreService.queryOne<UserMeta>(
        FirestoreCollection.USER_META,
        {
          field: 'userId',
          operator: '==',
          value: this.state.data?.userId ?? '',
        }
      )
      if (!userData) throw new Error()
      await this.firestoreService.updateById<UserMeta>(FirestoreCollection.USER_META, userData.id, {
        lastSyncDate: lastSyncDate.getTime(),
        uploadedActivities: [...userData.uploadedActivities, ...syncedIds],
        bikes,
      })
    } catch (e) {
      this.notificationService.showError('Could not update sync in user metadata')
    }
  }
}
