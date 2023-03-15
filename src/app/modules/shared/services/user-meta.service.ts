import { Injectable } from '@angular/core'
import { FirestoreService } from '../../../firebase/firestore.service'
import { NotificationService } from './notification.service'
import { User } from 'firebase/auth'
import { FirestoreCollection } from '../../../constants/firestore-collections'
import { UserMeta } from '../types'
import { Store } from '../../../utils/store'
import { StravaAthlete, StravaBikeData } from '../../strava/strava.types'

const initialUserMeta: UserMeta = {
  userId: null,
  athleteId: null,
  firstName: '',
  lastName: '',
  city: '',
  country: '',
  lastSyncDate: null,
  stravaProfilePicUrl: null,
  uploadedActivities: [] as number[],
  bikes: [] as StravaBikeData[],
} as unknown as UserMeta

interface UserMetaState {
  data: UserMeta | null
  loading: boolean
}

@Injectable({ providedIn: 'root' })
export class UserMetaService extends Store<UserMetaState> {
  constructor(
    private firestoreService: FirestoreService,
    private notificationService: NotificationService
  ) {
    super({ data: null, loading: false })
  }

  public userMeta$ = this.select(state => state.data)
  public loading$ = this.select(state => state.loading)

  public async registerUserMeta(user: User): Promise<void> {
    this.setState({ loading: true })
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
    } finally {
      this.setState({ loading: false })
    }
  }

  public async updateStravaDataInUserMeta(
    userId: string,
    athleteId: number,
    firstName: string,
    lastName: string,
    stravaProfilePicUrl: string | null
  ): Promise<void> {
    this.setState({ loading: true })
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
      this.setState({
        data: {
          ...userData,
          athleteId,
          firstName,
          lastName,
          stravaProfilePicUrl,
        },
      })
    } catch (e) {
      this.notificationService.showError('Could not update user metadata')
    } finally {
      this.setState({ loading: false })
    }
  }

  public async updateSyncDataInUserMeta(
    athlete: StravaAthlete,
    bikes: StravaBikeData[],
    syncedIds: number[]
  ): Promise<void> {
    this.setState({ loading: true })
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
      const lastSyncDate = new Date().getTime()
      const uploadedActivities = [...userData.uploadedActivities, ...syncedIds]
      const city = athlete.city ?? ''
      const country = athlete.country ?? ''
      await this.firestoreService.updateById<UserMeta>(FirestoreCollection.USER_META, userData.id, {
        lastSyncDate,
        uploadedActivities,
        bikes,
        city,
        country,
      })
      this.setState({
        data: {
          ...userData,
          lastSyncDate,
          bikes,
          uploadedActivities,
          city,
          country,
        },
      })
    } catch (e) {
      this.notificationService.showError('Could not update sync in user metadata')
    } finally {
      this.setState({ loading: false })
    }
  }
}
