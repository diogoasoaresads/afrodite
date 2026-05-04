import nodemailer from 'nodemailer'
import { getSettings } from './settings'

export interface EmailPayload {
  to: string
  subject: string
  html: string
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  try {
    const settings = await getSettings()
    const { smtp } = settings as any

    if (!smtp?.host || !smtp?.user || !smtp?.pass) {
      return { ok: false, error: 'SMTP não configurado' }
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    })

    await transporter.sendMail({
      from: `"${settings.loja.nome || 'Afrodite Joias'}" <${smtp.user}>`,
      ...payload,
    })

    return { ok: true }
  } catch (err: any) {
    console.error('Email error:', err.message)
    return { ok: false, error: err.message }
  }
}

export function orderApprovedEmailHtml(order: any, lojaNome: string): string {
  const items = (order.items || [])
    .map((i: any) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#F5F0E8;">${i.quantity}× ${i.title}</td>
      <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#c9912a;text-align:right;">
        R$ ${(i.unit_price * i.quantity).toFixed(2).replace('.', ',')}
      </td>
    </tr>`).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#141414;border:1px solid #c9912a33;">
    <div style="background:#1a1a1a;padding:32px;text-align:center;border-bottom:1px solid #c9912a33;">
      <h1 style="margin:0;font-family:Georgia,serif;color:#F5F0E8;font-weight:300;letter-spacing:0.2em;font-size:28px;">
        ${lojaNome.toUpperCase()}
      </h1>
      <p style="margin:4px 0 0;color:#c9912a;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;">joias</p>
    </div>

    <div style="padding:32px;">
      <div style="background:#c9912a22;border:1px solid #c9912a55;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;color:#c9912a;font-size:13px;letter-spacing:0.1em;">✓ NOVO PEDIDO APROVADO</p>
      </div>

      <h2 style="color:#F5F0E8;font-weight:400;font-size:18px;margin:0 0 16px;">
        Pedido #${order.id}
      </h2>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${items}
        <tr>
          <td style="padding:12px 0 0;color:#9e9e9e;font-size:13px;">Total</td>
          <td style="padding:12px 0 0;color:#c9912a;font-size:18px;font-weight:700;text-align:right;">
            R$ ${(order.total || 0).toFixed(2).replace('.', ',')}
          </td>
        </tr>
      </table>

      <div style="border-top:1px solid #2a2a2a;padding-top:20px;margin-top:8px;">
        <p style="margin:0 0 6px;color:#9e9e9e;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Cliente</p>
        <p style="margin:0;color:#F5F0E8;font-size:14px;">${order.payer?.name || '—'}</p>
        <p style="margin:4px 0 0;color:#757575;font-size:13px;">${order.payer?.email || ''}</p>
      </div>

      <div style="margin-top:24px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/vendas"
           style="display:inline-block;background:#c9912a;color:#0a0a0a;padding:12px 28px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">
          Ver no Admin
        </a>
      </div>
    </div>
  </div>
</body>
</html>`
}
