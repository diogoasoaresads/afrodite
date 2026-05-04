import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getSettings } from '@/lib/settings'
import { sendEmail, orderApprovedEmailHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    if (type === 'payment' && data?.id) {
      const settings = await getSettings()
      const accessToken = settings.mercadopago.accessToken || process.env.MP_ACCESS_TOKEN || ''

      if (!accessToken) return NextResponse.json({ received: true })

      const client = new MercadoPagoConfig({ accessToken })
      const payment = new Payment(client)
      const paymentInfo = await payment.get({ id: data.id })

      await updateOrder(paymentInfo)

      // Enviar e-mail de notificação ao aprovar pagamento
      if (paymentInfo.status === 'approved' && settings.smtp?.notifyEmail) {
        const orders = await getOrdersForNotification()
        const order = orders.find((o: any) => o.preference_id === (paymentInfo as any).preference_id)
        if (order) {
          await sendEmail({
            to: settings.smtp.notifyEmail,
            subject: `✓ Novo pedido aprovado — ${order.payer?.name || 'Cliente'}`,
            html: orderApprovedEmailHtml(order, settings.loja.nome),
          })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

async function getOrdersForNotification() {
  try {
    const fs   = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'orders.json')
    return JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    return []
  }
}

async function updateOrder(paymentInfo: any) {
  try {
    const fs   = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'orders.json')

    let orders: any[] = []
    try { orders = JSON.parse(await fs.readFile(filePath, 'utf-8')) } catch { return }

    const updated = orders.map(order =>
      order.preference_id === (paymentInfo as any).preference_id
        ? { ...order, payment_id: paymentInfo.id, payment_status: paymentInfo.status, payment_method: paymentInfo.payment_type_id, updated_at: new Date().toISOString() }
        : order
    )
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2))
  } catch (err) {
    console.error('Erro ao atualizar pedido:', err)
  }
}
