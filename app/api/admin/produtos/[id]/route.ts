import { NextRequest, NextResponse } from 'next/server'
import { updateDBProduct, deleteDBProduct, saveDBProduct, getDBProducts } from '@/lib/db'
import { getProductById } from '@/lib/products'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth'

function checkAuth(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()

  // Tenta atualizar produto existente no DB
  const updated = await updateDBProduct(params.id, body)
  if (updated) return NextResponse.json(updated)

  // Produto não está no DB — verifica se é um produto estático e cria cópia editável
  const staticProduct = getProductById(params.id)
  if (staticProduct) {
    const saved = await saveDBProduct({
      ...staticProduct,
      ...body,
      // Mantém o ID original para substituir o estático no frontend
    } as any)
    // Salva com o ID original para sobrescrever o estático
    const withOriginalId = await (async () => {
      const dbProducts = await getDBProducts()
      const idx = dbProducts.findIndex(p => p.id === saved.id)
      if (idx !== -1) {
        dbProducts[idx] = { ...dbProducts[idx], id: params.id }
        const fs = await import('fs/promises')
        const path = await import('path')
        await fs.writeFile(path.join(process.cwd(), 'data', 'products.json'), JSON.stringify(dbProducts, null, 2))
        return dbProducts[idx]
      }
      return saved
    })()
    return NextResponse.json(withOriginalId)
  }

  return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const ok = await deleteDBProduct(params.id)
  if (!ok) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
