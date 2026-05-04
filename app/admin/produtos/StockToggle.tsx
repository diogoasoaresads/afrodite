'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast-context'

export default function StockToggle({ id, initialValue }: { id: string; initialValue: boolean }) {
  const [inStock, setInStock] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const toggle = async () => {
    setLoading(true)
    const next = !inStock
    setInStock(next) // otimista
    try {
      const res = await fetch(`/api/admin/produtos/${id}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: next }),
      })
      if (!res.ok) throw new Error()
      showToast(next ? 'Produto marcado como em estoque' : 'Produto marcado como esgotado')
      router.refresh()
    } catch {
      setInStock(!next) // reverte
      showToast('Erro ao atualizar estoque', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={inStock ? 'Clique para marcar como esgotado' : 'Clique para marcar como em estoque'}
      className={`flex items-center gap-1.5 text-xs px-2 py-1 transition-colors ${loading ? 'opacity-50' : ''} ${
        inStock
          ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
          : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${inStock ? 'bg-green-400' : 'bg-red-400'}`} />
      {inStock ? 'Em estoque' : 'Esgotado'}
    </button>
  )
}
