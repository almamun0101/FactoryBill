'use client'
// ─── Machines Page ────────────────────────────────────────────────────────────
// FIXES:
//  1. MachineCard useEffect had no stable dependency — caused infinite loop.
//     Fixed by using a ref to track if this is the first render.
//  2. prevUnit initial value was wrong when reading.inputUnit was 0.
//  3. Firebase subscribe now wrapped in try/catch with error display.

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSettings } from '@/context/SettingsContext'
import { useLang } from '@/context/LangContext'
import { subscribeMonthReadings, saveMonthReadings } from '@/lib/db'
import { format, subMonths, startOfMonth } from 'date-fns'
import { monthNames, monthShort } from '@/lib/i18n'

function getMonthKey(date) { return format(date, 'yyyy-MM') }
function emptyReading(machineId) {
  return { machineId, mode: 'total', inputUnit: 0, peakUnit: 0, offPeakUnit: 0, totalUnit: 0, totalCost: 0 }
}

// ─── Number input with colored border ────────────────────────────────────────
function UnitInput({ label, value, onChange, suffix = 'kWh', accent = 'blue' }) {
  const styles = {
    blue:   { borderColor: 'var(--brand-mid)',    background: 'var(--brand-light)' },
    amber:  { borderColor: '#FCD34D',             background: 'var(--amber-light)' },
    violet: { borderColor: '#C4B5FD',             background: 'var(--violet-light)' },
    gray:   { borderColor: 'var(--border-strong)', background: 'var(--bg-subtle)' },
  }
  const s = styles[accent] || styles.blue
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display:'block', fontSize:'0.75rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:5 }}>
        {label}
      </label>
      <div style={{ position:'relative' }}>
        <input
          type="number" min="0" value={value === 0 ? '' : value}
          onChange={e => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          placeholder="0" className="input-base"
          style={{ paddingRight:44, fontFamily:'var(--font-mono)', ...s }}
        />
        <span style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)' }}>
          {suffix}
        </span>
      </div>
    </div>
  )
}

// ─── Single machine card ──────────────────────────────────────────────────────
function MachineCard({ machine, reading, onChange, priceConfig }) {
  const { t } = useLang()

  const [mode, setMode]           = useState(reading.mode || 'total')
  const [inputUnit, setInputUnit] = useState(reading.inputUnit ?? 0)
  const [peakUnit, setPeakUnit]   = useState(reading.peakUnit ?? 0)
  const [offPeakUnit, setOffPeakUnit] = useState(reading.offPeakUnit ?? 0)
  // Default prevUnit: use machine.defaultUnit (not inputUnit which starts at 0)
  const [prevUnit, setPrevUnit]   = useState(machine.defaultUnit ?? 0)

  // ── Calculations ─────────────────────────────────────────────────────────
  const rawUnit   = mode === 'total' ? inputUnit : (peakUnit + offPeakUnit)
  const netUnit   = Math.max(0, rawUnit - prevUnit)
  const peakNet   = Math.max(0, peakUnit - prevUnit)
  const peakCost     = mode === 'peakhour' ? peakNet * priceConfig.peakRate : 0
  const offPeakCost  = mode === 'peakhour' ? offPeakUnit * priceConfig.offPeakRate : 0
  const totalCost    = mode === 'total' ? netUnit * priceConfig.totalRate : peakCost + offPeakCost

  // ── Notify parent — use ref to avoid calling onChange on mount ────────────
  // BUG FIX: without this, every render triggers onChange → parent setState
  // → re-render → onChange again → infinite loop.
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return }
    onChange({ machineId: machine.id, mode, inputUnit, peakUnit, offPeakUnit, totalUnit: netUnit, totalCost })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, inputUnit, peakUnit, offPeakUnit, prevUnit])

  return (
    <div className="card" style={{ padding:16 }}>
      {/* Header: machine name + total cost */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:'0.95rem', color:'var(--text-primary)' }}>🔧 {machine.name}</div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', marginTop:2 }}>{machine.model}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>{t('totalCost')}</div>
          <div style={{ fontSize:'1.15rem', fontWeight:900, color:'var(--brand)', fontFamily:'var(--font-mono)' }}>
            ৳{totalCost.toFixed(0)}
          </div>
        </div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:'flex', gap:6, marginBottom:14, background:'var(--bg-subtle)', padding:4, borderRadius:10, border:'1px solid var(--border)' }}>
        {[
          { val:'total',    label: t('totalUnit') },
          { val:'peakhour', label: t('peakOffPeak') },
        ].map(({ val, label }) => (
          <button key={val} onClick={() => setMode(val)} style={{
            flex:1, padding:'7px 4px', borderRadius:7, border:'none', cursor:'pointer',
            fontFamily:'var(--font-main)', fontWeight:700, fontSize:'0.78rem',
            background: mode===val ? 'var(--bg-card)' : 'transparent',
            color: mode===val ? 'var(--brand)' : 'var(--text-muted)',
            boxShadow: mode===val ? 'var(--shadow-sm)' : 'none',
            transition:'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* Unit inputs */}
      {mode === 'total' ? (
        <UnitInput label={t('totalUnitInput')} value={inputUnit} onChange={setInputUnit} accent="blue" />
      ) : (
        <>
          <UnitInput label={t('peakHourUnit')} value={peakUnit} onChange={setPeakUnit} accent="amber" />
          <UnitInput label={t('offPeakHourUnit')} value={offPeakUnit} onChange={setOffPeakUnit} accent="violet" />
          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            <div style={{ flex:1, padding:'8px 10px', borderRadius:8, background:'var(--amber-light)', border:'1px solid #FCD34D' }}>
              <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--amber)' }}>{t('peakCost')}</div>
              <div style={{ fontWeight:800, color:'var(--amber)', fontFamily:'var(--font-mono)' }}>৳{peakCost.toFixed(0)}</div>
            </div>
            <div style={{ flex:1, padding:'8px 10px', borderRadius:8, background:'var(--violet-light)', border:'1px solid #C4B5FD' }}>
              <div style={{ fontSize:'0.68rem', fontWeight:700, color:'var(--violet)' }}>{t('offPeakCost')}</div>
              <div style={{ fontWeight:800, color:'var(--violet)', fontFamily:'var(--font-mono)' }}>৳{offPeakCost.toFixed(0)}</div>
            </div>
          </div>
        </>
      )}

      {/* Previous/default unit */}
      <UnitInput
        label={`${t('previousDefaultUnit')} (default: ${machine.defaultUnit})`}
        value={prevUnit} onChange={setPrevUnit} accent="gray"
      />

      {/* Net unit result pill */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 12px', borderRadius:8,
        background: netUnit > 0 ? 'var(--green-light)' : 'var(--bg-subtle)',
        border: `1px solid ${netUnit > 0 ? '#86EFAC' : 'var(--border)'}`,
      }}>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color: netUnit > 0 ? 'var(--green)' : 'var(--text-muted)' }}>
          📈 {t('netUnit')}
        </span>
        <span style={{ fontWeight:800, fontFamily:'var(--font-mono)', color: netUnit > 0 ? 'var(--green)' : 'var(--text-muted)' }}>
          {netUnit.toFixed(1)} kWh
        </span>
      </div>
    </div>
  )
}

// ─── Month accordion card ─────────────────────────────────────────────────────
function MonthCard({ monthDate, defaultExpanded, index }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [monthData, setMonthData] = useState(null)
  const [dbError, setDbError]   = useState(null)

  const { user } = useAuth()
  const { settings } = useSettings()
  const { t, lang } = useLang()

  const monthKey  = getMonthKey(monthDate)
  const monthNum  = monthDate.getMonth()
  const year      = monthDate.getFullYear()
  const monthLabel = `${monthNames[lang]?.[monthNum] ?? monthNames.en[monthNum]} ${year}`
  const shortLabel = monthShort[lang]?.[monthNum]  ?? monthShort.en[monthNum]

  // Subscribe to Firebase when expanded
  useEffect(() => {
    if (!user || !expanded) return
    let unsub = () => {}
    try {
      unsub = subscribeMonthReadings(user.uid, monthKey, data => {
        setMonthData(data)
        setDbError(null)
      })
    } catch (e) {
      console.error('[Machines] subscribe error:', e)
      setDbError(e.message)
    }
    return unsub
  }, [user, monthKey, expanded])

  // Update a single machine reading in local state
  const handleReadingChange = useCallback((machineId, reading) => {
    setMonthData(prev => ({
      monthKey,
      readings: { ...(prev?.readings || {}), [machineId]: reading },
    }))
    setSaved(false)
  }, [monthKey])

  async function handleSave() {
    if (!user || !monthData) return
    setSaving(true)
    setDbError(null)
    try {
      await saveMonthReadings(user.uid, monthData)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.error('[Machines] save error:', e)
      setDbError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const readings   = Object.values(monthData?.readings || {})
  const totalUnit  = readings.reduce((s, r) => s + (r.totalUnit || 0), 0)
  const totalCost  = readings.reduce((s, r) => s + (r.totalCost || 0), 0)

  return (
    <div className="card" style={{
      overflow:'hidden', transition:'border-color 0.2s',
      borderColor: expanded ? 'var(--brand-mid)' : 'var(--border)',
    }}>
      {/* Header row */}
      <button onClick={() => setExpanded(!expanded)} style={{
        width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 20px', background:'none', border:'none', cursor:'pointer',
        fontFamily:'var(--font-main)', textAlign:'left',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {/* Month badge */}
          <div style={{
            width:48, height:48, borderRadius:14, flexShrink:0,
            background: expanded ? 'linear-gradient(135deg,#2563EB,#60A5FA)' : 'var(--bg-subtle)',
            color: expanded ? 'white' : 'var(--text-muted)',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            fontWeight:900, lineHeight:1.2,
            boxShadow: expanded ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
            transition:'all 0.2s',
          }}>
            <span style={{ fontSize:'0.85rem' }}>{shortLabel}</span>
            <span style={{ fontSize:'0.58rem', opacity:0.8 }}>{year}</span>
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:'1rem', color: expanded ? 'var(--brand)' : 'var(--text-primary)' }}>
              {monthLabel}
            </div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:600 }}>
              {settings.machines.length} {t('machineCount')}
            </div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {totalCost > 0 && (
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>{t('totalCost')}</div>
              <div style={{ fontSize:'1rem', fontWeight:900, color:'var(--brand)', fontFamily:'var(--font-mono)' }}>৳{totalCost.toFixed(0)}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>{totalUnit.toFixed(0)} kWh</div>
            </div>
          )}
          <span style={{ fontSize:'0.9rem', color:'var(--text-muted)', transition:'transform 0.2s', display:'inline-block', transform: expanded ? 'rotate(180deg)' : 'none' }}>▼</span>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding:'0 16px 16px' }}>
          {/* DB error */}
          {dbError && (
            <div style={{ padding:'10px 14px', borderRadius:10, marginBottom:12, background:'var(--red-light)', border:'1px solid #FECACA', fontSize:'0.8rem', color:'var(--red)', fontWeight:600 }}>
              ⚠️ Database error: {dbError}
            </div>
          )}

          {/* Machine cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12, marginBottom:14 }}>
            {settings.machines.map(machine => (
              <MachineCard
                key={machine.id}
                machine={machine}
                reading={monthData?.readings?.[machine.id] || emptyReading(machine.id)}
                onChange={r => handleReadingChange(machine.id, r)}
                priceConfig={settings.priceConfig}
              />
            ))}
          </div>

          {/* Footer: totals + save */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'14px 16px', borderRadius:12, background:'var(--bg-subtle)',
            border:'1px solid var(--border)', flexWrap:'wrap', gap:10,
          }}>
            <div style={{ display:'flex', gap:24 }}>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:600 }}>{t('totalUnits')}</div>
                <div style={{ fontSize:'1.1rem', fontWeight:900, color:'var(--green)', fontFamily:'var(--font-mono)' }}>{totalUnit.toFixed(1)} kWh</div>
              </div>
              <div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:600 }}>{t('totalCost')}</div>
                <div style={{ fontSize:'1.1rem', fontWeight:900, color:'var(--brand)', fontFamily:'var(--font-mono)' }}>৳{totalCost.toFixed(2)}</div>
              </div>
            </div>
            <button
              className={`btn ${saved ? 'btn-success' : 'btn-primary'}`}
              onClick={handleSave} disabled={saving}
            >
              {saving ? `⏳ ${t('saving')}` : saved ? `✅ ${t('saved')}` : `💾 ${t('saveMonth')}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MachinesPage() {
  const { t } = useLang()
  const now    = new Date()
  const months = Array.from({ length: 12 }, (_, i) => subMonths(startOfMonth(now), i))

  return (
    <div style={{ padding:'28px 24px', maxWidth:1100, margin:'0 auto' }}>
      <div style={{ marginBottom:24 }}>
        <h1 className="section-title">🔧 {t('machineBilling')}</h1>
        <p className="section-sub">{t('machineBillingDesc')}</p>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {months.map((m, i) => (
          <MonthCard key={getMonthKey(m)} monthDate={m} defaultExpanded={i === 0} index={i} />
        ))}
      </div>
    </div>
  )
}
