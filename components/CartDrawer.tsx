'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/formatters'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const total = getTotalPrice()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-dark-900/70 backdrop-blur-sm z-[60] animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-dark-800 border-l border-gold-500/20 z-[70] flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-500/10">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-gold-400" />
            <h2 className="font-serif text-xl text-cream font-light tracking-wide">Meu Carrinho</h2>
            {items.length > 0 && (
              <span className="bg-gold-500 text-dark-900 text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-dark-400 hover:text-gold-400 transition-colors p-1"
            aria-label="Fechar carrinho"
          >
            <X size={22} />
          </button>
        </div>

        {/* Itens */}
        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <ShoppingBag size={48} className="text-dark-600" />
              <p className="font-serif text-xl text-dark-400 font-light">Seu carrinho está vazio</p>
              <p className="text-dark-500 text-sm">Explore nossas joias e encontre a peça perfeita para você.</p>
              <button
                onClick={closeCart}
                className="mt-2 btn-gold"
              >
                Ver Coleção
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gold-500/10">
              {items.map(item => (
                <li key={item.product.id} className="flex gap-4 px-6 py-4">
                  {/* Imagem */}
                  <Link href={`/produtos/${item.product.id}`} onClick={closeCart} className="flex-shrink-0">
                    <div className="relative w-20 h-20 overflow-hidden bg-dark-700">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produtos/${item.product.id}`}
                      onClick={closeCart}
                      className="font-serif text-cream text-base font-light hover:text-gold-300 transition-colors leading-snug block"
                    >
                      {item.product.name}
                    </Link>
                    {item.size && (
                      <p className="text-dark-400 text-xs mt-0.5">Tamanho: {item.size}</p>
                    )}
                    <p className="text-gold-400 font-semibold mt-1">{formatPrice(item.product.price)}</p>

                    {/* Quantidade */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 flex items-center justify-center transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-cream text-sm w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 flex items-center justify-center transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={12} />
                      </button>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto text-dark-500 hover:text-red-400 text-xs transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gold-500/10 px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-dark-300 text-sm">Subtotal</span>
              <span className="text-cream font-semibold text-lg">{formatPrice(total)}</span>
            </div>
            <p className="text-dark-500 text-xs">Frete e descontos calculados no checkout.</p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 btn-gold w-full text-center"
            >
              Finalizar Compra
              <ArrowRight size={16} />
            </Link>

            <button
              onClick={closeCart}
              className="w-full text-center text-dark-400 hover:text-gold-400 text-sm transition-colors py-1"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
