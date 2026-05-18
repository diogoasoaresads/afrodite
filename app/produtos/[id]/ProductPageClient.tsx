'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ShoppingBag, Heart, Shield, Truck, RefreshCcw, ChevronRight,
  Minus, Plus, Sparkles, Droplets, Clock, Award
} from 'lucide-react'
import { categories } from '@/lib/products'
import { formatPrice, formatInstallments } from '@/lib/formatters'
import { useCartStore, useWishlistStore } from '@/lib/store'
import ProductCard from '@/components/ProductCard'
import SizeGuideModal from '@/components/SizeGuideModal'
import type { Product } from '@/lib/products'

interface Props {
  product: Product & {
    // atributos estendidos (opcionais — backward compatible)
    liga?: string; banho?: string; acabamento?: string; pedras?: string
    peso?: string; dimensoes?: string; comprimento?: string; ajustavel?: boolean
    tamanhos?: Array<{ tamanho: string; estoque: number }>
    garantia?: string; resistenciaAgua?: string; cuidados?: string[]
    personalizavel?: boolean; tipoPersonalizacao?: string
    prazoPersonalizacao?: number; obsPersonalizacao?: string
    colecao?: string; sku?: string
  }
  related: Product[]
}

const RING_SIZES = ['10','11','12','13','14','15','16','17','18','19','20','21','22']

export default function ProductPageClient({ product, related }: Props) {
  const catLabel = categories.find(c => c.id === product.category)?.label || ''

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [added, setAdded] = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [showCuidados, setShowCuidados] = useState(false)

  const { addItem } = useCartStore()
  const { ids: wishIds, toggle: toggleWish } = useWishlistStore()
  const isFav = wishIds.includes(product.id)

  // Tamanhos: usa os cadastrados no admin, ou fallback para anéis
  const tamanhosCadastrados = product.tamanhos ?? []
  const needsSize = product.category === 'aneis' || tamanhosCadastrados.length > 0

  // Se tem tamanhos com estoque, usar eles; senão, usar os padrão de anéis
  const sizeOptions = tamanhosCadastrados.length > 0
    ? tamanhosCadastrados
    : product.category === 'aneis'
      ? RING_SIZES.map(t => ({ tamanho: t, estoque: 1 }))
      : []

  const selectedTamanho = tamanhosCadastrados.length > 0
    ? tamanhosCadastrados.find(t => t.tamanho === selectedSize)
    : null

  const sizeOutOfStock = selectedTamanho ? selectedTamanho.estoque === 0 : false

  const handleAddToCart = () => {
    if (sizeOutOfStock) return
    addItem(product, quantity, needsSize ? selectedSize : undefined)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Atributos relevantes para a ficha técnica
  const ficha: Array<{ label: string; value: string }> = []
  if (product.liga)           ficha.push({ label: 'Liga', value: product.liga })
  if (product.banho)          ficha.push({ label: 'Banho', value: product.banho })
  if (product.acabamento)     ficha.push({ label: 'Acabamento', value: product.acabamento })
  if (product.pedras)         ficha.push({ label: 'Pedras', value: product.pedras })
  if (product.peso)           ficha.push({ label: 'Peso', value: product.peso })
  if (product.dimensoes)      ficha.push({ label: 'Dimensões', value: product.dimensoes })
  if (product.comprimento)    ficha.push({ label: 'Comprimento', value: product.comprimento })
  if (product.ajustavel)      ficha.push({ label: 'Ajustável', value: 'Sim' })
  if (product.colecao)        ficha.push({ label: 'Coleção', value: product.colecao })
  // Adiciona os details legados
  ;(product.details ?? []).forEach(d => { if (d) ficha.push({ label: '·', value: d }) })

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

          {/* ── Imagens ── */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-dark-800">
              <Image src={product.images[selectedImage]} alt={product.name}
                fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-gold-500 text-dark-900 text-[10px] font-bold px-3 py-1 tracking-widest uppercase">
                  Novo
                </div>
              )}
              {product.personalizavel && (
                <div className="absolute top-4 right-4 bg-dark-900/80 border border-gold-500/40 text-gold-400 text-[10px] px-2.5 py-1 flex items-center gap-1.5">
                  <Sparkles size={10} /> Personalizável
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                      selectedImage === i ? 'border-gold-500' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <Image src={img} alt={`${product.name} - foto ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Informações ── */}
          <div className="flex flex-col">
            {product.colecao && (
              <p className="text-dark-500 text-xs tracking-widest uppercase mb-1">{product.colecao}</p>
            )}
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

            {/* ── Personalização ── */}
            {product.personalizavel && (
              <div className="mt-6 p-4 bg-gold-500/5 border border-gold-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-gold-400" />
                  <span className="text-gold-400 text-sm font-semibold">
                    {product.tipoPersonalizacao || 'Personalização disponível'}
                  </span>
                </div>
                {product.obsPersonalizacao && (
                  <p className="text-dark-400 text-xs leading-relaxed">{product.obsPersonalizacao}</p>
                )}
                {product.prazoPersonalizacao && (
                  <p className="text-dark-500 text-xs mt-1 flex items-center gap-1">
                    <Clock size={10} /> Prazo: {product.prazoPersonalizacao} dias úteis após pedido
                  </p>
                )}
              </div>
            )}

            {/* ── Tamanhos ── */}
            {needsSize && sizeOptions.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-cream text-sm tracking-wider uppercase">Tamanho</span>
                  {product.category === 'aneis' && (
                    <button onClick={() => setSizeGuideOpen(true)}
                      className="text-gold-400 text-xs hover:underline">
                      Guia de Tamanhos
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map(({ tamanho, estoque }) => {
                    const esgotado = estoque === 0
                    const selected = selectedSize === tamanho
                    return (
                      <button key={tamanho} onClick={() => !esgotado && setSelectedSize(tamanho)}
                        disabled={esgotado}
                        title={esgotado ? 'Esgotado' : undefined}
                        className={`min-w-[44px] h-11 px-2 border text-sm transition-all duration-200 relative ${
                          esgotado
                            ? 'border-dark-700 text-dark-600 cursor-not-allowed line-through'
                            : selected
                              ? 'border-gold-500 bg-gold-500 text-dark-900 font-semibold'
                              : 'border-dark-600 text-dark-300 hover:border-gold-500 hover:text-gold-400'
                        }`}>
                        {tamanho}
                      </button>
                    )
                  })}
                </div>
                {sizeOutOfStock && (
                  <p className="text-red-400 text-xs mt-2">Este tamanho está esgotado no momento.</p>
                )}
              </div>
            )}

            {/* ── Resistência à água (badge) ── */}
            {product.resistenciaAgua && product.resistenciaAgua !== 'Sem resistência' && (
              <div className="mt-5 inline-flex items-center gap-2 bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 w-fit">
                <Droplets size={13} className="text-blue-400" />
                <span className="text-blue-300 text-xs">{product.resistenciaAgua}</span>
              </div>
            )}

            {/* ── Quantidade ── */}
            <div className="mt-6">
              <span className="text-cream text-sm tracking-wider uppercase block mb-3">Quantidade</span>
              <div className="flex items-center gap-4 w-fit border border-dark-600">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-dark-300 hover:text-gold-400 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="text-cream w-6 text-center text-lg">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-dark-300 hover:text-gold-400 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* ── Botões ── */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={handleAddToCart}
                disabled={(needsSize && !selectedSize) || sizeOutOfStock || !product.inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 font-semibold tracking-widest text-sm uppercase transition-all duration-300 ${
                  added ? 'bg-green-600 text-white'
                  : !product.inStock ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                  : sizeOutOfStock ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                  : needsSize && !selectedSize ? 'bg-dark-700 text-dark-500 cursor-not-allowed'
                  : 'btn-gold'
                }`}>
                <ShoppingBag size={18} />
                {added ? 'Adicionado!'
                  : !product.inStock ? 'Indisponível'
                  : sizeOutOfStock ? 'Tamanho esgotado'
                  : needsSize && !selectedSize ? 'Selecione um tamanho'
                  : 'Adicionar ao Carrinho'}
              </button>
              <button onClick={() => toggleWish(product.id)}
                className={`border p-4 transition-colors ${
                  isFav ? 'border-red-500/40 text-red-400 bg-red-500/10'
                        : 'border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400'
                }`}
                aria-label={isFav ? 'Remover dos favoritos' : 'Favoritar'}>
                <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* ── Garantias / Diferenciais ── */}
            <div className="mt-10 space-y-3 border-t border-gold-500/10 pt-8">
              {product.garantia && (
                <div className="flex items-center gap-3">
                  <Award size={15} className="text-gold-400 flex-shrink-0" />
                  <span className="text-dark-300 text-sm">Garantia de {product.garantia} contra defeitos de fabricação</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Shield size={15} className="text-gold-400 flex-shrink-0" />
                <span className="text-dark-300 text-sm">Produto autêntico com certificado de qualidade</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={15} className="text-gold-400 flex-shrink-0" />
                <span className="text-dark-300 text-sm">Entrega segura em embalagem especial para presente</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw size={15} className="text-gold-400 flex-shrink-0" />
                <span className="text-dark-300 text-sm">Troca em até 7 dias após o recebimento</span>
              </div>
            </div>

            {/* ── Ficha Técnica ── */}
            {ficha.length > 0 && (
              <div className="mt-8 border-t border-gold-500/10 pt-8">
                <h3 className="text-cream text-sm tracking-[0.3em] uppercase mb-4">Ficha Técnica</h3>
                <div className="space-y-2">
                  {ficha.map((item, i) => (
                    <div key={i} className={`flex gap-3 text-sm ${item.label === '·' ? '' : 'border-b border-dark-700/50 pb-2'}`}>
                      {item.label !== '·' && (
                        <span className="text-dark-500 min-w-[90px] flex-shrink-0">{item.label}</span>
                      )}
                      <span className={item.label === '·' ? 'text-dark-300 flex items-start gap-2' : 'text-cream'}>
                        {item.label === '·' && <span className="text-gold-500 mt-1">·</span>}
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Cuidados ── */}
            {product.cuidados && product.cuidados.length > 0 && (
              <div className="mt-6 border-t border-gold-500/10 pt-6">
                <button onClick={() => setShowCuidados(!showCuidados)}
                  className="flex items-center justify-between w-full text-left">
                  <h3 className="text-cream text-sm tracking-[0.3em] uppercase">Cuidados com a Peça</h3>
                  <span className="text-dark-500 text-xs">{showCuidados ? 'ocultar ▲' : 'ver ▼'}</span>
                </button>
                {showCuidados && (
                  <ul className="mt-3 space-y-1.5">
                    {product.cuidados.map(c => (
                      <li key={c} className="flex items-start gap-2 text-dark-400 text-sm">
                        <span className="text-gold-500 mt-1 flex-shrink-0">·</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
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
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </div>
  )
}
