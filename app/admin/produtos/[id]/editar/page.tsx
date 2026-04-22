'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const categoryOptions = [
  { value: 'aneis',     label: 'Anéis' },
  { value: 'colares',   label: 'Colares' },
  { value: 'brincos',   label: 'Brincos' },
  { value: 'pulseiras', label: 'Pulseiras' },
]

export default function EditarProduto() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<any>(null)
  const [images, setImages] = useState<string[]>([''])
  const [details, setDetails] = useState<string[]>([''])
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/produtos`)
      .then(r => r.json())
      .then((products: any[]) => {
        const product = products.find((p: any) => p.id === id)
        if (product) {
          setForm(product)
          setImages(product.images?.length ? product.images : [''])
          setDetails(product.details?.length ? product.details : [''])
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const update = (key: string, value: unknown) => setForm((prev: any) => ({ ...prev, [key]: value }))

  const handleImageUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) {
        const newImages = [...images]
        newImages[idx] = data.url
        setImages(newImages)
      }
    } catch { alert('Erro ao fazer upload') }
    finally { setUploadingIdx(null) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images: images.filter(Boolean), details: details.filter(Boolean) }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      router.push('/admin/produtos')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally { setSaving(false) }
  }

  if (loading) return <div className="p-8 text-dark-400 animate-pulse">Carregando...</div>
  if (!form) return <div className="p-8 text-red-400">Produto não encontrado.</div>

  const inputClass = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors text-sm"
  const labelClass = "block text-dark-400 text-xs tracking-wider uppercase mb-2"

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-cream font-light">Editar Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-5">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">Informações</h2>
          <div>
            <label className={labelClass}>Nome *</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço (R$) *</label>
              <input type="number" value={form.price} onChange={e => update('price', parseFloat(e.target.value))} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preço Original</label>
              <input type="number" value={form.originalPrice || ''} onChange={e => update('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className={inputClass}>
                {categoryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Material *</label>
              <input type="text" value={form.material} onChange={e => update('material', e.target.value)} required className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} required
              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream px-4 py-3 outline-none transition-colors text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ key: 'inStock', label: 'Em Estoque' }, { key: 'featured', label: 'Destaque' }, { key: 'isNew', label: 'Novo' }, { key: 'isSale', label: 'Promoção' }].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => update(key, !form[key])}
                  className={`w-10 h-5 rounded-full transition-colors ${form[key] ? 'bg-gold-500' : 'bg-dark-600'} relative`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-dark-300 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-4">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">Fotos</h2>
          {images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-2">
                <input type="text" value={img} onChange={e => { const n = [...images]; n[idx] = e.target.value; setImages(n) }}
                  placeholder="URL da imagem" className={`${inputClass} flex-1`} />
                <label className="flex items-center gap-2 bg-dark-700 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-3 cursor-pointer transition-colors text-xs">
                  <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(idx, f) }} />
                  {uploadingIdx === idx ? '...' : 'Upload'}
                </label>
                {images.length > 1 && (
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="p-2 text-dark-400 hover:text-red-400">
                    <X size={16} />
                  </button>
                )}
              </div>
              {img && img.length > 4 && (
                <div className="relative w-20 h-20 bg-dark-700 overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </div>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setImages([...images, ''])} className="flex items-center gap-2 text-gold-400 text-sm">
            <Plus size={14} /> Adicionar foto
          </button>
        </div>

        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-4">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">Detalhes</h2>
          {details.map((d, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={d} onChange={e => { const n = [...details]; n[idx] = e.target.value; setDetails(n) }} className={`${inputClass} flex-1`} />
              {details.length > 1 && <button type="button" onClick={() => setDetails(details.filter((_, i) => i !== idx))} className="p-2 text-dark-400 hover:text-red-400"><X size={16} /></button>}
            </div>
          ))}
          <button type="button" onClick={() => setDetails([...details, ''])} className="flex items-center gap-2 text-gold-400 text-sm">
            <Plus size={14} /> Adicionar detalhe
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-gold">{saving ? 'Salvando...' : 'Salvar Alterações'}</button>
          <Link href="/admin/produtos" className="btn-outline-gold">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
