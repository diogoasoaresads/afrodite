import { getOrderStats, getOrders } from '@/lib/db'
import { formatPrice } from '@/lib/formatters'
import { TrendingUp, ShoppingCart, Users, Package, Clock, CheckCircle, XCircle } from 'lucide-react'

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getOrderStats(),
    getOrders().then(orders => orders.slice(0, 5)),
  ])

  const cards = [
    {
      title: 'Receita Total',
      value: formatPrice(stats.revenue),
      icon: <TrendingUp size={22} className="text-green-400" />,
      bg: 'bg-green-400/5 border-green-400/20',
    },
    {
      title: 'Pedidos Aprovados',
      value: stats.approved,
      icon: <CheckCircle size={22} className="text-gold-400" />,
      bg: 'bg-gold-400/5 border-gold-400/20',
    },
    {
      title: 'Pedidos Pendentes',
      value: stats.pending,
      icon: <Clock size={22} className="text-blue-400" />,
      bg: 'bg-blue-400/5 border-blue-400/20',
    },
    {
      title: 'Total de Pedidos',
      value: stats.total,
      icon: <ShoppingCart size={22} className="text-purple-400" />,
      bg: 'bg-purple-400/5 border-purple-400/20',
    },
  ]

  const statusLabel = (s?: string) => {
    switch (s) {
      case 'approved': return <span className="text-green-400 text-xs">Aprovado</span>
      case 'pending':  return <span className="text-yellow-400 text-xs">Pendente</span>
      case 'rejected': return <span className="text-red-400 text-xs">Recusado</span>
      default:         return <span className="text-dark-400 text-xs">—</span>
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream font-light">Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Visão geral da Afrodite Joias</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map(card => (
          <div key={card.title} className={`border ${card.bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400 text-xs tracking-wider uppercase">{card.title}</span>
              {card.icon}
            </div>
            <p className="text-cream text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div className="bg-dark-800 border border-gold-500/10">
        <div className="px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
          <h2 className="text-cream text-sm tracking-[0.2em] uppercase">Últimos Pedidos</h2>
          <a href="/admin/vendas" className="text-gold-400 text-xs hover:underline">Ver todos →</a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-dark-500 text-sm">Nenhum pedido ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Data</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Itens</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4 text-dark-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-cream text-sm">{order.payer?.name || '—'}</p>
                      <p className="text-dark-500 text-xs">{order.payer?.email || ''}</p>
                    </td>
                    <td className="px-6 py-4 text-dark-400 text-xs">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
                    </td>
                    <td className="px-6 py-4 text-gold-400 text-sm font-semibold">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      {statusLabel(order.payment_status || order.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
