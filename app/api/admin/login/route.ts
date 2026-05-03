import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidSessionAsync, createSessionValue } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
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
