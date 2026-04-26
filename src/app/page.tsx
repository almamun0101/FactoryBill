'use client'
import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      router.push(user ? '/dashboard/machines' : '/login')
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-sky-400 text-sm animate-pulse font-mono">Initializing...</div>
    </div>
  )
}
