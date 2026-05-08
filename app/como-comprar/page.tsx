import Link from 'next/link'
import { ArrowLeft, Search, ShoppingBag, CreditCard, Package, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Como Comprar — Afrodite Joias',
  description: 'Passo a passo para fazer sua compra na Afrodite Joias com segurança e facilidade.',
}

const steps = [
  {
    icon: Search,
    step: '01',
    title: 'Escolha suas joias',
    desc: 'Explore nossas coleções de anéis, colares, brincos e pulseiras. Use a busca ou filtre por categoria para encontrar o que procura.',
  },
  {
    icon: ShoppingBag,
    step: '02',
    title: 'Adicione ao carrinho',
    desc: 'Clique em "Adicionar ao Carrinho" no produto desejado. Você pode adicionar quantos itens quiser antes de finalizar.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Escolha a forma de pagamento',
    desc: 'Pagamos via Mercado Pago: cartão de crédito (até 12x sem juros), PIX (com desconto especial) ou boleto bancário.',
  },
  {
    icon: Package,
    step: '04',
    title: 'Aguarde a entrega',
    desc: 'Após a confirmação do pagamento, preparamos seu pedido com todo cuidado. Você receberá o código de rastreio por e-mail.',
  },
  {
    icon: Mail,
    step: '05',
    title: 'Receba e aproveite',
    desc: 'Suas joias chegam embaladas com carinho. Qualquer dúvida, nossa equipe está disponível para ajudar.',
  },
]

export default function ComoComprarPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Como Comprar</h1>
      </div>

      <p className="text-dark-400 mb-10 leading-relaxed">
        Comprar na Afrodite Joias é simples, rápido e seguro. Siga o passo a passo abaixo:
      </p>

      <div className="space-y-6">
        {steps.map(({ icon: Icon, step, title, desc }) => (
          <div key={step} className="flex gap-5 bg-dark-800 border border-gold-500/10 p-6">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <span className="text-gold-500 text-xs font-bold tracking-widest">{step}</span>
              <div className="w-10 h-10 bg-gold-500/10 flex items-center justify-center">
                <Icon size={20} className="text-gold-400" />
              </div>
            </div>
            <div>
              <h2 className="text-[var(--c-text)] font-semibold mb-1">{title}</h2>
              <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-gold-500/5 border border-gold-500/20 p-6 text-center">
        <p className="text-[var(--c-text)] font-serif text-xl font-light mb-4">Pronto para começar?</p>
        <Link href="/produtos" className="btn-gold inline-block">
          Ver Todas as Joias
        </Link>
      </div>
    </div>
  )
}
