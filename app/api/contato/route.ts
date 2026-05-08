import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })
  }

  const settings = await getSettings()

  if (!settings.smtp?.host) {
    // Se SMTP não configurado, apenas retorna sucesso (não bloqueia o site)
    console.log(`[Contato] ${email} — ${subject}: ${message}`)
    return NextResponse.json({ ok: true })
  }

  const notifyEmail = settings.smtp.notifyEmail || settings.loja.email
  if (!notifyEmail) {
    return NextResponse.json({ ok: true })
  }

  await sendEmail({
    to: notifyEmail,
    replyTo: email,
    subject: `[Contato Site] ${subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:24px;">
        <h2 style="color:#C9A84C;margin-bottom:16px;">Nova mensagem de contato</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px;color:#999;font-size:13px;width:80px;">Nome:</td>
            <td style="padding:8px;color:#eee;font-size:13px;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px;color:#999;font-size:13px;">E-mail:</td>
            <td style="padding:8px;color:#eee;font-size:13px;"><a href="mailto:${email}" style="color:#C9A84C;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px;color:#999;font-size:13px;">Assunto:</td>
            <td style="padding:8px;color:#eee;font-size:13px;">${subject}</td>
          </tr>
        </table>
        <div style="margin-top:16px;padding:16px;background:#1a1a1a;border-left:3px solid #C9A84C;">
          <p style="color:#ddd;font-size:14px;line-height:1.7;margin:0;">${message.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="color:#666;font-size:11px;margin-top:16px;">Responda diretamente a este e-mail para responder ao cliente.</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
