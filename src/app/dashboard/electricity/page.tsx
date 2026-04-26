'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { subscribeRecharges, addRecharge, deleteRecharge } from '@/lib/db'
import type { ElectricityRecharge } from '@/types'
import { format, parseISO, startOfMonth, endOfMonth, isSameMonth } from 'date-fns'
import { Plus, Trash2, Zap, Building2, MapPin, ChevronDown, ChevronUp, X } from 'lucide-react'

function AddRechargeModal({ onClose, onAdd }: { onClose: () => void; onAdd: (r: Omit<ElectricityRecharge,'id'>) => void }) {
  const today = format(new Date(), 'yyyy-MM-dd')
  const [date, setDate] = useState(today)
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState<'local' | 'office'>('local')

  function handleSubmit() {
    if (!amount || !date) return
    onAdd({ date, amount: parseFloat(amount), source })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 border border-slate-700/60 animate-slide-up"
        style={{ background: '#111827' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-700 text-white text-lg">Add Recharge</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
              style={{ background: 'rgba(15,23,42,0.8)' }} />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Amount (৳)</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm font-mono outline-none focus:border-sky-500/50 transition-colors"
              style={{ background: 'rgba(15,23,42,0.8)' }} />
          </div>

          {/* Source */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Source</label>
            <div className="grid grid-cols-2 gap-3">
              {(['local', 'office'] as const).map(s => (
                <button key={s} onClick={() => setSource(s)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                    source === s
                      ? s === 'local' ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                      : 'border-sky-500/40 bg-sky-500/10 text-sky-300'
                      : 'border-slate-700/50 text-slate-500 hover:border-slate-600'
                  }`}>
                  {s === 'local' ? <MapPin size={16} /> : <Building2 size={16} />}
                  <span className="text-sm font-medium capitalize">{s}</span>
                  {s === 'office' && <span className="ml-auto text-xs opacity-60">Free</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSubmit}
          className="w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #818cf8)', color: 'white' }}>
          Add Recharge
        </button>
      </div>
    </div>
  )
}

interface MonthRechargeCardProps {
  monthDate: Date
  recharges: ElectricityRecharge[]
  onDelete: (id: string) => void
  deductionConfig: { vatPercent: number; demandCharge: number; meterCharge: number; localSurchargePercent: number }
}

function MonthRechargeCard({ monthDate, recharges, onDelete, deductionConfig }: MonthRechargeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const monthRecharges = recharges.filter(r => isSameMonth(parseISO(r.date), monthDate))
  if (monthRecharges.length === 0) return null

  const total = monthRecharges.reduce((s, r) => s + r.amount, 0)
  const localAmount = monthRecharges.filter(r => r.source === 'local').reduce((s, r) => s + r.amount, 0)
  const officeAmount = monthRecharges.filter(r => r.source === 'office').reduce((s, r) => s + r.amount, 0)

  // Deductions
  const localSurcharge = localAmount * (deductionConfig.localSurchargePercent / 100)
  const grossAfterSurcharge = total + localSurcharge
  const vat = grossAfterSurcharge * (deductionConfig.vatPercent / 100)
  const netMeterBalance = grossAfterSurcharge - vat - deductionConfig.demandCharge - deductionConfig.meterCharge

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      expanded ? 'border-amber-500/30 glow-amber' : 'border-slate-700/40 hover:border-slate-600/60'
    }`} style={{ background: 'rgba(15,23,42,0.8)' }}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-800 text-sm ${
            expanded ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {format(monthDate, 'MMM').toUpperCase()}
          </div>
          <div className="text-left">
            <h2 className={`font-display font-700 text-lg ${expanded ? 'text-amber-300' : 'text-slate-300'}`}>
              {format(monthDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500">{monthRecharges.length} recharge{monthRecharges.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-500">Total Recharge</div>
            <div className="text-base font-display font-700 text-amber-400">৳{total.toFixed(0)}</div>
            <div className="text-xs text-green-400 font-mono">Net: ৳{netMeterBalance.toFixed(0)}</div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            expanded ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-slate-700/50 text-slate-500'
          }`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 animate-fade-in">
          {/* Recharge list */}
          <div className="space-y-2 mb-4">
            {monthRecharges.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-700/30"
                style={{ background: 'rgba(15,23,42,0.5)' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    r.source === 'local' ? 'bg-amber-500/20' : 'bg-sky-500/20'
                  }`}>
                    {r.source === 'local' ? <MapPin size={13} className="text-amber-400" /> : <Building2 size={13} className="text-sky-400" />}
                  </div>
                  <div>
                    <div className="text-sm text-white font-mono">৳{r.amount.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">{format(parseISO(r.date), 'dd MMM')} · {r.source}</div>
                  </div>
                </div>
                <button onClick={() => onDelete(r.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="rounded-xl border border-slate-700/40 p-4 space-y-2"
            style={{ background: 'rgba(15,23,42,0.6)' }}>
            <div className="text-xs font-display font-700 text-slate-400 uppercase tracking-wider mb-3">Deduction Breakdown</div>
            <Row label="Total Recharge" value={total} />
            <Row label={`Local Surcharge (${deductionConfig.localSurchargePercent}%)`} value={localSurcharge} color="text-red-400" prefix="-" />
            <Row label={`VAT (${deductionConfig.vatPercent}%)`} value={vat} color="text-red-400" prefix="-" />
            <Row label="Demand Charge" value={deductionConfig.demandCharge} color="text-red-400" prefix="-" />
            <Row label="Meter Charge" value={deductionConfig.meterCharge} color="text-red-400" prefix="-" />
            <div className="pt-2 border-t border-slate-700/50">
              <Row label="Net Meter Balance" value={netMeterBalance} color="text-green-400" bold />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, color = 'text-white', prefix = '', bold = false }: {
  label: string; value: number; color?: string; prefix?: string; bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={`text-slate-400 ${bold ? 'font-600' : ''}`}>{label}</span>
      <span className={`font-mono ${color} ${bold ? 'font-700 text-base' : ''}`}>
        {prefix}৳{Math.abs(value).toFixed(2)}
      </span>
    </div>
  )
}

export default function ElectricityPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [recharges, setRecharges] = useState<ElectricityRecharge[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!user) return
    return subscribeRecharges(user.uid, setRecharges)
  }, [user])

  async function handleAdd(r: Omit<ElectricityRecharge,'id'>) {
    if (!user) return
    await addRecharge(user.uid, r)
  }

  async function handleDelete(id: string) {
    if (!user) return
    await deleteRecharge(user.uid, id)
  }

  // Collect unique months from recharges
  const monthDates = Array.from(
    new Set(recharges.map(r => format(startOfMonth(parseISO(r.date)), 'yyyy-MM')))
  ).sort((a, b) => b.localeCompare(a)).map(k => new Date(k + '-01'))

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Zap size={18} className="text-amber-400" />
            </div>
            <h1 className="font-display font-800 text-2xl text-amber-300">Electricity Recharges</h1>
          </div>
          <p className="text-slate-500 text-sm">Track meter recharges with automatic deduction calculation</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
          <Plus size={16} />
          Add Recharge
        </button>
      </div>

      {/* Empty state */}
      {recharges.length === 0 && (
        <div className="text-center py-20">
          <Zap size={40} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No recharges yet. Add your first one.</p>
        </div>
      )}

      {/* Month cards */}
      <div className="space-y-4">
        {monthDates.map(m => (
          <MonthRechargeCard
            key={format(m, 'yyyy-MM')}
            monthDate={m}
            recharges={recharges}
            onDelete={handleDelete}
            deductionConfig={settings.deductionConfig}
          />
        ))}
      </div>

      {showModal && (
        <AddRechargeModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}
