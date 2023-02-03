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

export enum FirestoreCollection {
  COMMON = 'common',
  ACTIVITIES = 'ACTIVITIES',
}

export interface FirestoreWhereClause {
  field: string
  operator: WhereFilterOp
  value: string
}
