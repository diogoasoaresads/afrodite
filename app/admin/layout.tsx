import type { Metadata } from 'next'
import AdminSidebar from './components/AdminSidebar'
import { ToastProvider } from '@/lib/toast-context'

export const metadata: Metadata = {
  title: 'Admin — Afrodite Joias',
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: 'var(--c-bg)' }}>
        <AdminSidebar />
        <main className="flex-1 overflow-auto min-h-screen">
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
