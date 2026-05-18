'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/lib/toast-context'
import ProdutoForm from '@/components/admin/ProdutoForm'

export default function NovoProduto() {
  const router = useRouter()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: any) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erro ao salvar produto')
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

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/produtos" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-cream font-light">Novo Produto</h1>
          <p className="text-dark-500 text-sm mt-0.5">Preencha as seções relevantes para a peça</p>
        </div>
      </div>

      <ProdutoForm
        onSubmit={handleSubmit}
        submitLabel="Publicar Produto"
        loading={loading}
        error={error}
      />
    </div>
  )
}
