import { Injectable } from '@angular/core'
import { FirebaseAppService } from './firebase-app.service'
import {
  collection,
  query,
  where,
  Firestore,
  getFirestore,
  getDocs,
  QueryConstraint,
} from 'firebase/firestore'
import { FirestoreWhereClause } from './firebase.types'

@Injectable({ providedIn: 'root' })
export class FirestoreService {
  private readonly db: Firestore

  constructor(private firebaseAppService: FirebaseAppService) {
    this.db = getFirestore(this.firebaseAppService.app)
  }

  public async query<T>(
    collectionName: string,
    criteria: FirestoreWhereClause | FirestoreWhereClause[]
  ): Promise<T[]> {
    try {
      const constraints: QueryConstraint[] = Array.isArray(criteria)
        ? criteria.map(({ field, operator, value }) => where(field, operator, value))
        : [where(criteria.field, criteria.operator, criteria.value)]
      const collectionRef = collection(this.db, collectionName)
      const q = query(collectionRef, ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T))
    } catch (e) {
      console.log('Fetch failed from firestore', e)
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
      throw new Error('queryOne method actually found more matches, please check your query!')
    }
    return resultsArray[0]
  }
}
