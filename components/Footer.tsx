'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') return (
    <p className="text-gold-400 text-sm font-semibold">✓ Inscrição confirmada! Obrigada.</p>
  )

  return (
    <form className="flex w-full md:w-auto gap-0" onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Seu e-mail"
        required
        className="bg-dark-700 border border-gold-500/30 text-cream placeholder:text-dark-400 px-5 py-3 text-sm flex-1 md:w-72 outline-none focus:border-gold-400 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold px-6 py-3 text-sm tracking-widest uppercase transition-colors whitespace-nowrap disabled:opacity-60"
      >
        {status === 'loading' ? '...' : 'Assinar'}
      </button>
    </form>
  )
}

interface PublicCfg {
  loja: { nome: string; email: string; telefone: string; whatsapp: string; cidade: string; cnpj: string; siteUrl: string }
  social: { instagram: string; facebook: string }
}

export default function Footer() {
  const [cfg, setCfg] = useState<PublicCfg>({
    loja:   { nome: 'Afrodite Joias', email: 'contato@afroditejoias.com.br', telefone: '(11) 99999-9999', whatsapp: '', cidade: 'São Paulo, SP', cnpj: '00.000.000/0001-00', siteUrl: '' },
    social: { instagram: '', facebook: '' },
  })

  useEffect(() => {
    fetch('/api/configuracoes/publicas')
      .then(r => r.json())
      .then(d => setCfg(prev => ({ ...prev, ...d })))
      .catch(() => {})
  }, [])

  const instagramUrl = cfg.social.instagram
    ? `https://instagram.com/${cfg.social.instagram.replace('@', '')}`
    : '#'
  const facebookUrl = cfg.social.facebook
    ? `https://facebook.com/${cfg.social.facebook.replace('@', '')}`
    : '#'

  return (
    <footer className="bg-dark-800 border-t border-gold-500/20">
      {/* Newsletter */}
      <div className="border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-cream font-light">Receba Nossas Novidades</h3>
            <p className="text-dark-300 text-sm mt-1">Ofertas exclusivas e lançamentos em primeira mão.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl text-cream tracking-[0.2em] font-light">
              {cfg.loja.nome?.toUpperCase() || 'AFRODITE'}
            </span>
            <span className="text-gold-400 text-[9px] tracking-[0.4em] uppercase">joias</span>
          </Link>
          <p className="text-dark-400 text-sm mt-4 leading-relaxed">
            Joias exclusivas criadas para mulheres que celebram sua própria divindade.
          </p>
          <div className="flex gap-4 mt-6">
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
              className="text-dark-400 hover:text-gold-400 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
              className="text-dark-400 hover:text-gold-400 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Coleções */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Coleções</h4>
          <ul className="space-y-3">
            {[
              { href: '/produtos?categoria=aneis',     label: 'Anéis' },
              { href: '/produtos?categoria=colares',   label: 'Colares' },
              { href: '/produtos?categoria=brincos',   label: 'Brincos' },
              { href: '/produtos?categoria=pulseiras', label: 'Pulseiras' },
              { href: '/produtos',                     label: 'Todas as Joias' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Ajuda</h4>
          <ul className="space-y-3">
            {[
              { href: '/como-comprar',      label: 'Como Comprar' },
              { href: '/trocas-devolucoes', label: 'Trocas e Devoluções' },
              { href: '/garantia',          label: 'Garantia' },
              { href: '/faq',               label: 'Perguntas Frequentes' },
              { href: '/cuidados-joias',    label: 'Cuidados com Joias' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Empresa */}
        <div className="hidden md:block">
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Empresa</h4>
          <ul className="space-y-3">
            {[
              { href: '/sobre',   label: 'Sobre Nós' },
              { href: '/contato', label: 'Contato' },
              { href: '/faq',     label: 'FAQ' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Contato</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <Mail size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>{cfg.loja.email || 'contato@afroditejoias.com.br'}</span>
            </li>
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <Phone size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>{cfg.loja.telefone || '(11) 99999-9999'}</span>
            </li>
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>{cfg.loja.cidade || 'São Paulo, SP'} — Brasil</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-dark-500 text-xs">
          <p>© {new Date().getFullYear()} {cfg.loja.nome || 'Afrodite Joias'}. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/politica-privacidade" className="hover:text-gold-400 transition-colors">Privacidade</Link>
            <Link href="/termos-uso" className="hover:text-gold-400 transition-colors">Termos de Uso</Link>
            {cfg.loja.cnpj && (
              <span>CNPJ: {cfg.loja.cnpj}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
