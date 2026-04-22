import type { Metadata } from 'next'
import '../globals.css'
import AdminSidebar from './components/AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — Afrodite Joias',
  robots: 'noindex,nofollow',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen bg-dark-900">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
