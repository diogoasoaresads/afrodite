'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/formatters'

interface CustomerForm {
  name: string
  email: string
  cpf: string
  phone: string
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()

  const [form, setForm] = useState<CustomerForm>({ name: '', email: '', cpf: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14)
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15)
  }

  const isValid = form.name.trim().length > 2
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    && form.cpf.replace(/\D/g, '').length === 11
    && form.phone.replace(/\D/g, '').length >= 10

  const handleCheckout = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.product.id,
            title: i.product.name,
            quantity: i.quantity,
            unit_price: i.product.price,
          })),
          payer: {
            name: form.name,
            email: form.email,
            identification: { type: 'CPF', number: form.cpf.replace(/\D/g, '') },
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro ao criar pagamento')

      // Redireciona para o Mercado Pago
      window.location.href = data.init_point
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 px-4">
        <p className="font-serif text-3xl text-cream font-light">Seu carrinho está vazio</p>
        <Link href="/produtos" className="btn-gold">Ver Produtos</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-serif text-4xl text-cream font-light">Finalizar Compra</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Formulário */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h2 className="text-cream text-sm tracking-[0.3em] uppercase mb-6 pb-3 border-b border-gold-500/10">
                Dados do Comprador
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">CPF *</label>
                    <input
                      type="text"
                      name="cpf"
                      value={form.cpf}
                      onChange={e => setForm(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                      placeholder="000.000.000-00"
                      className="w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-300 text-xs tracking-wider uppercase mb-2">Telefone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={e => setForm(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Segurança */}
            <div className="bg-dark-800/50 border border-gold-500/10 p-5 flex items-start gap-4">
              <Lock size={20} className="text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cream text-sm font-semibold mb-1">Pagamento 100% Seguro</p>
                <p className="text-dark-400 text-xs leading-relaxed">
                  Seus dados são protegidos com criptografia SSL. O pagamento é processado pelo Mercado Pago — aceitamos PIX, cartão de crédito, débito e boleto.
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Resumo do Pedido */}
          <div className="md:col-span-2">
            <div className="bg-dark-800 border border-gold-500/10 p-6 sticky top-28">
              <h2 className="text-cream text-sm tracking-[0.3em] uppercase mb-6 pb-3 border-b border-gold-500/10">
                Resumo do Pedido
              </h2>

              <ul className="space-y-4 mb-6">
                {items.map(item => (
                  <li key={item.product.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-dark-700 overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
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

              <div className="space-y-3 border-t border-gold-500/10 pt-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Subtotal</span>
                  <span className="text-cream">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Frete</span>
                  <span className="text-green-400">Grátis</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t border-gold-500/10 pt-3">
                  <span className="text-cream">Total</span>
                  <span className="text-gold-400">{formatPrice(total)}</span>
                </div>
                <p className="text-dark-500 text-xs">12x de {formatPrice(total / 12)} sem juros no cartão</p>
                <p className="text-dark-500 text-xs">ou {formatPrice(total * 0.95)} no PIX</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!isValid || loading}
                className={`w-full flex items-center justify-center gap-2 py-4 font-semibold tracking-widest text-sm uppercase transition-all duration-300 ${
                  isValid && !loading
                    ? 'bg-[#009EE3] hover:bg-[#007FBF] text-white'
                    : 'bg-dark-700 text-dark-500 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="animate-pulse">Processando...</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    Pagar com Mercado Pago
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-3 mt-4 opacity-60">
                <img src="https://http2.mlstatic.com/frontend-assets/payment-methods-card-logos/img/mercado-pago.png" alt="Mercado Pago" className="h-5 object-contain" />
              </div>

              <p className="text-dark-600 text-[10px] text-center mt-4">
                Você será redirecionado para o ambiente seguro do Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
