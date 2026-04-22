import { NextRequest, NextResponse } from 'next/server'
import { updateDBProduct, deleteDBProduct } from '@/lib/db'
import { ADMIN_COOKIE, isValidSession } from '@/lib/admin-auth'

function checkAuth(req: NextRequest) {
  const session = req.cookies.get(ADMIN_COOKIE)?.value
  return isValidSession(session)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const product = await updateDBProduct(params.id, body)
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json(product)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const ok = await deleteDBProduct(params.id)
  if (!ok) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
