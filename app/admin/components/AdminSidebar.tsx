'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, ExternalLink, Tag, BarChart2 } from 'lucide-react'

const links = [
  { href: '/admin',               icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { href: '/admin/produtos',      icon: <Package size={18} />,         label: 'Produtos' },
  { href: '/admin/vendas',        icon: <ShoppingCart size={18} />,    label: 'Vendas' },
  { href: '/admin/clientes',      icon: <Users size={18} />,           label: 'Clientes' },
  { href: '/admin/cupons',        icon: <Tag size={18} />,             label: 'Cupons' },
  { href: '/admin/relatorios',    icon: <BarChart2 size={18} />,       label: 'Relatórios' },
  { href: '/admin/configuracoes', icon: <Settings size={18} />,        label: 'Configurações' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className="w-56 min-h-screen bg-dark-800 border-r border-gold-500/10 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-gold-500/10">
        <span className="font-serif text-xl text-cream tracking-[0.2em]">AFRODITE</span>
        <p className="text-gold-500 text-[9px] tracking-[0.4em] uppercase mt-0.5">admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 rounded-sm ${
              isActive(link.href)
                ? 'bg-gold-500/10 text-gold-400 border-l-2 border-gold-500'
                : 'text-dark-300 hover:text-cream hover:bg-dark-700'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 border-t border-gold-500/10 pt-4 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-2.5 text-xs text-dark-400 hover:text-gold-400 transition-colors rounded-sm hover:bg-dark-700"
        >
          <ExternalLink size={14} />
          Ver Loja
        </Link>

        {/* Logout — bem visível */}
        <form action="/api/admin/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium w-full rounded-sm
                       text-red-400 bg-red-400/5 hover:bg-red-400/15 border border-red-400/20 hover:border-red-400/40
                       transition-all duration-200"
          >
            <LogOut size={14} />
            Sair da Conta
          </button>
        </form>
      </div>
    </aside>
  )
}
