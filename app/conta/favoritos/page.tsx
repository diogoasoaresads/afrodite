'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'
import { useWishlistStore } from '@/lib/store'
import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/products'

export default function FavoritosPage() {
  const { ids } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/produtos')
      .then(r => r.json())
      .then((all: Product[]) => {
        setProducts(all.filter(p => ids.includes(p.id)))
      })
      .finally(() => setLoading(false))
  }, [ids])

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/conta" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl text-cream font-light">Meus Favoritos</h1>
      </div>

      {loading ? (
        <p className="text-dark-400 text-sm animate-pulse">Carregando...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <Heart size={40} className="text-dark-600 mx-auto mb-3" />
          <p className="font-serif text-2xl text-dark-400 font-light">Nenhum favorito ainda</p>
          <p className="text-dark-500 text-sm mt-2">Toque no coração das peças que quiser guardar para depois.</p>
          <Link href="/produtos" className="btn-gold inline-block mt-6">Ver Produtos</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
