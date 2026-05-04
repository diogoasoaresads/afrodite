import Link from 'next/link'
import { getOrderStats, getOrders, getDBProducts } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import { formatPrice } from '@/lib/formatters'
import { TrendingUp, ShoppingCart, CheckCircle, Clock, ArrowRight, Settings, Package, Zap } from 'lucide-react'

export default async function AdminDashboard() {
  const [stats, recentOrders, settings, dbProducts] = await Promise.all([
    getOrderStats(),
    getOrders().then(orders => orders.slice(0, 5)),
    getSettings(),
    getDBProducts(),
  ])

  // Checklist de primeiros passos
  const checklist = [
    {
      done: !!settings.mercadopago.accessToken,
      label: 'Configurar Mercado Pago',
      desc: 'Adicione seu Access Token para receber pagamentos',
      href: '/admin/configuracoes',
    },
    {
      done: !!settings.loja.nome && !!settings.loja.whatsapp,
      label: 'Completar dados da loja',
      desc: 'Nome, WhatsApp, e-mail e cidade da loja',
      href: '/admin/configuracoes',
    },
    {
      done: dbProducts.length > 0,
      label: 'Criar seu primeiro produto',
      desc: 'Adicione produtos com fotos, descrição e preço',
      href: '/admin/produtos/novo',
    },
    {
      done: !!settings.smtp?.notifyEmail,
      label: 'Ativar e-mails de pedido',
      desc: 'Receba alertas quando uma venda for aprovada',
      href: '/admin/configuracoes',
    },
  ]
  const checklistDone = checklist.filter(c => c.done).length
  const allDone = checklistDone === checklist.length

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
      case 'approved': return <span className="text-green-400 text-xs bg-green-400/10 px-2 py-0.5">Aprovado</span>
      case 'pending':  return <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-0.5">Pendente</span>
      case 'rejected': return <span className="text-red-400 text-xs bg-red-400/10 px-2 py-0.5">Recusado</span>
      default:         return <span className="text-dark-400 text-xs">—</span>
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-cream font-light">Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Bem-vinda ao painel da Afrodite Joias</p>
      </div>

      {/* Checklist de primeiros passos */}
      {!allDone && (
        <div className="bg-dark-800 border border-gold-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-gold-400" />
              <h2 className="text-cream text-sm font-semibold tracking-wide">Primeiros Passos</h2>
            </div>
            <span className="text-gold-400 text-xs font-semibold">
              {checklistDone}/{checklist.length} concluídos
            </span>
          </div>

          {/* Barra de progresso */}
          <div className="h-1 bg-dark-700 mb-5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-500 rounded-full"
              style={{ width: `${(checklistDone / checklist.length) * 100}%` }}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {checklist.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-start gap-3 p-3 border transition-colors ${
                  item.done
                    ? 'border-green-500/20 bg-green-500/5 opacity-60 cursor-default pointer-events-none'
                    : 'border-dark-600 hover:border-gold-500/40 hover:bg-dark-700/50'
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${item.done ? 'border-green-500 bg-green-500' : 'border-dark-500'}`}>
                  {item.done && <CheckCircle size={12} className="text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.done ? 'text-dark-400 line-through' : 'text-cream'}`}>
                    {item.label}
                  </p>
                  <p className="text-dark-500 text-xs mt-0.5">{item.desc}</p>
                </div>
                {!item.done && <ArrowRight size={14} className="text-dark-500 mt-0.5 flex-shrink-0" />}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.title} className={`border ${card.bg} p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-dark-400 text-xs tracking-wider uppercase leading-tight">{card.title}</span>
              {card.icon}
            </div>
            <p className="text-cream text-2xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Atalhos rápidos */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: '/admin/produtos/novo', icon: <Package size={16} />, label: 'Novo Produto' },
          { href: '/admin/vendas',        icon: <ShoppingCart size={16} />, label: 'Ver Vendas' },
          { href: '/admin/configuracoes', icon: <Settings size={16} />, label: 'Configurações' },
        ].map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-center gap-2 border border-dark-600 hover:border-gold-500/50 text-dark-300 hover:text-gold-400 py-3 text-xs tracking-wider uppercase transition-colors"
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Últimos pedidos */}
      <div className="bg-dark-800 border border-gold-500/10">
        <div className="px-6 py-4 border-b border-gold-500/10 flex items-center justify-between">
          <h2 className="text-cream text-sm tracking-[0.2em] uppercase">Últimos Pedidos</h2>
          <Link href="/admin/vendas" className="text-gold-400 text-xs hover:underline flex items-center gap-1">
            Ver todos <ArrowRight size={12} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-dark-500 text-sm">
            Nenhum pedido ainda — compartilhe o link da loja!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Data</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 text-dark-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-6 py-4 text-dark-400 text-xs whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-cream text-sm">{order.payer?.name || '—'}</p>
                      <p className="text-dark-500 text-xs">{order.payer?.email || ''}</p>
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
