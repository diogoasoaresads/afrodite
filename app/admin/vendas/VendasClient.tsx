'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/formatters'
import { ChevronDown, ChevronUp, Truck, Package, CheckCircle, Loader2, Download } from 'lucide-react'
import { useToast } from '@/lib/toast-context'

interface Order {
  id: string
  preference_id?: string
  payment_id?: string
  payment_status?: string
  payment_method?: string
  items: { id: string; title: string; quantity: number; unit_price: number }[]
  payer: { name: string; email: string; identification?: { type: string; number: string } }
  shipping_address?: any
  shipping_status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  tracking_code?: string
  shipped_at?: string
  delivered_at?: string
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

function paymentBadge(s?: string) {
  switch (s) {
    case 'approved': return <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 whitespace-nowrap">✓ Aprovado</span>
    case 'pending':  return <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 whitespace-nowrap">⏳ Pendente</span>
    case 'rejected': return <span className="text-red-400 text-xs bg-red-400/10 px-2 py-0.5 whitespace-nowrap">✕ Recusado</span>
    default:         return <span className="text-dark-400 text-xs bg-dark-700 px-2 py-0.5">—</span>
  }
}

function shippingBadge(s?: string) {
  switch (s) {
    case 'shipped':   return <span className="text-blue-400  text-xs bg-blue-400/10 px-2 py-0.5 inline-flex items-center gap-1"><Truck size={11} /> Enviado</span>
    case 'delivered': return <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5 inline-flex items-center gap-1"><CheckCircle size={11} /> Entregue</span>
    default:          return <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5 inline-flex items-center gap-1"><Package size={11} /> Aguardando envio</span>
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

export default function VendasClient({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [savingShip, setSavingShip] = useState<string | null>(null)
  const [draftTracking, setDraftTracking] = useState<Record<string, string>>({})
  const { showToast } = useToast()
  const router = useRouter()

  const filtered = useMemo(() => {
    let list = orders
    if (filter !== 'all') list = list.filter(o => (o.payment_status || o.status) === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.payer?.name?.toLowerCase().includes(q) ||
        o.payer?.email?.toLowerCase().includes(q) ||
        o.id.includes(q) || o.tracking_code?.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, filter, search])

  const total = filtered.reduce((s, o) => (o.payment_status || o.status) === 'approved' ? s + o.total : s, 0)

  const updateShipping = async (orderId: string, status: 'shipped' | 'delivered' | 'pending', tracking?: string) => {
    setSavingShip(orderId)
    try {
      const res = await fetch(`/api/admin/pedidos/${orderId}/shipping`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipping_status: status, tracking_code: tracking }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data.order } : o))
      showToast(
        status === 'shipped'   ? 'Pedido marcado como enviado — cliente notificado por e-mail!' :
        status === 'delivered' ? 'Pedido marcado como entregue!' :
                                 'Status atualizado'
      )
      router.refresh()
    } catch {
      showToast('Erro ao atualizar', 'error')
    } finally {
      setSavingShip(null)
    }
  }

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
        <a href="/api/admin/exportar/pedidos" download
          className="flex items-center gap-2 px-4 py-2 border border-dark-600 hover:border-gold-500 text-dark-400 hover:text-gold-400 text-xs transition-colors whitespace-nowrap">
          <Download size={14} /> Exportar CSV
        </a>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail, código de rastreio..."
          className="bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-2.5 text-sm outline-none transition-colors flex-1" />
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTS.map(opt => (
            <button key={opt.value} onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors whitespace-nowrap ${
                filter === opt.value
                  ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                  : 'border-dark-600 text-dark-400 hover:border-gold-500/50 hover:text-cream'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-dark-800 border border-gold-500/10">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-dark-500 text-sm">Nenhum pedido encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {['Data', 'Cliente', 'Itens', 'Pagto', 'Total', 'Status', 'Envio', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const isApproved = (order.payment_status || order.status) === 'approved'
                  const isOpen = expanded === order.id
                  return (
                    <>
                      <tr key={order.id}
                        className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors cursor-pointer"
                        onClick={() => setExpanded(isOpen ? null : order.id)}>
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
                        <td className="px-4 py-4">{paymentBadge(order.payment_status || order.status)}</td>
                        <td className="px-4 py-4">{isApproved ? shippingBadge(order.shipping_status) : <span className="text-dark-600 text-xs">—</span>}</td>
                        <td className="px-4 py-4 text-dark-500">{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</td>
                      </tr>

                      {isOpen && (
                        <tr key={`${order.id}-detail`} className="border-b border-dark-700/50 bg-dark-700/20">
                          <td colSpan={8} className="px-6 py-5">
                            <div className="grid lg:grid-cols-2 gap-6">
                              {/* Detalhes */}
                              <div>
                                <p className="text-dark-500 text-xs uppercase tracking-wider mb-2">Itens do Pedido</p>
                                <ul className="space-y-1.5 mb-4">
                                  {order.items?.map((item, i) => (
                                    <li key={i} className="flex justify-between text-sm">
                                      <span className="text-dark-300">{item.quantity}× {item.title}</span>
                                      <span className="text-gold-400 font-semibold">{formatPrice(item.unit_price * item.quantity)}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="space-y-1 text-xs text-dark-400 border-t border-dark-700 pt-3">
                                  {order.payer?.identification?.number && <p>CPF: {order.payer.identification.number}</p>}
                                  {order.payment_id && <p>ID Pagamento: {order.payment_id}</p>}
                                  <p>ID Pedido: #{order.id}</p>
                                </div>
                              </div>

                              {/* Painel de envio */}
                              {isApproved && (
                                <div className="bg-dark-800 border border-gold-500/10 p-4">
                                  <p className="text-dark-500 text-xs uppercase tracking-wider mb-3">Gerenciar Envio</p>

                                  <div className="mb-3">
                                    <label className="block text-dark-400 text-xs mb-1.5">Código de Rastreio (Correios)</label>
                                    <input type="text"
                                      value={draftTracking[order.id] ?? order.tracking_code ?? ''}
                                      onChange={e => setDraftTracking(prev => ({ ...prev, [order.id]: e.target.value.toUpperCase() }))}
                                      onClick={e => e.stopPropagation()}
                                      placeholder="AB123456789BR"
                                      className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream px-3 py-2 text-sm outline-none uppercase" />
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={e => { e.stopPropagation(); updateShipping(order.id, 'shipped', draftTracking[order.id] ?? order.tracking_code) }}
                                      disabled={savingShip === order.id || (!draftTracking[order.id] && !order.tracking_code) || order.shipping_status === 'shipped'}
                                      className="flex items-center gap-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-blue-300 hover:text-blue-200 px-3 py-2 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                      {savingShip === order.id ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />}
                                      Marcar Enviado
                                    </button>
                                    <button
                                      onClick={e => { e.stopPropagation(); updateShipping(order.id, 'delivered') }}
                                      disabled={savingShip === order.id || order.shipping_status === 'delivered'}
                                      className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-green-300 hover:text-green-200 px-3 py-2 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                      <CheckCircle size={12} /> Entregue
                                    </button>
                                    {order.tracking_code && (
                                      <a href={`https://rastreamento.correios.com.br/app/index.php?objetos=${order.tracking_code}`}
                                        target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                                        className="flex items-center gap-1.5 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-3 py-2 text-xs transition-colors">
                                        Rastrear
                                      </a>
                                    )}
                                  </div>

                                  {order.shipped_at && (
                                    <p className="text-dark-500 text-xs mt-3">Enviado em {new Date(order.shipped_at).toLocaleDateString('pt-BR')}</p>
                                  )}
                                  {order.delivered_at && (
                                    <p className="text-green-500 text-xs">Entregue em {new Date(order.delivered_at).toLocaleDateString('pt-BR')}</p>
                                  )}

                                  <p className="text-dark-500 text-[10px] mt-3 leading-relaxed">
                                    💡 Ao marcar como enviado com um código de rastreio, o cliente recebe e-mail automático com o link dos Correios.
                                  </p>
                                </div>
                              )}

                              {!isApproved && (
                                <div className="bg-dark-800 border border-dark-700 p-4 text-dark-500 text-xs">
                                  Aguardando confirmação do pagamento para gerenciar envio.
                                </div>
                              )}
                            </div>
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
