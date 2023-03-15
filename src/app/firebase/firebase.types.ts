import { WhereFilterOp } from 'firebase/firestore'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export interface FirestoreWhereClause {
  field: string
  operator: WhereFilterOp
  value: string
}

export interface BaseFirestoreData {
  //eslint-disable-next-line
  [key: string]: any
}

export interface FirestoreDataWithId extends BaseFirestoreData {
  id: string
}
