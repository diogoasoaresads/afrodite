import { NextRequest, NextResponse } from 'next/server'
import { registerCustomer, createSessionToken, CUSTOMER_COOKIE } from '@/lib/customer-auth'

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, { status: 400 })
  }

  const customer = await registerCustomer(name, email, password)
  if (!customer) {
    return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
  }

  const res = NextResponse.json({ ok: true, name: customer.name, email: customer.email })
  res.cookies.set(CUSTOMER_COOKIE, createSessionToken(customer.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: '/',
  })

  return res
}
