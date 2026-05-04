import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'
import { getSettings } from '@/lib/settings'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const settings = await getSettings()
  const { smtp } = settings as any

  if (!smtp?.host || !smtp?.notifyEmail) {
    return NextResponse.json({ error: 'Configure o SMTP e o e-mail de destino primeiro.' }, { status: 400 })
  }

  const result = await sendEmail({
    to: smtp.notifyEmail,
    subject: `✓ Teste de e-mail — ${settings.loja.nome || 'Afrodite Joias'}`,
    html: `
      <div style="font-family:system-ui;padding:32px;background:#141414;color:#F5F0E8;max-width:480px;margin:0 auto;border:1px solid #c9912a33;">
        <h2 style="color:#c9912a;font-family:Georgia,serif;font-weight:300;">Afrodite Joias</h2>
        <p>Este é um e-mail de teste enviado pelo painel admin.</p>
        <p style="color:#9e9e9e;font-size:13px;">Se você está vendo isto, o envio de e-mails está configurado corretamente! ✓</p>
      </div>
    `,
  })

  if (result.ok) return NextResponse.json({ ok: true })
  return NextResponse.json({ error: result.error || 'Erro ao enviar' }, { status: 500 })
}
