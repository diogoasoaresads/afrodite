import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { parseSessionToken, getCustomerById, CUSTOMER_COOKIE, verifyPassword, hashPassword } from '@/lib/customer-auth'
import fs from 'fs/promises'
import path from 'path'

const CUSTOMERS_FILE = path.join(process.cwd(), 'data', 'customers.json')

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get(CUSTOMER_COOKIE)?.value
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const customerId = parseSessionToken(session)
  if (!customerId) return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })

  const { name, email, phone, currentPassword, newPassword } = await req.json()

  if (!name?.trim()) return NextResponse.json({ error: 'Nome é obrigatório.' }, { status: 400 })
  if (!email?.trim()) return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 })

  const customers = JSON.parse(await fs.readFile(CUSTOMERS_FILE, 'utf-8').catch(() => '[]'))
  const idx = customers.findIndex((c: any) => c.id === customerId)
  if (idx === -1) return NextResponse.json({ error: 'Cliente não encontrado.' }, { status: 404 })

  // Verifica se o novo e-mail já está em uso por outra conta
  const emailInUse = customers.find((c: any) => c.email.toLowerCase() === email.toLowerCase() && c.id !== customerId)
  if (emailInUse) return NextResponse.json({ error: 'Este e-mail já está em uso por outra conta.' }, { status: 400 })

  // Atualizar senha se informada
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: 'Informe a senha atual para alterá-la.' }, { status: 400 })
    }
    const currentValid = await verifyPassword(currentPassword, customers[idx].passwordHash)
    if (!currentValid) {
      return NextResponse.json({ error: 'Senha atual incorreta.' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }
    customers[idx].passwordHash = await hashPassword(newPassword)
  }

  customers[idx].name = name.trim()
  customers[idx].email = email.trim().toLowerCase()
  if (phone !== undefined) customers[idx].phone = phone.trim()

  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2))

  return NextResponse.json({ ok: true })
}
