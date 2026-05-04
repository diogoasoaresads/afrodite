'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, ShoppingBag, LogOut, Star, Package, Truck, CheckCircle, Clock, X as XIcon } from 'lucide-react'
import { formatPrice } from '@/lib/formatters'

interface CustomerInfo {
  id: string
  name: string
  email: string
  createdAt: string
}

interface Order {
  id: string
  created_at: string
  total: number
  payment_status?: string
  status: string
  shipping_status?: 'pending' | 'shipped' | 'delivered'
  tracking_code?: string
  items: { title: string; quantity: number; unit_price: number }[]
}

function statusInfo(o: Order) {
  const s = o.payment_status || o.status
  if (s === 'approved') {
    if (o.shipping_status === 'delivered') return { label: 'Entregue',  color: 'text-green-400',  icon: <CheckCircle size={14} /> }
    if (o.shipping_status === 'shipped')   return { label: 'Enviado',   color: 'text-blue-400',   icon: <Truck size={14} /> }
    return { label: 'Pago — em preparação',  color: 'text-gold-400', icon: <Package size={14} /> }
  }
  if (s === 'pending')  return { label: 'Aguardando pagamento', color: 'text-yellow-400', icon: <Clock size={14} /> }
  if (s === 'rejected') return { label: 'Pagamento recusado',   color: 'text-red-400',    icon: <XIcon size={14} /> }
  return { label: 'Em processamento', color: 'text-dark-400', icon: <Clock size={14} /> }
}

export default function ContaPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cliente/me')
      .then(r => r.json())
      .then(data => {
        if (!data.customer) {
          router.push('/login')
          return
        }
        setCustomer(data.customer)
        return fetch('/api/cliente/pedidos').then(r => r.json())
      })
      .then(data => {
        if (data?.orders) setOrders(data.orders)
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

  const memberSince = new Date(customer.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const totalSpent = orders
    .filter(o => (o.payment_status || o.status) === 'approved')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="py-8 sm:py-10 animate-fade-in">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between mb-8 sm:mb-10 gap-4">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
              <span className="font-serif text-xl sm:text-2xl text-gold-400">{customer.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl text-[var(--c-text)] font-light truncate">
                Olá, {customer.name.split(' ')[0]}
              </h1>
              <p className="text-dark-400 text-xs sm:text-sm mt-1">Membro desde {memberSince}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-dark-400 hover:text-red-400 text-sm transition-colors flex-shrink-0">
            <LogOut size={16} />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="bg-dark-800 border border-gold-500/10 p-4">
            <p className="text-dark-400 text-[10px] sm:text-xs tracking-wider uppercase mb-1">Pedidos</p>
            <p className="text-cream text-2xl font-semibold">{orders.length}</p>
          </div>
          <div className="bg-dark-800 border border-gold-500/10 p-4">
            <p className="text-dark-400 text-[10px] sm:text-xs tracking-wider uppercase mb-1">Total Gasto</p>
            <p className="text-gold-400 text-base sm:text-lg font-semibold leading-tight">{formatPrice(totalSpent)}</p>
          </div>
          <Link href="/conta/favoritos" className="bg-dark-800 border border-gold-500/10 hover:border-gold-500/30 p-4 transition-colors">
            <p className="text-dark-400 text-[10px] sm:text-xs tracking-wider uppercase mb-1">Favoritos</p>
            <p className="text-cream text-base sm:text-lg font-semibold leading-tight">Ver lista</p>
          </Link>
        </div>

        {/* Pedidos */}
        <div className="bg-dark-800 border border-gold-500/10 mb-6">
          <div className="px-5 sm:px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
            <h2 className="text-cream text-xs sm:text-sm tracking-[0.2em] uppercase">Meus Pedidos</h2>
            <span className="text-gold-400 text-xs">{orders.length} no total</span>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center px-6">
              <ShoppingBag size={36} className="text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">Você ainda não fez nenhum pedido.</p>
              <Link href="/produtos" className="btn-gold inline-block mt-5">Ver Produtos</Link>
            </div>
          ) : (
            <ul className="divide-y divide-dark-700">
              {orders.map(order => {
                const info = statusInfo(order)
                return (
                  <li key={order.id} className="px-5 sm:px-6 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-dark-400 text-xs">
                          Pedido #{order.id} · {new Date(order.created_at).toLocaleDateString('pt-BR')}
                        </p>
                        <div className={`flex items-center gap-1.5 mt-1 ${info.color} text-xs sm:text-sm font-medium`}>
                          {info.icon}
                          {info.label}
                        </div>
                      </div>
                      <p className="text-gold-400 text-base sm:text-lg font-semibold whitespace-nowrap">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <ul className="space-y-0.5 mb-2">
                      {order.items?.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-dark-300 text-xs">{item.quantity}× {item.title}</li>
                      ))}
                      {(order.items?.length || 0) > 3 && (
                        <li className="text-dark-500 text-xs">+{order.items.length - 3} item(ns)</li>
                      )}
                    </ul>

                    {order.tracking_code && order.shipping_status === 'shipped' && (
                      <a href={`https://rastreamento.correios.com.br/app/index.php?objetos=${order.tracking_code}`}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs mt-1 hover:underline">
                        <Truck size={12} /> Rastrear: {order.tracking_code}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Dados pessoais */}
        <div className="bg-dark-800 border border-gold-500/10 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gold-500/10">
            <h2 className="text-cream text-xs sm:text-sm tracking-[0.2em] uppercase">Minha Conta</h2>
            <Link href="/conta/perfil" className="text-gold-400 text-xs hover:underline">Editar</Link>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-dark-400 text-[10px] tracking-wider uppercase">Nome</p>
              <p className="text-cream mt-0.5">{customer.name}</p>
            </div>
            <div>
              <p className="text-dark-400 text-[10px] tracking-wider uppercase">E-mail</p>
              <p className="text-cream mt-0.5">{customer.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
