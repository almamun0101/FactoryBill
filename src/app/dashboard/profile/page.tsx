'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { User, Factory, Mail, Save, Shield } from 'lucide-react'

export default function ProfilePage() {
  const { user, profile, updateUserProfile } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.displayName || '')
  const [factoryName, setFactoryName] = useState(profile?.factoryName || '')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await updateUserProfile({ displayName, factoryName })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
            <User size={18} className="text-sky-400" />
          </div>
          <h1 className="font-display font-800 text-2xl gradient-text">Profile</h1>
        </div>
        <p className="text-slate-500 text-sm">Manage your account details</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8 p-5 rounded-2xl border border-slate-700/40"
        style={{ background: 'rgba(15,23,42,0.8)' }}>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-white text-2xl font-display font-800">
          {(profile?.displayName || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <div className="text-white font-display font-700">{profile?.displayName || 'User'}</div>
          <div className="text-slate-500 text-sm">{profile?.factoryName || 'No factory set'}</div>
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
            <Shield size={11} />
            <span>Authenticated</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-700/40 p-5 space-y-4"
          style={{ background: 'rgba(15,23,42,0.8)' }}>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <User size={11} /> Display Name
            </label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
              style={{ background: 'rgba(15,23,42,0.8)' }}
              placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <Factory size={11} /> Factory Name
            </label>
            <input value={factoryName} onChange={e => setFactoryName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
              style={{ background: 'rgba(15,23,42,0.8)' }}
              placeholder="Your factory name" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 flex items-center gap-1">
              <Mail size={11} /> Email
            </label>
            <input value={user?.email || ''} disabled
              className="w-full px-3 py-2.5 rounded-xl border border-slate-700/30 text-slate-500 text-sm cursor-not-allowed"
              style={{ background: 'rgba(15,23,42,0.4)' }} />
          </div>
        </div>

        <button onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-display font-700 text-sm transition-all ${
            saved
              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
              : 'border border-sky-500/30 text-sky-300 hover:bg-sky-500/10'
          }`}>
          <Save size={16} />
          {saved ? 'Profile Saved ✓' : 'Save Profile'}
        </button>
      </div>
    </div>
  )
}
