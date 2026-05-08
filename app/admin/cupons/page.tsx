'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, Copy, Check } from 'lucide-react'
import type { Coupon } from '@/lib/db'

export default function CuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    code: '', type: 'percent' as 'percent' | 'fixed',
    discount: '', minValue: '', maxUses: '', expiresAt: '', active: true,
  })

  const load = () => {
    setLoading(true)
    fetch('/api/admin/cupons').then(r => r.json()).then(setCoupons).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/admin/cupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: form.code.toUpperCase(),
          discount: Number(form.discount),
          minValue: Number(form.minValue) || 0,
          maxUses: Number(form.maxUses) || 0,
          expiresAt: form.expiresAt || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao criar cupom.'); return }
      setShowForm(false)
      setForm({ code: '', type: 'percent', discount: '', minValue: '', maxUses: '', expiresAt: '', active: true })
      load()
    } finally { setSaving(false) }
  }

  const toggleActive = async (coupon: Coupon) => {
    await fetch(`/api/admin/cupons/${coupon.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !coupon.active }),
    })
    load()
  }

  const deleteCoupon = async (id: string) => {
    if (!confirm('Excluir este cupom?')) return
    await fetch(`/api/admin/cupons/${id}`, { method: 'DELETE' })
    load()
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDiscount = (c: Coupon) =>
    c.type === 'percent' ? `${c.discount}%` : `R$ ${c.discount.toFixed(2).replace('.', ',')}`

  const isExpired = (c: Coupon) => !!c.expiresAt && new Date(c.expiresAt) < new Date()

  const inputClass = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-3 py-2 text-sm outline-none transition-colors"

  return (
    <div className="p-6 sm:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-cream text-xl font-semibold">Cupons de Desconto</h1>
          <p className="text-dark-400 text-sm mt-1">{coupons.length} cupons cadastrados</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold flex items-center gap-2 text-sm">
          <Plus size={16} /> Novo Cupom
        </button>
      </div>

      {/* Formulário novo cupom */}
      {showForm && (
        <div className="bg-dark-800 border border-gold-500/20 p-6 mb-6">
          <h2 className="text-cream text-sm font-semibold mb-4">Criar Novo Cupom</h2>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-dark-400 text-xs mb-1">Código *</label>
              <input type="text" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="EX: DESCONTO10" required className={inputClass} />
            </div>
            <div>
              <label className="block text-dark-400 text-xs mb-1">Tipo *</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} className={inputClass}>
                <option value="percent">Percentual (%)</option>
                <option value="fixed">Valor fixo (R$)</option>
              </select>
            </div>
            <div>
              <label className="block text-dark-400 text-xs mb-1">
                Desconto * {form.type === 'percent' ? '(%)' : '(R$)'}
              </label>
              <input type="number" min="0.01" step="0.01" value={form.discount}
                onChange={e => setForm(p => ({ ...p, discount: e.target.value }))}
                placeholder={form.type === 'percent' ? '10' : '50'} required className={inputClass} />
            </div>
            <div>
              <label className="block text-dark-400 text-xs mb-1">Valor mínimo (R$)</label>
              <input type="number" min="0" step="0.01" value={form.minValue}
                onChange={e => setForm(p => ({ ...p, minValue: e.target.value }))}
                placeholder="0 = sem mínimo" className={inputClass} />
            </div>
            <div>
              <label className="block text-dark-400 text-xs mb-1">Limite de usos</label>
              <input type="number" min="0" value={form.maxUses}
                onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                placeholder="0 = ilimitado" className={inputClass} />
            </div>
            <div>
              <label className="block text-dark-400 text-xs mb-1">Expira em</label>
              <input type="date" value={form.expiresAt}
                onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                className={inputClass} />
            </div>

            {error && <p className="col-span-full text-red-400 text-sm">{error}</p>}

            <div className="col-span-full flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold text-sm">
                {saving ? 'Salvando...' : 'Criar Cupom'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-dark-400 hover:text-dark-200 text-sm">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de cupons */}
      {loading ? (
        <p className="text-dark-400 text-sm animate-pulse">Carregando...</p>
      ) : coupons.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 border border-dark-700">
          <Tag size={32} className="text-dark-600 mx-auto mb-3" />
          <p className="text-dark-400 text-sm">Nenhum cupom cadastrado.</p>
          <button onClick={() => setShowForm(true)} className="btn-gold mt-4 text-sm">Criar primeiro cupom</button>
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700 text-dark-400 text-xs tracking-wider uppercase">
                <th className="text-left px-4 py-3">Código</th>
                <th className="text-left px-4 py-3">Desconto</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Mínimo</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Usos</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Validade</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className={`border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors ${isExpired(c) ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-gold-400 font-semibold">{c.code}</span>
                      <button onClick={() => copyCode(c.code, c.id)} className="text-dark-500 hover:text-dark-300 transition-colors">
                        {copiedId === c.id ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-cream font-semibold">{formatDiscount(c)}</td>
                  <td className="px-4 py-3 text-dark-400 hidden sm:table-cell">
                    {c.minValue > 0 ? `R$ ${c.minValue.toFixed(2).replace('.', ',')}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-dark-400 hidden md:table-cell">
                    {c.usedCount}/{c.maxUses === 0 ? '∞' : c.maxUses}
                  </td>
                  <td className="px-4 py-3 text-dark-400 hidden lg:table-cell text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('pt-BR') : '—'}
                    {isExpired(c) && <span className="ml-1 text-red-400">(expirado)</span>}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(c)} className="transition-colors">
                      {c.active && !isExpired(c)
                        ? <ToggleRight size={22} className="text-green-400" />
                        : <ToggleLeft size={22} className="text-dark-500" />}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteCoupon(c.id)} className="text-dark-500 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
