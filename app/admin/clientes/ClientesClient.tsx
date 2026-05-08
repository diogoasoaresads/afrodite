'use client'

import { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/formatters'
import { Users, ChevronDown, ChevronUp, Download } from 'lucide-react'

interface Customer {
  email: string; name: string; cpf: string
  orderCount: number; totalSpent: number; lastOrder: string
}
interface Order {
  id: string; payer: { name: string; email: string }
  items: { title: string; quantity: number; unit_price: number }[]
  total: number; payment_status?: string; status: string; created_at: string
}

function statusBadge(s?: string) {
  switch (s) {
    case 'approved': return <span className="text-green-400 text-xs">✓ Aprovado</span>
    case 'pending':  return <span className="text-yellow-400 text-xs">⏳ Pendente</span>
    case 'rejected': return <span className="text-red-400 text-xs">✕ Recusado</span>
    default:         return <span className="text-dark-500 text-xs">—</span>
  }
}

export default function ClientesClient({ customers, orders }: { customers: Customer[]; orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return customers
    const q = search.toLowerCase()
    return customers.filter(c =>
      c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }, [customers, search])

  const ordersByEmail = useMemo(() => {
    const map = new Map<string, Order[]>()
    for (const o of orders) {
      if (!o.payer?.email) continue
      if (!map.has(o.payer.email)) map.set(o.payer.email, [])
      map.get(o.payer.email)!.push(o)
    }
    return map
  }, [orders])

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-cream font-light">Clientes</h1>
          <p className="text-dark-400 text-sm mt-1">{filtered.length} cliente{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <a href="/api/admin/exportar/clientes" download
            className="flex items-center gap-2 px-4 py-2 border border-dark-600 hover:border-gold-500 text-dark-400 hover:text-gold-400 text-xs transition-colors whitespace-nowrap">
            <Download size={14} /> Exportar CSV
          </a>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-2.5 text-sm outline-none transition-colors sm:w-72"
          />
        </div>
      </div>

      <div className="bg-dark-800 border border-gold-500/10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 text-sm">
              {search ? 'Nenhum cliente encontrado.' : 'Os clientes aparecem aqui conforme os pedidos forem feitos.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {['Cliente', 'E-mail', 'Pedidos', 'Gasto Total', 'Último Pedido', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(customer => {
                  const customerOrders = ordersByEmail.get(customer.email) || []
                  const isOpen = expanded === customer.email

                  return (
                    <>
                      <tr
                        key={customer.email}
                        className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors cursor-pointer"
                        onClick={() => setExpanded(isOpen ? null : customer.email)}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-semibold flex-shrink-0">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-cream text-sm">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-dark-400 text-xs">{customer.email}</td>
                        <td className="px-4 py-4 text-dark-300 text-sm">{customer.orderCount}</td>
                        <td className="px-4 py-4 text-gold-400 text-sm font-semibold">{formatPrice(customer.totalSpent)}</td>
                        <td className="px-4 py-4 text-dark-400 text-xs">
                          {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-4 text-dark-500">
                          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </td>
                      </tr>

                      {/* Histórico de pedidos */}
                      {isOpen && (
                        <tr key={`${customer.email}-hist`} className="border-b border-dark-700/50 bg-dark-700/20">
                          <td colSpan={6} className="px-6 py-4">
                            <p className="text-dark-500 text-xs uppercase tracking-wider mb-3">Histórico de Pedidos</p>
                            {customerOrders.length === 0 ? (
                              <p className="text-dark-500 text-sm">Nenhum pedido registrado.</p>
                            ) : (
                              <div className="space-y-2">
                                {customerOrders.map(order => (
                                  <div key={order.id} className="flex items-start justify-between gap-4 p-3 bg-dark-800 border border-dark-700">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-dark-400 text-xs mb-1">
                                        {new Date(order.created_at).toLocaleDateString('pt-BR')} · #{order.id}
                                      </p>
                                      <div className="space-y-0.5">
                                        {order.items?.slice(0, 3).map((item, i) => (
                                          <p key={i} className="text-dark-300 text-xs">{item.quantity}× {item.title}</p>
                                        ))}
                                        {(order.items?.length || 0) > 3 && (
                                          <p className="text-dark-500 text-xs">+{order.items.length - 3} mais</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-gold-400 text-sm font-semibold">{formatPrice(order.total)}</p>
                                      <div className="mt-1">{statusBadge(order.payment_status || order.status)}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
