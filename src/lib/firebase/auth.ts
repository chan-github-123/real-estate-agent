import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'
import { auth } from './config'

export async function signIn(email: string, password: string) {
  if (!auth) return { user: null, error: 'Auth not initialized' }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export async function signOut() {
  if (!auth) return { error: 'Auth not initialized' }
  try {
    await firebaseSignOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    // Auth가 초기화되지 않았을 때도 콜백 호출
    setTimeout(() => callback(null), 0)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export function getCurrentUser(): User | null {
  if (!auth) return null
  return auth.currentUser
}
