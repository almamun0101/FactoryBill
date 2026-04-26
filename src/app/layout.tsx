import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { SettingsProvider } from '@/context/SettingsContext'

export const metadata: Metadata = {
  title: 'FactoryBill — Industrial Energy Manager',
  description: 'Machine billing & electricity management for factories',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
