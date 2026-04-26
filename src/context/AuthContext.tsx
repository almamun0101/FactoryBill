'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User,
} from 'firebase/auth'
import { saveProfile, getProfile } from '@/lib/db'

interface AuthCtx {
  user: User | null
  profile: { displayName: string; factoryName: string } | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, factory: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: { displayName: string; factoryName: string }) => Promise<void>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ displayName: string; factoryName: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async u => {
      setUser(u)
      if (u) {
        const p = await getProfile(u.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
  }, [])

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function register(email: string, password: string, name: string, factory: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await saveProfile(cred.user.uid, { displayName: name, factoryName: factory })
    setProfile({ displayName: name, factoryName: factory })
  }

  async function logout() {
    await signOut(auth)
  }

  async function updateUserProfile(data: { displayName: string; factoryName: string }) {
    if (!user) return
    await saveProfile(user.uid, data)
    setProfile(data)
  }

  return (
    <Ctx.Provider value={{ user, profile, loading, login, register, logout, updateUserProfile }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
