'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from '@/lib/toast-context'
import ProdutoForm from '@/components/admin/ProdutoForm'

export default function EditarProduto() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { showToast } = useToast()

  const [product, setProduct] = useState<any>(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/produtos')
      .then(r => r.json())
      .then((list: any[]) => {
        const found = list.find(p => p.id === id)
        setProduct(found ?? null)
      })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erro ao salvar produto')
      showToast('Produto atualizado com sucesso!')
      router.push('/admin/produtos')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 size={28} className="text-gold-400 animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="p-8">
        <p className="text-red-400">Produto não encontrado.</p>
        <Link href="/admin/produtos" className="text-gold-400 text-sm mt-4 inline-block hover:underline">
          ← Voltar para Produtos
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream font-light">Editar Produto</h1>
          <p className="text-dark-500 text-sm mt-0.5 truncate max-w-xs">{product.name}</p>
        </div>
      </div>

      <ProdutoForm
        initialData={product}
        onSubmit={handleSubmit}
        submitLabel="Salvar Alterações"
        productId={id}
        loading={loading}
        error={error}
      />
    </div>
  )
}
