import { Injectable } from '@angular/core'
import { FirestoreService } from '../../../firebase/firestore.service'
import { NotificationService } from './notification.service'
import { User } from 'firebase/auth'
import { FirestoreCollection } from '../../../constants/firestore-collections'
import { UserMeta } from '../types'

@Injectable({ providedIn: 'root' })
export class UserMetaService {
  constructor(
    private firestoreService: FirestoreService,
    private notificationService: NotificationService
  ) {}

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
      console.log('existing user in meta table:', existing)
      if (!existing) {
        await this.firestoreService.createOne<UserMeta>(FirestoreCollection.USER_META, {
          userId: user.uid,
          athleteId: null,
          firstName: '',
          lastName: '',
          lastSyncDate: null,
          stravaProfilePicUrl: null,
          uploadedActivities: [] as number[],
        } as UserMeta)
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
}
