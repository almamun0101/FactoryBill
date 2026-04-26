'use client'
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { subscribeMonthReadings, saveMonthReadings } from '@/lib/db'
import type { MachineReading, MonthData, MeterMode } from '@/types'
import { ChevronDown, ChevronUp, Zap, Activity, Save, TrendingUp } from 'lucide-react'
import { format, startOfMonth, addMonths, subMonths } from 'date-fns'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function getMonthKey(date: Date) {
  return format(date, 'yyyy-MM')
}

function MonthLabel(date: Date) {
  return format(date, 'MMMM yyyy')
}

interface MachineCardProps {
  machineId: string
  reading: MachineReading
  onChange: (r: MachineReading) => void
  priceConfig: { peakRate: number; offPeakRate: number; totalRate: number }
  previousUnit?: number
  defaultUnit: number
  machineName: string
  machineModel: string
}

function MachineCard({ machineId, reading, onChange, priceConfig, previousUnit, defaultUnit, machineName, machineModel }: MachineCardProps) {
  const [mode, setMode] = useState<MeterMode>(reading.mode || 'total')
  const [inputUnit, setInputUnit] = useState(reading.inputUnit ?? 0)
  const [peakUnit, setPeakUnit] = useState(reading.peakUnit ?? 0)
  const [offPeakUnit, setOffPeakUnit] = useState(reading.offPeakUnit ?? 0)
  const [prevUnit, setPrevUnit] = useState(previousUnit ?? reading.inputUnit ?? defaultUnit)

  const baseUnit = mode === 'total' ? inputUnit : (peakUnit + offPeakUnit)
  const netUnit = Math.max(0, baseUnit - prevUnit)
  const totalCost = mode === 'total'
    ? netUnit * priceConfig.totalRate
    : (Math.max(0, peakUnit - prevUnit) * priceConfig.peakRate + offPeakUnit * priceConfig.offPeakRate)

  useEffect(() => {
    const r: MachineReading = {
      machineId,
      mode,
      inputUnit,
      peakUnit,
      offPeakUnit,
      totalUnit: netUnit,
      totalCost,
    }
    onChange(r)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, inputUnit, peakUnit, offPeakUnit, prevUnit])

  return (
    <div className="glass rounded-2xl p-5 glow-blue transition-all hover:glow-blue">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-700 text-white text-base">{machineName}</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">{machineModel}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Total Cost</div>
          <div className="text-lg font-display font-700 gradient-text">
            ৳{totalCost.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        {(['total', 'peakhour'] as MeterMode[]).map(m => (
          <label key={m} className={`flex items-center gap-2 flex-1 p-2.5 rounded-xl cursor-pointer border transition-all ${
            mode === m ? 'border-sky-500/50 bg-sky-500/10' : 'border-slate-700/50 hover:border-slate-600'
          }`}>
            <input type="radio" name={`mode-${machineId}`} value={m}
              checked={mode === m} onChange={() => setMode(m)} className="hidden" />
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
              mode === m ? 'border-sky-400' : 'border-slate-600'
            }`}>
              {mode === m && <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />}
            </div>
            <span className={`text-xs font-medium ${mode === m ? 'text-sky-300' : 'text-slate-500'}`}>
              {m === 'total' ? 'Total Unit' : 'Peak / Off-Peak'}
            </span>
          </label>
        ))}
      </div>

      {/* Inputs */}
      <div className="space-y-3">
        {mode === 'total' ? (
          <InputField label="Total Unit Input" value={inputUnit} onChange={setInputUnit} unit="kWh" />
        ) : (
          <>
            <InputField label="Peak Hour Unit" value={peakUnit} onChange={setPeakUnit} unit="kWh" accent="amber" />
            <InputField label="Off-Peak Hour Unit" value={offPeakUnit} onChange={setOffPeakUnit} unit="kWh" accent="violet" />
            <div className="flex gap-3 text-xs">
              <div className="flex-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-amber-400">Peak Cost: </span>
                <span className="text-white font-mono">৳{(Math.max(0, peakUnit - prevUnit) * priceConfig.peakRate).toFixed(2)}</span>
              </div>
              <div className="flex-1 p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <span className="text-violet-400">Off-Peak: </span>
                <span className="text-white font-mono">৳{(offPeakUnit * priceConfig.offPeakRate).toFixed(2)}</span>
              </div>
            </div>
          </>
        )}

        {/* Previous / Default unit */}
        <div className="pt-2 border-t border-slate-700/30">
          <InputField
            label={`Previous / Default Unit (default: ${defaultUnit})`}
            value={prevUnit} onChange={setPrevUnit} unit="kWh" accent="slate"
          />
          <div className="mt-2 flex items-center gap-2 text-xs">
            <TrendingUp size={12} className="text-green-400" />
            <span className="text-slate-500">Net Unit:</span>
            <span className="text-green-400 font-mono font-700">{netUnit} kWh</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, unit, accent = 'sky' }: {
  label: string; value: number; onChange: (v: number) => void; unit: string; accent?: string
}) {
  const colors: Record<string, string> = {
    sky: 'border-sky-500/30 focus:border-sky-400 bg-sky-500/5',
    amber: 'border-amber-500/30 focus:border-amber-400 bg-amber-500/5',
    violet: 'border-violet-500/30 focus:border-violet-400 bg-violet-500/5',
    slate: 'border-slate-600/50 focus:border-slate-400 bg-slate-500/5',
  }
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      <div className="relative">
        <input type="number" value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full px-3 py-2.5 rounded-xl border text-white text-sm font-mono outline-none transition-all ${colors[accent] || colors.sky}`}
          placeholder="0"
          style={{ background: 'rgba(15,23,42,0.6)' }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  )
}

interface MonthCardProps {
  monthDate: Date
  defaultExpanded?: boolean
}

function MonthCard({ monthDate, defaultExpanded = false }: MonthCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { user } = useAuth()
  const { settings } = useSettings()
  const [monthData, setMonthData] = useState<MonthData | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const monthKey = getMonthKey(monthDate)

  useEffect(() => {
    if (!user || !expanded) return
    const unsub = subscribeMonthReadings(user.uid, monthKey, data => {
      setMonthData(data)
    })
    return unsub
  }, [user, monthKey, expanded])

  function initReading(machineId: string): MachineReading {
    return {
      machineId,
      mode: 'total',
      inputUnit: 0,
      peakUnit: 0,
      offPeakUnit: 0,
      totalUnit: 0,
      totalCost: 0,
    }
  }

  function handleReadingChange(machineId: string, r: MachineReading) {
    setMonthData(prev => ({
      monthKey,
      readings: { ...(prev?.readings || {}), [machineId]: r },
    }))
    setSaved(false)
  }

  async function handleSave() {
    if (!user || !monthData) return
    setSaving(true)
    await saveMonthReadings(user.uid, monthData)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const totalUnit = Object.values(monthData?.readings || {}).reduce((s, r) => s + r.totalUnit, 0)
  const totalCost = Object.values(monthData?.readings || {}).reduce((s, r) => s + r.totalCost, 0)

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      expanded ? 'border-sky-500/30 glow-blue' : 'border-slate-700/40 hover:border-slate-600/60'
    }`} style={{ background: 'rgba(15,23,42,0.8)' }}>
      {/* Month header */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/30 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-800 text-sm ${
            expanded
              ? 'bg-gradient-to-br from-sky-500 to-violet-600 text-white'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {format(monthDate, 'MMM').toUpperCase()}
          </div>
          <div className="text-left">
            <h2 className={`font-display font-700 text-lg ${expanded ? 'gradient-text' : 'text-slate-300'}`}>
              {format(monthDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500">
              {settings.machines.length} machine{settings.machines.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          {totalCost > 0 && (
            <div className="text-right">
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-base font-display font-700 gradient-text">৳{totalCost.toFixed(0)}</div>
              <div className="text-xs text-slate-500 font-mono">{totalUnit.toFixed(0)} kWh</div>
            </div>
          )}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            expanded ? 'border-sky-500/50 bg-sky-500/10 text-sky-400' : 'border-slate-700/50 text-slate-500'
          }`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
            {settings.machines.map(machine => {
              const reading = monthData?.readings?.[machine.id] || initReading(machine.id)
              return (
                <MachineCard
                  key={machine.id}
                  machineId={machine.id}
                  reading={reading}
                  onChange={r => handleReadingChange(machine.id, r)}
                  priceConfig={settings.priceConfig}
                  defaultUnit={machine.defaultUnit}
                  previousUnit={machine.previousUnit}
                  machineName={machine.name}
                  machineModel={machine.model}
                />
              )
            })}
          </div>

          {/* Footer summary + save */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-700/50"
            style={{ background: 'rgba(15,23,42,0.6)' }}>
            <div className="flex gap-6">
              <div>
                <div className="text-xs text-slate-500">Total Units</div>
                <div className="text-lg font-display font-700 gradient-text-green">{totalUnit.toFixed(1)} kWh</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Total Cost</div>
                <div className="text-lg font-display font-700 gradient-text">৳{totalCost.toFixed(2)}</div>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                saved
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-sky-500/20 border border-sky-500/30 text-sky-300 hover:bg-sky-500/30'
              }`}>
              <Save size={15} />
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Month'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MachinesPage() {
  const now = new Date()
  const months = Array.from({ length: 12 }, (_, i) => subMonths(startOfMonth(now), 11 - i))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <Activity size={18} className="text-sky-400" />
          </div>
          <h1 className="font-display font-800 text-2xl gradient-text">Machine Billing</h1>
        </div>
        <p className="text-slate-500 text-sm">Track unit consumption and costs per machine, per month</p>
      </div>

      {/* Month cards — latest first */}
      <div className="space-y-4">
        {[...months].reverse().map((m, i) => (
          <MonthCard key={getMonthKey(m)} monthDate={m} defaultExpanded={i === 0} />
        ))}
      </div>
    </div>
  )
}
