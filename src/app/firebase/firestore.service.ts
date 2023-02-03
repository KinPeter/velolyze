import { Injectable } from '@angular/core'
import { FirebaseAppService } from './firebase-app.service'
import { collection, query, where, Firestore, getFirestore, getDocs } from 'firebase/firestore'
import { FirestoreCollection, FirestoreWhereClause } from './firebase.types'

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db: Firestore

  constructor(private firebaseAppService: FirebaseAppService) {
    this.db = getFirestore(this.firebaseAppService.app)
    this.query(FirestoreCollection.COMMON, {
      field: 'name',
      operator: '==',
      value: 'stravaClient',
    }).then(result => {
      console.log('queryResult', result)
    })
  }

  public async query<T>(collectionName: string, whereClause: FirestoreWhereClause): Promise<T[]> {
    try {
      const { field, operator, value } = whereClause
      const collectionRef = collection(this.db, collectionName)
      const q = query(collectionRef, where(field, operator, value))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    } catch (e) {
      console.log('Fetch failed from firestore', e)
      return []
    }
  }
}
