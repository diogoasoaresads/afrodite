'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, User } from 'lucide-react'

type Mode = 'login' | 'register'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })

  const update = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/api/cliente/login' : '/api/cliente/register'
      const body = mode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Ocorreu um erro. Tente novamente.')
        return
      }

      router.push('/conta')
      router.refresh()
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
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center">
            <span className="font-serif text-3xl text-[var(--c-text)] tracking-[0.2em] font-light">AFRODITE</span>
            <span className="text-gold-400 text-[9px] tracking-[0.5em] uppercase mt-0.5">joias</span>
          </Link>
        </div>

        <div className="bg-dark-800 border border-gold-500/10 p-8">
          {/* Tabs */}
          <div className="flex mb-8 border-b border-gold-500/10">
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-colors ${
                mode === 'login'
                  ? 'text-gold-400 border-b-2 border-gold-500 -mb-px'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 pb-3 text-sm tracking-widest uppercase transition-colors ${
                mode === 'register'
                  ? 'text-gold-400 border-b-2 border-gold-500 -mb-px'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Seu nome"
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="seu@email.com"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder={mode === 'register' ? 'Mínimo 6 caracteres' : 'Sua senha'}
                  required
                  minLength={mode === 'register' ? 6 : undefined}
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

            {mode === 'register' && (
              <div>
                <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Confirmar Senha</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Repita a senha"
                  required
                  className={inputClass}
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full mt-2">
              {loading
                ? 'Aguarde...'
                : mode === 'login'
                ? 'Entrar na Minha Conta'
                : 'Criar Minha Conta'}
            </button>

            {mode === 'login' && (
              <div className="text-center mt-4 space-y-2">
                <p className="text-dark-500 text-xs">
                  Ainda não tem conta?{' '}
                  <button type="button" onClick={() => setMode('register')} className="text-gold-400 hover:underline">
                    Cadastre-se grátis
                  </button>
                </p>
                <p className="text-dark-600 text-xs">
                  <Link href="/recuperar-senha" className="text-dark-400 hover:text-gold-400 transition-colors">
                    Esqueci minha senha
                  </Link>
                </p>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-dark-600 text-xs mt-6">
          Ao criar conta, você concorda com nossa{' '}
          <Link href="/politica-privacidade" className="text-gold-500/60 hover:text-gold-400">Política de Privacidade</Link>
        </p>
      </div>
    </div>
  )
}
