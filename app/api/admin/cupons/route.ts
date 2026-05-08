import { NextRequest, NextResponse } from 'next/server'
import { isValidSessionAsync } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { getCoupons, saveCoupon } from '@/lib/db'

async function auth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value || ''
  return isValidSessionAsync(session)
}

export async function GET() {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const coupons = await getCoupons()
  return NextResponse.json(coupons)
}

export async function POST(req: NextRequest) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { code, type, discount, minValue, maxUses, expiresAt, active } = body

  if (!code?.trim()) return NextResponse.json({ error: 'Código obrigatório.' }, { status: 400 })
  if (!type || !['percent', 'fixed'].includes(type)) return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 })
  if (!discount || discount <= 0) return NextResponse.json({ error: 'Desconto inválido.' }, { status: 400 })

  // Verifica duplicação de código
  const existing = await getCoupons()
  if (existing.find(c => c.code.toUpperCase() === code.toUpperCase())) {
    return NextResponse.json({ error: 'Já existe um cupom com este código.' }, { status: 400 })
  }

  const coupon = await saveCoupon({
    code: code.trim().toUpperCase(),
    type,
    discount: Number(discount),
    minValue: Number(minValue) || 0,
    maxUses: Number(maxUses) || 0,
    expiresAt: expiresAt || undefined,
    active: active !== false,
  })

  return NextResponse.json(coupon, { status: 201 })
}
