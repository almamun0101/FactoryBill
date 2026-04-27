# FactoryBill v2 — Industrial Energy Manager

A **Next.js 14** app (JSX, fully commented) with Firebase Realtime Database.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

> **Firebase setup required** — Enable Email/Password Auth + Realtime Database in your Firebase Console.
> Set database rules so each user can only access their own data (see below).

---

## 📁 Project Structure

```
src/
├── app/
│   ├── login/page.jsx              # Login + Register + Guest login
│   ├── dashboard/
│   │   ├── layout.jsx              # Auth guard + sidebar + mobile nav
│   │   ├── machines/page.jsx       # Machine billing (month accordion)
│   │   ├── electricity/page.jsx    # Electricity recharges + deductions
│   │   ├── calculation/page.jsx    # Combined monthly summary
│   │   ├── settings/page.jsx       # Machines, rates, deductions config
│   │   └── profile/page.jsx        # User profile editor
│   ├── layout.jsx                  # Root layout (all providers)
│   ├── page.jsx                    # Root redirect
│   └── globals.css                 # Design system (CSS variables, light theme)
├── components/
│   └── Sidebar.jsx                 # Desktop sidebar + mobile bottom nav
├── context/
│   ├── AuthContext.jsx             # Firebase auth (login/register/guest)
│   ├── SettingsContext.jsx         # Machine/price config with DB sync
│   └── LangContext.jsx             # English / Bangla language switching
└── lib/
    ├── firebase.js                 # Firebase app initialization
    ├── db.js                       # All Realtime DB read/write helpers
    └── i18n.js                     # All UI strings in EN + BN
```

---

## ✨ Features

### 🔐 Authentication
- Email + Password login and registration
- **Guest login** (Firebase Anonymous Auth) — no account needed
- Language toggle: **English / বাংলা** on every screen

### 🔧 Machines Page
- Last 12 months as accordion cards (latest open by default)
- Per-machine cards: name, model, cost display
- **Total Unit mode**: enter meter reading → minus previous/default → net × rate
- **Peak/Off-Peak mode**: separate inputs, separate rates, separate cost breakdown
- Configurable previous/default unit per machine
- Save button → Firebase Realtime DB

### ⚡ Electricity Page
- Add recharge modal: date, amount, source (Local with surcharge / Office free)
- Month accordion cards showing all entries
- **Deduction breakdown**: local surcharge, VAT, demand charge, meter charge
- Net meter balance prominently shown

### 📊 Calculation Page
- Combines electricity + machines per month
- Net meter balance − total machine cost = remaining / deficit
- Color-coded green (surplus) / red (deficit)
- Grand totals across all time

### ⚙️ Settings Page
- Add/remove/edit machines (name, model, default unit)
- Electricity rates: total, peak, off-peak (৳/kWh)
- Deductions: VAT%, local surcharge%, demand charge, meter charge
- All saved to Firebase and synced in real-time

### 📱 Mobile Responsive
- Desktop: fixed left sidebar
- Mobile: sidebar hidden, bottom tab bar shown
- All cards and grids adapt to small screens

---

## 🔥 Firebase Setup

### 1. Enable Authentication
Firebase Console → Authentication → Sign-in method → Enable:
- **Email/Password**
- **Anonymous** (for guest login)

### 2. Create Realtime Database
Firebase Console → Realtime Database → Create database (choose your region)

### 3. Set Security Rules
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

### 4. Update databaseURL
In `src/lib/firebase.js`, update the `databaseURL` if your region is not `us-central1`:
```
https://factory-db-e6bcf-default-rtdb.firebaseio.com        (US)
https://factory-db-e6bcf-default-rtdb.europe-west1.firebaseio.com  (EU)
```

---

## 🎨 Design System

All design tokens are CSS variables in `globals.css`:
- `--brand` — primary blue
- `--bg-card` — white card background
- `--text-primary/secondary/muted` — text hierarchy
- `--green/amber/red/violet` — semantic colors

Fonts: **Nunito** (UI) + **Noto Sans Bengali** (Bangla) + **JetBrains Mono** (numbers)
