import Link from 'next/link'
import { ArrowLeft, Heart, Shield, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós — Afrodite Joias',
  description: 'Conheça a história da Afrodite Joias e nossa missão de celebrar a feminilidade através de peças exclusivas.',
}

export default function SobrePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Nossa História</h1>
      </div>

      {/* Hero */}
      <div className="bg-dark-800 border border-gold-500/10 p-8 sm:p-12 mb-10 text-center">
        <div className="w-16 h-px bg-gold-500 mx-auto mb-6" />
        <p className="font-serif text-3xl sm:text-4xl text-[var(--c-text)] font-light leading-relaxed">
          "Criadas para mulheres que celebram sua própria divindade."
        </p>
        <div className="w-16 h-px bg-gold-500 mx-auto mt-6" />
      </div>

      <div className="text-dark-300 space-y-6 leading-relaxed mb-12">
        <p>
          A Afrodite Joias nasceu da paixão por peças que vão além do ornamental — joias que contam histórias, marcam momentos e fazem a mulher se sentir única. Inspirada pela deusa grega da beleza e do amor, nossa marca celebra a feminilidade em todas as suas formas.
        </p>
        <p>
          Cada peça é selecionada com cuidado, pensando na qualidade dos materiais, no design atemporal e na acessibilidade. Acreditamos que toda mulher merece se sentir linda, independente da ocasião.
        </p>
        <p>
          Nossa missão é clara: oferecer joias de alta qualidade com um atendimento personalizado e humano, transformando cada compra em uma experiência especial.
        </p>
      </div>

      {/* Valores */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {[
          {
            icon: Heart,
            title: 'Com Amor',
            desc: 'Cada peça é selecionada com cuidado. Não vendemos apenas joias — vendemos a forma como você se sente ao usá-las.',
          },
          {
            icon: Shield,
            title: 'Com Qualidade',
            desc: 'Materiais selecionados, acabamento impecável e garantia real. Sua satisfação é nossa prioridade.',
          },
          {
            icon: Star,
            title: 'Com Propósito',
            desc: 'Acreditamos que beleza é autoexpressão. Nossas joias são para quem quer se sentir poderosa todos os dias.',
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-dark-800 border border-gold-500/10 p-6 text-center">
            <Icon size={28} className="text-gold-400 mx-auto mb-4" />
            <h2 className="text-[var(--c-text)] font-semibold mb-2">{title}</h2>
            <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href="/produtos" className="btn-gold inline-block mr-4">
          Ver Coleções
        </Link>
        <Link href="/contato"
          className="inline-block px-6 py-3 border border-gold-500/30 text-gold-400 hover:border-gold-500 hover:bg-gold-500/5 transition-all text-sm tracking-widest uppercase font-semibold">
          Fale Conosco
        </Link>
      </div>
    </div>
  )
}
