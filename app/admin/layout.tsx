import type { Metadata } from 'next'
import AdminSidebar from './components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — Afrodite Joias',
  robots: 'noindex,nofollow',
}

// Layout do admin não tem <html>/<body> — herda do root layout
// O ConditionalShell no root layout já omite Header/Footer para /admin
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--c-bg)' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  )
}
