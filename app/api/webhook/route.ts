import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'payment' && data?.id) {
      const payment = new Payment(client)
      const paymentInfo = await payment.get({ id: data.id })

      await updateOrder(paymentInfo)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function updateOrder(paymentInfo: any) {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'orders.json')

    let orders: any[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(raw)
    } catch {
      return
    }

    const updated = orders.map(order => {
      if (order.preference_id === paymentInfo.preference_id) {
        return {
          ...order,
          payment_id: paymentInfo.id,
          payment_status: paymentInfo.status,
          payment_method: paymentInfo.payment_type_id,
          updated_at: new Date().toISOString(),
        }
      }
      return order
    })

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err)
  }
}
