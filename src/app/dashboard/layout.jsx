'use client'
// ─── Dashboard Layout ─────────────────────────────────────────────────────────
// NO LOGIN REQUIRED — AuthContext auto-signs in as guest.
// This layout just shows a loading spinner while auth resolves,
// then renders the sidebar + content. Never redirects to login.
//
// If authError is set, shows a detailed error screen instead of blank/spinner.

import { useAuth } from '@/context/AuthContext'
import { Sidebar, MobileNav } from '@/components/Sidebar'

export default function DashboardLayout({ children }) {
  const { user, loading, authError } = useAuth()

  // ── Auth error screen ─────────────────────────────────────────────────────
  if (authError) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FFF8F8', padding: 24, fontFamily: 'sans-serif',
      }}>
        <div style={{
          maxWidth: 500, width: '100%', padding: 32, borderRadius: 16,
          background: 'white', border: '1px solid #FECACA',
          boxShadow: '0 4px 24px rgba(220,38,38,0.08)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔥</div>
          <h2 style={{ color: '#DC2626', fontWeight: 800, marginBottom: 8, fontSize: '1.1rem' }}>
            Firebase Connection Error
          </h2>
          <pre style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
            padding: '12px 14px', fontSize: '0.78rem', color: '#7F1D1D',
            overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            marginBottom: 20, lineHeight: 1.6,
          }}>
            {authError}
          </pre>
          <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 16 }}>
            <strong>Common fixes:</strong><br />
            1. Enable <strong>Anonymous Auth</strong> in Firebase Console → Authentication → Sign-in method<br />
            2. Create a <strong>Realtime Database</strong> in Firebase Console<br />
            3. Check the <code>databaseURL</code> in <code>src/lib/firebase.js</code>
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: '#2563EB', color: 'white', fontWeight: 700, fontSize: '0.875rem',
            }}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Loading spinner ───────────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>⚡</div>
          <div style={{
            display: 'inline-block', width: 32, height: 32, border: '3px solid var(--border)',
            borderTopColor: 'var(--brand)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'var(--font-main)' }}>
            Connecting...
          </div>
        </div>
      </div>
    )
  }

  // ── Main layout ───────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main
        className="main-content"
        style={{ flex: 1, marginLeft: 'var(--sidebar)', minHeight: '100vh', background: 'var(--bg)' }}
      >
        {children}
      </main>
      <MobileNav />
    </div>
  )
}
