'use client'
// ─── Settings Context ─────────────────────────────────────────────────────────
// BUG FIXES:
//  1. When user is null (logged out), immediately set loading=false.
//     Previously this kept loading=true until next render cycle.
//  2. Wrapped Firebase subscription in try/catch.
//  3. Added settingsError state for debug display.

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { subscribeSettings, saveSettings } from '@/lib/db'

const DEFAULT_SETTINGS = {
  priceConfig: {
    totalRate: 9.00,
    peakRate: 12.50,
    offPeakRate: 6.00,
  },
  deductionConfig: {
    vatPercent: 5,
    demandCharge: 500,
    meterCharge: 150,
    localSurchargePercent: 3,
  },
  machines: [
    { id: 'm1', name: 'Machine A', model: 'Model X-100', defaultUnit: 1000 },
    { id: 'm2', name: 'Machine B', model: 'Model Y-200', defaultUnit: 800 },
    { id: 'm3', name: 'Machine C', model: 'Model Z-300', defaultUnit: 600 },
  ],
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [settingsError, setSettingsError] = useState(null)

  useEffect(() => {
    // ── Wait for auth to resolve first ─────────────────────────────────────────
    // If auth is still loading, don't do anything yet.
    if (authLoading) return

    // ── No user → use defaults immediately ────────────────────────────────────
    if (!user) {
      setSettings(DEFAULT_SETTINGS)
      setLoading(false)
      return
    }

    // ── Subscribe to user's settings from Firebase ────────────────────────────
    setLoading(true)
    let unsub = () => {}

    try {
      unsub = subscribeSettings(user.uid, (data) => {
        setSettings(data ?? DEFAULT_SETTINGS)
        setSettingsError(null)
        setLoading(false)
      })
    } catch (e) {
      console.error('[Settings] Subscribe error:', e)
      setSettingsError(e.message)
      setSettings(DEFAULT_SETTINGS)
      setLoading(false)
    }

    // Timeout: if Firebase never responds (e.g. no DB rules)
    const t = setTimeout(() => {
      console.warn('[Settings] Firebase settings never responded, using defaults')
      setSettings(DEFAULT_SETTINGS)
      setLoading(false)
    }, 6000)

    return () => {
      clearTimeout(t)
      unsub()
    }
  }, [user, authLoading])

  async function updateSettings(partial) {
    if (!user) return
    const merged = { ...settings, ...partial }
    setSettings(merged) // Optimistic update
    try {
      await saveSettings(user.uid, merged)
    } catch (e) {
      console.error('[Settings] Save error:', e)
      setSettingsError(e.message)
      throw e
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading, settingsError }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider')
  return ctx
}
