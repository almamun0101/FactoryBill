import { db } from './firebase'
import { ref, set, get, push, remove, onValue, off } from 'firebase/database'
import type { Settings, MonthData, ElectricityRecharge } from '@/types'

// ─── Settings ────────────────────────────────────────────────────────────────
export async function saveSettings(uid: string, settings: Settings) {
  await set(ref(db, `users/${uid}/settings`), settings)
}

export async function getSettings(uid: string): Promise<Settings | null> {
  const snap = await get(ref(db, `users/${uid}/settings`))
  return snap.exists() ? snap.val() : null
}

export function subscribeSettings(uid: string, cb: (s: Settings | null) => void) {
  const r = ref(db, `users/${uid}/settings`)
  onValue(r, snap => cb(snap.exists() ? snap.val() : null))
  return () => off(r)
}

// ─── Machine readings ─────────────────────────────────────────────────────────
export async function saveMonthReadings(uid: string, monthData: MonthData) {
  await set(ref(db, `users/${uid}/readings/${monthData.monthKey}`), monthData)
}

export function subscribeMonthReadings(uid: string, monthKey: string, cb: (d: MonthData | null) => void) {
  const r = ref(db, `users/${uid}/readings/${monthKey}`)
  onValue(r, snap => cb(snap.exists() ? snap.val() : null))
  return () => off(r)
}

export async function getAllReadings(uid: string): Promise<Record<string, MonthData>> {
  const snap = await get(ref(db, `users/${uid}/readings`))
  return snap.exists() ? snap.val() : {}
}

// ─── Electricity recharges ────────────────────────────────────────────────────
export async function addRecharge(uid: string, recharge: Omit<ElectricityRecharge, 'id'>) {
  const r = ref(db, `users/${uid}/recharges`)
  await push(r, recharge)
}

export async function deleteRecharge(uid: string, id: string) {
  await remove(ref(db, `users/${uid}/recharges/${id}`))
}

export function subscribeRecharges(uid: string, cb: (list: ElectricityRecharge[]) => void) {
  const r = ref(db, `users/${uid}/recharges`)
  onValue(r, snap => {
    if (!snap.exists()) { cb([]); return }
    const val = snap.val()
    const list: ElectricityRecharge[] = Object.entries(val).map(([id, v]) => ({ id, ...(v as any) }))
    cb(list.sort((a, b) => a.date.localeCompare(b.date)))
  })
  return () => off(r)
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export async function saveProfile(uid: string, data: { displayName: string; factoryName: string }) {
  await set(ref(db, `users/${uid}/profile`), data)
}

export async function getProfile(uid: string) {
  const snap = await get(ref(db, `users/${uid}/profile`))
  return snap.exists() ? snap.val() : null
}
