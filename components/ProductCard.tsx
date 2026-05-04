'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice, calculateDiscount } from '@/lib/formatters'
import type { Product } from '@/lib/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <Link href={`/produtos/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-dark-800">
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Overlay hover (desktop) */}
          <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end justify-center pb-6">
            <button
              onClick={handleAddToCart}
              className="bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold px-6 py-2.5 text-xs tracking-widest uppercase transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
            >
              Adicionar ao Carrinho
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-gold-500 text-dark-900 text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                Novo
              </span>
            )}
            {product.isSale && product.originalPrice && (
              <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
                -{calculateDiscount(product.originalPrice, product.price)}%
              </span>
            )}
          </div>

          {/* Favoritar — desktop hover */}
          <button
            onClick={e => e.preventDefault()}
            className="absolute top-2 right-2 bg-dark-900/60 backdrop-blur-sm text-dark-200 hover:text-gold-400 p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
            aria-label="Favoritar"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-gold-500 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mb-0.5 font-light">
            {product.material}
          </p>
          <h3 className="font-serif text-cream text-base sm:text-lg font-light group-hover:text-gold-300 transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-2 flex items-end gap-1.5">
            <span className="text-cream font-semibold text-base sm:text-lg">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-dark-400 text-xs sm:text-sm line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <p className="text-dark-400 text-[10px] sm:text-xs mt-0.5 leading-tight">
            12x {formatPrice(product.price / 12)}
          </p>

          {/* Botão "+" visível no mobile */}
          <button
            onClick={handleAddToCart}
            className="sm:hidden mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 bg-gold-500/10 hover:bg-gold-500 border border-gold-500/40 hover:border-gold-500 text-gold-400 hover:text-dark-900 text-[10px] tracking-widest uppercase font-semibold transition-all duration-200"
          >
            <ShoppingBag size={12} />
            Adicionar
          </button>
        </div>
      </div>
    </Link>
  )
}
