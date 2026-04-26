'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { subscribeSettings, saveSettings } from '@/lib/db'
import type { Settings } from '@/types'

const DEFAULT_SETTINGS: Settings = {
  priceConfig: {
    peakRate: 12.5,
    offPeakRate: 6.0,
    totalRate: 9.0,
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

interface SettingsCtx {
  settings: Settings
  updateSettings: (s: Partial<Settings>) => Promise<void>
  loading: boolean
}

const Ctx = createContext<SettingsCtx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const unsub = subscribeSettings(user.uid, s => {
      setSettings(s ?? DEFAULT_SETTINGS)
      setLoading(false)
    })
    return unsub
  }, [user])

  async function updateSettings(partial: Partial<Settings>) {
    if (!user) return
    const merged = { ...settings, ...partial }
    setSettings(merged)
    await saveSettings(user.uid, merged)
  }

  return <Ctx.Provider value={{ settings, updateSettings, loading }}>{children}</Ctx.Provider>
}

export function useSettings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider')
  return ctx
}
