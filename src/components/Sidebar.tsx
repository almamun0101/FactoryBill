'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Zap, Cpu, BarChart3, Settings, LogOut, Factory, User } from 'lucide-react'

const navItems = [
  { href: '/dashboard/machines', icon: Cpu, label: 'Machines', color: 'text-sky-400' },
  { href: '/dashboard/electricity', icon: Zap, label: 'Electricity', color: 'text-amber-400' },
  { href: '/dashboard/calculation', icon: BarChart3, label: 'Calculation', color: 'text-violet-400' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings', color: 'text-slate-400' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user, profile, logout } = useAuth()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40 border-r border-slate-700/50"
      style={{ background: 'linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)' }}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #818cf8)' }}>
            <Factory size={20} className="text-white" />
          </div>
          <div>
            <div className="font-display font-800 text-white text-sm leading-tight">FactoryBill</div>
            <div className="text-xs text-slate-500">{profile?.factoryName || 'Energy Manager'}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label, color }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                active
                  ? 'bg-sky-500/10 border border-sky-500/30'
                  : 'hover:bg-slate-800/60 border border-transparent'
              }`}>
              <Icon size={18} className={active ? color : 'text-slate-500 group-hover:text-slate-300'} />
              <span className={`text-sm font-medium ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {label}
              </span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-slate-700/50">
        <Link href="/dashboard/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/60 transition-all mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {profile?.displayName || user?.email?.split('@')[0]}
            </div>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
        </Link>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm">
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
