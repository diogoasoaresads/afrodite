'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, Instagram, CheckCircle } from 'lucide-react'

interface PublicCfg {
  loja: { nome: string; email: string; telefone: string; whatsapp: string }
  social: { instagram: string }
}

export default function ContatoPage() {
  const [cfg, setCfg] = useState<PublicCfg>({
    loja: { nome: 'Afrodite Joias', email: 'contato@afroditejoias.com.br', telefone: '(11) 99999-9999', whatsapp: '' },
    social: { instagram: '' },
  })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/configuracoes/publicas')
      .then(r => r.json())
      .then(d => setCfg(prev => ({ ...prev, ...d })))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Erro ao enviar mensagem.')
        return
      }
      setSent(true)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-dark-800 border border-dark-600 focus:border-gold-500 text-[var(--c-text)] placeholder:text-dark-500 px-4 py-3 outline-none transition-colors"

  const whatsappNum = cfg.loja.whatsapp?.replace(/\D/g, '')
  const whatsappUrl = whatsappNum ? `https://wa.me/55${whatsappNum}?text=Olá,%20vim%20pelo%20site!` : null
  const instagramUrl = cfg.social.instagram
    ? `https://instagram.com/${cfg.social.instagram.replace('@', '')}`
    : null

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Fale Conosco</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Info */}
        <div className="md:col-span-2 space-y-6">
          <p className="text-dark-400 leading-relaxed">
            Estamos aqui para ajudar! Entre em contato pelo formulário ou pelos nossos canais de atendimento.
          </p>

          <div className="space-y-4">
            <a href={`mailto:${cfg.loja.email}`} className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors group">
              <div className="w-10 h-10 bg-dark-800 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-400 transition-colors">
                <Mail size={18} className="text-gold-400" />
              </div>
              <span className="text-sm">{cfg.loja.email}</span>
            </a>

            {cfg.loja.telefone && (
              <div className="flex items-center gap-3 text-dark-300">
                <div className="w-10 h-10 bg-dark-800 border border-gold-500/20 flex items-center justify-center">
                  <Phone size={18} className="text-gold-400" />
                </div>
                <span className="text-sm">{cfg.loja.telefone}</span>
              </div>
            )}

            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors group">
                <div className="w-10 h-10 bg-dark-800 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-400 transition-colors">
                  <Phone size={18} className="text-green-400" />
                </div>
                <span className="text-sm">WhatsApp</span>
              </a>
            )}

            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-dark-300 hover:text-gold-400 transition-colors group">
                <div className="w-10 h-10 bg-dark-800 border border-gold-500/20 flex items-center justify-center group-hover:border-gold-400 transition-colors">
                  <Instagram size={18} className="text-gold-400" />
                </div>
                <span className="text-sm">{cfg.social.instagram}</span>
              </a>
            )}
          </div>

          <div className="bg-dark-800 border border-gold-500/10 p-4">
            <p className="text-dark-400 text-xs leading-relaxed">
              <strong className="text-[var(--c-text)]">Horário de atendimento:</strong><br />
              Segunda a Sexta: 9h às 18h<br />
              Sábados: 9h às 13h<br />
              Respondemos em até 1 dia útil.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div className="md:col-span-3">
          {sent ? (
            <div className="bg-dark-800 border border-gold-500/10 p-10 text-center">
              <CheckCircle size={40} className="text-green-400 mx-auto mb-4" />
              <p className="text-[var(--c-text)] font-serif text-xl font-light mb-2">Mensagem enviada!</p>
              <p className="text-dark-400 text-sm">Retornaremos em até 1 dia útil.</p>
              <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                className="btn-gold inline-block mt-6 text-sm">
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-dark-800 border border-gold-500/10 p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Nome *</label>
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Seu nome" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">E-mail *</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="seu@email.com" required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Assunto *</label>
                <input type="text" value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="Sobre o que você quer falar?" required className={inputClass} />
              </div>
              <div>
                <label className="block text-dark-400 text-xs tracking-wider uppercase mb-2">Mensagem *</label>
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Escreva sua mensagem aqui..." required rows={5}
                  className={`${inputClass} resize-none`} />
              </div>

              {error && <p className="text-red-400 text-sm bg-red-400/10 px-4 py-3">{error}</p>}

              <button type="submit" disabled={loading} className="btn-gold w-full">
                {loading ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
