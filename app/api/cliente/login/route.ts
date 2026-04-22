import { NextRequest, NextResponse } from 'next/server'
import { loginCustomer, createSessionToken, CUSTOMER_COOKIE } from '@/lib/customer-auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Preencha e-mail e senha' }, { status: 400 })
  }

  const customer = await loginCustomer(email, password)
  if (!customer) {
    return NextResponse.json({ error: 'E-mail ou senha incorretos' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true, name: customer.name, email: customer.email })
  res.cookies.set(CUSTOMER_COOKIE, createSessionToken(customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return res
}
