'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Factory, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login, register } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [factoryName, setFactoryName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password, name, factoryName)
      }
      router.push('/dashboard/machines')
    } catch (e: any) {
      setError(e.message?.replace('Firebase: ', '') || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, #0d1a2e 0%, #0a0f1e 60%)' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #0ea5e9, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #818cf8, transparent)', filter: 'blur(60px)' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #818cf8)' }}>
            <Factory size={28} className="text-white" />
          </div>
          <h1 className="font-display font-800 text-3xl gradient-text">FactoryBill</h1>
          <p className="text-slate-500 text-sm mt-1">Industrial Energy Manager</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 border border-slate-700/50"
          style={{ background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(20px)' }}>
          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(15,23,42,0.8)' }}>
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  mode === m
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-500 hover:text-slate-400'
                }`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === 'register' && (
              <>
                <Field label="Your Name" value={name} onChange={setName} placeholder="Full name" />
                <Field label="Factory Name" value={factoryName} onChange={setFactoryName} placeholder="Factory name" />
              </>
            )}
            <Field label="Email" value={email} onChange={setEmail} placeholder="email@example.com" type="email" />
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  className="w-full px-3 pr-10 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
                  style={{ background: 'rgba(15,23,42,0.8)' }} />
                <button onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 rounded-xl font-display font-700 text-sm text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #818cf8)' }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-700/50 text-white text-sm outline-none focus:border-sky-500/50 transition-colors"
        style={{ background: 'rgba(15,23,42,0.8)' }} />
    </div>
  )
}
