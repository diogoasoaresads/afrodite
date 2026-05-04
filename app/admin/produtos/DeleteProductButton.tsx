'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  id: string
  name: string
  isStatic?: boolean
}

export default function DeleteProductButton({ id, name, isStatic }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const msg = isStatic
      ? `Ocultar "${name}" da loja?\n\nEste é um produto padrão — ele ficará oculto mas não será removido permanentemente.`
      : `Excluir permanentemente "${name}"?\n\nEssa ação não pode ser desfeita.`

    if (!confirm(msg)) return

    setLoading(true)
    await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border border-dark-600 hover:border-red-500/60 text-dark-400 hover:text-red-400 transition-colors disabled:opacity-40"
      title={isStatic ? 'Ocultar produto' : 'Excluir produto'}
    >
      <Trash2 size={12} />
      {loading ? '...' : 'Excluir'}
    </button>
  )
}
