'use client'

import Link from 'next/link'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'

export default function SucessoPage() {
  const { clearCart } = useCartStore()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <CheckCircle2 size={72} className="text-gold-400" strokeWidth={1} />
        </div>
        <h1 className="font-serif text-4xl text-cream font-light mb-4">Pedido Confirmado!</h1>
        <p className="text-dark-300 leading-relaxed mb-2">
          Seu pagamento foi aprovado com sucesso. Você receberá um e-mail com os detalhes do pedido.
        </p>
        <p className="text-dark-500 text-sm mb-10">
          Em breve sua joia será enviada com muito cuidado e carinho. 💛
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/produtos" className="btn-gold">
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
