'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('afrodite_cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('afrodite_cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('afrodite_cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] p-4 sm:p-6 animate-slide-up">
      <div className="max-w-4xl mx-auto bg-dark-900/98 border border-gold-500/30 backdrop-blur-md p-5 sm:p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie size={22} className="text-gold-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-cream text-sm font-semibold mb-1">Usamos cookies</p>
            <p className="text-dark-400 text-xs leading-relaxed">
              Utilizamos cookies para manter o carrinho, favoritos e preferências. Cookies essenciais são necessários para o funcionamento do site.{' '}
              <Link href="/politica-privacidade" className="text-gold-400 hover:underline">
                Saiba mais
              </Link>
            </p>
          </div>
          <button onClick={decline} className="text-dark-500 hover:text-dark-300 flex-shrink-0 ml-2" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-5 sm:justify-end">
          <button
            onClick={decline}
            className="px-5 py-2 border border-dark-600 text-dark-400 hover:text-dark-200 hover:border-dark-400 text-xs tracking-widest uppercase transition-colors"
          >
            Apenas essenciais
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold text-xs tracking-widest uppercase transition-colors"
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  )
}
