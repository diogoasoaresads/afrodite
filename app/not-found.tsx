import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in">
        <p className="text-gold-500 text-xs tracking-[0.5em] uppercase mb-4">Erro 404</p>
        <h1 className="font-serif text-5xl sm:text-7xl text-[var(--c-text)] font-light mb-4">
          Página não encontrada
        </h1>
        <div className="w-16 h-px bg-gold-500 mx-auto my-6" />
        <p className="text-dark-400 max-w-md mx-auto leading-relaxed mb-8">
          A página que você procura não existe ou foi movida. Explore nossas coleções ou volte ao início.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-gold">
            Voltar ao Início
          </Link>
          <Link
            href="/produtos"
            className="px-6 py-3 border border-gold-500/30 text-gold-400 hover:border-gold-500 hover:bg-gold-500/5 transition-all text-sm tracking-widest uppercase font-semibold"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    </div>
  )
}
