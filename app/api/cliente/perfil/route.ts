import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSessionToken, getCustomerById, CUSTOMER_COOKIE } from '@/lib/customer-auth'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get(CUSTOMER_COOKIE)?.value
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const customerId = parseSessionToken(session)
  if (!customerId) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  const customer = await getCustomerById(customerId)
  if (!customer) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })

  return NextResponse.json({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: (customer as any).phone || '',
    createdAt: customer.createdAt,
  })
}
