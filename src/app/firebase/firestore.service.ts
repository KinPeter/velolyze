import { Injectable } from '@angular/core'
import { FirebaseAppService } from './firebase-app.service'
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  QueryConstraint,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { BaseFirestoreData, FirestoreDataWithId, FirestoreWhereClause } from './firebase.types'
import { NotificationService } from '../modules/shared/services/notification.service'
import { AuthStore } from '../modules/shared/services/auth.store'

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db: Firestore
  private isLoggedIn = false

  constructor(
    private firebaseAppService: FirebaseAppService,
    private authStore: AuthStore,
    private notificationService: NotificationService
  ) {
    this.db = getFirestore(this.firebaseAppService.app)
    this.authStore.isLoggedIn$.subscribe(value => {
      this.isLoggedIn = !!value
    })
  }

  public async query<T>(
    collectionName: string,
    criteria: FirestoreWhereClause | FirestoreWhereClause[]
  ): Promise<T[]> {
    if (!this.isLoggedIn) return []
    try {
      const constraints: QueryConstraint[] = Array.isArray(criteria)
        ? criteria.map(({ field, operator, value }) => where(field, operator, value))
        : [where(criteria.field, criteria.operator, criteria.value)]
      const collectionRef = collection(this.db, collectionName)
      const q = query(collectionRef, ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    } catch (e) {
      console.log('Fetch failed from Firestore', e)
      this.notificationService.showError('Fetch failed from Firestore')
      return [] as T[]
    }
  }

  public async queryOne<T>(
    collectionName: string,
    criteria: FirestoreWhereClause | FirestoreWhereClause[]
  ): Promise<T | null> {
    const resultsArray = await this.query<T>(collectionName, criteria)
    if (!resultsArray.length) return null
    if (resultsArray.length > 1) {
      const message = 'queryOne method actually found more matches, please check your query!'
      this.notificationService.showWarning(message)
      throw new Error(message)
    }
    return resultsArray[0]
  }

  public async createOne<T extends BaseFirestoreData>(
    collectionName: string,
    data: T
  ): Promise<string | undefined> {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data)
      console.log('Document written: ', docRef)
      return docRef.id
    } catch (e) {
      this.notificationService.showError('Failed to create document in Firestore')
      return undefined
    }
  }

  public async createMany<T extends FirestoreDataWithId>(
    collectionName: string,
    data: T[]
  ): Promise<number> {
    try {
      const batch = writeBatch(this.db)
      for (const item of data) {
        const ref = doc(this.db, collectionName, item.id)
        batch.set(ref, item)
      }
      await batch.commit()
      return data.length
    } catch (e) {
      this.notificationService.showError('Failed to create documents in Firestore')
      return 0
    }
  }

  public async updateById<T extends BaseFirestoreData>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<string | undefined> {
    try {
      const documentRef = doc(this.db, collectionName, docId)
      await updateDoc(documentRef, data as T)
      return docId
    } catch (e) {
      this.notificationService.showError('Failed to update document in Firestore')
      return undefined
    }
  }
}
