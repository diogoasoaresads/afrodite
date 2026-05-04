import { NextRequest, NextResponse } from 'next/server'
import { CUSTOMER_COOKIE, parseSessionToken, getCustomerById } from '@/lib/customer-auth'
import { getOrders } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value
  if (!token) return NextResponse.json({ orders: [] }, { status: 401 })

  const customerId = parseSessionToken(token)
  if (!customerId) return NextResponse.json({ orders: [] }, { status: 401 })

  const customer = await getCustomerById(customerId)
  if (!customer) return NextResponse.json({ orders: [] }, { status: 401 })

  const allOrders = await getOrders()
  const orders = allOrders
    .filter(o => o.payer?.email?.toLowerCase() === customer.email.toLowerCase())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  return NextResponse.json({ orders })
}
