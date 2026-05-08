'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, Heart, Shield, Truck, RefreshCcw, ChevronRight, Minus, Plus } from 'lucide-react'
import { categories } from '@/lib/products'
import { formatPrice, formatInstallments } from '@/lib/formatters'
import { useCartStore, useWishlistStore } from '@/lib/store'
import ProductCard from '@/components/ProductCard'
import SizeGuideModal from '@/components/SizeGuideModal'
import type { Product } from '@/lib/products'

interface Props {
  product: Product
  related: Product[]
}

export default function ProductPageClient({ product, related }: Props) {
  const catLabel = categories.find(c => c.id === product.category)?.label || ''

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const { addItem } = useCartStore()
  const { ids: wishIds, toggle: toggleWish } = useWishlistStore()
  const isFav = wishIds.includes(product.id)

  const sizes = ['12', '13', '14', '15', '16', '17', '18', '19', '20']
  const needsSize = product.category === 'aneis'

  const handleAddToCart = () => {
    addItem(product, quantity, needsSize ? selectedSize : undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-dark-500">
          <Link href="/" className="hover:text-gold-400 transition-colors">Início</Link>
          <ChevronRight size={12} />
          <Link href="/produtos" className="hover:text-gold-400 transition-colors">Produtos</Link>
          <ChevronRight size={12} />
          <Link href={`/produtos?categoria=${product.category}`} className="hover:text-gold-400 transition-colors">
            {catLabel}
          </Link>
          <ChevronRight size={12} />
          <span className="text-dark-400">{product.name}</span>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Imagens */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-dark-800">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-gold-500 text-dark-900 text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
                  Novo
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      selectedImage === i ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} - foto ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex flex-col">
            <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">{product.material}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-cream font-light leading-tight">{product.name}</h1>

            <div className="mt-6 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-4xl text-cream">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-dark-400 text-lg line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <p className="text-gold-400 text-sm">{formatInstallments(product.price)}</p>
              <p className="text-dark-400 text-xs">ou {formatPrice(product.price * 0.95)} no PIX (5% de desconto)</p>
            </div>

            <div className="h-px bg-gold-500/10 my-8" />

            <p className="text-dark-300 leading-relaxed">{product.description}</p>

            {/* Tamanho */}
            {needsSize && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cream text-sm tracking-wider uppercase">Tamanho</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-gold-400 text-xs hover:underline transition-colors"
                  >
                    Guia de Tamanhos
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 border text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                          : 'border-dark-600 text-dark-300 hover:border-gold-500 hover:text-gold-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div className="mt-6">
              <span className="text-cream text-sm tracking-wider uppercase block mb-3">Quantidade</span>
              <div className="flex items-center gap-4 w-fit border border-dark-600">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-dark-300 hover:text-gold-400 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="text-cream w-6 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-dark-300 hover:text-gold-400 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={needsSize && !selectedSize}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold tracking-widest text-sm uppercase transition-all duration-300 ${
                  added
                    ? 'bg-green-600 text-white'
                    : needsSize && !selectedSize
                    ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                    : 'btn-gold'
                }`}
              >
                <ShoppingBag size={18} />
                {added ? 'Adicionado!' : needsSize && !selectedSize ? 'Selecione um tamanho' : 'Adicionar ao Carrinho'}
              </button>
              <button
                onClick={() => toggleWish(product.id)}
                className={`border p-4 transition-colors ${
                  isFav
                    ? 'border-red-500/40 text-red-400 bg-red-500/10'
                    : 'border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400'
                }`}
                aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar'}
              >
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Garantias */}
            <div className="mt-10 space-y-4 border-t border-gold-500/10 pt-8">
              {[
                { icon: <Shield size={16} className="text-gold-400" />, text: 'Produto autêntico com certificado de garantia' },
                { icon: <Truck size={16} className="text-gold-400" />,  text: 'Entrega segura em embalagem especial presente' },
                { icon: <RefreshCcw size={16} className="text-gold-400" />, text: 'Troca em até 7 dias após o recebimento' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-dark-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Detalhes */}
            <div className="mt-8 border-t border-gold-500/10 pt-8">
              <h3 className="text-cream text-sm tracking-[0.3em] uppercase mb-4">Detalhes da Peça</h3>
              <ul className="space-y-2">
                {product.details.map(detail => (
                  <li key={detail} className="flex items-start gap-2 text-dark-300 text-sm">
                    <span className="text-gold-500 mt-1">·</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Produtos Relacionados */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-gold-500/10">
          <div className="text-center mb-12">
            <h2 className="section-title">Você Também Pode Gostar</h2>
            <span className="gold-line" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Modal Guia de Tamanhos */}
      {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </div>
  )
}
