import { NextRequest, NextResponse } from 'next/server'
import { CUSTOMER_COOKIE, parseSessionToken, getCustomerById } from '@/lib/customer-auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(CUSTOMER_COOKIE)?.value
  if (!token) return NextResponse.json({ customer: null })

  const customerId = parseSessionToken(token)
  if (!customerId) return NextResponse.json({ customer: null })

  const customer = await getCustomerById(customerId)
  if (!customer) return NextResponse.json({ customer: null })

  return NextResponse.json({
    customer: { id: customer.id, name: customer.name, email: customer.email, createdAt: customer.createdAt },
  })
}
