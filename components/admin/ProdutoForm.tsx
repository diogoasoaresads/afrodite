'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Plus, X, ExternalLink, ChevronDown, ChevronUp,
  Loader2, Package, Gem, Ruler, Droplets, Sparkles, Tag, Info
} from 'lucide-react'
import type { DBProduct, TamanhoEstoque } from '@/lib/db'

// ─── Opções fixas ────────────────────────────────────────────────────────────

const CATEGORIAS = [
  { value: 'aneis',     label: 'Anéis' },
  { value: 'colares',   label: 'Colares' },
  { value: 'brincos',   label: 'Brincos' },
  { value: 'pulseiras', label: 'Pulseiras' },
  { value: 'tornozeleiras', label: 'Tornozeleiras' },
  { value: 'piercings', label: 'Piercings' },
  { value: 'conjuntos', label: 'Conjuntos' },
]

const LIGAS = [
  'Ouro 18k Amarelo', 'Ouro 18k Branco', 'Ouro 18k Rosé',
  'Ouro 14k Amarelo', 'Ouro 14k Branco', 'Ouro 14k Rosé',
  'Prata 925', 'Prata 950',
  'Aço Inoxidável 316L', 'Titânio',
  'Latão', 'Cobre', 'Outro',
]

const BANHOS = [
  'Banho de Ouro 18k', 'Banho de Ouro 24k', 'Banho de Ouro Rosé',
  'Banho de Ródio', 'Banho de Rutênio', 'Banho de Níquel',
  'Sem banho', 'Outro',
]

const ACABAMENTOS = [
  'Polido (brilhante)', 'Fosco', 'Acetinado', 'Escovado',
  'Texturizado', 'Martelado', 'Diamantado',
]

const GARANTIAS = [
  '3 meses', '6 meses', '12 meses', '18 meses', '24 meses', 'Vitalícia',
]

const RESISTENCIA_AGUA = [
  'Sem resistência', 'Respingos leves (IPX2)',
  'Uso diário (IPX4)', 'Natação (IPX7)',
]

const CUIDADOS_OPCOES = [
  'Evitar contato com perfumes e cremes',
  'Remover antes de dormir',
  'Remover antes de banho ou praia',
  'Evitar contato com cloro e água salgada',
  'Guardar em local seco e escuro',
  'Limpar com pano macio e seco',
  'Não usar durante atividade física',
  'Evitar contato com produtos químicos',
  'Guardar separado para evitar arranhões',
]

const TIPO_PERSONALIZACAO = [
  'Gravação de nome', 'Gravação de data', 'Monograma',
  'Pedra de nascimento', 'Foto personalizada', 'Outro',
]

// Tamanhos por categoria
const TAMANHOS_POR_CATEGORIA: Record<string, string[]> = {
  aneis:      ['10','11','12','13','14','15','16','17','18','19','20','21','22'],
  pulseiras:  ['14cm','15cm','16cm','17cm','18cm','19cm','20cm','21cm'],
  colares:    ['35cm','40cm','42cm','45cm','50cm','55cm','60cm','70cm','80cm'],
  tornozeleiras: ['22cm','23cm','24cm','25cm','26cm','27cm','28cm'],
  brincos:    ['Único'],
  piercings:  ['Único'],
  conjuntos:  [],
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

// FormData usa string para price/originalPrice para facilitar o input controlado
// A conversão para número acontece no handleSubmit
interface FormData {
  name: string
  price: number | string
  originalPrice?: number | string
  category: string
  description: string
  details: string[]
  material: string
  images: string[]
  inStock: boolean
  featured: boolean
  isNew?: boolean
  isSale?: boolean
  sku?: string
  colecao?: string
  tags?: string[]
  liga?: string
  banho?: string
  acabamento?: string
  pedras?: string
  peso?: string
  dimensoes?: string
  comprimento?: string
  ajustavel?: boolean
  tamanhos?: TamanhoEstoque[]
  garantia?: string
  resistenciaAgua?: string
  cuidados?: string[]
  personalizavel?: boolean
  tipoPersonalizacao?: string
  prazoPersonalizacao?: number
  obsPersonalizacao?: string
}

interface ProdutoFormProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  submitLabel: string
  productId?: string
  loading: boolean
  error?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const emptyForm = (): FormData => ({
  name: '', price: '', originalPrice: '',
  category: 'aneis', description: '', details: [], material: '',
  images: [], inStock: true, featured: false, isNew: false, isSale: false,
  sku: '', colecao: '', tags: [],
  liga: '', banho: '', acabamento: '',
  pedras: '', peso: '', dimensoes: '', comprimento: '', ajustavel: false,
  tamanhos: [],
  garantia: '12 meses', resistenciaAgua: 'Sem resistência', cuidados: [],
  personalizavel: false, tipoPersonalizacao: '', prazoPersonalizacao: undefined, obsPersonalizacao: '',
})

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProdutoForm({ initialData, onSubmit, submitLabel, productId, loading, error }: ProdutoFormProps) {
  const [form, setForm] = useState<FormData>({ ...emptyForm(), ...initialData })
  const [images, setImages] = useState<string[]>(
    initialData?.images?.length ? initialData.images : ['']
  )
  const [details, setDetails] = useState<string[]>(
    initialData?.details?.length ? initialData.details : ['']
  )
  const [tamanhos, setTamanhos] = useState<TamanhoEstoque[]>(
    initialData?.tamanhos ?? []
  )
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [cuidados, setCuidados] = useState<string[]>(initialData?.cuidados ?? [])
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    basico: true, fotos: true, material: true, tamanhos: true,
    cuidados: false, personalizacao: false, organizacao: false,
  })

  const up = (key: keyof FormData, value: unknown) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const toggleSection = (s: string) =>
    setOpenSections(prev => ({ ...prev, [s]: !prev[s] }))

  const handleUpload = async (idx: number, file: File) => {
    setUploadingIdx(idx)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) { const n = [...images]; n[idx] = data.url; setImages(n) }
    } catch { alert('Erro ao fazer upload da imagem') }
    finally { setUploadingIdx(null) }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const toggleCuidado = (c: string) =>
    setCuidados(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])

  const addTamanho = (t: string) => {
    if (!tamanhos.find(x => x.tamanho === t)) {
      setTamanhos(prev => [...prev, { tamanho: t, estoque: 1 }])
    }
  }

  const updateEstoque = (idx: number, val: number) =>
    setTamanhos(prev => prev.map((t, i) => i === idx ? { ...t, estoque: val } : t))

  const removeTamanho = (idx: number) =>
    setTamanhos(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalImages = images.filter(Boolean)
    if (finalImages.length === 0) { alert('Adicione pelo menos uma foto.'); return }

    const hasStock = tamanhos.length > 0
      ? tamanhos.some(t => t.estoque > 0)
      : form.inStock as boolean

    await onSubmit({
      ...form,
      price: parseFloat(String(form.price)) || 0,
      originalPrice: form.originalPrice ? (parseFloat(String(form.originalPrice)) || undefined) : undefined,
      images: finalImages,
      details: details.filter(Boolean),
      tamanhos: tamanhos.length > 0 ? tamanhos : undefined,
      inStock: hasStock,
      tags,
      cuidados,
    })
  }

  const ic = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-2.5 outline-none transition-colors text-sm"
  const lc = "block text-dark-400 text-xs tracking-wider uppercase mb-1.5"
  const sc = "w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream px-4 py-2.5 outline-none transition-colors text-sm"

  const tamanhosPreset = TAMANHOS_POR_CATEGORIA[form.category] ?? []

  const SectionHeader = ({ id, icon, title, subtitle }: {
    id: string; icon: React.ReactNode; title: string; subtitle?: string
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between px-6 py-4 border-b border-gold-500/10 hover:bg-dark-700/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-gold-400">{icon}</span>
        <div className="text-left">
          <p className="text-cream text-xs tracking-[0.2em] uppercase">{title}</p>
          {subtitle && <p className="text-dark-500 text-xs mt-0.5 normal-case tracking-normal">{subtitle}</p>}
        </div>
      </div>
      {openSections[id] ? <ChevronUp size={14} className="text-dark-500" /> : <ChevronDown size={14} className="text-dark-500" />}
    </button>
  )

  const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <div onClick={onChange} className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? 'bg-gold-500' : 'bg-dark-600'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-dark-300 text-sm">{label}</span>
    </label>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── 1. INFORMAÇÕES BÁSICAS ─────────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="basico" icon={<Package size={16} />} title="Informações Básicas" subtitle="Nome, preço, categoria e status" />
        {openSections.basico && (
          <div className="px-6 py-6 space-y-5">
            <div>
              <label className={lc}>Nome do Produto *</label>
              <input type="text" value={form.name} onChange={e => up('name', e.target.value)}
                placeholder="Ex: Anel Eternidade Ouro 18k" required className={ic} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Preço (R$) *</label>
                <input type="number" value={form.price} onChange={e => up('price', e.target.value)}
                  placeholder="990.00" min="0" step="0.01" required className={ic} />
              </div>
              <div>
                <label className={lc}>Preço Original <span className="text-dark-600 normal-case tracking-normal">(antes da promoção)</span></label>
                <input type="number" value={form.originalPrice || ''} onChange={e => up('originalPrice', e.target.value)}
                  placeholder="1200.00" min="0" step="0.01" className={ic} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Categoria *</label>
                <select value={form.category} onChange={e => up('category', e.target.value)} className={sc}>
                  {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Material (resumo) *</label>
                <input type="text" value={form.material} onChange={e => up('material', e.target.value)}
                  placeholder="Ex: Ouro 18k com Zircônia" required className={ic} />
                <p className="text-dark-600 text-xs mt-1">Aparece como subtítulo no site</p>
              </div>
            </div>

            <div>
              <label className={lc}>Descrição *</label>
              <textarea value={form.description} onChange={e => up('description', e.target.value)}
                placeholder="Descreva a joia com detalhes que encantem a cliente..."
                rows={4} required
                className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors text-sm resize-none" />
            </div>

            {/* Status */}
            <div>
              <p className={lc}>Status</p>
              <div className="grid grid-cols-2 gap-3">
                {tamanhos.length === 0 && (
                  <Toggle label="Em Estoque" checked={form.inStock as boolean} onChange={() => up('inStock', !form.inStock)} />
                )}
                <Toggle label="Destaque (Home)" checked={!!form.featured} onChange={() => up('featured', !form.featured)} />
                <Toggle label="Novo" checked={!!form.isNew} onChange={() => up('isNew', !form.isNew)} />
                <Toggle label="Em Promoção" checked={!!form.isSale} onChange={() => up('isSale', !form.isSale)} />
              </div>
              {tamanhos.length > 0 && (
                <p className="text-dark-500 text-xs mt-2">
                  <Info size={11} className="inline mr-1" />
                  Estoque controlado por tamanho — estoque geral calculado automaticamente
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── 2. FOTOS ──────────────────────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="fotos" icon={<Package size={16} />} title="Fotos do Produto" subtitle="Upload ou URL — primeira foto é a principal" />
        {openSections.fotos && (
          <div className="px-6 py-6 space-y-4">
            <p className="text-dark-400 text-xs">Faça upload do seu computador ou cole a URL da imagem. JPG, PNG ou WebP.</p>
            {images.map((img, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="text-dark-600 text-xs w-5 text-center flex-shrink-0">{idx + 1}</span>
                  <input type="text" value={img}
                    onChange={e => { const n = [...images]; n[idx] = e.target.value; setImages(n) }}
                    placeholder="URL da imagem ou clique em Upload →"
                    className={`${ic} flex-1`} />
                  <label className="flex items-center gap-1.5 bg-dark-700 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-3 py-2.5 cursor-pointer transition-colors text-xs whitespace-nowrap flex-shrink-0">
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(idx, f) }} />
                    {uploadingIdx === idx ? <Loader2 size={12} className="animate-spin" /> : null}
                    {uploadingIdx === idx ? 'Enviando...' : 'Upload'}
                  </label>
                  {images.length > 1 && (
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="p-2 text-dark-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {img && img.length > 5 && (
                  <div className="relative w-16 h-16 bg-dark-700 overflow-hidden ml-7">
                    <Image src={img} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="64px"
                      onError={() => {}} />
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={() => setImages([...images, ''])}
              className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors ml-7">
              <Plus size={13} /> Adicionar foto
            </button>
          </div>
        )}
      </div>

      {/* ── 3. MATERIAL & COMPOSIÇÃO ──────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="material" icon={<Gem size={16} />} title="Material & Composição" subtitle="Liga, banho, acabamento e pedras" />
        {openSections.material && (
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Liga do Metal</label>
                <select value={form.liga || ''} onChange={e => up('liga', e.target.value)} className={sc}>
                  <option value="">— Selecionar —</option>
                  {LIGAS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Banho</label>
                <select value={form.banho || ''} onChange={e => up('banho', e.target.value)} className={sc}>
                  <option value="">— Selecionar —</option>
                  {BANHOS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={lc}>Acabamento</label>
              <select value={form.acabamento || ''} onChange={e => up('acabamento', e.target.value)} className={sc}>
                <option value="">— Selecionar —</option>
                {ACABAMENTOS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className={lc}>Pedras & Gemas</label>
              <input type="text" value={form.pedras || ''} onChange={e => up('pedras', e.target.value)}
                placeholder="Ex: Zircônia branca 4mm × 5 unidades"
                className={ic} />
              <p className="text-dark-600 text-xs mt-1">Descreva livremente as pedras, quantidade e quilates se houver</p>
            </div>

            {/* Detalhes técnicos (lista livre) */}
            <div>
              <label className={lc}>Detalhes Técnicos Adicionais</label>
              <p className="text-dark-500 text-xs mb-3">Itens extras que aparecem na lista de detalhes da página do produto</p>
              {details.map((d, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" value={d} onChange={e => { const n = [...details]; n[idx] = e.target.value; setDetails(n) }}
                    placeholder="Ex: Fecho de pressão em ouro" className={`${ic} flex-1`} />
                  {details.length > 1 && (
                    <button type="button" onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                      className="p-2 text-dark-600 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setDetails([...details, ''])}
                className="flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors">
                <Plus size={13} /> Adicionar item
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 4. TAMANHOS & DIMENSÕES ───────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="tamanhos" icon={<Ruler size={16} />} title="Tamanhos & Dimensões" subtitle="Estoque por tamanho, peso e medidas" />
        {openSections.tamanhos && (
          <div className="px-6 py-6 space-y-6">

            {/* Tamanhos com estoque */}
            <div>
              <label className={lc}>Tamanhos Disponíveis <span className="text-dark-600 normal-case tracking-normal">(com estoque por tamanho)</span></label>

              {tamanhosPreset.length > 0 && (
                <div className="mb-3">
                  <p className="text-dark-500 text-xs mb-2">Clique para adicionar:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tamanhosPreset.map(t => {
                      const exists = tamanhos.some(x => x.tamanho === t)
                      return (
                        <button key={t} type="button" onClick={() => addTamanho(t)}
                          disabled={exists}
                          className={`px-2.5 py-1 text-xs border transition-colors ${
                            exists
                              ? 'border-gold-500/50 bg-gold-500/10 text-gold-400 cursor-default'
                              : 'border-dark-600 text-dark-400 hover:border-gold-500 hover:text-gold-400'
                          }`}>
                          {t}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tamanho livre (fora dos presets) */}
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="Tamanho personalizado (ex: 39½)"
                  className={`${ic} flex-1`}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) { addTamanho(val); (e.target as HTMLInputElement).value = '' }
                    }
                  }} />
                <span className="text-dark-500 text-xs self-center whitespace-nowrap">↵ Enter</span>
              </div>

              {/* Tabela de tamanhos adicionados */}
              {tamanhos.length > 0 && (
                <div className="border border-dark-600">
                  <div className="grid grid-cols-3 px-4 py-2 bg-dark-700/50 text-dark-500 text-xs tracking-wider uppercase">
                    <span>Tamanho</span>
                    <span>Estoque</span>
                    <span></span>
                  </div>
                  {tamanhos.map((t, idx) => (
                    <div key={idx} className={`grid grid-cols-3 px-4 py-2 items-center border-t border-dark-700 ${t.estoque === 0 ? 'opacity-60' : ''}`}>
                      <span className="text-cream text-sm font-medium">{t.tamanho}</span>
                      <div className="flex items-center gap-2">
                        <input type="number" min="0" value={t.estoque}
                          onChange={e => updateEstoque(idx, parseInt(e.target.value) || 0)}
                          className="w-20 bg-dark-600 border border-dark-500 focus:border-gold-500 text-cream px-2 py-1 text-sm outline-none" />
                        {t.estoque === 0 && <span className="text-red-400 text-xs">Esgotado</span>}
                      </div>
                      <button type="button" onClick={() => removeTamanho(idx)}
                        className="justify-self-end text-dark-600 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {tamanhos.length === 0 && (
                <p className="text-dark-600 text-xs">Sem tamanhos cadastrados — estoque controlado pelo toggle "Em Estoque"</p>
              )}
            </div>

            {/* Dimensões físicas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Peso</label>
                <input type="text" value={form.peso || ''} onChange={e => up('peso', e.target.value)}
                  placeholder="Ex: 3,5 g" className={ic} />
              </div>
              <div>
                <label className={lc}>Dimensões</label>
                <input type="text" value={form.dimensoes || ''} onChange={e => up('dimensoes', e.target.value)}
                  placeholder="Ex: Largura 4mm / Altura 6mm" className={ic} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Comprimento disponível</label>
                <input type="text" value={form.comprimento || ''} onChange={e => up('comprimento', e.target.value)}
                  placeholder="Ex: 40cm, 45cm, 50cm" className={ic} />
                <p className="text-dark-600 text-xs mt-1">Para correntes e pulseiras</p>
              </div>
              <div className="flex items-end pb-1">
                <Toggle label="Tamanho Ajustável" checked={!!form.ajustavel} onChange={() => up('ajustavel', !form.ajustavel)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. CUIDADOS & GARANTIA ────────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="cuidados" icon={<Droplets size={16} />} title="Cuidados & Garantia" subtitle="Resistência à água, garantia e instruções" />
        {openSections.cuidados && (
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>Garantia</label>
                <select value={form.garantia || ''} onChange={e => up('garantia', e.target.value)} className={sc}>
                  <option value="">— Selecionar —</option>
                  {GARANTIAS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={lc}>Resistência à Água</label>
                <select value={form.resistenciaAgua || ''} onChange={e => up('resistenciaAgua', e.target.value)} className={sc}>
                  <option value="">— Selecionar —</option>
                  {RESISTENCIA_AGUA.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={lc}>Instruções de Cuidado</label>
              <p className="text-dark-500 text-xs mb-3">Selecione as que se aplicam à peça</p>
              <div className="space-y-2">
                {CUIDADOS_OPCOES.map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleCuidado(c)}
                      className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${
                        cuidados.includes(c) ? 'border-gold-500 bg-gold-500' : 'border-dark-500 group-hover:border-gold-500'
                      }`}
                    >
                      {cuidados.includes(c) && <span className="text-dark-900 text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-dark-300 text-sm">{c}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 6. PERSONALIZAÇÃO ─────────────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="personalizacao" icon={<Sparkles size={16} />} title="Personalização" subtitle="Gravação, monograma e outras personalizações" />
        {openSections.personalizacao && (
          <div className="px-6 py-6 space-y-5">
            <Toggle label="Produto personalizável" checked={!!form.personalizavel} onChange={() => up('personalizavel', !form.personalizavel)} />

            {form.personalizavel && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lc}>Tipo de Personalização</label>
                    <select value={form.tipoPersonalizacao || ''} onChange={e => up('tipoPersonalizacao', e.target.value)} className={sc}>
                      <option value="">— Selecionar —</option>
                      {TIPO_PERSONALIZACAO.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={lc}>Prazo <span className="text-dark-600 normal-case tracking-normal">(dias úteis)</span></label>
                    <input type="number" min="1" value={form.prazoPersonalizacao || ''}
                      onChange={e => up('prazoPersonalizacao', parseInt(e.target.value) || undefined)}
                      placeholder="Ex: 5" className={ic} />
                  </div>
                </div>
                <div>
                  <label className={lc}>Instruções para o cliente</label>
                  <textarea value={form.obsPersonalizacao || ''} onChange={e => up('obsPersonalizacao', e.target.value)}
                    placeholder="Ex: Máximo 15 caracteres para gravação"
                    rows={2}
                    className="w-full bg-dark-700 border border-dark-600 focus:border-gold-500 text-cream placeholder:text-dark-500 px-4 py-3 outline-none transition-colors text-sm resize-none" />
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── 7. ORGANIZAÇÃO INTERNA ────────────────────────────── */}
      <div className="bg-dark-800 border border-gold-500/10">
        <SectionHeader id="organizacao" icon={<Tag size={16} />} title="Organização & SEO" subtitle="SKU, coleção e tags de busca" />
        {openSections.organizacao && (
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lc}>SKU <span className="text-dark-600 normal-case tracking-normal">(código interno)</span></label>
                <input type="text" value={form.sku || ''} onChange={e => up('sku', e.target.value)}
                  placeholder="Ex: AFR-AN-001" className={ic} />
              </div>
              <div>
                <label className={lc}>Coleção</label>
                <input type="text" value={form.colecao || ''} onChange={e => up('colecao', e.target.value)}
                  placeholder="Ex: Coleção Primavera 2025" className={ic} />
              </div>
            </div>

            <div>
              <label className={lc}>Tags de Busca</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Ex: presente, casamento, noivado"
                  className={`${ic} flex-1`} />
                <button type="button" onClick={addTag}
                  className="bg-dark-700 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-3 text-xs transition-colors">
                  + Adicionar
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(t => (
                    <span key={t} className="flex items-center gap-1 bg-dark-700 border border-dark-600 text-dark-300 px-2.5 py-0.5 text-xs">
                      {t}
                      <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}
                        className="text-dark-600 hover:text-red-400 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-dark-600 text-xs mt-1">Ajudam na busca interna e filtros</p>
            </div>
          </div>
        )}
      </div>

      {/* ── ERRO & BOTÕES ─────────────────────────────────────── */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pb-8">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-900 px-6 py-3 font-semibold text-sm tracking-widest uppercase transition-all disabled:opacity-50">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Salvando...' : submitLabel}
        </button>
        {productId && (
          <a href={`/produtos/${productId}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 border border-dark-600 hover:border-gold-500 text-dark-300 hover:text-gold-400 px-5 py-3 text-sm transition-colors">
            <ExternalLink size={14} /> Ver na Loja
          </a>
        )}
        <Link href="/admin/produtos"
          className="px-5 py-3 border border-dark-600 hover:border-dark-400 text-dark-400 hover:text-dark-200 text-sm transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
