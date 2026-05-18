import { NextResponse } from 'next/server'
import { isValidSessionAsync, ADMIN_COOKIE } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { getCustomers } from '@/lib/db'

function escCsv(val: unknown): string {
  const str = val == null ? '' : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(ADMIN_COOKIE)?.value || ''
  if (!await isValidSessionAsync(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const customers = await getCustomers()

  const headers = ['Nome', 'E-mail', 'CPF', 'Total Pedidos', 'Total Gasto (R$)', 'Último Pedido']

  const rows = customers.map(c => [
    c.name,
    c.email,
    c.cpf,
    c.orderCount,
    c.totalSpent.toFixed(2).replace('.', ','),
    c.lastOrder ? new Date(c.lastOrder).toLocaleString('pt-BR') : '',
  ].map(escCsv).join(','))

  const csv = '﻿' + [headers.join(','), ...rows].join('\r\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="clientes_${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
