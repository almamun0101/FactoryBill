'use client'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-sky-400 text-sm animate-pulse">Loading...</div>
    </div>
  )
  if (!user) return null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
