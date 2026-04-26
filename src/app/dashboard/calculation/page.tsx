'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { getAllReadings, subscribeRecharges } from '@/lib/db'
import type { MonthData, ElectricityRecharge } from '@/types'
import { format, parseISO, isSameMonth, startOfMonth } from 'date-fns'
import { BarChart3, TrendingDown, TrendingUp, Zap, Cpu, ChevronDown, ChevronUp } from 'lucide-react'

function StatCard({ label, value, sub, color = 'sky', icon: Icon }: {
  label: string; value: string; sub?: string; color?: string; icon: React.ElementType
}) {
  const colors: Record<string, string> = {
    sky: 'from-sky-500/20 to-sky-600/10 border-sky-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30',
    violet: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
  }
  const iconColor: Record<string, string> = {
    sky: 'text-sky-400', amber: 'text-amber-400', green: 'text-green-400',
    red: 'text-red-400', violet: 'text-violet-400',
  }
  return (
    <div className={`rounded-2xl p-5 border bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} className={iconColor[color]} />
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className={`text-2xl font-display font-800 ${iconColor[color]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

interface MonthCalcCardProps {
  monthKey: string
  monthData: MonthData | null
  recharges: ElectricityRecharge[]
  deductionConfig: { vatPercent: number; demandCharge: number; meterCharge: number; localSurchargePercent: number }
  machines: { id: string; name: string; model: string }[]
}

function MonthCalcCard({ monthKey, monthData, recharges, deductionConfig, machines }: MonthCalcCardProps) {
  const [expanded, setExpanded] = useState(false)
  const monthDate = new Date(monthKey + '-01')

  const monthRecharges = recharges.filter(r => isSameMonth(parseISO(r.date), monthDate))
  const totalRecharge = monthRecharges.reduce((s, r) => s + r.amount, 0)
  const localAmount = monthRecharges.filter(r => r.source === 'local').reduce((s, r) => s + r.amount, 0)
  const localSurcharge = localAmount * (deductionConfig.localSurchargePercent / 100)
  const grossAfterSurcharge = totalRecharge + localSurcharge
  const vat = grossAfterSurcharge * (deductionConfig.vatPercent / 100)
  const netMeterBalance = grossAfterSurcharge - vat - deductionConfig.demandCharge - deductionConfig.meterCharge

  const totalMachineCost = Object.values(monthData?.readings || {}).reduce((s, r) => s + r.totalCost, 0)
  const totalMachineUnit = Object.values(monthData?.readings || {}).reduce((s, r) => s + r.totalUnit, 0)
  const remaining = netMeterBalance - totalMachineCost

  if (totalRecharge === 0 && totalMachineCost === 0) return null

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
      expanded ? 'border-violet-500/30' : 'border-slate-700/40 hover:border-slate-600/60'
    }`} style={{ background: 'rgba(15,23,42,0.8)' }}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-800/20 transition-colors">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-display font-800 text-sm ${
            expanded ? 'bg-gradient-to-br from-violet-500 to-sky-600 text-white' : 'bg-slate-800 text-slate-400'
          }`}>
            {format(monthDate, 'MMM').toUpperCase()}
          </div>
          <div className="text-left">
            <h2 className={`font-display font-700 text-lg ${expanded ? 'gradient-text' : 'text-slate-300'}`}>
              {format(monthDate, 'MMMM yyyy')}
            </h2>
            <p className="text-xs text-slate-500">
              {monthRecharges.length} recharge · {Object.keys(monthData?.readings || {}).length} machines
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-500">Remaining</div>
            <div className={`text-base font-display font-700 ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ৳{remaining.toFixed(0)}
            </div>
          </div>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
            expanded ? 'border-violet-500/50 bg-violet-500/10 text-violet-400' : 'border-slate-700/50 text-slate-500'
          }`}>
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 animate-fade-in space-y-4">
          {/* Overview grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Total Recharge" value={`৳${totalRecharge.toFixed(0)}`} icon={Zap} color="amber" />
            <StatCard label="Net Meter Balance" value={`৳${netMeterBalance.toFixed(0)}`} icon={TrendingUp} color="green" />
            <StatCard label="Machine Cost" value={`৳${totalMachineCost.toFixed(0)}`} icon={Cpu} color="sky"
              sub={`${totalMachineUnit.toFixed(0)} kWh`} />
            <StatCard label={remaining >= 0 ? 'Remaining' : 'Deficit'}
              value={`৳${Math.abs(remaining).toFixed(0)}`}
              icon={remaining >= 0 ? TrendingUp : TrendingDown}
              color={remaining >= 0 ? 'green' : 'red'} />
          </div>

          {/* Machine breakdown */}
          <div className="rounded-xl border border-slate-700/40 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/40 bg-slate-800/30">
              <span className="text-xs font-display font-700 text-slate-400 uppercase tracking-wider">Machine Breakdown</span>
            </div>
            <div className="divide-y divide-slate-700/30">
              {machines.map(m => {
                const r = monthData?.readings?.[m.id]
                if (!r) return null
                return (
                  <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <span className="text-sm text-white font-medium">{m.name}</span>
                      <span className="text-xs text-slate-500 ml-2">{m.model}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <span className="text-slate-400 font-mono">{r.totalUnit.toFixed(1)} kWh</span>
                      <span className="text-sky-400 font-mono font-700">৳{r.totalCost.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Final calculation */}
          <div className="rounded-xl border p-4 space-y-2"
            style={{
              background: remaining >= 0 ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
              borderColor: remaining >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
            }}>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Net Meter Balance</span>
              <span className="text-white font-mono">৳{netMeterBalance.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total Machine Cost</span>
              <span className="text-red-400 font-mono">- ৳{totalMachineCost.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-700/40 flex justify-between">
              <span className="font-display font-700 text-white">{remaining >= 0 ? 'Remaining Balance' : 'Deficit'}</span>
              <span className={`font-display font-800 text-xl ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ৳{Math.abs(remaining).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function CalculationPage() {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [allReadings, setAllReadings] = useState<Record<string, MonthData>>({})
  const [recharges, setRecharges] = useState<ElectricityRecharge[]>([])

  useEffect(() => {
    if (!user) return
    getAllReadings(user.uid).then(setAllReadings)
    return subscribeRecharges(user.uid, setRecharges)
  }, [user])

  // All months from both readings and recharges
  const monthKeys = Array.from(new Set([
    ...Object.keys(allReadings),
    ...recharges.map(r => format(startOfMonth(parseISO(r.date)), 'yyyy-MM')),
  ])).sort((a, b) => b.localeCompare(a))

  // Grand totals
  const grandRecharge = recharges.reduce((s, r) => s + r.amount, 0)
  const grandMachine = Object.values(allReadings).reduce(
    (s, m) => s + Object.values(m.readings || {}).reduce((ss, r) => ss + r.totalCost, 0), 0
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-violet-400" />
          </div>
          <h1 className="font-display font-800 text-2xl gradient-text">Calculation</h1>
        </div>
        <p className="text-slate-500 text-sm">Monthly summary: recharge vs machine costs</p>
      </div>

      {/* Overall summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="All-time Recharge" value={`৳${grandRecharge.toFixed(0)}`} icon={Zap} color="amber" />
        <StatCard label="All-time Machine Cost" value={`৳${grandMachine.toFixed(0)}`} icon={Cpu} color="sky" />
        <StatCard
          label={grandRecharge - grandMachine >= 0 ? 'Net Balance' : 'Net Deficit'}
          value={`৳${Math.abs(grandRecharge - grandMachine).toFixed(0)}`}
          icon={grandRecharge - grandMachine >= 0 ? TrendingUp : TrendingDown}
          color={grandRecharge - grandMachine >= 0 ? 'green' : 'red'}
        />
      </div>

      {monthKeys.length === 0 && (
        <div className="text-center py-20">
          <BarChart3 size={40} className="text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No data yet. Add recharges and machine readings first.</p>
        </div>
      )}

      <div className="space-y-4">
        {monthKeys.map(key => (
          <MonthCalcCard
            key={key}
            monthKey={key}
            monthData={allReadings[key] || null}
            recharges={recharges}
            deductionConfig={settings.deductionConfig}
            machines={settings.machines}
          />
        ))}
      </div>
    </div>
  )
}
