'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/formatters'

interface Result {
  id: string; name: string; material: string; price: number; images: string[]; category: string
}

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    setLoading(true)
    const timer = setTimeout(() => {
      fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => setResults(d.results || []))
        .finally(() => setLoading(false))
    }, 250)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="fixed inset-0 z-[100] bg-dark-900/95 backdrop-blur-md animate-fade-in">
      <div className="max-w-2xl mx-auto pt-20 px-4 sm:px-6">
        <div className="flex items-center gap-3 border-b border-gold-500/30 pb-4">
          <Search size={22} className="text-gold-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar joias..."
            className="flex-1 bg-transparent text-cream text-xl placeholder:text-dark-500 outline-none"
          />
          {loading && <Loader2 size={18} className="text-gold-400 animate-spin" />}
          <button onClick={onClose} className="text-dark-400 hover:text-gold-400 p-1" aria-label="Fechar">
            <X size={22} />
          </button>
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto">
          {!query.trim() && (
            <div className="text-center py-12">
              <p className="text-dark-500 text-sm">Digite para buscar por nome, material ou categoria.</p>
            </div>
          )}

          {query.trim() && !loading && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-400 text-sm">Nenhum resultado para "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-gold-500/10">
              {results.map(r => (
                <li key={r.id}>
                  <Link href={`/produtos/${r.id}`} onClick={onClose}
                    className="flex items-center gap-4 py-3 px-2 hover:bg-dark-800/50 transition-colors">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-dark-700 overflow-hidden">
                      {r.images?.[0] && (
                        <Image src={r.images[0]} alt={r.name} fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream text-sm font-medium truncate">{r.name}</p>
                      <p className="text-dark-400 text-xs">{r.material} · {r.category}</p>
                    </div>
                    <p className="text-gold-400 font-semibold whitespace-nowrap">{formatPrice(r.price)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
