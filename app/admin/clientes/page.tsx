import { getCustomers } from '@/lib/db'
import { formatPrice } from '@/lib/formatters'
import { Users } from 'lucide-react'

export default async function AdminClientes() {
  const customers = await getCustomers()

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-cream font-light">Clientes</h1>
        <p className="text-dark-400 text-sm mt-1">{customers.length} clientes cadastrados</p>
      </div>

      <div className="bg-dark-800 border border-gold-500/10">
        {customers.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400 text-sm">Nenhum cliente ainda. Os clientes aparecerão aqui conforme os pedidos forem feitos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  {['Cliente', 'E-mail', 'CPF', 'Pedidos', 'Gasto Total', 'Último Pedido'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {customers.map(customer => (
                  <tr key={customer.email} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm font-semibold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-cream text-sm">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-dark-400 text-xs">{customer.email}</td>
                    <td className="px-4 py-4 text-dark-400 text-xs">
                      {customer.cpf ? `${customer.cpf.slice(0, 3)}.***.***-${customer.cpf.slice(-2)}` : '—'}
                    </td>
                    <td className="px-4 py-4 text-dark-300 text-sm">{customer.orderCount}</td>
                    <td className="px-4 py-4 text-gold-400 text-sm font-semibold">
                      {formatPrice(customer.totalSpent)}
                    </td>
                    <td className="px-4 py-4 text-dark-400 text-xs">
                      {new Date(customer.lastOrder).toLocaleDateString('pt-BR')}
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
