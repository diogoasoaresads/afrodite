'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function RedefinirSenhaPage() {
  const { token } = useParams<{ token: string }>()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cliente/redefinir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao redefinir senha.')
        return
      }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-serif text-3xl text-[var(--c-text)] tracking-[0.2em] font-light">AFRODITE</span>
            <span className="text-gold-400 text-[9px] tracking-[0.5em] uppercase mt-0.5">joias</span>
          </Link>
        </div>

        <div className="bg-dark-800 border border-gold-500/10 p-8">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <p className="text-cream text-lg font-serif font-light mb-2">Senha redefinida!</p>
              <p className="text-dark-400 text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <>
              <h1 className="text-cream text-lg font-serif font-light mb-2">Nova Senha</h1>
              <p className="text-dark-400 text-sm mb-6">Escolha uma nova senha segura para sua conta.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Nova Senha</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError('') }}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Confirmar Senha</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => { setConfirm(e.target.value); setError('') }}
                    placeholder="Repita a nova senha"
                    required
                    className={inputClass}
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3">{error}</p>
                )}

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? 'Salvando...' : 'Redefinir Senha'}
                </button>

                <p className="text-center">
                  <Link href="/login" className="text-dark-400 hover:text-gold-400 text-xs transition-colors">
                    Cancelar e voltar ao login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
