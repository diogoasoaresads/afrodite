import { NextRequest, NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { getSettings } from '@/lib/settings'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const settings = await getSettings()
  const token = settings.mercadopago.accessToken

  if (!token) {
    return NextResponse.json({ error: 'Access Token não configurado' }, { status: 400 })
  }

  try {
    // Tenta listar um pagamento — se o token for válido, retorna 200 mesmo sem resultados
    const client = new MercadoPagoConfig({ accessToken: token })
    const payment = new Payment(client)
    await payment.search({ options: { limit: 1 } })
    return NextResponse.json({ ok: true, message: 'Credenciais válidas!' })
  } catch (err: any) {
    const msg = err?.message || 'Token inválido'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
