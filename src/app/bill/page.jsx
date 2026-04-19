"use client";

import { useState, useEffect, useCallback } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore, doc, getDoc, setDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  Zap, Plus, Trash2, Save, Settings2,
  Loader2, AlertCircle, CheckCircle2,
  TrendingUp, Activity, X,
} from "lucide-react";

/* ─────────────────────────────────────────────────────
   FIREBASE CONFIG  —  replace with your project values
───────────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_AUTH_DOMAIN",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];
  return initializeApp(firebaseConfig);
}

/* ─────────────────────────────────────────────────────
   CONSTANTS & HELPERS
───────────────────────────────────────────────────── */
const DEFAULT_PEAK_RATE    = 12.95;
const DEFAULT_OFFPEAK_RATE = 9.68;

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const uid = () => Math.random().toString(36).slice(2, 10);

function monthKey(y, m)   { return `${y}-${String(m + 1).padStart(2, "0")}`; }
function prevMonthKey(y, m) {
  if (m === 0) return monthKey(y - 1, 11);
  return monthKey(y, m - 1);
}

function calcMachine(machine, prev, pkRate, opRate) {
  const cp  = parseFloat(machine.currentPeak)    || 0;
  const cop = parseFloat(machine.currentOffpeak) || 0;
  const pp  = parseFloat(prev?.currentPeak)      || 0;
  const pop = parseFloat(prev?.currentOffpeak)   || 0;
  const pu  = Math.max(0, cp  - pp);
  const ou  = Math.max(0, cop - pop);
  return {
    peakUnit:    pu,
    offpeakUnit: ou,
    totalUnit:   pu + ou,
    peakCost:    pu  * pkRate,
    offpeakCost: ou  * opRate,
    totalCost:   pu  * pkRate + ou * opRate,
  };
}

/* ─────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────── */
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold border pointer-events-auto
            ${t.type === "success"
              ? "bg-white border-emerald-200 text-emerald-700 shadow-emerald-100"
              : t.type === "error"
              ? "bg-white border-red-200 text-red-600 shadow-red-100"
              : "bg-white border-slate-200 text-slate-700"}`}>
          {t.type === "success" && <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />}
          {t.type === "error"   && <AlertCircle  size={15} className="text-red-400    flex-shrink-0" />}
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   SETTINGS MODAL
───────────────────────────────────────────────────── */
function SettingsModal({ rates, onSave, onClose }) {
  const [peak,    setPeak]    = useState(rates.peak);
  const [offpeak, setOffpeak] = useState(rates.offpeak);

  return (
    <div>
 <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,.45)", backdropFilter: "blur(10px)" }}>
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-6 shadow-2xl shadow-slate-200">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Settings2 size={16} className="text-amber-600" />
            </div>
            <span className="font-bold text-base text-slate-800">Unit Rate Settings</span>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2">
              Peak Rate (৳ / unit)
            </label>
            <input type="number" step="0.01" value={peak}
              onChange={(e) => setPeak(e.target.value)}
              className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all" />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-2">
              Off-Peak Rate (৳ / unit)
            </label>
            <input type="number" step="0.01" value={offpeak}
              onChange={(e) => setOffpeak(e.target.value)}
              className="w-full bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all" />
          </div>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button onClick={onClose}
            className="flex-1 py-3 bg-slate-100 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-all">
            Cancel
          </button>
          <button
            onClick={() => onSave(parseFloat(peak) || DEFAULT_PEAK_RATE, parseFloat(offpeak) || DEFAULT_OFFPEAK_RATE)}
            className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 active:scale-[.98] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-200">
            <Save size={14} /> Save Rates
          </button>
        </div>
      </div>
    </div>
    </div>
   
  );
}

/* ─────────────────────────────────────────────────────
   MACHINE ROW
───────────────────────────────────────────────────── */
function MachineRow({ machine, prevMachine, peakRate, offpeakRate, onChange, onDelete, saving }) {
  const c = calcMachine(machine, prevMachine, peakRate, offpeakRate);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 hover:shadow-md hover:shadow-slate-100/80 transition-all duration-200">

      {/* Header row */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <input
          value={machine.name}
          onChange={(e) => onChange(machine.id, "name", e.target.value)}
          placeholder="Machine Name"
          className="flex-1 bg-transparent text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none border-b-2 border-transparent focus:border-amber-300 pb-0.5 transition-all min-w-0"
        />
        <button
          onClick={() => onDelete(machine.id)}
          disabled={saving}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 hover:border-red-200 hover:text-red-600 transition-all flex-shrink-0"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Input pair */}
      <div className="grid grid-cols-2 gap-2.5 mb-3">
        <div>
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1.5">Current Peak</p>
          <input
            type="number" min="0"
            value={machine.currentPeak}
            onChange={(e) => onChange(machine.id, "currentPeak", e.target.value)}
            className="w-full bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-semibold focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all"
          />
        </div>
        <div>
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-1.5">Current Off-Peak</p>
          <input
            type="number" min="0"
            value={machine.currentOffpeak}
            onChange={(e) => onChange(machine.id, "currentOffpeak", e.target.value)}
            className="w-full bg-sky-50 border border-sky-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 font-semibold focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all"
          />
        </div>
      </div>

      {/* Previous hint */}
      {prevMachine && (
        <div className="flex gap-4 mb-3 px-1">
          <p className="text-[10px] text-slate-400 font-medium">
            Prev peak: <span className="text-slate-500 font-bold">{prevMachine.currentPeak || 0}</span>
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            Prev off-peak: <span className="text-slate-500 font-bold">{prevMachine.currentOffpeak || 0}</span>
          </p>
        </div>
      )}

      {/* Calc results strip */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100">
        <div>
          <p className="text-[10px] text-slate-400 font-medium mb-1">Peak Unit</p>
          <p className="text-sm font-black text-amber-500">{c.peakUnit.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium mb-1">Off-Pk Unit</p>
          <p className="text-sm font-black text-sky-500">{c.offpeakUnit.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium mb-1">Total Unit</p>
          <p className="text-sm font-black text-slate-600">{c.totalUnit.toFixed(1)}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-medium mb-1">Cost</p>
          <p className="text-sm font-black text-emerald-600">৳{c.totalCost.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MONTH CARD
───────────────────────────────────────────────────── */
function MonthCard({ year, month, machines, prevMachines, peakRate, offpeakRate,
  onMachineChange, onMachineDelete, onAddMachine, onSave, saving }) {

  const allCalc = machines.map((m) => {
    const prev = prevMachines.find((p) => p.id === m.id) || null;
    return calcMachine(m, prev, peakRate, offpeakRate);
  });

  const totalUnits = allCalc.reduce((s, c) => s + c.totalUnit,  0);
  const totalCost  = allCalc.reduce((s, c) => s + c.totalCost,  0);
  const totalPeak  = allCalc.reduce((s, c) => s + c.peakUnit,   0);
  const totalOff   = allCalc.reduce((s, c) => s + c.offpeakUnit, 0);

  const isCurrentMonth =
    year === new Date().getFullYear() && month === new Date().getMonth();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60">

      {/* ── Gradient card header ── */}
      <div className="relative overflow-hidden px-6 pt-6 pb-5"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 55%, #1e293b 100%)",
        }}>

        {/* Warm glow top-right */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,.35) 0%, transparent 65%)" }} />
        {/* Cool glow bottom-left */}
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,.18) 0%, transparent 65%)" }} />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            {isCurrentMonth && (
              <span className="inline-flex items-center text-[10px] font-bold bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 px-2.5 py-0.5 rounded-full tracking-widest uppercase mb-2">
                Current Month
              </span>
            )}
            <h2 className="text-3xl font-black tracking-tight text-white leading-none">
              {MONTH_NAMES[month]}
            </h2>
            <p className="text-slate-400 text-sm font-mono mt-1">{year}</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-3xl font-black text-amber-400 tracking-tight leading-none">
              ৳{totalCost.toFixed(2)}
            </p>
            <p className="text-xs font-mono text-slate-400 mt-1">{totalUnits.toFixed(1)} units</p>
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="flex items-center gap-1.5 bg-amber-400/15 border border-amber-400/25 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-semibold text-amber-300">Peak {totalPeak.toFixed(1)} u</span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-400/15 border border-sky-400/25 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-[11px] font-semibold text-sky-300">Off-peak {totalOff.toFixed(1)} u</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
            <Activity size={10} className="text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-300">
              {machines.length} machine{machines.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Machine rows ── */}
      <div className="p-4 space-y-3 bg-slate-50">
        {machines.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
              <Zap size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-400 mb-1">No machines added yet</p>
            <p className="text-xs text-slate-400">Click "Add Machine" below to get started</p>
          </div>
        ) : (
          machines.map((machine) => {
            const prev = prevMachines.find((p) => p.id === machine.id) || null;
            return (
              <MachineRow
                key={machine.id}
                machine={machine}
                prevMachine={prev}
                peakRate={peakRate}
                offpeakRate={offpeakRate}
                onChange={onMachineChange}
                onDelete={onMachineDelete}
                saving={saving}
              />
            );
          })
        )}
      </div>

      {/* ── Summary table ── */}
      {machines.length > 0 && (
        <div className="px-4 pb-4 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Monthly Summary</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/40">
                    <th className="text-left px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Machine</th>
                    <th className="text-right px-3 py-3 text-[11px] font-bold text-amber-500 uppercase tracking-wide">Pk Unit</th>
                    <th className="text-right px-3 py-3 text-[11px] font-bold text-sky-500 uppercase tracking-wide">Off Unit</th>
                    <th className="text-right px-3 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total</th>
                    <th className="text-right px-4 py-3 text-[11px] font-bold text-emerald-500 uppercase tracking-wide">৳ Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((m, i) => {
                    const c = allCalc[i];
                    return (
                      <tr key={m.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-700 font-bold text-xs">{m.name || "—"}</td>
                        <td className="px-3 py-3 text-right font-mono text-xs font-semibold text-amber-600">{c.peakUnit.toFixed(1)}</td>
                        <td className="px-3 py-3 text-right font-mono text-xs font-semibold text-sky-600">{c.offpeakUnit.toFixed(1)}</td>
                        <td className="px-3 py-3 text-right font-mono text-xs font-semibold text-slate-600">{c.totalUnit.toFixed(1)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs font-black text-emerald-600">৳{c.totalCost.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: "linear-gradient(90deg,#1e293b,#334155)" }}>
                    <td className="px-4 py-3.5 text-xs font-black text-white rounded-bl-xl">Total</td>
                    <td className="px-3 py-3.5 text-right font-mono text-xs font-bold text-amber-300">{totalPeak.toFixed(1)}</td>
                    <td className="px-3 py-3.5 text-right font-mono text-xs font-bold text-sky-300">{totalOff.toFixed(1)}</td>
                    <td className="px-3 py-3.5 text-right font-mono text-xs font-bold text-slate-200">{totalUnits.toFixed(1)}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-sm font-black text-amber-400 rounded-br-xl">৳{totalCost.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Card actions ── */}
      <div className="flex gap-2.5 px-4 pb-5 bg-slate-50">
        <button
          onClick={onAddMachine}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-100 hover:border-slate-300 hover:text-slate-800 transition-all disabled:opacity-50 shadow-sm"
        >
          <Plus size={14} /> Add Machine
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 active:scale-[.98] transition-all disabled:opacity-60 ml-auto shadow-lg shadow-slate-300"
        >
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
            : <><Save size={14} /> Save</>}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────── */
export default function ElectricityDashboard() {
  const now = new Date();

  const monthSlots = Array.from({ length: 4 }, (_, i) => {
    let m = now.getMonth() - i;
    let y = now.getFullYear();
    while (m < 0) { m += 12; y--; }
    return { year: y, month: m };
  });

  const [rates,        setRates]        = useState({ peak: DEFAULT_PEAK_RATE, offpeak: DEFAULT_OFFPEAK_RATE });
  const [monthData,    setMonthData]    = useState({});
  const [savingMonth,  setSavingMonth]  = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts,       setToasts]       = useState([]);
  const [db,           setDb]           = useState(null);
  const [dbReady,      setDbReady]      = useState(false);

  const toast = useCallback((message, type = "info") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  useEffect(() => {
    try {
      const app = getFirebaseApp();
      setDb(getFirestore(app));
      setDbReady(true);
    } catch {
      toast("Firebase init failed – running in demo mode", "error");
    }
  }, []);

  useEffect(() => {
    if (!db) return;
    getDoc(doc(db, "settings", "rates")).then((snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setRates({ peak: d.peak ?? DEFAULT_PEAK_RATE, offpeak: d.offpeak ?? DEFAULT_OFFPEAK_RATE });
      }
    }).catch(() => {});
  }, [db]);

  useEffect(() => {
    if (!db) return;
    const unsubs = monthSlots.map(({ year, month }) => {
      const key = monthKey(year, month);
      return onSnapshot(
        doc(db, "electricity_months", key),
        (snap) => setMonthData((prev) => ({ ...prev, [key]: snap.exists() ? snap.data() : { machines: [] } })),
        ()     => setMonthData((prev) => ({ ...prev, [key]: { machines: [] } }))
      );
    });
    return () => unsubs.forEach((u) => u());
  }, [db, dbReady]);

  const getMachines = (y, m) => monthData[monthKey(y, m)]?.machines ?? [];
  const setMachines = (y, m, machines) => {
    const key = monthKey(y, m);
    setMonthData((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), machines } }));
  };

  const handleChange = (y, m, id, field, value) =>
    setMachines(y, m, getMachines(y, m).map((x) => x.id === id ? { ...x, [field]: value } : x));

  const handleDelete = (y, m, id) =>
    setMachines(y, m, getMachines(y, m).filter((x) => x.id !== id));

  const handleAdd = (y, m) =>
    setMachines(y, m, [...getMachines(y, m), { id: uid(), name: "", currentPeak: "", currentOffpeak: "" }]);

  const handleSave = async (y, m) => {
    const key = monthKey(y, m);
    setSavingMonth(key);
    try {
      if (db) {
        await setDoc(doc(db, "electricity_months", key), {
          machines: getMachines(y, m),
          updatedAt: new Date().toISOString(),
        });
      }
      toast(`${MONTH_NAMES[m]} ${y} saved successfully`, "success");
    } catch {
      toast("Save failed – check Firebase config", "error");
    } finally {
      setSavingMonth(null);
    }
  };

  const handleSaveRates = async (peak, offpeak) => {
    setRates({ peak, offpeak });
    setShowSettings(false);
    try {
      if (db) await setDoc(doc(db, "settings", "rates"), { peak, offpeak });
      toast("Unit rates updated", "success");
    } catch {
      toast("Rates saved locally only", "error");
    }
  };

  const overviewTotals = monthSlots.map(({ year, month }) => {
    const machines = getMachines(year, month);
    const prevMs   = monthData[prevMonthKey(year, month)]?.machines ?? [];
    const calcs    = machines.map((m) =>
      calcMachine(m, prevMs.find((p) => p.id === m.id) || null, rates.peak, rates.offpeak)
    );
    return {
      key:        monthKey(year, month),
      label:      `${MONTH_NAMES[month].slice(0, 3)} '${String(year).slice(2)}`,
      isCurrent:  year === now.getFullYear() && month === now.getMonth(),
      totalCost:  calcs.reduce((s, c) => s + c.totalCost,  0),
      totalUnits: calcs.reduce((s, c) => s + c.totalUnit, 0),
    };
  });

  const grandTotal = overviewTotals.reduce((s, g) => s + g.totalCost, 0);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pl-50"
      style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>

      {/* Subtle dot grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }} />

      <div className="relative z-10 max-width-4xl mx-auto max-w-4xl px-4 pb-24">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between pt-7 pb-7">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-300/50">
              <Zap size={22} color="#ffffff" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 leading-none">
                Electricity Dashboard
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5 tracking-wide">
                Monthly billing tracker
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all shadow-sm"
          >
            <Settings2 size={14} />
            <span className="hidden sm:inline text-slate-600">Rates</span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              ৳{rates.peak} / ৳{rates.offpeak}
            </span>
          </button>
        </div>

        {/* ── Overview stat strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {overviewTotals.map((g) => (
            <div key={g.key}
              className={`bg-white border rounded-2xl p-4 relative overflow-hidden transition-all hover:shadow-md
                ${g.isCurrent
                  ? "border-amber-300 shadow-md shadow-amber-100"
                  : "border-slate-200 shadow-sm"}`}>
              <div className={`absolute bottom-0 left-0 right-0 h-[3px]
                ${g.isCurrent ? "bg-amber-400" : "bg-slate-200"}`} />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{g.label}</p>
              <p className={`text-lg font-black tracking-tight leading-none
                ${g.isCurrent ? "text-amber-500" : "text-slate-700"}`}>
                ৳{g.totalCost.toFixed(0)}
              </p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">{g.totalUnits.toFixed(1)} units</p>
            </div>
          ))}
        </div>

        {/* ── Rates + grand total bar ── */}
        <div className="flex flex-wrap items-center gap-2.5 mb-7">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <TrendingUp size={13} className="text-amber-500" />
            <span className="text-xs font-bold text-amber-600">Peak ৳{rates.peak}/unit</span>
          </div>
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-3 py-2">
            <TrendingUp size={13} className="text-sky-500" />
            <span className="text-xs font-bold text-sky-600">Off-Peak ৳{rates.offpeak}/unit</span>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">4-mo total</span>
            <span className="text-sm font-black text-slate-800">৳{grandTotal.toFixed(2)}</span>
          </div>
          {!dbReady && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <AlertCircle size={13} className="text-red-400" />
              <span className="text-xs font-semibold text-red-500">Firebase not connected</span>
            </div>
          )}
        </div>

        {/* ── Month cards ── */}
        <div className="space-y-6">
          {monthSlots.map(({ year, month }) => {
            const key    = monthKey(year, month);
            const prevMs = monthData[prevMonthKey(year, month)]?.machines ?? [];

            return (
              <MonthCard
                key={key}
                year={year}
                month={month}
                machines={getMachines(year, month)}
                prevMachines={prevMs}
                peakRate={rates.peak}
                offpeakRate={rates.offpeak}
                onMachineChange={(id, f, v) => handleChange(year, month, id, f, v)}
                onMachineDelete={(id) => handleDelete(year, month, id)}
                onAddMachine={() => handleAdd(year, month)}
                onSave={() => handleSave(year, month)}
                saving={savingMonth === key}
              />
            );
          })}
        </div>
      </div>

      {showSettings && (
        <SettingsModal rates={rates} onSave={handleSaveRates} onClose={() => setShowSettings(false)} />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}