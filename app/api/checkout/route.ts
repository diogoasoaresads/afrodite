import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { getSettings } from '@/lib/settings'
import { sendEmail, customerOrderReceivedHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, payer, shipping_address } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    // Lê credenciais e configurações do settings.json (admin) com fallback para env
    const settings = await getSettings()
    const accessToken = settings.mercadopago.accessToken || process.env.MP_ACCESS_TOKEN || ''
    const baseUrl     = settings.loja.siteUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const installments = settings.mercadopago.installments || 12

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Mercado Pago não configurado. Acesse Admin → Configurações e insira seu Access Token.' },
        { status: 500 }
      )
    }

    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id:         item.id,
          title:      item.title,
          quantity:   item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
          category_id: 'fashion',
        })),
        payer: {
          name:  payer.name,
          email: payer.email,
          identification: payer.identification,
        },
        payment_methods: {
          excluded_payment_types: [],
          installments,
        },
        back_urls: {
          success: `${baseUrl}/pedido/sucesso`,
          failure: `${baseUrl}/pedido/erro`,
          pending: `${baseUrl}/pedido/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`,
        statement_descriptor: settings.loja.nome || 'AFRODITE JOIAS',
      },
    })

    const orderTotal = items.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0)
    const newOrder: any = {
      preference_id: result.id,
      items,
      payer,
      total: orderTotal,
      status: 'pending',
      shipping_status: 'pending',
      created_at: new Date().toISOString(),
    }
    if (shipping_address) newOrder.shipping_address = shipping_address
    const savedOrder = await saveOrder(newOrder)

    // E-mail "Pedido recebido" ao cliente (não bloqueia em caso de erro)
    if (payer.email && settings.smtp?.host) {
      sendEmail({
        to: payer.email,
        subject: `Recebemos seu pedido #${savedOrder.id} — ${settings.loja.nome}`,
        html: customerOrderReceivedHtml(savedOrder, settings.loja.nome),
      }).catch(err => console.error('Erro ao enviar e-mail de pedido recebido:', err))
    }

    return NextResponse.json({ id: result.id, init_point: result.init_point })
  } catch (err: any) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno ao processar pagamento' },
      { status: 500 }
    )
  }
}

async function saveOrder(order: any) {
  const newOrder = { ...order, id: Date.now().toString() }
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
    orders.unshift(newOrder)
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2))
  } catch (err) {
    console.error('Erro ao salvar pedido:', err)
  }
  return newOrder
}
