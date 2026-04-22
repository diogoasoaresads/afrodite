import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, payer } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: 'BRL',
          category_id: 'fashion',
        })),
        payer: {
          name: payer.name,
          email: payer.email,
          identification: payer.identification,
        },
        payment_methods: {
          excluded_payment_types: [],
          installments: 12,
        },
        back_urls: {
          success: `${baseUrl}/pedido/sucesso`,
          failure: `${baseUrl}/pedido/erro`,
          pending: `${baseUrl}/pedido/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${baseUrl}/api/webhook`,
        statement_descriptor: 'AFRODITE JOIAS',
        metadata: {
          store: 'afrodite-joias',
        },
      },
    })

    // Salva o pedido (em produção, salvar no banco de dados)
    await saveOrder({ preference_id: result.id, items, payer, total: items.reduce((s: number, i: any) => s + i.unit_price * i.quantity, 0), status: 'pending', created_at: new Date().toISOString() })

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
    })
  } catch (err: any) {
    console.error('Mercado Pago error:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno ao processar pagamento' },
      { status: 500 }
    )
  }
}

async function saveOrder(order: any) {
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'data', 'orders.json')

    let orders: any[] = []
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      orders = JSON.parse(raw)
    } catch {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true })
    }

    orders.unshift({ ...order, id: Date.now().toString() })
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2))
  } catch (err) {
    console.error('Erro ao salvar pedido:', err)
  }
}
