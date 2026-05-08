import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { hashPassword } from '@/lib/customer-auth'

const RESETS_FILE = path.join(process.cwd(), 'data', 'password_resets.json')
const CUSTOMERS_FILE = path.join(process.cwd(), 'data', 'customers.json')

interface ResetToken { token: string; email: string; expiresAt: number }

async function readTokens(): Promise<ResetToken[]> {
  try { return JSON.parse(await fs.readFile(RESETS_FILE, 'utf-8')) }
  catch { return [] }
}
async function writeTokens(t: ResetToken[]) {
  await fs.mkdir(path.dirname(RESETS_FILE), { recursive: true })
  await fs.writeFile(RESETS_FILE, JSON.stringify(t, null, 2))
}

// POST: redefinir senha com token
export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json()

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token e nova senha são obrigatórios.' }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
  }

  const tokens = await readTokens()
  const found = tokens.find(t => t.token === token && t.expiresAt > Date.now())

  if (!found) {
    return NextResponse.json({ error: 'Link inválido ou expirado. Solicite um novo.' }, { status: 400 })
  }

  // Atualiza a senha do cliente
  const customers = JSON.parse(
    await fs.readFile(CUSTOMERS_FILE, 'utf-8').catch(() => '[]')
  )
  const idx = customers.findIndex((c: any) => c.email.toLowerCase() === found.email.toLowerCase())
  if (idx === -1) {
    return NextResponse.json({ error: 'Conta não encontrada.' }, { status: 404 })
  }

  customers[idx].passwordHash = await hashPassword(newPassword)
  await fs.writeFile(CUSTOMERS_FILE, JSON.stringify(customers, null, 2))

  // Remove token usado (e expirados)
  const remaining = tokens.filter(t => t.token !== token && t.expiresAt > Date.now())
  await writeTokens(remaining)

  return NextResponse.json({ ok: true })
}
