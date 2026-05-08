import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidSessionAsync, createSessionValue } from '@/lib/admin-auth'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown'
  const limit = rateLimit(`admin_login:${ip}`, { windowMs: 15 * 60 * 1000, max: 5 })
  if (limit.limited) {
    const waitMin = Math.ceil((limit.resetAt - Date.now()) / 60000)
    return NextResponse.json(
      { error: `Muitas tentativas. Tente novamente em ${waitMin} minuto${waitMin > 1 ? 's' : ''}.` },
      { status: 429 }
    )
  }

  const { password } = await req.json()

  // Build what the cookie would be for the supplied password and compare
  const candidateCookie = `admin_${password}`
  const valid = await isValidSessionAsync(candidateCookie)

  if (!valid) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const sessionValue = await createSessionValue()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  })

  return res
}
