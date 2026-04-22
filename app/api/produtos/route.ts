import { NextResponse } from 'next/server'
import { getDBProducts } from '@/lib/db'
import { products as staticProducts } from '@/lib/products'

export async function GET() {
  const dbProducts = await getDBProducts()
  // DB products têm prioridade e aparecem primeiro
  const all = [...dbProducts, ...staticProducts]
  return NextResponse.json(all)
}
