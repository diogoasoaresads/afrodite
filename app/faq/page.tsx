'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'As joias são banhadas a ouro ou de ouro maciço?',
    a: 'A maioria das nossas peças são folheadas/banhadas a ouro 18k sobre aço inoxidável ou prata 925. Cada produto indica claramente o material na sua descrição.',
  },
  {
    q: 'Quanto tempo dura o banho de ouro?',
    a: 'Com cuidados adequados (evitar água, suor, perfumes e produtos químicos), o banho de ouro pode durar de 1 a 3 anos. Consulte nossa página de Cuidados com Joias para mais dicas.',
  },
  {
    q: 'Qual é o prazo de entrega?',
    a: 'O prazo varia por região: capitais e regiões metropolitanas geralmente recebem em 3 a 7 dias úteis após a confirmação do pagamento. Regiões mais remotas podem levar até 15 dias úteis.',
  },
  {
    q: 'Posso parcelar minha compra?',
    a: 'Sim! Parcelamos em até 12x sem juros no cartão de crédito. Também aceitamos PIX (com desconto) e boleto bancário.',
  },
  {
    q: 'Como rastrear meu pedido?',
    a: 'Assim que seu pedido for enviado, você receberá um e-mail com o código de rastreamento dos Correios. Você também pode acompanhar pelo menu "Minha Conta" no site.',
  },
  {
    q: 'Posso trocar se o produto não servir?',
    a: 'Sim! Aceitamos trocas em até 7 dias após o recebimento, desde que o produto esteja sem uso e na embalagem original. Consulte nossa política de Trocas e Devoluções.',
  },
  {
    q: 'As joias causam alergia?',
    a: 'Nossas joias de aço inoxidável são hipoalergênicas e adequadas para peles sensíveis. Para joias banhadas, recomendamos sempre evitar contato prolongado com suor para maior durabilidade.',
  },
  {
    q: 'Vocês fazem personalização ou gravação?',
    a: 'No momento não oferecemos personalização. Fique atento às novidades em nossas redes sociais!',
  },
  {
    q: 'Como acionar a garantia?',
    a: 'Entre em contato conosco enviando uma foto do defeito e o número do pedido. Nossa equipe responde em até 2 dias úteis. Consulte nossa página de Garantia para mais detalhes.',
  },
  {
    q: 'O site é seguro para comprar?',
    a: 'Sim! Utilizamos SSL/TLS para proteger seus dados e o pagamento é processado pelo Mercado Pago, uma das plataformas de pagamento mais seguras do Brasil.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gold-500/10 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-gold-400 transition-colors"
      >
        <span className="text-[var(--c-text)] text-sm font-medium leading-snug">{q}</span>
        <ChevronDown
          size={18}
          className={`text-gold-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <p className="text-dark-400 text-sm leading-relaxed pb-5 pr-8">{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Perguntas Frequentes</h1>
      </div>

      <div className="bg-dark-800 border border-gold-500/10 px-6 divide-y divide-gold-500/10">
        {faqs.map((faq) => (
          <FaqItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-dark-500 text-sm mb-4">Não encontrou sua resposta?</p>
        <Link href="/contato" className="btn-gold inline-block">
          Fale Conosco
        </Link>
      </div>
    </div>
  )
}
