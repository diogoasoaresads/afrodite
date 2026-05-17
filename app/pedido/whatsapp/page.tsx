'use client'

import Link from 'next/link'
import { MessageCircle, ShoppingBag } from 'lucide-react'

export default function PedidoWhatsAppPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle size={44} className="text-[#25D366]" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="font-serif text-4xl text-cream font-light mb-4">WhatsApp Aberto!</h1>
        <p className="text-dark-300 leading-relaxed mb-2">
          Sua mensagem com o resumo do pedido foi preparada. Finalize o pedido diretamente na conversa com a loja.
        </p>
        <p className="text-dark-500 text-sm mb-10">
          Caso o WhatsApp não tenha aberto, verifique seu aplicativo ou entre em contato pelo Instagram.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/produtos" className="btn-gold flex items-center justify-center gap-2">
            <ShoppingBag size={16} />
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
