'use client'
// ─── Sidebar + Mobile Bottom Navigation ──────────────────────────────────────
// Desktop: fixed left sidebar (240px).
// Mobile: hidden sidebar + bottom tab bar.
// Guest users see "Save Account" CTA instead of Sign Out.

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'

const NAV_ITEMS = [
  { href: '/dashboard/machines',    icon: '🔧', key: 'machines'    },
  { href: '/dashboard/electricity', icon: '⚡', key: 'electricity' },
  { href: '/dashboard/calculation', icon: '📊', key: 'calculation' },
  { href: '/dashboard/settings',    icon: '⚙️', key: 'settings'   },
]

// ─── Language toggle ──────────────────────────────────────────────────────────
export function LangToggle({ compact = false }) {
  const { lang, setLang } = useLang()
  return (
    <div style={{ display:'flex', gap:3, padding:3, background:'var(--bg-subtle)', borderRadius:8, border:'1px solid var(--border)' }}>
      {['en','bn'].map(l => (
        <button key={l} onClick={() => setLang(l)} style={{
          padding: compact ? '3px 8px' : '4px 10px',
          borderRadius:6, border:'none', cursor:'pointer',
          fontSize: compact ? '0.72rem' : '0.78rem', fontWeight:700,
          fontFamily:'var(--font-main)',
          background: lang===l ? 'var(--bg-card)' : 'transparent',
          color: lang===l ? 'var(--brand)' : 'var(--text-muted)',
          boxShadow: lang===l ? 'var(--shadow-sm)' : 'none',
          transition:'all 0.15s ease',
        }}>
          {l==='en' ? 'EN' : 'বাং'}
        </button>
      ))}
    </div>
  )
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname()
  const { user, profile, isGuest, logout } = useAuth()
  const { t } = useLang()

  return (
    <aside className="sidebar" style={{
      position:'fixed', left:0, top:0, bottom:0, width:'var(--sidebar)',
      background:'var(--bg-card)', borderRight:'1px solid var(--border)',
      display:'flex', flexDirection:'column', zIndex:40,
      boxShadow:'2px 0 12px rgba(26,32,53,0.04)',
    }}>
      {/* Logo + factory name */}
      <div style={{ padding:'20px 16px 16px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
          <div style={{
            width:38, height:38, borderRadius:12, flexShrink:0,
            background:'linear-gradient(135deg,#2563EB,#60A5FA)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.1rem', boxShadow:'0 2px 8px rgba(37,99,235,0.25)',
          }}>⚡</div>
          <div style={{ overflow:'hidden' }}>
            <div style={{ fontWeight:900, fontSize:'1rem', color:'var(--text-primary)', letterSpacing:'-0.02em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {t('appName')}
            </div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:600, marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {profile?.factoryName || t('appTagline')}
            </div>
          </div>
        </div>
        <LangToggle />
      </div>

      {/* Nav links */}
      <nav style={{ flex:1, padding:'12px 10px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV_ITEMS.map(({ href, icon, key }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 12px', borderRadius:10, textDecoration:'none',
              background: active ? 'var(--brand-light)' : 'transparent',
              color: active ? 'var(--brand)' : 'var(--text-secondary)',
              fontWeight: active ? 700 : 600, fontSize:'0.875rem',
              transition:'all 0.15s ease',
              border: active ? '1px solid var(--brand-mid)' : '1px solid transparent',
            }}>
              <span style={{ fontSize:'1.05rem', flexShrink:0 }}>{icon}</span>
              {t(key)}
              {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:'var(--brand)' }} />}
            </Link>
          )
        })}
      </nav>

      {/* User area */}
      <div style={{ padding:'12px 10px', borderTop:'1px solid var(--border)' }}>
        {/* Guest: show "Save Account" CTA */}
        {isGuest ? (
          <Link href="/login" style={{
            display:'block', padding:'10px 12px', borderRadius:10, textDecoration:'none',
            background:'var(--brand-light)', border:'1px solid var(--brand-mid)',
            marginBottom:6,
          }}>
            <div style={{ fontWeight:800, fontSize:'0.82rem', color:'var(--brand)' }}>🔐 Save Your Account</div>
            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>Register to keep your data</div>
          </Link>
        ) : (
          <Link href="/dashboard/profile" style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'10px 12px', borderRadius:10, textDecoration:'none', marginBottom:4,
            transition:'background 0.15s',
          }}>
            <div style={{
              width:34, height:34, borderRadius:10, flexShrink:0,
              background:'linear-gradient(135deg,#2563EB,#93C5FD)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'0.9rem', fontWeight:800, color:'white',
              border:'1.5px solid var(--border)',
            }}>
              {(profile?.displayName?.[0] || '?').toUpperCase()}
            </div>
            <div style={{ overflow:'hidden', flex:1 }}>
              <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {profile?.displayName || 'User'}
              </div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {user?.email || ''}
              </div>
            </div>
          </Link>
        )}

        {/* Sign out (only for registered users) */}
        {!isGuest && (
          <button onClick={logout} style={{
            width:'100%', display:'flex', alignItems:'center', gap:8,
            padding:'9px 12px', borderRadius:10, border:'none',
            background:'transparent', cursor:'pointer',
            fontFamily:'var(--font-main)', fontSize:'0.82rem', fontWeight:700,
            color:'var(--red)', transition:'background 0.15s',
          }}>
            🚪 {t('signOut')}
          </button>
        )}
      </div>
    </aside>
  )
}

// ─── Mobile Bottom Navigation ─────────────────────────────────────────────────
export function MobileNav() {
  const pathname = usePathname()
  const { t, lang } = useLang()

  // Add account tab for mobile
  const mobileItems = [
    ...NAV_ITEMS,
    { href: '/login', icon: '👤', key: 'profile' },
  ]

  return (
    <div className="mobile-nav" style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:50,
      background:'var(--bg-card)', borderTop:'1px solid var(--border)',
      boxShadow:'0 -4px 20px rgba(26,32,53,0.08)',
      padding:'6px 0 max(6px, env(safe-area-inset-bottom))',
      display:'flex', justifyContent:'space-around', alignItems:'center',
    }}>
      {mobileItems.map(({ href, icon, key }) => {
        const active = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link key={href} href={href} style={{
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            padding:'4px 10px', borderRadius:10, textDecoration:'none',
            color: active ? 'var(--brand)' : 'var(--text-muted)',
            transition:'all 0.15s', flex:1,
          }}>
            <span style={{ fontSize:'1.2rem' }}>{icon}</span>
            <span style={{ fontSize:'0.58rem', fontWeight: active ? 800 : 600, lineHeight:1, textAlign:'center' }}>
              {t(key)}
            </span>
            {active && <div style={{ width:16, height:2.5, borderRadius:2, background:'var(--brand)' }} />}
          </Link>
        )
      })}
    </div>
  )
}
