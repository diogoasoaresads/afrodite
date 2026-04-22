'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Senha incorreta. Tente novamente.')
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="font-serif text-4xl text-cream tracking-[0.2em]">AFRODITE</span>
          <p className="text-gold-500 text-[10px] tracking-[0.5em] uppercase mt-1">painel administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="bg-dark-800 border border-gold-500/10 p-8 space-y-5">
          <div className="flex justify-center mb-2">
            <Lock size={28} className="text-gold-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-cream text-center font-serif text-2xl font-light">Acesso Restrito</h1>

          <div>
            <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-gold w-full"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-dark-600 text-xs text-center">
            Senha padrão: <code className="text-dark-400">afrodite2024</code><br />
            (configure via variável ADMIN_PASSWORD no .env.local)
          </p>
        </form>
      </div>
    </div>
  )
}
