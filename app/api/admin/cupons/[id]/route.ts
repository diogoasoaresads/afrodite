import { NextRequest, NextResponse } from 'next/server'
import { isValidSessionAsync } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { updateCoupon, deleteCoupon } from '@/lib/db'

async function auth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value || ''
  return isValidSessionAsync(session)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const updated = await updateCoupon(params.id, data)
  if (!updated) return NextResponse.json({ error: 'Cupom não encontrado.' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await auth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const ok = await deleteCoupon(params.id)
  if (!ok) return NextResponse.json({ error: 'Cupom não encontrado.' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
