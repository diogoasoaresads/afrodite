'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Menu, X, Sun, Moon, User } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useTheme } from '@/lib/theme'
import SearchModal from './SearchModal'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { getTotalItems, toggleCart } = useCartStore()
  const { theme, toggle: toggleTheme } = useTheme()
  const totalItems = getTotalItems()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/produtos',                     label: 'Todos' },
    { href: '/produtos?categoria=aneis',     label: 'Anéis' },
    { href: '/produtos?categoria=colares',   label: 'Colares' },
    { href: '/produtos?categoria=brincos',   label: 'Brincos' },
    { href: '/produtos?categoria=pulseiras', label: 'Pulseiras' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[var(--c-bg)]/95 backdrop-blur-md border-b border-gold-500/20 py-3 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start">
            <span className="font-serif text-2xl md:text-3xl text-[var(--c-text)] tracking-[0.2em] font-light leading-none">
              AFRODITE
            </span>
            <span className="text-gold-400 text-[9px] tracking-[0.4em] uppercase font-sans font-light">
              joias
            </span>
          </Link>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[var(--c-nav)] hover:text-gold-400 text-sm tracking-widest uppercase font-light transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-[var(--c-nav)] hover:text-gold-400 transition-colors"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>

            {/* Conta do cliente */}
            <Link
              href="/conta"
              className="text-[var(--c-nav)] hover:text-gold-400 transition-colors"
              aria-label="Minha conta"
              title="Minha conta"
            >
              <User size={20} />
            </Link>

            {/* Botão Tema */}
            <button
              onClick={toggleTheme}
              className="text-[var(--c-nav)] hover:text-gold-400 transition-colors p-1"
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {/* Carrinho */}
            <button
              onClick={toggleCart}
              className="relative text-[var(--c-nav)] hover:text-gold-400 transition-colors"
              aria-label="Carrinho"
            >
              <ShoppingBag size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-gold-500 text-dark-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[var(--c-nav)] hover:text-gold-400 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Modal de busca */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

      {/* Menu Mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--c-bg)]/98 backdrop-blur-md flex flex-col items-center justify-center gap-8 animate-fade-in">
          <Link
            href="/"
            className="font-serif text-3xl text-[var(--c-text)] tracking-[0.2em]"
            onClick={() => setMenuOpen(false)}
          >
            AFRODITE
          </Link>
          <div className="w-8 h-px bg-gold-500" />
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[var(--c-text)] hover:text-gold-400 text-xl tracking-widest uppercase font-light transition-colors opacity-80 hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
          <button onClick={toggleTheme} className="text-[var(--c-muted2)] hover:text-gold-400 flex items-center gap-2 text-sm mt-2">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          </button>
        </div>
      )}
    </>
  )
}
