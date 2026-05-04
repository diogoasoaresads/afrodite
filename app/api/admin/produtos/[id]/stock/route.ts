import { NextRequest, NextResponse } from 'next/server'
import { updateDBProduct, getDBProducts, saveDBProduct, hideStaticProduct } from '@/lib/db'
import { getProductById } from '@/lib/products'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { inStock } = await req.json()

  // Tenta atualizar no DB
  const updated = await updateDBProduct(params.id, { inStock })
  if (updated) return NextResponse.json({ ok: true, inStock: updated.inStock })

  // Produto estático — cria cópia no DB com o valor alterado
  const staticProduct = getProductById(params.id)
  if (staticProduct) {
    const saved = await saveDBProduct({ ...staticProduct, inStock } as any)
    // Renomeia o ID para o original
    const dbProducts = await getDBProducts()
    const idx = dbProducts.findIndex(p => p.id === saved.id)
    if (idx !== -1) {
      dbProducts[idx] = { ...dbProducts[idx], id: params.id }
      const fs = await import('fs/promises')
      const path = await import('path')
      await fs.writeFile(path.join(process.cwd(), 'data', 'products.json'), JSON.stringify(dbProducts, null, 2))
    }
    return NextResponse.json({ ok: true, inStock })
  }

  return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
}
