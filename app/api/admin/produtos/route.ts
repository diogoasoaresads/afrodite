import { NextRequest, NextResponse } from 'next/server'
import { saveDBProduct, getDBProducts } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth'

function checkAuth(req: NextRequest) {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const dbProducts = await getDBProducts()
  const dbIds = new Set(dbProducts.map(p => p.id))

  // Retorna DB primeiro, estáticos que não foram sobrescritos depois
  const all = [
    ...dbProducts,
    ...staticProducts.filter(p => !dbIds.has(p.id)).map(p => ({
      ...p,
      createdAt: '—',
      updatedAt: '—',
    })),
  ]

  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, price, originalPrice, category, description, details, material, images, inStock, featured, isNew, isSale } = body

  if (!name || !price || !category) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  const product = await saveDBProduct({
    name, price, originalPrice, category, description,
    details: details || [],
    material, images: images || [],
    inStock: inStock ?? true,
    featured: featured ?? false,
    isNew: isNew ?? false,
    isSale: isSale ?? false,
  })

  return NextResponse.json(product, { status: 201 })
}
