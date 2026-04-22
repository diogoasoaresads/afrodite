'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Header />}
      {!isAdmin && <CartDrawer />}
      {children}
      {!isAdmin && <Footer />}
    </>
  )
}
