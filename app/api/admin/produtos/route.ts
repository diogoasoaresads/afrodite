import { NextRequest, NextResponse } from 'next/server'
import { saveDBProduct, getDBProducts } from '@/lib/db'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth'

function checkAuth(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE)?.value
  return isValidSession(session)
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const products = await getDBProducts()
  return NextResponse.json(products)
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
