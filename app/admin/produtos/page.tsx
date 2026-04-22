import Link from 'next/link'
import Image from 'next/image'
import { getDBProducts } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'
import { formatPrice } from '@/lib/formatters'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'

export default async function AdminProdutos() {
  const dbProducts = await getDBProducts()

  // Combina produtos estáticos (seed) + produtos criados pelo admin
  const allProducts = [
    ...dbProducts,
    ...staticProducts.map(p => ({ ...p, createdAt: '2024-01-01', updatedAt: '2024-01-01', details: p.details })),
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cream font-light">Produtos</h1>
          <p className="text-dark-400 text-sm mt-1">{allProducts.length} produtos cadastrados</p>
        </div>
        <Link href="/admin/produtos/novo" className="btn-gold flex items-center gap-2">
          <Plus size={16} />
          Novo Produto
        </Link>
      </div>

      <div className="bg-dark-800 border border-gold-500/10">
        {allProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={40} className="text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">Nenhum produto ainda.</p>
            <Link href="/admin/produtos/novo" className="btn-gold inline-block mt-6">
              Criar Primeiro Produto
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Produto</th>
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Categoria</th>
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Preço</th>
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {allProducts.map(product => (
                  <tr key={product.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0 bg-dark-700 overflow-hidden">
                          {product.images?.[0] && (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-cream text-sm">{product.name}</p>
                          <p className="text-dark-500 text-xs">{product.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-dark-300 text-sm capitalize">{product.category}</td>
                    <td className="px-4 py-4 text-gold-400 text-sm font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-4 py-4">
                      {product.inStock ? (
                        <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1">Em estoque</span>
                      ) : (
                        <span className="text-red-400 text-xs bg-red-400/10 px-2 py-1">Esgotado</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {product.id.startsWith('db_') ? (
                        <span className="text-blue-400 text-xs">Personalizado</span>
                      ) : (
                        <span className="text-dark-500 text-xs">Padrão</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {product.id.startsWith('db_') && (
                          <>
                            <Link
                              href={`/admin/produtos/${product.id}/editar`}
                              className="p-2 text-dark-400 hover:text-gold-400 transition-colors"
                              title="Editar"
                            >
                              <Pencil size={14} />
                            </Link>
                            <DeleteProductButton id={product.id} />
                          </>
                        )}
                        <Link
                          href={`/produtos/${product.id}`}
                          target="_blank"
                          className="p-2 text-dark-400 hover:text-cream transition-colors text-xs"
                          title="Ver na loja"
                        >
                          Ver →
                        </Link>
                      </div>
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
