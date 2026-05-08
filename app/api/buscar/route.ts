import { NextRequest, NextResponse } from 'next/server'
import { getDBProducts, getHiddenProductIds } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').toLowerCase().trim()
  if (!q) return NextResponse.json({ results: [] })

  const [dbProducts, hidden] = await Promise.all([getDBProducts(), getHiddenProductIds()])
  const hiddenSet = new Set(hidden)
  const dbIds = new Set(dbProducts.map(p => p.id))

  const all = [
    ...dbProducts.filter(p => !hiddenSet.has(p.id)),
    ...staticProducts.filter(p => !dbIds.has(p.id) && !hiddenSet.has(p.id)),
  ]

  const matches = all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.material.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description?.toLowerCase().includes(q)
  ).slice(0, 8)

  return NextResponse.json({ results: matches })
}
