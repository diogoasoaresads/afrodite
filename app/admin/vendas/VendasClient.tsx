'use client'

import { useState, useMemo } from 'react'
import { formatPrice } from '@/lib/formatters'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Order {
  id: string
  preference_id?: string
  payment_id?: string
  payment_status?: string
  payment_method?: string
  items: { id: string; title: string; quantity: number; unit_price: number }[]
  payer: { name: string; email: string; identification?: { type: string; number: string } }
  total: number
  status: string
  created_at: string
  updated_at?: string
}

const STATUS_OPTS = [
  { value: 'all',      label: 'Todos' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'pending',  label: 'Pendentes' },
  { value: 'rejected', label: 'Recusados' },
]

function statusBadge(s?: string) {
  switch (s) {
    case 'approved': return <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 whitespace-nowrap">✓ Aprovado</span>
    case 'pending':  return <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 whitespace-nowrap">⏳ Pendente</span>
    case 'rejected': return <span className="text-red-400 text-xs bg-red-400/10 px-2 py-0.5 whitespace-nowrap">✕ Recusado</span>
    default:         return <span className="text-dark-400 text-xs bg-dark-700 px-2 py-0.5">—</span>
  }
}

function methodLabel(m?: string) {
  if (!m) return '—'
  if (m.includes('pix')) return 'PIX'
  if (m.includes('credit')) return 'Cartão de Crédito'
  if (m.includes('debit')) return 'Débito'
  if (m.includes('ticket')) return 'Boleto'
  return m
}

export default function VendasClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = orders
    if (filter !== 'all') {
      list = list.filter(o => (o.payment_status || o.status) === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.payer?.name?.toLowerCase().includes(q) ||
        o.payer?.email?.toLowerCase().includes(q) ||
        o.id.includes(q)
      )
    }
    return list
  }, [orders, filter, search])

  const total = filtered.reduce((s, o) =>
    (o.payment_status || o.status) === 'approved' ? s + o.total : s, 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-cream font-light">Vendas</h1>
          <p className="text-dark-400 text-sm mt-1">
            {filtered.length} pedido{filtered.length !== 1 ? 's' : ''}
            {filter === 'approved' && ` · ${formatPrice(total)} aprovados`}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail ou ID..."
          className="bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-2.5 text-sm outline-none transition-colors flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors whitespace-nowrap ${
                filter === opt.value
                  ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                  : 'border-dark-600 text-dark-400 hover:border-gold-500/50 hover:text-cream'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-dark-800 border border-gold-500/10">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-dark-500 text-sm">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {['Data', 'Cliente', 'Itens', 'Pagamento', 'Total', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <>
                    <tr
                      key={order.id}
                      className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                    >
                      <td className="px-4 py-4 text-dark-400 text-xs whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString('pt-BR')}<br />
                        <span className="text-dark-600">{new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-cream text-sm">{order.payer?.name || '—'}</p>
                        <p className="text-dark-400 text-xs">{order.payer?.email || ''}</p>
                      </td>
                      <td className="px-4 py-4 text-dark-400 text-xs whitespace-nowrap">
                        {order.items?.length || 0} iten{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </td>
                      <td className="px-4 py-4 text-dark-400 text-xs">{methodLabel(order.payment_method)}</td>
                      <td className="px-4 py-4 text-gold-400 text-sm font-semibold whitespace-nowrap">{formatPrice(order.total)}</td>
                      <td className="px-4 py-4">{statusBadge(order.payment_status || order.status)}</td>
                      <td className="px-4 py-4 text-dark-500">
                        {expanded === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </td>
                    </tr>

                    {/* Detalhes expandidos */}
                    {expanded === order.id && (
                      <tr key={`${order.id}-detail`} className="border-b border-dark-700/50 bg-dark-700/20">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-dark-500 text-xs uppercase tracking-wider mb-2">Itens do Pedido</p>
                              <ul className="space-y-1.5">
                                {order.items?.map((item, i) => (
                                  <li key={i} className="flex justify-between text-sm">
                                    <span className="text-dark-300">{item.quantity}× {item.title}</span>
                                    <span className="text-gold-400 font-semibold">{formatPrice(item.unit_price * item.quantity)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <p className="text-dark-500 text-xs uppercase tracking-wider mb-2">Detalhes</p>
                              {order.payer?.identification?.number && (
                                <p className="text-xs text-dark-400">CPF: {order.payer.identification.number}</p>
                              )}
                              {order.payment_id && (
                                <p className="text-xs text-dark-400">ID Pagamento: {order.payment_id}</p>
                              )}
                              <p className="text-xs text-dark-400">ID Pedido: #{order.id}</p>
                              {order.updated_at && (
                                <p className="text-xs text-dark-400">
                                  Atualizado: {new Date(order.updated_at).toLocaleDateString('pt-BR')}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
