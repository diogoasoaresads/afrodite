'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/cliente/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Erro ao enviar. Tente novamente.')
        return
      }
      setSent(true)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-serif text-3xl text-[var(--c-text)] tracking-[0.2em] font-light">AFRODITE</span>
            <span className="text-gold-400 text-[9px] tracking-[0.5em] uppercase mt-0.5">joias</span>
          </Link>
        </div>

        <div className="bg-dark-800 border border-gold-500/10 p-8">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/login" className="text-dark-400 hover:text-gold-400 transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-cream text-lg font-serif font-light">Recuperar Senha</h1>
          </div>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={26} className="text-gold-400" />
              </div>
              <p className="text-cream text-base font-light mb-2">Verifique seu e-mail</p>
              <p className="text-dark-400 text-sm leading-relaxed">
                Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha em breve.
              </p>
              <Link href="/login" className="btn-gold inline-block mt-6 text-sm">
                Voltar ao Login
              </Link>
            </div>
          ) : (
            <>
              <p className="text-dark-400 text-sm mb-6 leading-relaxed">
                Digite o e-mail da sua conta e enviaremos um link para redefinir sua senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="seu@email.com"
                    required
                    className="w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3">{error}</p>
                )}

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
