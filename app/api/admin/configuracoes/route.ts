import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/settings'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'

async function checkAuth(req: NextRequest) {
  return isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value)
}

export async function GET(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const settings = await getSettings()
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  if (!(await checkAuth(req))) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const updated = await saveSettings(body)

  // Se mudou a senha do admin, o admin precisará fazer login novamente com a nova senha.
  return NextResponse.json({ ok: true, settings: updated })
}
