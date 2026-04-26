import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCVr1Zymln06QskvAudQWi3SG8pPblF0o8',
  authDomain: 'factory-db-e6bcf.firebaseapp.com',
  projectId: 'factory-db-e6bcf',
  storageBucket: 'factory-db-e6bcf.firebasestorage.app',
  messagingSenderId: '451635285016',
  appId: '1:451635285016:web:241bae5a15f002994ac76d',
  databaseURL: 'https://factory-db-e6bcf-default-rtdb.firebaseio.com',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getDatabase(app)
export const auth = getAuth(app)
export default app
