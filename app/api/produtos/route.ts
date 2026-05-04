import { NextResponse } from 'next/server'
import { getDBProducts, getHiddenProductIds } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'

export async function GET() {
  const [dbProducts, hidden] = await Promise.all([getDBProducts(), getHiddenProductIds()])
  const hiddenSet = new Set(hidden)
  const dbIds     = new Set(dbProducts.map(p => p.id))

  const all = [
    ...dbProducts.filter(p => !hiddenSet.has(p.id)),
    ...staticProducts.filter(p => !dbIds.has(p.id) && !hiddenSet.has(p.id)),
  ]

  return NextResponse.json(all)
}
