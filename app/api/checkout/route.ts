import { NextRequest, NextResponse } from 'next/server'
import { incrementCouponUse } from '@/lib/db'

// Salva o pedido WhatsApp no histórico local (data/orders.json)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, customerName, coupon } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    const orderTotal    = items.reduce((s: number, i: any) => s + (i.unit_price ?? 0) * (i.quantity ?? 1), 0)
    const couponDiscount = coupon?.discountAmount ?? 0
    const finalTotal    = Math.max(0, orderTotal - couponDiscount)

    const newOrder: any = {
      id:          Date.now().toString(),
      items,
      customerName: customerName ?? '',
      total:       finalTotal,
      status:      'whatsapp',
      created_at:  new Date().toISOString(),
    }
    if (coupon) newOrder.coupon = { id: coupon.couponId, code: coupon.code, discount: couponDiscount }

    await saveOrder(newOrder)

    // Incrementa uso do cupom
    if (coupon?.couponId) {
      incrementCouponUse(coupon.couponId).catch(err => console.error('Erro ao incrementar cupom:', err))
    }

    return NextResponse.json({ ok: true, orderId: newOrder.id })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno' },
      { status: 500 }
    )
  }
}

async function saveOrder(order: any) {
  try {
    const fs   = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'orders.json')
    let orders: any[] = []
    try {
      orders = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    } catch {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    }
    orders.unshift(order)
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2))
  } catch (err) {
    console.error('Erro ao salvar pedido:', err)
  }
}
