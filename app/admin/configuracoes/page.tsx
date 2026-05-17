'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle, Store, Truck, Share2, Lock, Mail,
  Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, ExternalLink,
  Zap, ToggleLeft, ToggleRight, Send
} from 'lucide-react'
import { useToast } from '@/lib/toast-context'

interface Settings {
  mercadopago: { accessToken: string; publicKey: string; installments: number; pixDiscount: number }
  loja: { nome: string; cnpj: string; telefone: string; whatsapp: string; email: string; endereco: string; cidade: string; siteUrl: string }
  frete: { gratisPorValor: number; valorFixo: number }
  social: { instagram: string; facebook: string }
  seguranca: { adminPassword: string }
  smtp: { host: string; port: number; user: string; pass: string; notifyEmail: string }
  evolution: { enabled: boolean; url: string; apiKey: string; instance: string; ownerPhone: string }
}

type SectionKey = keyof Settings
type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

export default function Configuracoes() {
  const { showToast } = useToast()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<Record<SectionKey, SaveStatus>>({
    mercadopago: 'idle', loja: 'idle', frete: 'idle', social: 'idle', seguranca: 'idle', smtp: 'idle', evolution: 'idle',
  })
  const [showSmtpPass, setShowSmtpPass] = useState(false)
  const [showEvolutionKey, setShowEvolutionKey] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [testingEmail, setTestingEmail] = useState(false)
  const [testingEvolution, setTestingEvolution] = useState(false)
  const [evolutionTestMsg, setEvolutionTestMsg] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then(r => r.json())
      .then(data => {
        setSettings({
          smtp: { host: '', port: 587, user: '', pass: '', notifyEmail: '' },
          evolution: { enabled: false, url: '', apiKey: '', instance: '', ownerPhone: '' },
          ...data,
        })
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

  const testEvolution = async () => {
    if (!settings) return
    setTestingEvolution(true)
    setEvolutionTestMsg(null)
    try {
      // Salva as configurações atuais antes de testar
      await fetch('/api/admin/configuracoes', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evolution: settings.evolution }),
      })
      const res = await fetch('/api/admin/evolution-test', { method: 'POST' })
      const data = await res.json()
      setEvolutionTestMsg({ ok: data.ok, message: data.ok ? data.message : (data.error || 'Erro ao testar') })
    } catch {
      setEvolutionTestMsg({ ok: false, message: 'Falha na conexão com o servidor.' })
    } finally { setTestingEvolution(false) }
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

      {/* ─── DADOS DA LOJA ─────────────────────────────────────── */}
      <Section title="Dados da Loja" icon={<Store size={18} />} section="loja">
        <div className="p-3 bg-green-500/5 border border-green-500/20 flex items-start gap-3">
          <MessageCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
          <p className="text-green-300 text-xs leading-relaxed">
            O <strong>WhatsApp</strong> é o canal principal de vendas. Certifique-se de que o número está correto — ele é usado no botão "Finalizar pelo WhatsApp" do checkout.
          </p>
        </div>
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

      {/* ─── EVOLUTION API ─────────────────────────────────────── */}
      <Section title="Evolution API — Notificações WhatsApp" icon={<Zap size={18} />} section="evolution">
        <div className="p-3 bg-green-500/5 border border-green-500/20 text-green-300 text-xs leading-relaxed">
          <strong>Como funciona:</strong> Quando um cliente clica em "Finalizar pelo WhatsApp", o site salva o pedido e <em>automaticamente envia uma mensagem para você</em> com todos os detalhes — mesmo que o cliente não vá até o final no WhatsApp. Assim você pode chamar primeiro!
        </div>

        {/* Toggle ativo/inativo */}
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-cream text-sm">Ativar notificações automáticas</p>
            <p className="text-dark-500 text-xs">Receba mensagem WhatsApp a cada novo pedido</p>
          </div>
          <button
            onClick={() => update('evolution', 'enabled', !settings.evolution.enabled)}
            className="text-gold-400 hover:text-gold-300 transition-colors"
          >
            {settings.evolution.enabled
              ? <ToggleRight size={36} className="text-green-400" />
              : <ToggleLeft size={36} className="text-dark-500" />}
          </button>
        </div>

        <div>
          <label className={labelClass}>URL do servidor Evolution <span className="text-dark-600 normal-case tracking-normal">(sem barra no final)</span></label>
          <input
            type="url"
            value={settings.evolution.url}
            onChange={e => update('evolution', 'url', e.target.value)}
            placeholder="https://evolution.seuservidor.com"
            className={inputClass}
          />
          <a href="https://doc.evolution-api.com" target="_blank" rel="noreferrer"
            className="text-blue-400 text-xs mt-1 inline-flex items-center gap-1 hover:underline">
            <ExternalLink size={11} /> Documentação Evolution API
          </a>
        </div>

        <div>
          <label className={labelClass}>Nome da Instância</label>
          <input
            type="text"
            value={settings.evolution.instance}
            onChange={e => update('evolution', 'instance', e.target.value)}
            placeholder="afrodite"
            className={inputClass}
          />
          <p className="text-dark-500 text-xs mt-1">Exatamente como aparece no painel do Evolution.</p>
        </div>

        <div>
          <label className={labelClass}>API Key <span className="text-dark-600 normal-case tracking-normal">(Global ou da instância)</span></label>
          <div className="relative">
            <input
              type={showEvolutionKey ? 'text' : 'password'}
              value={settings.evolution.apiKey}
              onChange={e => update('evolution', 'apiKey', e.target.value)}
              placeholder="••••••••••••••••••••"
              className={`${inputClass} pr-10`}
            />
            <button type="button" onClick={() => setShowEvolutionKey(!showEvolutionKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-dark-300">
              {showEvolutionKey ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Seu número WhatsApp <span className="text-dark-600 normal-case tracking-normal">(para receber notificações)</span></label>
          <input
            type="text"
            value={settings.evolution.ownerPhone}
            onChange={e => update('evolution', 'ownerPhone', e.target.value.replace(/\D/g, ''))}
            placeholder="5511999999999"
            className={inputClass}
          />
          <p className="text-dark-500 text-xs mt-1">Código do país + DDD + número. Ex: 5511999999999</p>
        </div>

        {/* Resultado do teste */}
        {evolutionTestMsg && (
          <div className={`flex items-start gap-2 p-3 border text-xs ${
            evolutionTestMsg.ok
              ? 'bg-green-500/5 border-green-500/20 text-green-300'
              : 'bg-red-500/5 border-red-500/20 text-red-300'
          }`}>
            {evolutionTestMsg.ok ? <CheckCircle2 size={14} className="flex-shrink-0 mt-0.5" /> : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />}
            <span>{evolutionTestMsg.message}</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-1">
          <button
            onClick={testEvolution}
            disabled={testingEvolution || !settings.evolution.url || !settings.evolution.apiKey || !settings.evolution.instance}
            className="flex items-center gap-2 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-4 py-2 text-xs transition-colors disabled:opacity-40"
          >
            {testingEvolution ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {testingEvolution ? 'Testando...' : 'Testar Conexão'}
          </button>
          <p className="text-dark-600 text-xs">Salva as configurações e envia mensagem de teste</p>
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
