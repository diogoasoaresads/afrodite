import { NextRequest, NextResponse } from 'next/server'
import { getCouponByCode } from '@/lib/db'

// POST: validate coupon for a given cart total
export async function POST(req: NextRequest) {
  const { code, cartTotal } = await req.json()

  if (!code?.trim()) {
    return NextResponse.json({ error: 'Código de cupom obrigatório.' }, { status: 400 })
  }

  const coupon = await getCouponByCode(code)

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: 'Cupom inválido ou expirado.' }, { status: 400 })
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return NextResponse.json({ error: 'Este cupom expirou.' }, { status: 400 })
  }

  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Este cupom atingiu o limite de usos.' }, { status: 400 })
  }

  if (coupon.minValue > 0 && cartTotal < coupon.minValue) {
    return NextResponse.json({
      error: `Valor mínimo para este cupom: R$ ${coupon.minValue.toFixed(2).replace('.', ',')}`
    }, { status: 400 })
  }

  const discountAmount = coupon.type === 'percent'
    ? (cartTotal * coupon.discount) / 100
    : Math.min(coupon.discount, cartTotal)

  return NextResponse.json({
    ok: true,
    couponId: coupon.id,
    code: coupon.code,
    type: coupon.type,
    discount: coupon.discount,
    discountAmount: Math.round(discountAmount * 100) / 100,
  })
}
