import Link from 'next/link'
import Image from 'next/image'
import { getDBProducts, getHiddenProductIds } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'
import { formatPrice } from '@/lib/formatters'
import { Plus, Pencil, Package } from 'lucide-react'
import DeleteProductButton from './DeleteProductButton'

export default async function AdminProdutos() {
  const [dbProducts, hidden] = await Promise.all([getDBProducts(), getHiddenProductIds()])
  const hiddenSet = new Set(hidden)
  const dbIds     = new Set(dbProducts.map(p => p.id))

  const allProducts = [
    ...dbProducts.filter(p => !hiddenSet.has(p.id)),
    ...staticProducts
      .filter(p => !dbIds.has(p.id) && !hiddenSet.has(p.id))
      .map(p => ({ ...p, createdAt: '—', updatedAt: '—' })),
  ]

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Produtos</h1>
          <p className="text-[var(--c-muted3)] text-sm mt-1">{allProducts.length} produtos cadastrados</p>
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
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Estoque</th>
                  <th className="text-left px-4 py-3 text-dark-500 text-xs uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-dark-500 text-xs uppercase tracking-wider text-right">Ações</th>
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
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/produtos/${product.id}/editar`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 transition-colors"
                          title="Editar produto"
                        >
                          <Pencil size={12} />
                          Editar
                        </Link>

                        {/* Excluir — disponível para TODOS os produtos */}
                        <DeleteProductButton
                          id={product.id}
                          name={product.name}
                          isStatic={!product.id.startsWith('db_')}
                        />

                        <Link
                          href={`/produtos/${product.id}`}
                          target="_blank"
                          className="px-3 py-1.5 text-xs border border-dark-600 hover:border-dark-400 text-dark-500 hover:text-dark-300 transition-colors"
                          title="Ver na loja"
                        >
                          Ver
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
