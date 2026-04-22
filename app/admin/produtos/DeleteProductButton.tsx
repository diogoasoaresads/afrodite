'use client'

import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteProductButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    setLoading(true)
    await fetch(`/api/admin/produtos/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 text-dark-400 hover:text-red-400 transition-colors"
      title="Excluir"
    >
      <Trash2 size={14} />
    </button>
  )
}
