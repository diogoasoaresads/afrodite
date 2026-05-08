import Link from 'next/link'
import { Clock, Mail, ShoppingBag } from 'lucide-react'

export default function PedidoPendentePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="w-20 h-20 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={36} className="text-gold-400" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl text-[var(--c-text)] font-light mb-3">
          Aguardando Pagamento
        </h1>

        <p className="text-dark-400 leading-relaxed mb-8">
          Recebemos seu pedido! Assim que o pagamento for confirmado, você receberá um e-mail de confirmação.
        </p>

        <div className="bg-dark-800 border border-gold-500/10 p-5 text-left space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-gold-400 mt-0.5 flex-shrink-0" />
            <p className="text-dark-300 text-sm">
              Se pagou via PIX ou boleto, aguarde a confirmação automática. Pode levar alguns minutos (PIX) ou até 3 dias úteis (boleto).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingBag size={18} className="text-gold-400 mt-0.5 flex-shrink-0" />
            <p className="text-dark-300 text-sm">
              Após a confirmação, seu pedido será separado e você receberá o código de rastreio por e-mail.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/conta" className="btn-gold">
            Acompanhar Pedidos
          </Link>
          <Link
            href="/produtos"
            className="px-6 py-3 border border-gold-500/30 text-gold-400 hover:border-gold-500 hover:bg-gold-500/5 transition-all text-sm tracking-widest uppercase font-semibold"
          >
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
