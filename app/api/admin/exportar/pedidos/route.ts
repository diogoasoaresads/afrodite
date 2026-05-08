import { NextResponse } from 'next/server'
import { isValidSessionAsync } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { getOrders } from '@/lib/db'

function escCsv(val: unknown): string {
  const str = val == null ? '' : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value || ''
  if (!await isValidSessionAsync(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await getOrders()

  const headers = [
    'ID', 'Data', 'Cliente', 'E-mail', 'CPF', 'Total (R$)',
    'Status Pagamento', 'Status Envio', 'Código Rastreio',
    'Endereço', 'Itens',
  ]

  const rows = orders.map(o => {
    const addr = o.shipping_address
      ? `${o.shipping_address.rua}, ${o.shipping_address.numero} — ${o.shipping_address.cidade}/${o.shipping_address.uf}`
      : ''
    const items = (o.items || []).map(i => `${i.quantity}x ${i.title}`).join(' | ')

    return [
      o.id,
      new Date(o.created_at).toLocaleString('pt-BR'),
      o.payer?.name || '',
      o.payer?.email || '',
      o.payer?.identification?.number || '',
      o.total?.toFixed(2).replace('.', ','),
      o.payment_status || o.status,
      o.shipping_status || '',
      o.tracking_code || '',
      addr,
      items,
    ].map(escCsv).join(',')
  })

  const csv = '﻿' + [headers.join(','), ...rows].join('\r\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pedidos_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
