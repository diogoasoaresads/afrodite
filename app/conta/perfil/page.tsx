'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface ProfileForm {
  name: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function PerfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  const [form, setForm] = useState<ProfileForm>({
    name: '', email: '', phone: '',
    currentPassword: '', newPassword: '', confirmPassword: '',
  })

  useEffect(() => {
    fetch('/api/cliente/perfil')
      .then(r => {
        if (r.status === 401) { router.push('/login'); return null }
        return r.json()
      })
      .then(d => {
        if (d) setForm(prev => ({ ...prev, name: d.name || '', email: d.email || '', phone: d.phone || '' }))
      })
      .catch(() => setError('Erro ao carregar perfil.'))
      .finally(() => setLoading(false))
  }, [router])

  const update = (key: keyof ProfileForm, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.newPassword && form.newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setSaving(true)
    try {
      const body: any = { name: form.name, email: form.email, phone: form.phone }
      if (form.newPassword) {
        body.currentPassword = form.currentPassword
        body.newPassword = form.newPassword
      }

      const res = await fetch('/api/cliente/atualizar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao salvar.')
        return
      }
      setSuccess(true)
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-[var(--c-text)] placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-dark-400 animate-pulse text-sm">Carregando perfil...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/conta" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-2xl sm:text-3xl text-[var(--c-text)] font-light">Meu Perfil</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Dados pessoais */}
        <div className="bg-dark-800 border border-gold-500/10 p-6">
          <h2 className="text-[var(--c-text)] text-xs tracking-[0.3em] uppercase mb-6 pb-3 border-b border-gold-500/10">
            Dados Pessoais
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Nome Completo</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Telefone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Alterar senha */}
        <div className="bg-dark-800 border border-gold-500/10 p-6">
          <h2 className="text-[var(--c-text)] text-xs tracking-[0.3em] uppercase mb-2 pb-3 border-b border-gold-500/10">
            Alterar Senha
          </h2>
          <p className="text-dark-500 text-xs mb-5">Deixe em branco se não quiser alterar a senha.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Senha Atual</label>
              <div className="relative">
                <input
                  type={showCurrentPw ? 'text' : 'password'}
                  value={form.currentPassword}
                  onChange={e => update('currentPassword', e.target.value)}
                  placeholder="Sua senha atual"
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Nova Senha</label>
              <div className="relative">
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={form.newPassword}
                  onChange={e => update('newPassword', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  className={`${inputClass} pr-12`}
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Confirmar Nova Senha</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                placeholder="Repita a nova senha"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3">{error}</p>
        )}

        {success && (
          <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3">
            <CheckCircle size={16} />
            <p className="text-sm">Perfil atualizado com sucesso!</p>
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-gold w-full">
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  )
}
