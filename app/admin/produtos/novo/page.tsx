'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from '@/lib/toast-context'

const categoryOptions = [
  { value: 'aneis',     label: 'Anéis' },
  { value: 'colares',   label: 'Colares' },
  { value: 'brincos',   label: 'Brincos' },
  { value: 'pulseiras', label: 'Pulseiras' },
]

export default function NovoProduto() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedId, setSavedId] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'aneis',
    description: '',
    material: '',
    inStock: true,
    featured: false,
    isNew: false,
    isSale: false,
  })

  const [images, setImages] = useState<string[]>([''])
  const [details, setDetails] = useState<string[]>([''])
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

  const update = (key: string, value: unknown) => setForm(prev => ({ ...prev, [key]: value }))

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
    } catch {
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploadingIdx(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
          images: images.filter(Boolean),
          details: details.filter(Boolean),
        }),
      })

      if (!res.ok) throw new Error('Erro ao salvar produto')
      const data = await res.json()
      setSavedId(data.id)
      showToast('Produto publicado com sucesso!')
      router.push('/admin/produtos')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors text-sm"
  const labelClass = "block text-dark-400 text-xs tracking-wider uppercase mb-2"

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-cream font-light">Novo Produto</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações básicas */}
        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-5">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">
            Informações Básicas
          </h2>

          <div>
            <label className={labelClass}>Nome do Produto *</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="Ex: Anel Eternidade Diamante" required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Preço (R$) *</label>
              <input type="number" value={form.price} onChange={e => update('price', e.target.value)}
                placeholder="990.00" min="0" step="0.01" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Preço Original (opcional)</label>
              <input type="number" value={form.originalPrice} onChange={e => update('originalPrice', e.target.value)}
                placeholder="1200.00" min="0" step="0.01" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Categoria *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)}
                className={inputClass}>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Material *</label>
              <input type="text" value={form.material} onChange={e => update('material', e.target.value)}
                placeholder="Ex: Ouro 18k com Diamantes" required className={inputClass} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Descrição *</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="Descreva a joia com detalhes que encantem a cliente..."
              rows={4} required
              className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors text-sm resize-none" />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'inStock',  label: 'Em Estoque' },
              { key: 'featured', label: 'Destaque' },
              { key: 'isNew',    label: 'Novo' },
              { key: 'isSale',   label: 'Promoção' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => update(key, !(form as any)[key])}
                  className={`w-10 h-5 rounded-full transition-colors ${(form as any)[key] ? 'bg-gold-500' : 'bg-dark-600'} relative`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${(form as any)[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-dark-300 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Imagens */}
        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-4">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">
            Fotos do Produto
          </h2>
          <p className="text-dark-400 text-xs">Você pode fazer upload de fotos do seu computador ou colar URLs de imagens.</p>

          {images.map((img, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={img}
                  onChange={e => {
                    const newImages = [...images]
                    newImages[idx] = e.target.value
                    setImages(newImages)
                  }}
                  placeholder="URL da imagem ou faça upload →"
                  className={`${inputClass} flex-1`}
                />
                <label className="flex items-center gap-2 bg-dark-700 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-3 cursor-pointer transition-colors text-xs whitespace-nowrap">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(idx, file)
                    }}
                  />
                  {uploadingIdx === idx ? '...' : 'Upload'}
                </label>
                {images.length > 1 && (
                  <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>
              {img && img.startsWith('http') && (
                <div className="relative w-20 h-20 bg-dark-700 overflow-hidden">
                  <Image src={img} alt="Preview" fill className="object-cover" sizes="80px" />
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={() => setImages([...images, ''])}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors">
            <Plus size={14} /> Adicionar mais foto
          </button>
        </div>

        {/* Detalhes */}
        <div className="bg-dark-800 border border-gold-500/10 p-6 space-y-4">
          <h2 className="text-cream text-xs tracking-[0.3em] uppercase pb-3 border-b border-gold-500/10">
            Detalhes Técnicos
          </h2>

          {details.map((detail, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                value={detail}
                onChange={e => {
                  const newDetails = [...details]
                  newDetails[idx] = e.target.value
                  setDetails(newDetails)
                }}
                placeholder="Ex: Ouro 18k amarelo"
                className={`${inputClass} flex-1`}
              />
              {details.length > 1 && (
                <button type="button" onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                  className="p-2 text-dark-400 hover:text-red-400 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={() => setDetails([...details, ''])}
            className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors">
            <Plus size={14} /> Adicionar detalhe
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={loading} className="btn-gold">
            {loading ? 'Salvando...' : 'Publicar Produto'}
          </button>
          {savedId && (
            <a href={`/produtos/${savedId}`} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-5 py-3 text-sm transition-colors">
              <ExternalLink size={14} /> Ver na Loja
            </a>
          )}
          <Link href="/admin/produtos" className="btn-outline-gold">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
