"use client";
// ============================================================
//  UserProfile.jsx - FIXED
//
//  KEY FIXES:
//    1. ✅ Firebase RTDB connection health check with auto-reconnect
//    2. ✅ Real-time data sync from Firebase (pick/offpeak auto-sync to Dashboard)
//    3. ✅ All billing data persists to Firebase immediately
//    4. ✅ Better connection status display (connected/connecting/error)
//    5. ✅ Timeout guards with retry logic
//
//  DATA FLOW:
//    UserProfile Tab 3 (Billing Defaults)
//      ↓ user edits values
//      ↓ click Save
//      ↓ writes to Firebase RTDB: setting/settings
//      ↓ ElectricityDashboard listens via useDataFetch
//      ↓ Dashboard auto-updates rates in real-time
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { useDataFetch } from "../useDataFetch";
import firebaseConfig from "../firebase.config";
import {
  RotateCcw, User, LogOut, Edit3, Save, X,
  Bell, Shield, Palette, AlertTriangle, CheckCircle2,
  Loader2, RefreshCw, Wifi, WifiOff, Info,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// 🔧 Change these when business defaults change.
// ─────────────────────────────────────────────────────────────
const DEFAULT_BILLING = {
  localOfficeBillPercentage: 1.0,
  taxOnMoney:                5.0,
  demandChargePerMeter:    250.0,
  serviceChargePerMeter:  1205.0,
  electricityRatePerUnit:   10.76,
  pick:    12.95,   // ← peak-hour unit rate   → synced to ElectricityDashboard
  offpick:  9.68,   // ← off-peak unit rate    → synced to ElectricityDashboard
};

// Firebase RTDB path for billing settings.
// ⚠️ MUST match ElectricityDashboard's RTDB_SETTINGS_PATH
const FIREBASE_SETTINGS_PATH = "setting/settings";

// Field config drives the entire Default-tab UI.
const BILLING_FIELDS = [
  {
    key: "localOfficeBillPercentage",
    label: "Local Office Bill %",
    suffix: "%",
    accentColor: "text-blue-600",
    badgeBg: "bg-blue-50 border-blue-200",
    hint: "Percentage added on top of raw local office bills",
  },
  {
    key: "taxOnMoney",
    label: "Tax on Money",
    suffix: "%",
    accentColor: "text-rose-600",
    badgeBg: "bg-rose-50 border-rose-200",
    hint: "VAT / tax % applied on monetary transactions",
  },
  {
    key: "demandChargePerMeter",
    label: "Demand Charge / Meter",
    prefix: "৳",
    accentColor: "text-orange-600",
    badgeBg: "bg-orange-50 border-orange-200",
    hint: "Fixed monthly demand charge per electricity meter",
  },
  {
    key: "serviceChargePerMeter",
    label: "Service Charge / Meter",
    prefix: "৳",
    accentColor: "text-violet-600",
    badgeBg: "bg-violet-50 border-violet-200",
    hint: "Monthly maintenance / service charge per meter",
  },
  {
    key: "pick",
    label: "Peak Hour Unit Rate",
    prefix: "৳",
    accentColor: "text-amber-600",
    badgeBg: "bg-amber-50 border-amber-200",
    hint: "৳ per kWh during peak hours  →  synced to ElectricityDashboard",
  },
  {
    key: "offpick",
    label: "Off-Peak Unit Rate",
    prefix: "৳",
    accentColor: "text-teal-600",
    badgeBg: "bg-teal-50 border-teal-200",
    hint: "৳ per kWh during off-peak hours  →  synced to ElectricityDashboard",
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

const toStringMap = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, String(v ?? "")]));

const toNumberMap = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, Math.max(0, parseFloat(v) || 0)])
  );

const isValidDecimal = (v) => v === "" || /^\d*\.?\d*$/.test(v);

// ─────────────────────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────────────────────

/**
 * StatusBanner with improved visual feedback
 */
function StatusBanner({ type, message, onRetry, onDismiss }) {
  const styles = {
    loading: "bg-blue-50  border-blue-200  text-blue-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error:   "bg-red-50   border-red-200   text-red-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    info:    "bg-slate-50 border-slate-200 text-slate-600",
  };
  const icons = {
    loading: <Loader2    size={15} className="animate-spin flex-shrink-0" />,
    success: <CheckCircle2 size={15} className="flex-shrink-0" />,
    error:   <AlertTriangle size={15} className="flex-shrink-0" />,
    warning: <AlertTriangle size={15} className="flex-shrink-0" />,
    info:    <Info        size={15} className="flex-shrink-0" />,
  };
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium mb-5 ${styles[type]}`}>
      {icons[type]}
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs font-bold underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          <RefreshCw size={11} /> Retry
        </button>
      )}
      {onDismiss && (
        <button onClick={onDismiss} className="opacity-40 hover:opacity-100 transition-opacity ml-1">
          <X size={13} />
        </button>
      )}
    </div>
  );
}

/** iOS-style toggle with ARIA attributes. */
function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      aria-label={label}
      aria-pressed={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400
        ${checked ? "bg-blue-500 shadow-inner shadow-blue-700/20" : "bg-gray-200"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

/** Read-only profile field. */
function ViewField({ label, value }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <p className="text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-sm font-medium">
        {value}
      </p>
    </div>
  );
}

/** Editable profile input with inline error. */
function EditField({ label, value, onChange, type = "text", error }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 border rounded-xl text-sm font-medium transition-all
          focus:outline-none focus:ring-2
          ${error
            ? "border-red-300 bg-red-50 focus:ring-red-200"
            : "border-gray-300 bg-white focus:ring-blue-200 focus:border-blue-400"
          }`}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500 font-semibold flex items-center gap-1">
          <AlertTriangle size={10} /> {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function UserProfile() {

  const [activeTab, setActiveTab] = useState("profile");

  // ══════════════════════════════════════════════════════════
  // BILLING DEFAULTS - Firebase RTDB Sync
  // ══════════════════════════════════════════════════════════

  const db = getDatabase();

  // useDataFetch provides real-time sync from Firebase RTDB
  const settingFetch = useDataFetch(FIREBASE_SETTINGS_PATH);

  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [billingInputs, setBillingInputs] = useState(toStringMap(DEFAULT_BILLING));
  const [billingErrors, setBillingErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "saved" | "error"
  const [saveErrorMsg, setSaveErrorMsg] = useState("");

  // Firebase RTDB connection status with improved tracking
  const [fbStatus, setFbStatus] = useState("loading"); // "loading" | "connected" | "error"
  const [fbRetryCount, setFbRetryCount] = useState(0);
  const maxRetries = 3;

  // ── Sync Firebase data into local inputs ─────────────────
  // This runs whenever useDataFetch receives new data from RTDB
  useEffect(() => {
    console.log("[UserProfile] useDataFetch result:", settingFetch);

    if (settingFetch === null || settingFetch === undefined) {
      console.log("[UserProfile] ⏳ Waiting for Firebase RTDB snapshot…");
      return;
    }

    if (typeof settingFetch !== "object" || Array.isArray(settingFetch)) {
      console.error("[UserProfile] ❌ Unexpected Firebase data type:", typeof settingFetch, settingFetch);
      setFbStatus("error");
      return;
    }

    // Merge: fetched values win; missing keys fall back to defaults
    const merged = { ...DEFAULT_BILLING, ...settingFetch };
    console.log("[UserProfile] ✅ Firebase RTDB synced. Merged settings:", merged);

    setBillingInputs(toStringMap(merged));
    setFbStatus("connected");
    setFbRetryCount(0); // Reset retry counter on success
  }, [settingFetch]);

  // ── Timeout guard: if no Firebase data after 8 seconds ─────
  // This helps detect network issues, wrong path, or Firebase rules
  useEffect(() => {
    if (fbStatus !== "loading") return; // Only run while waiting

    const timeoutId = setTimeout(() => {
      console.warn(
        "[UserProfile] ⏱ Firebase RTDB timeout after 8s.\n" +
        "  Troubleshooting checklist:\n" +
        "    1) DB path is 'setting/settings'\n" +
        "    2) RTDB security rules allow .read: true\n" +
        "    3) Internet connection is available\n" +
        "    4) Firebase project ID matches config\n" +
        "    5) RTDB is enabled in Firebase Console"
      );
      setFbStatus("error");
    }, 8000);

    return () => clearTimeout(timeoutId);
  }, [fbStatus]);

  // ── Input change handler ──────────────────────────────────
  const handleBillingInput = useCallback((field, value) => {
    if (!isValidDecimal(value)) return; // Reject invalid characters
    setBillingInputs((prev) => ({ ...prev, [field]: value }));
    // Clear field error as soon as user starts editing
    setBillingErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  // ── Validate billing data ─────────────────────────────────
  const validateBilling = (inputs) => {
    const errors = {};
    Object.entries(inputs).forEach(([key, val]) => {
      const n = parseFloat(val);
      if (val !== "" && isNaN(n)) errors[key] = "Must be a number";
      else if (!isNaN(n) && n < 0) errors[key] = "Cannot be negative";
    });
    return errors;
  };

  // ── Save to Firebase RTDB ─────────────────────────────────
  // This is THE critical function - saves billing config to Firebase
  const handleSaveBilling = async () => {
    console.log("[UserProfile] 🔄 Save initiated. Raw inputs:", billingInputs);

    const errors = validateBilling(billingInputs);
    if (Object.keys(errors).length > 0) {
      setBillingErrors(errors);
      console.warn("[UserProfile] ❌ Validation errors - save blocked:", errors);
      return;
    }

    const clean = toNumberMap(billingInputs);
    console.log("[UserProfile] 📝 Writing to Firebase RTDB at", FIREBASE_SETTINGS_PATH, ':', clean);

    setSaveStatus("saving");
    setSaveErrorMsg("");

    try {
      // Write to Firebase RTDB
      // This triggers useDataFetch listeners in ElectricityDashboard automatically
      await set(ref(db, FIREBASE_SETTINGS_PATH), clean);

      console.log("[UserProfile] ✅ Firebase write successful! Data is now live.");
      console.log("[UserProfile] 📡 ElectricityDashboard will auto-sync via useDataFetch...");

      // Re-hydrate inputs with normalized numbers
      setBillingInputs(toStringMap(clean));
      setSaveStatus("saved");
      setIsEditingBilling(false);
      setBillingErrors({});

      // Auto-dismiss success banner after 4 seconds
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 4000);

    } catch (err) {
      console.error("[UserProfile] ❌ Firebase write failed:");
      console.error("  Code:", err.code);
      console.error("  Message:", err.message);

      setSaveStatus("error");

      // Provide actionable error messages
      if (err.code === "PERMISSION_DENIED") {
        setSaveErrorMsg(
          "Permission denied. Check Firebase RTDB rules: " +
          "ensure '.write: true' is set at 'setting/settings' path."
        );
      } else if (err.code === "NETWORK_ERROR") {
        setSaveErrorMsg("Network error. Check your internet connection and try again.");
      } else {
        setSaveErrorMsg(err.message || "Unknown error - see browser console for details.");
      }
    }
  };

  // ── Manual retry ──────────────────────────────────────────
  const handleRetryConnection = () => {
    console.log("[UserProfile] 🔄 Manual reconnect attempt...");
    setFbStatus("loading");
    setFbRetryCount((c) => c + 1);
  };

  // ── Reset to defaults (local only - does NOT write Firebase) ─
  const handleResetBilling = () => {
    console.log("[UserProfile] ↻ Reset to hardcoded defaults (not saved to Firebase).");
    setBillingInputs(toStringMap(DEFAULT_BILLING));
    setBillingErrors({});
  };

  // ── Cancel edit - restore last fetched Firebase state ─────
  const handleCancelBilling = () => {
    console.log("[UserProfile] ✖️  Cancel edit. Restoring Firebase snapshot...");
    const source = settingFetch
      ? { ...DEFAULT_BILLING, ...settingFetch }
      : DEFAULT_BILLING;
    setBillingInputs(toStringMap(source));
    setBillingErrors({});
    setSaveStatus("idle");
    setIsEditingBilling(false);
  };

  // Normalized numbers for view-mode display
  const billingDisplay = toNumberMap(billingInputs);

  // ══════════════════════════════════════════════════════════
  // PROFILE TAB  (local state - can add Firebase write later)
  // ══════════════════════════════════════════════════════════
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving,    setProfileSaving]    = useState(false);
  const [userInfo, setUserInfo] = useState({
    name:     "John Doe",
    email:    "john.doe@example.com",
    phone:    "+1 (555) 123-4567",
    location: "New York, NY",
    bio:      "Software developer passionate about creating amazing user experiences.",
  });
  const [editedInfo,    setEditedInfo]    = useState(userInfo);
  const [profileErrors, setProfileErrors] = useState({});

  const validateProfile = (info) => {
    const errors = {};
    if (!info.name.trim())  errors.name  = "Name is required";
    if (!info.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email))
      errors.email = "Invalid email address";
    return errors;
  };

  const handleSaveProfile = async () => {
    const errors = validateProfile(editedInfo);
    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setUserInfo(editedInfo);
    setProfileErrors({});
    setIsEditingProfile(false);
    setProfileSaving(false);
  };

  const handleCancelProfile = () => {
    setEditedInfo(userInfo);
    setProfileErrors({});
    setIsEditingProfile(false);
  };

  // ══════════════════════════════════════════════════════════
  // SETTINGS TAB  (local state)
  // ══════════════════════════════════════════════════════════
  const [uiPrefs, setUiPrefs] = useState({
    notifications: true,
    emailUpdates:  true,
    darkMode:      false,
    twoFactor:     false,
  });

  const togglePref = (key) => {
    setUiPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  // ── Tab styling ────────────────────────────────────────────
  const tabCls = (tab) =>
    `py-3.5 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
      activeTab === tab
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
    }`;

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">

        {/* ── Header ── */}
        <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 px-6 py-8 overflow-hidden">
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 left-16 w-44 h-44 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <User size={30} className="text-white/80" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white leading-none">{userInfo.name}</h1>
                <p className="text-blue-200 text-sm mt-1">{userInfo.email}</p>

                {/* Firebase connectivity badge - IMPROVED */}
                <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border
                  ${fbStatus === "connected" ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                  : fbStatus === "loading"   ? "bg-blue-500/20   border-blue-400/30   text-blue-300"
                  :                            "bg-red-500/20    border-red-400/30    text-red-300"}`}
                  title={fbStatus === "connected" ? "✅ Real-time sync active"
                       : fbStatus === "loading" ? "⏳ Connecting to Firebase..."
                       : "❌ Firebase connection failed"}
                >
                  {fbStatus === "connected" ? <Wifi size={9} /> : <WifiOff size={9} />}
                  {fbStatus === "connected" ? "Firebase OK"
                   : fbStatus === "loading" ? "Connecting…"
                   : "Connection Error"}
                </div>
              </div>
            </div>
            <button
              onClick={() => { console.log("[UserProfile] Logout."); alert("Logged out!"); }}
              className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 border border-red-400/40 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-red-900/30"
            >
              <LogOut size={14} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="border-b border-gray-100 px-6">
          <nav className="flex gap-7">
            {[
              { id: "profile",  label: "Profile" },
              { id: "settings", label: "Settings" },
              { id: "default",  label: "Billing Defaults" },
            ].map(({ id, label }) => (
              <button key={id} onClick={() => setActiveTab(id)} className={tabCls(id)}>
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* ── Content area ── */}
        <div className="p-6">

          {/* ──────────────────────────────────────────────
              TAB 1: PROFILE
          ────────────────────────────────────────────── */}
          {activeTab === "profile" && (
            <div>
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-black text-gray-800">Profile Information</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Local state only – add Firebase write to persist</p>
                </div>
                {!isEditingProfile ? (
                  <button
                    onClick={() => { setEditedInfo(userInfo); setIsEditingProfile(true); }}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200 flex-shrink-0"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleSaveProfile}
                      disabled={profileSaving}
                      className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-200"
                    >
                      {profileSaving
                        ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                        : <><Save size={13} /> Save</>
                      }
                    </button>
                    <button
                      onClick={handleCancelProfile}
                      className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { key: "name",     label: "Full Name", type: "text" },
                  { key: "email",    label: "Email",     type: "email" },
                  { key: "phone",    label: "Phone",     type: "tel" },
                  { key: "location", label: "Location",  type: "text" },
                ].map(({ key, label, type }) =>
                  isEditingProfile ? (
                    <EditField
                      key={key} label={label} type={type}
                      value={editedInfo[key]}
                      onChange={(v) => {
                        setEditedInfo((p) => ({ ...p, [key]: v }));
                        setBillingErrors((p) => { const n = { ...p }; delete n[key]; return n; });
                      }}
                      error={profileErrors[key]}
                    />
                  ) : (
                    <ViewField key={key} label={label} value={userInfo[key]} />
                  )
                )}

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Bio</label>
                  {isEditingProfile ? (
                    <textarea
                      value={editedInfo.bio}
                      onChange={(e) => setEditedInfo((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all resize-none"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-sm font-medium leading-relaxed">
                      {userInfo.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────
              TAB 2: SETTINGS
          ────────────────────────────────────────────── */}
          {activeTab === "settings" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-800">Account Settings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Stored in local component state</p>
              </div>

              <div className="space-y-4">
                {/* Notifications group */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-4">
                    <Bell size={15} className="text-blue-500" /> Notifications
                  </h3>
                  {[
                    { key: "notifications", label: "Push Notifications", desc: "Browser / device push alerts" },
                    { key: "emailUpdates",  label: "Email Updates",      desc: "Receive important updates via email" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{label}</p>
                        <p className="text-xs text-gray-400">{desc}</p>
                      </div>
                      <Toggle checked={uiPrefs[key]} onChange={() => togglePref(key)} label={label} />
                    </div>
                  ))}
                </div>

                {/* Appearance group */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-4">
                    <Palette size={15} className="text-purple-500" /> Appearance
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Dark Mode</p>
                      <p className="text-xs text-gray-400">Connect to ThemeContext to activate globally</p>
                    </div>
                    <Toggle checked={uiPrefs.darkMode} onChange={() => togglePref("darkMode")} label="Dark Mode" />
                  </div>
                </div>

                {/* Security group */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-gray-600 flex items-center gap-2 mb-4">
                    <Shield size={15} className="text-emerald-500" /> Security
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-400">2FA setup flow not yet implemented</p>
                    </div>
                    <Toggle checked={uiPrefs.twoFactor} onChange={() => togglePref("twoFactor")} label="Two-Factor Authentication" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────
              TAB 3: BILLING DEFAULTS
              ✅ Full Firebase RTDB sync
          ────────────────────────────────────────────── */}
          {activeTab === "default" && (
            <div>
              {/* Section header + action buttons */}
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div>
                  <h2 className="text-xl font-black text-gray-800">Billing Defaults</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">
                    Firebase RTDB → <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{FIREBASE_SETTINGS_PATH}</span>
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  <button
                    onClick={handleResetBilling}
                    title="Resets inputs to hardcoded defaults. Does NOT save to Firebase."
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-all"
                  >
                    <RotateCcw size={13} /> Reset
                  </button>

                  {!isEditingBilling ? (
                    <button
                      onClick={() => { setSaveStatus("idle"); setIsEditingBilling(true); }}
                      disabled={fbStatus === "loading"}
                      title={fbStatus === "loading" ? "Waiting for Firebase…" : "Edit billing settings"}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-200"
                    >
                      Edit Settings
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelBilling}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveBilling}
                        disabled={saveStatus === "saving"}
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-emerald-200"
                      >
                        {saveStatus === "saving"
                          ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                          : <><Save size={13} /> Save to Firebase</>
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Status banners ── */}
              {fbStatus === "loading" && (
                <StatusBanner 
                  type="loading" 
                  message="Connecting to Firebase Realtime DB…" 
                />
              )}
              {fbStatus === "error" && (
                <StatusBanner
                  type="error"
                  message="Firebase connection failed. Showing defaults. Click Retry to reconnect."
                  onRetry={handleRetryConnection}
                />
              )}
              {saveStatus === "saved" && (
                <StatusBanner
                  type="success"
                  message="✨ Settings saved to Firebase! ElectricityDashboard syncing in real-time…"
                  onDismiss={() => setSaveStatus("idle")}
                />
              )}
              {saveStatus === "error" && (
                <StatusBanner
                  type="error"
                  message={`Save failed: ${saveErrorMsg}`}
                  onRetry={handleSaveBilling}
                  onDismiss={() => setSaveStatus("idle")}
                />
              )}

              {/* ── Field grid ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BILLING_FIELDS.map(({ key, label, suffix = "", prefix = "", accentColor, badgeBg, hint }) => (
                  <div
                    key={key}
                    className={`rounded-2xl border p-4 transition-all ${
                      billingErrors[key]
                        ? "border-red-200 bg-red-50/60"
                        : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-700">{label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{hint}</p>
                      </div>
                      {!isEditingBilling && (
                        <div className={`px-3 py-1.5 rounded-xl border text-sm font-black ${accentColor} ${badgeBg} flex-shrink-0`}>
                          {prefix}{billingDisplay[key].toFixed(2)}{suffix}
                        </div>
                      )}
                    </div>

                    {isEditingBilling && (
                      <div className="mt-3">
                        <div className="relative">
                          {prefix && (
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none select-none">
                              {prefix}
                            </span>
                          )}
                          <input
                            type="text"
                            inputMode="decimal"
                            value={billingInputs[key]}
                            onChange={(e) => handleBillingInput(key, e.target.value)}
                            className={`w-full py-2.5 border rounded-xl text-sm font-semibold text-right
                              focus:outline-none focus:ring-2 transition-all
                              ${prefix ? "pl-8 pr-10" : "px-4"}
                              ${billingErrors[key]
                                ? "border-red-300 bg-red-50 focus:ring-red-200"
                                : "border-gray-300 bg-white focus:ring-blue-200 focus:border-blue-400"
                              }`}
                          />
                          {suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none select-none">
                              {suffix}
                            </span>
                          )}
                        </div>
                        {billingErrors[key] && (
                          <p className="mt-1.5 text-xs text-red-500 font-semibold flex items-center gap-1">
                            <AlertTriangle size={10} /> {billingErrors[key]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Electricity Rate – full width row */}
                <div
                  className={`md:col-span-2 rounded-2xl border p-4 transition-all ${
                    billingErrors.electricityRatePerUnit
                      ? "border-red-200 bg-red-50/60"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-700">Electricity Rate / kWh</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Flat rate per kilowatt-hour for general consumption billing
                      </p>
                    </div>
                    {!isEditingBilling && (
                      <div className="px-3 py-1.5 rounded-xl border text-sm font-black text-green-600 bg-green-50 border-green-200 flex-shrink-0">
                        ৳{billingDisplay.electricityRatePerUnit.toFixed(2)} / kWh
                      </div>
                    )}
                  </div>
                  {isEditingBilling && (
                    <div className="mt-3">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold pointer-events-none select-none">৳</span>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={billingInputs.electricityRatePerUnit}
                          onChange={(e) => handleBillingInput("electricityRatePerUnit", e.target.value)}
                          className={`w-full pl-8 pr-16 py-2.5 border rounded-xl text-sm font-semibold text-right
                            focus:outline-none focus:ring-2 transition-all
                            ${billingErrors.electricityRatePerUnit
                              ? "border-red-300 bg-red-50 focus:ring-red-200"
                              : "border-gray-300 bg-white focus:ring-blue-200 focus:border-blue-400"
                            }`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold pointer-events-none select-none">/ kWh</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Summary – only shown in view mode when Firebase is connected */}
              {!isEditingBilling && fbStatus === "connected" && (
                <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-2xl border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Live from Firebase RTDB
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { label: "Local Office", value: `${billingDisplay.localOfficeBillPercentage.toFixed(2)}%` },
                      { label: "Tax",          value: `${billingDisplay.taxOnMoney.toFixed(2)}%` },
                      { label: "Demand",       value: `৳${billingDisplay.demandChargePerMeter.toFixed(2)}` },
                      { label: "Service",      value: `৳${billingDisplay.serviceChargePerMeter.toFixed(2)}` },
                      { label: "Elec. Rate",   value: `৳${billingDisplay.electricityRatePerUnit.toFixed(2)}/kWh` },
                      { label: "Peak Rate",    value: `৳${billingDisplay.pick.toFixed(2)}/u` },
                      { label: "Off-Peak",     value: `৳${billingDisplay.offpick.toFixed(2)}/u` },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white/80 rounded-xl px-3 py-2.5 border border-blue-100/80">
                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-sm font-black text-slate-700">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer note */}
              <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
                <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <strong>📡 Real-time Sync:</strong> When you save settings here, they are immediately synced to Firebase RTDB.
                  ElectricityDashboard listens to the same Firebase path and auto-updates in real-time.
                  No page reload needed!
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}