'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="animate-fade-in">
        <AlertTriangle size={40} className="text-gold-400 mx-auto mb-4" />
        <p className="text-gold-500 text-xs tracking-[0.5em] uppercase mb-2">Erro 500</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-[var(--c-text)] font-light mb-4">
          Algo deu errado
        </h1>
        <div className="w-16 h-px bg-gold-500 mx-auto my-5" />
        <p className="text-dark-400 max-w-md mx-auto leading-relaxed mb-8">
          Ocorreu um erro inesperado. Nossa equipe já foi notificada. Tente recarregar a página.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-gold">
            Tentar Novamente
          </button>
          <Link href="/"
            className="px-6 py-3 border border-gold-500/30 text-gold-400 hover:border-gold-500 hover:bg-gold-500/5 transition-all text-sm tracking-widest uppercase font-semibold">
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  )
}
