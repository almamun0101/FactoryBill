'use client'
import { useState } from 'react'
import { useSettings } from '@/context/SettingsContext'
import type { Machine } from '@/types'
import { Settings, Plus, Trash2, Save, Cpu, DollarSign, Percent } from 'lucide-react'

function SectionCard({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700/40 overflow-hidden" style={{ background: 'rgba(15,23,42,0.8)' }}>
      <div className="px-5 py-4 border-b border-slate-700/40 bg-slate-800/30 flex items-center gap-3">
        <Icon size={16} className="text-sky-400" />
        <span className="font-display font-700 text-white text-sm">{title}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function NumInput({ label, value, onChange, prefix = '', suffix = '' }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{prefix}</span>}
        <input type="number" value={value || ''}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full py-2.5 rounded-xl border border-slate-700/50 text-white text-sm font-mono outline-none focus:border-sky-500/50 transition-colors ${prefix ? 'pl-8 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'}`}
          style={{ background: 'rgba(15,23,42,0.8)' }} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{suffix}</span>}
      </div>
    </div>
  )
}

function StrInput({ label, value, onChange, placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input type="text" value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
        style={{ background: 'rgba(15,23,42,0.8)' }} />
    </div>
  )
}

export default function SettingsPage() {
  const { settings, updateSettings, loading } = useSettings()
  const [saved, setSaved] = useState(false)

  // Local editable copies
  const [priceConfig, setPriceConfig] = useState(settings.priceConfig)
  const [deductConfig, setDeductConfig] = useState(settings.deductionConfig)
  const [machines, setMachines] = useState<Machine[]>(settings.machines)

  // Sync from settings when loaded
  if (loading) return <div className="p-8 text-slate-500 text-sm">Loading settings...</div>

  function addMachine() {
    const newM: Machine = {
      id: `m${Date.now()}`,
      name: 'New Machine',
      model: 'Model',
      defaultUnit: 500,
    }
    setMachines(prev => [...prev, newM])
  }

  function updateMachine(id: string, patch: Partial<Machine>) {
    setMachines(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  function removeMachine(id: string) {
    setMachines(prev => prev.filter(m => m.id !== id))
  }

  async function handleSave() {
    await updateSettings({ priceConfig, deductionConfig: deductConfig, machines })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
            <Settings size={18} className="text-slate-400" />
          </div>
          <h1 className="font-display font-800 text-2xl text-slate-300">Settings</h1>
        </div>
        <p className="text-slate-500 text-sm">Configure machines, pricing, and deductions</p>
      </div>

      <div className="space-y-6">
        {/* Machines */}
        <SectionCard title="Machines" icon={Cpu}>
          <div className="space-y-4">
            {machines.map(m => (
              <div key={m.id} className="p-4 rounded-xl border border-slate-700/40"
                style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <StrInput label="Machine Name" value={m.name} onChange={v => updateMachine(m.id, { name: v })} placeholder="e.g. Machine A" />
                  <StrInput label="Model" value={m.model} onChange={v => updateMachine(m.id, { model: v })} placeholder="e.g. Model X-100" />
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <NumInput label="Default Unit (kWh)" value={m.defaultUnit} onChange={v => updateMachine(m.id, { defaultUnit: v })} />
                  <button onClick={() => removeMachine(m.id)}
                    className="flex items-center gap-2 justify-center py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm transition-all">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addMachine}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-sky-500/40 hover:text-sky-400 transition-all text-sm">
              <Plus size={16} /> Add Machine
            </button>
          </div>
        </SectionCard>

        {/* Pricing */}
        <SectionCard title="Electricity Rates" icon={DollarSign}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NumInput label="Total Unit Rate" value={priceConfig.totalRate}
              onChange={v => setPriceConfig(p => ({ ...p, totalRate: v }))} prefix="৳" suffix="/kWh" />
            <NumInput label="Peak Hour Rate" value={priceConfig.peakRate}
              onChange={v => setPriceConfig(p => ({ ...p, peakRate: v }))} prefix="৳" suffix="/kWh" />
            <NumInput label="Off-Peak Rate" value={priceConfig.offPeakRate}
              onChange={v => setPriceConfig(p => ({ ...p, offPeakRate: v }))} prefix="৳" suffix="/kWh" />
          </div>
        </SectionCard>

        {/* Deductions */}
        <SectionCard title="Deductions & Charges" icon={Percent}>
          <div className="grid grid-cols-2 gap-4">
            <NumInput label="VAT %" value={deductConfig.vatPercent}
              onChange={v => setDeductConfig(d => ({ ...d, vatPercent: v }))} suffix="%" />
            <NumInput label="Local Surcharge %" value={deductConfig.localSurchargePercent}
              onChange={v => setDeductConfig(d => ({ ...d, localSurchargePercent: v }))} suffix="%" />
            <NumInput label="Demand Charge" value={deductConfig.demandCharge}
              onChange={v => setDeductConfig(d => ({ ...d, demandCharge: v }))} prefix="৳" />
            <NumInput label="Meter Charge" value={deductConfig.meterCharge}
              onChange={v => setDeductConfig(d => ({ ...d, meterCharge: v }))} prefix="৳" />
          </div>
        </SectionCard>

        {/* Save */}
        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-700 text-sm transition-all ${
            saved
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'border border-sky-500/30 text-sky-300 hover:bg-sky-500/10'
          }`}>
          <Save size={16} />
          {saved ? 'Settings Saved ✓' : 'Save All Settings'}
        </button>
      </div>
    </div>
  )
}
