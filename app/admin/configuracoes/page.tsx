'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard, Store, Truck, Share2, Lock, Mail,
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ExternalLink
} from 'lucide-react'
import { useToast } from '@/lib/toast-context'

interface Settings {
  mercadopago: { accessToken: string; publicKey: string; installments: number; pixDiscount: number }
  loja: { nome: string; cnpj: string; telefone: string; whatsapp: string; email: string; endereco: string; cidade: string; siteUrl: string }
  frete: { gratisPorValor: number; valorFixo: number }
  social: { instagram: string; facebook: string }
  seguranca: { adminPassword: string }
  smtp: { host: string; port: number; user: string; pass: string; notifyEmail: string }
}

type SectionKey = keyof Settings
type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export default function Configuracoes() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Record<SectionKey, SaveStatus>>({
    mercadopago: 'idle', loja: 'idle', frete: 'idle', social: 'idle', seguranca: 'idle', smtp: 'idle',
  })
  const [showToken, setShowToken] = useState(false)
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [testingMP, setTestingMP] = useState(false)
  const [mpTestResult, setMpTestResult] = useState<'idle' | 'ok' | 'error'>('idle')
  const [testingEmail, setTestingEmail] = useState(false)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then(data => {
        setSettings({ smtp: { host: '', port: 587, user: '', pass: '', notifyEmail: '' }, ...data })
        setLoading(false)
      })
  }, [])

  const update = <K extends SectionKey>(section: K, key: string, value: unknown) => {
    setSettings(prev => prev ? ({ ...prev, [section]: { ...prev[section], [key]: value } }) : prev)
    setStatus(s => ({ ...s, [section]: 'idle' }))
  }

  const save = async (section: SectionKey) => {
    if (!settings) return
    setStatus(s => ({ ...s, [section]: 'saving' }))

    let payload: Partial<Settings> = { [section]: settings[section] }

    if (section === 'seguranca') {
      if (!newPassword) { setStatus(s => ({ ...s, seguranca: 'idle' })); return }
      if (newPassword !== confirmPassword) {
        showToast('As senhas não coincidem.', 'error')
        setStatus(s => ({ ...s, seguranca: 'idle' }))
        return
      }
      if (newPassword.length < 8) {
        showToast('A senha deve ter no mínimo 8 caracteres.', 'error')
        setStatus(s => ({ ...s, seguranca: 'idle' }))
        return
      }
      payload = { seguranca: { adminPassword: newPassword } }
    }

    try {
      const res = await fetch('/api/admin/configuracoes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus(s => ({ ...s, [section]: 'success' }))
      showToast('Configurações salvas com sucesso!')
      if (section === 'seguranca') { setNewPassword(''); setConfirmPassword('') }
      setTimeout(() => setStatus(s => ({ ...s, [section]: 'idle' })), 3000)
    } catch {
      setStatus(s => ({ ...s, [section]: 'error' }))
      showToast('Erro ao salvar. Tente novamente.', 'error')
      setTimeout(() => setStatus(s => ({ ...s, [section]: 'idle' })), 3000)
    }
  }

  const testMPConnection = async () => {
    if (!settings?.mercadopago.accessToken) return
    setTestingMP(true); setMpTestResult('idle')
    try {
      await fetch('/api/admin/configuracoes', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mercadopago: settings.mercadopago }),
      })
      const res = await fetch('/api/admin/mp-test')
      const ok = res.ok
      setMpTestResult(ok ? 'ok' : 'error')
      showToast(ok ? '✓ Mercado Pago conectado!' : 'Token inválido ou sem acesso.', ok ? 'success' : 'error')
    } catch { setMpTestResult('error') }
    finally { setTestingMP(false) }
  }

  const testEmail = async () => {
    if (!settings?.smtp.notifyEmail) return
    setTestingEmail(true)
    try {
      await fetch('/api/admin/configuracoes', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smtp: settings.smtp }),
      })
      const res = await fetch('/api/admin/email-test', { method: 'POST' })
      const data = await res.json()
      showToast(data.ok ? '✓ E-mail de teste enviado!' : (data.error || 'Erro ao enviar'), data.ok ? 'success' : 'error')
    } catch { showToast('Erro ao testar e-mail', 'error') }
    finally { setTestingEmail(false) }
  }

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-[400px]"><Loader2 size={28} className="text-gold-400 animate-spin" /></div>
  }
  if (!settings) return null

  const inputClass = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-2.5 outline-none transition-colors text-sm"
  const labelClass = "block text-dark-400 text-xs tracking-wider uppercase mb-1.5"

  const SaveButton = ({ section }: { section: SectionKey }) => {
    const s = status[section]
    return (
      <button
        onClick={() => save(section)}
        disabled={s === 'saving'}
        className={`flex items-center gap-2 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${
          s === 'success' ? 'bg-green-600 text-white' :
          s === 'error'   ? 'bg-red-600 text-white' :
          s === 'saving'  ? 'bg-dark-600 text-dark-400 cursor-wait' :
          'bg-gold-500 hover:bg-gold-400 text-dark-900'
        }`}
      >
        {s === 'saving'  && <Loader2 size={13} className="animate-spin" />}
        {s === 'success' && <CheckCircle2 size={13} />}
        {s === 'error'   && <AlertCircle size={13} />}
        {s === 'saving' ? 'Salvando...' : s === 'success' ? 'Salvo!' : s === 'error' ? 'Erro' : 'Salvar'}
      </button>
    )
  }

  const Section = ({ title, icon, children, section }: {
    title: string; icon: React.ReactNode; children: React.ReactNode; section: SectionKey
  }) => (
    <div className="bg-dark-800 border border-gold-500/10">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-500/10">
        <div className="flex items-center gap-3">
          <span className="text-gold-400">{icon}</span>
          <h2 className="text-cream text-sm tracking-[0.2em] uppercase">{title}</h2>
        </div>
        <SaveButton section={section} />
      </div>
      <div className="px-6 py-6 space-y-4">{children}</div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-cream font-light">Configurações</h1>
        <p className="text-dark-400 text-sm mt-1">Gerencie todas as integrações e dados da sua loja.</p>
      </div>

      {/* ─── MERCADO PAGO ─────────────────────────────────────── */}
      <Section title="Mercado Pago" icon={<CreditCard size={18} />} section="mercadopago">
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 flex items-start gap-3">
          <ExternalLink size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-blue-300 text-xs leading-relaxed">
            Pegue suas credenciais em{' '}
            <a href="https://www.mercadopago.com.br/developers/panel" target="_blank" rel="noreferrer" className="underline hover:text-blue-200">
              mercadopago.com.br/developers/panel
            </a>{' '}→ Suas integrações → Credenciais de produção.
          </p>
        </div>

        <div>
          <label className={labelClass}>Access Token (privado — nunca compartilhe)</label>
          <div className="relative">
            <input type={showToken ? 'text' : 'password'} value={settings.mercadopago.accessToken}
              onChange={e => update('mercadopago', 'accessToken', e.target.value)}
              placeholder="APP_USR-xxxx-xxxx-xxxx-xxxx" className={`${inputClass} pr-10`} />
            <button type="button" onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Public Key</label>
          <input type="text" value={settings.mercadopago.publicKey}
            onChange={e => update('mercadopago', 'publicKey', e.target.value)}
            placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Parcelas máximas</label>
            <select value={settings.mercadopago.installments}
              onChange={e => update('mercadopago', 'installments', Number(e.target.value))} className={inputClass}>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n}x</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Desconto no PIX (%)</label>
            <input type="number" min="0" max="30" step="0.5"
              value={settings.mercadopago.pixDiscount}
              onChange={e => update('mercadopago', 'pixDiscount', Number(e.target.value))} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button onClick={testMPConnection} disabled={testingMP || !settings.mercadopago.accessToken}
            className="flex items-center gap-2 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-4 py-2 text-xs transition-colors disabled:opacity-40">
            {testingMP && <Loader2 size={13} className="animate-spin" />}
            Testar Conexão
          </button>
          {mpTestResult === 'ok'    && <span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle2 size={13} /> Conectado!</span>}
          {mpTestResult === 'error' && <span className="text-red-400 text-xs flex items-center gap-1"><AlertCircle size={13} /> Token inválido.</span>}
        </div>
      </Section>

      {/* ─── DADOS DA LOJA ─────────────────────────────────────── */}
      <Section title="Dados da Loja" icon={<Store size={18} />} section="loja">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nome da Loja</label>
            <input type="text" value={settings.loja.nome} onChange={e => update('loja', 'nome', e.target.value)}
              placeholder="Afrodite Joias" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>CNPJ</label>
            <input type="text" value={settings.loja.cnpj} onChange={e => update('loja', 'cnpj', e.target.value)}
              placeholder="00.000.000/0001-00" className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>E-mail de Contato</label>
            <input type="email" value={settings.loja.email} onChange={e => update('loja', 'email', e.target.value)}
              placeholder="contato@afroditejoias.com.br" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Telefone</label>
            <input type="text" value={settings.loja.telefone} onChange={e => update('loja', 'telefone', e.target.value)}
              placeholder="(11) 99999-9999" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>WhatsApp <span className="text-dark-600 normal-case tracking-normal">(só números: 5511999999999)</span></label>
          <input type="text" value={settings.loja.whatsapp}
            onChange={e => update('loja', 'whatsapp', e.target.value.replace(/\D/g, ''))}
            placeholder="5511999999999" className={inputClass} />
          {settings.loja.whatsapp && (
            <a href={`https://wa.me/${settings.loja.whatsapp}`} target="_blank" rel="noreferrer"
              className="text-green-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline">
              <ExternalLink size={11} /> Testar link WhatsApp
            </a>
          )}
        </div>
        <div>
          <label className={labelClass}>Endereço</label>
          <input type="text" value={settings.loja.endereco} onChange={e => update('loja', 'endereco', e.target.value)}
            placeholder="Rua das Flores, 123 — Jardins" className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cidade / Estado</label>
            <input type="text" value={settings.loja.cidade} onChange={e => update('loja', 'cidade', e.target.value)}
              placeholder="São Paulo, SP" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>URL do Site</label>
            <input type="url" value={settings.loja.siteUrl} onChange={e => update('loja', 'siteUrl', e.target.value)}
              placeholder="https://afroditejoias.com.br" className={inputClass} />
          </div>
        </div>
      </Section>

      {/* ─── FRETE ─────────────────────────────────────────────── */}
      <Section title="Frete" icon={<Truck size={18} />} section="frete">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Frete grátis acima de (R$)</label>
            <input type="number" min="0" step="10" value={settings.frete.gratisPorValor}
              onChange={e => update('frete', 'gratisPorValor', Number(e.target.value))} className={inputClass} />
            <p className="text-dark-500 text-xs mt-1">Use 0 para frete sempre grátis.</p>
          </div>
          <div>
            <label className={labelClass}>Valor fixo do frete (R$)</label>
            <input type="number" min="0" step="1" value={settings.frete.valorFixo}
              onChange={e => update('frete', 'valorFixo', Number(e.target.value))} className={inputClass} />
            <p className="text-dark-500 text-xs mt-1">Cobrado quando abaixo do mínimo.</p>
          </div>
        </div>
        <div className="p-3 bg-dark-700/50 border border-gold-500/10 text-xs text-dark-400">
          {settings.frete.gratisPorValor === 0
            ? '✓ Frete grátis para todos os pedidos.'
            : `Frete grátis acima de R$ ${settings.frete.gratisPorValor}. Abaixo: R$ ${settings.frete.valorFixo.toFixed(2)}.`}
        </div>
      </Section>

      {/* ─── REDES SOCIAIS ─────────────────────────────────────── */}
      <Section title="Redes Sociais" icon={<Share2 size={18} />} section="social">
        <div>
          <label className={labelClass}>Instagram (URL completa)</label>
          <input type="url" value={settings.social.instagram}
            onChange={e => update('social', 'instagram', e.target.value)}
            placeholder="https://instagram.com/afroditejoias" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Facebook (URL completa)</label>
          <input type="url" value={settings.social.facebook}
            onChange={e => update('social', 'facebook', e.target.value)}
            placeholder="https://facebook.com/afroditejoias" className={inputClass} />
        </div>
      </Section>

      {/* ─── E-MAILS / SMTP ────────────────────────────────────── */}
      <Section title="E-mails de Notificação" icon={<Mail size={18} />} section="smtp">
        <div className="p-3 bg-blue-500/5 border border-blue-500/20 text-blue-300 text-xs leading-relaxed">
          Configure o envio de e-mail para receber um alerta sempre que uma venda for aprovada.
          Use Gmail (com senha de app), Outlook, ou qualquer provedor SMTP.
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Servidor SMTP</label>
            <input type="text" value={settings.smtp.host}
              onChange={e => update('smtp', 'host', e.target.value)}
              placeholder="smtp.gmail.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Porta</label>
            <select value={settings.smtp.port}
              onChange={e => update('smtp', 'port', Number(e.target.value))} className={inputClass}>
              <option value={587}>587 (TLS — recomendado)</option>
              <option value={465}>465 (SSL)</option>
              <option value={25}>25</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>E-mail remetente (login do SMTP)</label>
          <input type="email" value={settings.smtp.user}
            onChange={e => update('smtp', 'user', e.target.value)}
            placeholder="seuemail@gmail.com" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Senha do SMTP <span className="text-dark-600 normal-case tracking-normal">(Gmail: use "Senha de App")</span></label>
          <div className="relative">
            <input type={showSmtpPass ? 'text' : 'password'} value={settings.smtp.pass}
              onChange={e => update('smtp', 'pass', e.target.value)}
              placeholder="••••••••••••" className={`${inputClass} pr-10`} />
            <button type="button" onClick={() => setShowSmtpPass(!showSmtpPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              {showSmtpPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer"
            className="text-blue-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline">
            <ExternalLink size={11} /> Como criar senha de app do Gmail
          </a>
        </div>

        <div>
          <label className={labelClass}>E-mail para receber notificações de pedido</label>
          <input type="email" value={settings.smtp.notifyEmail}
            onChange={e => update('smtp', 'notifyEmail', e.target.value)}
            placeholder="dona@afroditejoias.com.br" className={inputClass} />
          <p className="text-dark-500 text-xs mt-1">Pode ser diferente do e-mail remetente.</p>
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button onClick={testEmail} disabled={testingEmail || !settings.smtp.notifyEmail || !settings.smtp.host}
            className="flex items-center gap-2 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-4 py-2 text-xs transition-colors disabled:opacity-40">
            {testingEmail && <Loader2 size={13} className="animate-spin" />}
            Enviar E-mail de Teste
          </button>
        </div>
      </Section>

      {/* ─── SEGURANÇA ─────────────────────────────────────────── */}
      <Section title="Senha do Admin" icon={<Lock size={18} />} section="seguranca">
        <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 text-yellow-300 text-xs">
          Ao salvar, você precisará usar a nova senha no próximo login.
        </div>
        <div>
          <label className={labelClass}>Nova Senha</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres" minLength={8} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Confirmar Nova Senha</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha" className={inputClass} />
        </div>
        {newPassword && newPassword !== confirmPassword && (
          <p className="text-red-400 text-xs">As senhas não coincidem.</p>
        )}
      </Section>
    </div>
  )
}
