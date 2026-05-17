'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MessageCircle, Tag, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/formatters'

interface PublicSettings {
  loja: { whatsapp: string; nome: string }
  frete: { gratisPorValor: number; valorFixo: number }
}

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCartStore()
  const subtotal = getTotalPrice()

  const [name, setName]   = useState('')
  const [phone, setPhone] = useState('')

  // Cupom
  const [couponInput, setCouponInput]     = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError, setCouponError]     = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string; code: string; discountAmount: number
  } | null>(null)

  const [cfg, setCfg] = useState<PublicSettings>({
    loja:  { whatsapp: '', nome: 'Afrodite Joias' },
    frete: { gratisPorValor: 500, valorFixo: 0 },
  })

  useEffect(() => {
    fetch('/api/configuracoes/publicas')
      .then(r => r.json())
      .then(d => setCfg(d))
      .catch(() => {})
  }, [])

  // Cálculo de frete
  const freteGratis     = cfg.frete.gratisPorValor === 0 || subtotal >= cfg.frete.gratisPorValor
  const frete           = freteGratis ? 0 : cfg.frete.valorFixo
  const total           = subtotal + frete
  const couponDiscount  = appliedCoupon?.discountAmount ?? 0
  const totalFinal      = Math.max(0, total - couponDiscount)

  const applyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponError('')
    setCouponLoading(true)
    try {
      const res = await fetch('/api/cupom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), cartTotal: total }),
      })
      const data = await res.json()
      if (!res.ok) { setCouponError(data.error); return }
      setAppliedCoupon({ couponId: data.couponId, code: data.code, discountAmount: data.discountAmount })
      setCouponInput('')
    } finally { setCouponLoading(false) }
  }

  const formatPhone = (v: string) =>
    v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15)

  const buildWhatsAppMessage = () => {
    const greeting = name.trim()
      ? `Olá, sou ${name.trim()}! Gostaria de fazer um pedido 😊`
      : 'Olá! Gostaria de fazer um pedido 😊'

    const itemLines = items
      .map(i => `• ${i.quantity}x ${i.product.name}${i.size ? ` (${i.size})` : ''} — ${formatPrice(i.product.price * i.quantity)}`)
      .join('\n')

    let msg = `${greeting}\n\n🛍️ *Itens do Pedido:*\n${itemLines}`

    if (frete > 0) {
      msg += `\n\n📦 *Frete:* ${formatPrice(frete)}`
    }

    if (couponDiscount > 0 && appliedCoupon) {
      msg += `\n🏷️ *Cupom ${appliedCoupon.code}:* −${formatPrice(couponDiscount)}`
    }

    msg += `\n\n💰 *Total: ${formatPrice(totalFinal)}*`

    if (phone.trim()) {
      msg += `\n📱 *Meu telefone:* ${phone.trim()}`
    }

    msg += '\n\nPoderia me informar sobre formas de pagamento e prazo de entrega?'

    return encodeURIComponent(msg)
  }

  const handleWhatsApp = () => {
    const whatsapp = cfg.loja.whatsapp.replace(/\D/g, '')
    if (!whatsapp) {
      alert('Número de WhatsApp da loja não configurado. Entre em contato pelo Instagram ou e-mail.')
      return
    }
    const url = `https://wa.me/${whatsapp}?text=${buildWhatsAppMessage()}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 px-4">
        <p className="font-serif text-3xl text-cream font-light">Seu carrinho está vazio</p>
        <Link href="/produtos" className="btn-gold">Ver Produtos</Link>
      </div>
    )
  }

  const inputClass = "w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-4xl text-cream font-light">Finalizar Compra</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Formulário simples */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h2 className="text-cream text-sm tracking-[0.3em] uppercase mb-2 pb-3 border-b border-gold-500/10">
                Seus Dados (opcional)
              </h2>
              <p className="text-dark-500 text-xs mb-5">
                Preencha para personalizar a mensagem no WhatsApp. Não é obrigatório.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">Seu Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Como gostaria de ser chamada?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">Seu Telefone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-500/20 p-5 flex items-start gap-4">
              <MessageCircle size={22} className="text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cream text-sm font-semibold mb-1">Pagamento pelo WhatsApp</p>
                <p className="text-dark-400 text-xs leading-relaxed">
                  Ao clicar no botão, você será redirecionada para o WhatsApp com o resumo do pedido já preenchido.
                  Combinamos pagamento, endereço e envio direto na conversa. Aceitamos PIX, transferência e cartão.
                </p>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="md:col-span-2">
            <div className="bg-dark-800 border border-gold-500/10 p-6 sticky top-28">
              <h2 className="text-cream text-sm tracking-[0.3em] uppercase mb-6 pb-3 border-b border-gold-500/10">
                Resumo do Pedido
              </h2>

              <ul className="space-y-4 mb-6">
                {items.map(item => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-dark-700 overflow-hidden">
                      <Image src={item.product.images[0]} alt={item.product.name}
                        fill className="object-cover" sizes="56px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm font-light leading-snug truncate">{item.product.name}</p>
                      {item.size && <p className="text-dark-500 text-xs">Tamanho: {item.size}</p>}
                      <p className="text-dark-400 text-xs">Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-cream text-sm font-semibold flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Campo cupom */}
              <div className="mb-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-400/10 border border-green-400/30 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag size={13} className="text-green-400" />
                      <span className="text-green-400 font-mono text-sm font-semibold">{appliedCoupon.code}</span>
                      <span className="text-green-400 text-xs">−{formatPrice(appliedCoupon.discountAmount)}</span>
                    </div>
                    <button onClick={() => setAppliedCoupon(null)} className="text-dark-400 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      placeholder="Código de cupom"
                      className="flex-1 bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-600 px-3 py-2 text-xs outline-none"
                    />
                    <button onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}
                      className="px-3 py-2 bg-dark-700 border border-l-0 border-dark-600 hover:border-gold-500 text-dark-400 hover:text-gold-400 text-xs transition-colors whitespace-nowrap disabled:opacity-50">
                      {couponLoading ? '...' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
              </div>

              <div className="space-y-3 border-t border-gold-500/10 pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-cream">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Frete</span>
                  {freteGratis
                    ? <span className="text-green-400">Grátis</span>
                    : <span className="text-cream">{formatPrice(frete)}</span>}
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Cupom ({appliedCoupon?.code})</span>
                    <span className="text-green-400">−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                {!freteGratis && cfg.frete.gratisPorValor > 0 && (
                  <p className="text-dark-500 text-xs">
                    Falta {formatPrice(cfg.frete.gratisPorValor - subtotal)} para frete grátis
                  </p>
                )}
                <div className="flex justify-between font-semibold text-lg border-t border-gold-500/10 pt-3">
                  <span className="text-cream">Total</span>
                  <span className="text-gold-400">{formatPrice(totalFinal)}</span>
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 font-semibold tracking-widest text-sm uppercase transition-all duration-300 bg-[#25D366] hover:bg-[#1ebe5a] text-white"
              >
                <MessageCircle size={20} />
                Finalizar pelo WhatsApp
              </button>

              <p className="text-dark-600 text-[10px] text-center mt-4">
                Você será redirecionada para o WhatsApp com o pedido resumido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
