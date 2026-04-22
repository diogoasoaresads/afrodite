import { getOrders } from '@/lib/db'
import { formatPrice } from '@/lib/formatters'

export default async function AdminVendas() {
  const orders = await getOrders()

  const statusLabel = (s?: string) => {
    switch (s) {
      case 'approved': return <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1">Aprovado</span>
      case 'pending':  return <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1">Pendente</span>
      case 'rejected': return <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1">Recusado</span>
      default:         return <span className="text-dark-400 text-xs bg-dark-700 px-2 py-1">—</span>
    }
  }

  const methodLabel = (m?: string) => {
    if (!m) return '—'
    if (m.includes('pix')) return 'PIX'
    if (m.includes('credit')) return 'Cartão de Crédito'
    if (m.includes('debit')) return 'Débito'
    if (m.includes('ticket')) return 'Boleto'
    return m
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream font-light">Vendas</h1>
        <p className="text-dark-400 text-sm mt-1">{orders.length} pedidos no total</p>
      </div>

      <div className="bg-dark-800 border border-gold-500/10">
        {orders.length === 0 ? (
          <div className="py-20 text-center text-dark-500 text-sm">
            Nenhum pedido registrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {['Data', 'Cliente', 'E-mail', 'Itens', 'Pagamento', 'Total', 'Status'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-4 text-dark-400 text-xs whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('pt-BR')}<br />
                      <span className="text-dark-600">{new Date(order.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="px-4 py-4 text-cream text-sm">{order.payer?.name || '—'}</td>
                    <td className="px-4 py-4 text-dark-400 text-xs">{order.payer?.email || '—'}</td>
                    <td className="px-4 py-4">
                      <div className="space-y-0.5">
                        {order.items?.slice(0, 2).map((item, i) => (
                          <p key={i} className="text-dark-300 text-xs">{item.quantity}× {item.title}</p>
                        ))}
                        {(order.items?.length || 0) > 2 && (
                          <p className="text-dark-500 text-xs">+{order.items.length - 2} mais</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-dark-400 text-xs">
                      {methodLabel(order.payment_method)}
                    </td>
                    <td className="px-4 py-4 text-gold-400 text-sm font-semibold whitespace-nowrap">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-4">
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
