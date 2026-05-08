import { NextRequest, NextResponse } from 'next/server'
import { loginCustomer, createSessionToken, CUSTOMER_COOKIE } from '@/lib/customer-auth'
import { loginRateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  const limit = loginRateLimit(ip)
  if (limit.limited) {
    const waitMin = Math.ceil((limit.resetAt - Date.now()) / 60000)
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${waitMin} minuto${waitMin > 1 ? 's' : ''}.` },
      { status: 429 }
    )
  }

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
