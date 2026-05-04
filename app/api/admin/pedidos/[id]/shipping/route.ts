import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'
import { getSettings } from '@/lib/settings'
import { sendEmail, customerOrderShippedHtml } from '@/lib/email'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { shipping_status, tracking_code } = await req.json()

  const fs   = await import('fs/promises')
  const path = await import('path')
  const filePath = path.join(process.cwd(), 'data', 'orders.json')

  let orders: any[] = []
  try {
    orders = JSON.parse(await fs.readFile(filePath, 'utf-8'))
  } catch {
    return NextResponse.json({ error: 'Sem pedidos' }, { status: 404 })
  }

  const idx = orders.findIndex(o => o.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })

  const previousStatus = orders[idx].shipping_status
  orders[idx] = {
    ...orders[idx],
    shipping_status: shipping_status || orders[idx].shipping_status,
    tracking_code:   tracking_code   ?? orders[idx].tracking_code,
    shipped_at:      shipping_status === 'shipped'   && !orders[idx].shipped_at   ? new Date().toISOString() : orders[idx].shipped_at,
    delivered_at:    shipping_status === 'delivered' && !orders[idx].delivered_at ? new Date().toISOString() : orders[idx].delivered_at,
    updated_at:      new Date().toISOString(),
  }

  await fs.writeFile(filePath, JSON.stringify(orders, null, 2))

  // E-mail ao cliente quando muda para "shipped"
  if (shipping_status === 'shipped' && previousStatus !== 'shipped') {
    const settings = await getSettings()
    const order = orders[idx]
    if (order.payer?.email && order.tracking_code && settings.smtp?.host) {
      sendEmail({
        to: order.payer.email,
        subject: `📦 Seu pedido #${order.id} foi enviado!`,
        html: customerOrderShippedHtml(order, settings.loja.nome, order.tracking_code),
      }).catch(err => console.error('Erro e-mail envio:', err))
    }
  }

  return NextResponse.json({ ok: true, order: orders[idx] })
}
