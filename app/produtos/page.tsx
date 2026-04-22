'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X } from 'lucide-react'
import { products, categories, type Category } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import { Suspense } from 'react'

function ProdutosContent() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get('categoria') as Category | null

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(categoriaParam)
  const [sortBy, setSortBy] = useState<string>('featured')
  const [filterOpen, setFilterOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }
    switch (sortBy) {
      case 'price-asc':   return result.sort((a, b) => a.price - b.price)
      case 'price-desc':  return result.sort((a, b) => b.price - a.price)
      case 'new':         return result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      default:            return result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [selectedCategory, sortBy])

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="text-center py-12">
        <p className="text-gold-500 text-xs tracking-[0.5em] uppercase mb-3">
          {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'Todas as Peças'}
        </p>
        <h1 className="section-title">Nossa Coleção</h1>
        <span className="gold-line" />
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gold-500/10">
        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-200 border ${
              !selectedCategory
                ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                : 'border-dark-600 text-dark-300 hover:border-gold-500 hover:text-gold-400'
            }`}
          >
            Todas
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as Category)}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-all duration-200 border ${
                selectedCategory === cat.id
                  ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                  : 'border-dark-600 text-dark-300 hover:border-gold-500 hover:text-gold-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Ordenar */}
        <div className="flex items-center gap-3">
          <span className="text-dark-400 text-xs uppercase tracking-widest hidden sm:block">Ordenar:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-dark-800 border border-dark-600 text-cream text-sm px-4 py-2 focus:border-gold-500 outline-none cursor-pointer"
          >
            <option value="featured">Em Destaque</option>
            <option value="new">Mais Novos</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
          </select>
        </div>
      </div>

      {/* Contagem */}
      <p className="text-dark-400 text-sm mb-8">
        {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="ml-3 inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 transition-colors"
          >
            <X size={12} />
            Limpar filtro
          </button>
        )}
      </p>

      {/* Grid de Produtos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="font-serif text-3xl text-dark-500 font-light">Nenhuma joia encontrada</p>
          <p className="text-dark-600 mt-3">Tente outro filtro ou veja toda a coleção.</p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="btn-gold mt-8 inline-block"
          >
            Ver Todas
          </button>
        </div>
      )}
    </div>
  )
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center"><div className="text-gold-400 text-sm tracking-widest uppercase animate-pulse">Carregando...</div></div>}>
      <ProdutosContent />
    </Suspense>
  )
}
