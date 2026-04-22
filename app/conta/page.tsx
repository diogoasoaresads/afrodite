'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, LogOut, Star } from 'lucide-react'

interface CustomerInfo {
  id: string
  name: string
  email: string
  createdAt: string
}

export default function ContaPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cliente/me')
      .then(r => r.json())
      .then(data => {
        if (!data.customer) {
          router.push('/login')
        } else {
          setCustomer(data.customer)
        }
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/cliente/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-gold-400 text-sm tracking-widest uppercase animate-pulse">Carregando...</div>
      </div>
    )
  }

  if (!customer) return null

  const memberSince = new Date(customer.createdAt).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  })

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="py-10 animate-fade-in">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
              <span className="font-serif text-2xl text-gold-400">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">
                Olá, {customer.name.split(' ')[0]}
              </h1>
              <p className="text-dark-400 text-sm mt-1">Membro desde {memberSince}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-dark-400 hover:text-red-400 text-sm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: <User size={22} className="text-gold-400" />, label: 'Dados Pessoais', value: customer.email },
            { icon: <ShoppingBag size={22} className="text-gold-400" />, label: 'Meus Pedidos', value: 'Ver histórico' },
            { icon: <Star size={22} className="text-gold-400" />, label: 'Favoritos', value: 'Minhas listas' },
          ].map(card => (
            <div key={card.label} className="bg-dark-800 border border-gold-500/10 p-5 flex items-start gap-4">
              <div className="mt-0.5">{card.icon}</div>
              <div>
                <p className="text-dark-400 text-xs tracking-wider uppercase">{card.label}</p>
                <p className="text-cream text-sm mt-1 truncate">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dados da conta */}
        <div className="bg-dark-800 border border-gold-500/10 p-6">
          <h2 className="text-[var(--c-text)] text-sm tracking-[0.3em] uppercase mb-6 pb-3 border-b border-gold-500/10">
            Minha Conta
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-dark-700">
              <div>
                <p className="text-dark-400 text-xs tracking-wider uppercase">Nome</p>
                <p className="text-cream text-sm mt-1">{customer.name}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-dark-700">
              <div>
                <p className="text-dark-400 text-xs tracking-wider uppercase">E-mail</p>
                <p className="text-cream text-sm mt-1">{customer.email}</p>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <p className="text-dark-400 text-xs tracking-wider uppercase">Cliente desde</p>
                <p className="text-cream text-sm mt-1">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/produtos" className="btn-gold">
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
