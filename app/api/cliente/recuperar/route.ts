import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { sendEmail, passwordResetEmailHtml } from '@/lib/email'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const RESETS_FILE = path.join(process.cwd(), 'data', 'password_resets.json')

interface ResetToken { token: string; email: string; expiresAt: number }

async function readTokens(): Promise<ResetToken[]> {
  try { return JSON.parse(await fs.readFile(RESETS_FILE, 'utf-8')) }
  catch { return [] }
}
async function writeTokens(t: ResetToken[]) {
  await fs.mkdir(path.dirname(RESETS_FILE), { recursive: true })
  await fs.writeFile(RESETS_FILE, JSON.stringify(t, null, 2))
}

// POST: solicitar recuperação
export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-mail obrigatório' }, { status: 400 })

  // Verifica se cliente existe
  const customers = JSON.parse(await fs.readFile(path.join(process.cwd(), 'data', 'customers.json'), 'utf-8').catch(() => '[]'))
  const customer = customers.find((c: any) => c.email.toLowerCase() === email.toLowerCase())

  // Sempre responde sucesso (anti-enumeration). Só envia e-mail se cliente existir.
  if (customer) {
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = Date.now() + 60 * 60 * 1000 // 1h

    // Limpa tokens expirados, adiciona novo
    let tokens = (await readTokens()).filter(t => t.expiresAt > Date.now() && t.email !== email.toLowerCase())
    tokens.push({ token, email: email.toLowerCase(), expiresAt })
    await writeTokens(tokens)

    const settings = await getSettings()
    const baseUrl = settings.loja.siteUrl || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const resetLink = `${baseUrl}/redefinir-senha/${token}`

    if (settings.smtp?.host) {
      sendEmail({
        to: email,
        subject: `Redefinir senha — ${settings.loja.nome}`,
        html: passwordResetEmailHtml(customer.name, resetLink, settings.loja.nome),
      }).catch(err => console.error('Erro e-mail recuperação:', err))
    }
  }

  return NextResponse.json({ ok: true })
}
