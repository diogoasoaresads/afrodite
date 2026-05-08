'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Admin Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-dark-900">
      <div className="animate-fade-in max-w-md">
        <AlertTriangle size={36} className="text-red-400 mx-auto mb-4" />
        <h1 className="text-cream text-2xl font-semibold mb-2">Erro no Admin</h1>
        <p className="text-dark-400 text-sm leading-relaxed mb-6">
          {error.message || 'Ocorreu um erro inesperado no painel administrativo.'}
        </p>
        {error.digest && (
          <p className="text-dark-600 text-xs mb-6 font-mono">ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold text-sm transition-colors">
            <RefreshCw size={14} /> Tentar novamente
          </button>
          <Link href="/admin"
            className="px-4 py-2 border border-dark-600 text-dark-400 hover:text-dark-200 text-sm transition-colors">
            Ir ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
