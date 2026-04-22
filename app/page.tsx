import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star, Shield, RefreshCcw, Truck } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  const featured = getFeaturedProducts()

  const benefits = [
    { icon: <Shield size={28} className="text-gold-400" />, title: 'Garantia de Autenticidade', desc: 'Todas as peças acompanham certificado de autenticidade.' },
    { icon: <Truck size={28} className="text-gold-400" />,  title: 'Entrega Grátis',           desc: 'Frete grátis para compras acima de R$ 500.' },
    { icon: <RefreshCcw size={28} className="text-gold-400" />, title: 'Troca Fácil',          desc: '30 dias para troca ou devolução sem burocracia.' },
    { icon: <Star size={28} className="text-gold-400" />,   title: 'Peças Exclusivas',         desc: 'Designs únicos criados por artesãos especializados.' },
  ]

  const categories = [
    {
      id: 'aneis',
      label: 'Anéis',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    },
    {
      id: 'colares',
      label: 'Colares',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    },
    {
      id: 'brincos',
      label: 'Brincos',
      image: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=600&q=80',
    },
    {
      id: 'pulseiras',
      label: 'Pulseiras',
      image: 'https://images.unsplash.com/photo-1573408301185-9519eb8db0e4?w=600&q=80',
    },
  ]

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=85"
            alt="Afrodite Joias Hero"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/40 to-dark-900/80" />
        </div>

        <div className="relative z-10 text-center px-4 animate-fade-in">
          <p className="text-gold-400 text-xs tracking-[0.6em] uppercase mb-6 font-light">
            Coleção 2024
          </p>
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl text-cream font-light tracking-[0.08em] leading-none">
            AFRODITE
          </h1>
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px bg-gold-500/60 w-16" />
            <span className="text-gold-400 text-[10px] tracking-[0.5em] uppercase">Joias Exclusivas</span>
            <div className="h-px bg-gold-500/60 w-16" />
          </div>
          <p className="text-dark-200 text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
            Beleza que transcende o tempo. Joias criadas para mulheres que celebram a própria divindade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/produtos" className="btn-gold">
              Explorar Coleção
            </Link>
            <Link href="/produtos?categoria=aneis" className="btn-outline-gold">
              Ver Anéis
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-10 bg-gradient-to-b from-gold-500/60 to-transparent" />
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="section-title">Nossas Coleções</h2>
          <span className="gold-line" />
          <p className="text-dark-300 mt-6 text-base font-light">Cada peça conta uma história única.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.id}`}
              className="group relative overflow-hidden aspect-[3/4] block"
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-dark-900/40 group-hover:bg-dark-900/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-5">
                <span className="block w-8 h-px bg-gold-400 mb-3 group-hover:w-12 transition-all duration-300" />
                <h3 className="font-serif text-cream text-2xl font-light tracking-wide">{cat.label}</h3>
                <span className="text-gold-400 text-xs tracking-widest uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver tudo →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PRODUTOS EM DESTAQUE */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-gold-500 text-xs tracking-[0.4em] uppercase mb-3">Mais Desejados</p>
          <h2 className="section-title">Peças em Destaque</h2>
          <span className="gold-line" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/produtos" className="btn-outline-gold inline-flex items-center gap-2">
            Ver Todos os Produtos
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* BANNER CENTRAL */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1600&q=85"
            alt="Afrodite Banner"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-dark-900/75" />
        </div>
        <div className="relative z-10 text-center px-4 animate-slide-up">
          <p className="text-gold-400 text-xs tracking-[0.6em] uppercase mb-4">Exclusividade</p>
          <h2 className="font-serif text-4xl md:text-6xl text-cream font-light leading-tight max-w-3xl mx-auto">
            Cada Joia Conta a Sua História
          </h2>
          <p className="text-dark-200 text-base md:text-lg font-light mt-6 max-w-xl mx-auto leading-relaxed">
            Criadas com materiais nobres e atenção artesanal em cada detalhe. Porque você merece o melhor.
          </p>
          <Link href="/produtos" className="btn-gold inline-flex mt-10">
            Descobrir Agora
          </Link>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {benefits.map(benefit => (
            <div key={benefit.title} className="text-center group">
              <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-cream text-sm font-semibold tracking-wide mb-2">{benefit.title}</h3>
              <p className="text-dark-400 text-xs leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 bg-dark-800/50 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="section-title mb-2">O Que Dizem Nossas Clientes</h2>
          <span className="gold-line" />
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            {[
              { name: 'Ana Carolina', stars: 5, text: 'Recebi meu colar e fiquei sem palavras. A qualidade é impecável e o acabamento é de joalheria fina. Vou comprar muito mais!' },
              { name: 'Beatriz Oliveira', stars: 5, text: 'O anel de noivado que meu namorado comprou aqui foi perfeito. Entrega rápida e bem embalado. Recomendo demais!' },
              { name: 'Fernanda Lima', stars: 5, text: 'Joias lindíssimas e preços justos. O atendimento foi excelente e chegou antes do prazo. Marca incrível!' },
            ].map(review => (
              <div key={review.name} className="bg-dark-800 p-8 border border-gold-500/10">
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={14} className="text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-dark-200 text-sm leading-relaxed italic mb-6">"{review.text}"</p>
                <p className="text-gold-400 text-xs tracking-[0.3em] uppercase font-semibold">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
