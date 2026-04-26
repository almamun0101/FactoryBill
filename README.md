# FactoryBill — Industrial Energy Manager

A full-stack Next.js 14 app with Firebase Realtime Database for factory electricity billing management.

## 🚀 Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 File Structure

```
src/
├── app/
│   ├── login/page.tsx              # Auth page (login + register)
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected dashboard layout w/ sidebar
│   │   ├── machines/page.tsx       # Machine billing per month
│   │   ├── electricity/page.tsx    # Electricity recharges
│   │   ├── calculation/page.tsx    # Final calculation summary
│   │   ├── settings/page.tsx       # Machines, pricing, deductions
│   │   └── profile/page.tsx        # User profile
│   ├── layout.tsx                  # Root layout (providers)
│   └── globals.css                 # Global styles
├── context/
│   ├── AuthContext.tsx             # Firebase auth context
│   └── SettingsContext.tsx         # Settings with realtime DB sync
├── lib/
│   ├── firebase.ts                 # Firebase config
│   └── db.ts                       # All DB read/write helpers
├── types/index.ts                  # TypeScript types
└── components/
    └── Sidebar.tsx                 # Navigation sidebar
```

## ✨ Features

### Machine Billing Page
- Monthly accordion cards (latest first)
- Per-machine cards with: name, model, total cost
- **Radio toggle**: Total Unit mode vs Peak/Off-Peak mode
- Total Unit mode: enter meter reading → auto minus previous/default unit → net units × rate
- Peak/Off-Peak mode: peak kWh × peak rate + off-peak kWh × off-peak rate, shown separately
- Previous unit input (defaults to machine default unit from settings)
- Net unit calculation displayed with each machine
- Save button → stored in Firebase Realtime Database

### Electricity Page
- Add recharge modal: date (today default), amount, source (Local/Office)
- Local recharges have surcharge; Office = free
- Month cards showing all recharges for that month
- Deduction breakdown: VAT, demand charge, meter charge
- Net meter balance shown per month

### Calculation Page
- Combines both pages: net meter balance − total machine cost
- Per-machine breakdown table
- Remaining balance or deficit highlighted in green/red
- All-time grand totals

### Settings Page
- Add/remove machines with name, model, default unit
- Set electricity rates: total rate, peak rate, off-peak rate
- Set deductions: VAT %, local surcharge %, demand charge, meter charge
- All saved to Firebase, synced in real-time

### Profile Page
- Display name + factory name editor
- Email (read-only from Firebase Auth)

## 🔧 Firebase Setup

Enable in Firebase Console:
1. **Authentication** → Email/Password sign-in
2. **Realtime Database** → Create database

**Database Rules (for development):**
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
