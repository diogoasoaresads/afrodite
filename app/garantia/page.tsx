import Link from 'next/link'
import { ArrowLeft, Shield, Star, Wrench } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Garantia — Afrodite Joias',
  description: 'Conheça a garantia das nossas joias e como acioná-la.',
}

export default function GarantiaPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Garantia</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Shield, title: '12 meses', desc: 'Garantia contra defeitos de fabricação' },
          { icon: Star, title: 'Banhado', desc: 'Garantia de coloração por 6 meses' },
          { icon: Wrench, title: 'Assistência', desc: 'Suporte rápido por WhatsApp' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-dark-800 border border-gold-500/10 p-5 text-center">
            <Icon size={28} className="text-gold-400 mx-auto mb-3" />
            <p className="text-[var(--c-text)] font-semibold text-lg">{title}</p>
            <p className="text-dark-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-dark-300 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">O que cobre</h2>
          <p>Nossa garantia cobre defeitos de fabricação e falhas estruturais pelo prazo de <strong className="text-cream">12 meses</strong> a partir da data de entrega. Isso inclui:</p>
          <ul className="list-disc list-inside space-y-1 mt-3 text-dark-400">
            <li>Soldas defeituosas ou que se soltam em uso normal</li>
            <li>Fechos e travas com defeito de origem</li>
            <li>Deformações estruturais não causadas por impacto</li>
            <li>Oxidação prematura não relacionada ao uso (joias banhadas: 6 meses)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">O que não cobre</h2>
          <ul className="list-disc list-inside space-y-1 text-dark-400">
            <li>Desgaste natural pelo uso</li>
            <li>Danos causados por batidas, quedas ou impactos</li>
            <li>Contato com produtos químicos, perfumes ou cloro</li>
            <li>Oxidação por contato frequente com água ou suor sem os cuidados adequados</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Como acionar a garantia</h2>
          <ol className="list-decimal list-inside space-y-2 text-dark-400">
            <li>Entre em <Link href="/contato" className="text-gold-400 hover:underline">contato</Link> com uma foto clara do defeito</li>
            <li>Informe o número do seu pedido</li>
            <li>Nossa equipe avaliará e responderá em até 2 dias úteis</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Dicas para prolongar a vida útil</h2>
          <p>Consulte nossa página de <Link href="/cuidados-joias" className="text-gold-400 hover:underline">Cuidados com Joias</Link> para manter suas peças sempre bonitas.</p>
        </section>
      </div>
    </div>
  )
}
