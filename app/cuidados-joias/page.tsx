import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cuidados com Joias — Afrodite Joias',
  description: 'Dicas essenciais para conservar e prolongar a vida útil das suas joias Afrodite.',
}

const tips = [
  {
    title: 'Evite contato com água',
    desc: 'Retire suas joias antes de tomar banho, nadar ou lavar as mãos. A água, especialmente clorada, acelera o desgaste do banho e pode oxidar os metais.',
  },
  {
    title: 'Perfumes e cremes por último',
    desc: 'Aplique perfumes, cremes e produtos de beleza antes de colocar suas joias. Produtos químicos são os principais inimigos da durabilidade.',
  },
  {
    title: 'Guarde separadamente',
    desc: 'Armazene cada peça em saquinhos individuais ou na caixinha original. Joias que se atritam perdem o brilho e podem se arranhar.',
  },
  {
    title: 'Limpe com pano macio',
    desc: 'Use um pano de microfibra seco para limpar suavemente após o uso. Evite produtos abrasivos ou esponjas que possam riscar a superfície.',
  },
  {
    title: 'Retire durante exercícios',
    desc: 'O suor contém ácidos que aceleram a oxidação. Retire as joias antes de praticar esportes ou atividades físicas.',
  },
  {
    title: 'Cuidado com produtos químicos',
    desc: 'Evite contato com produtos de limpeza, cloro de piscina, acetona e álcool. Eles podem desbotar o banho e corroer os metais.',
  },
]

export default function CuidadosJoiasPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Cuidados com Joias</h1>
      </div>

      <p className="text-dark-400 mb-10 leading-relaxed">
        Com o cuidado certo, suas joias Afrodite durarão muito mais tempo e manterão o brilho de sempre. Confira nossas dicas:
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {tips.map(({ title, desc }) => (
          <div key={title} className="bg-dark-800 border border-gold-500/10 p-5">
            <div className="w-1 h-6 bg-gold-500 mb-3" />
            <h2 className="text-[var(--c-text)] font-semibold mb-2 text-sm">{title}</h2>
            <p className="text-dark-400 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gold-500/5 border border-gold-500/20 p-6">
        <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Joias com Banho de Ouro</h2>
        <p className="text-dark-400 text-sm leading-relaxed">
          Nossas joias folheadas/banhadas a ouro têm uma camada protetora que dura aproximadamente <strong className="text-cream">1 a 3 anos</strong> com cuidados adequados. O banho pode ser renovado por joalheiros especializados. Com os cuidados certos, esse prazo é facilmente atingido!
        </p>
      </div>

      <p className="mt-8 text-dark-500 text-sm text-center">
        Dúvidas?{' '}
        <Link href="/contato" className="text-gold-400 hover:underline">
          Fale com nossa equipe
        </Link>
      </p>
    </div>
  )
}
