import nodemailer from 'nodemailer'
import { getSettings } from './settings'

export interface EmailPayload {
  to: string
  subject: string
  html: string
  replyTo?: string
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

function emailShell(lojaNome: string, content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#141414;border:1px solid #c9912a33;">
    <div style="background:#1a1a1a;padding:32px;text-align:center;border-bottom:1px solid #c9912a33;">
      <h1 style="margin:0;font-family:Georgia,serif;color:#F5F0E8;font-weight:300;letter-spacing:0.2em;font-size:28px;">${lojaNome.toUpperCase()}</h1>
      <p style="margin:4px 0 0;color:#c9912a;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;">joias</p>
    </div>
    <div style="padding:32px;">${content}</div>
  </div>
</body></html>`
}

function itemsTable(order: any): string {
  return (order.items || []).map((i: any) => `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#F5F0E8;">${i.quantity}× ${i.title}</td>
    <td style="padding:8px 0;border-bottom:1px solid #2a2a2a;color:#c9912a;text-align:right;">R$ ${(i.unit_price * i.quantity).toFixed(2).replace('.', ',')}</td>
  </tr>`).join('') + `
  <tr>
    <td style="padding:12px 0 0;color:#9e9e9e;font-size:13px;">Total</td>
    <td style="padding:12px 0 0;color:#c9912a;font-size:18px;font-weight:700;text-align:right;">R$ ${(order.total || 0).toFixed(2).replace('.', ',')}</td>
  </tr>`
}

export function customerOrderReceivedHtml(order: any, lojaNome: string): string {
  return emailShell(lojaNome, `
    <h2 style="color:#F5F0E8;font-weight:400;font-size:20px;margin:0 0 8px;">Olá, ${(order.payer?.name || 'cliente').split(' ')[0]}!</h2>
    <p style="color:#9e9e9e;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Recebemos seu pedido <strong style="color:#c9912a;">#${order.id}</strong>. Estamos aguardando a confirmação do pagamento.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${itemsTable(order)}</table>
    <p style="color:#757575;font-size:12px;line-height:1.6;border-top:1px solid #2a2a2a;padding-top:16px;margin-top:8px;">
      Assim que o pagamento for confirmado, você receberá outro e-mail. Boas compras!
    </p>
  `)
}

export function customerOrderApprovedHtml(order: any, lojaNome: string): string {
  return emailShell(lojaNome, `
    <div style="background:#0d3818;border:1px solid #2a7a3a;padding:14px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#7adf94;font-size:13px;letter-spacing:0.1em;">✓ PAGAMENTO CONFIRMADO</p>
    </div>
    <h2 style="color:#F5F0E8;font-weight:400;font-size:20px;margin:0 0 8px;">Obrigada pela compra, ${(order.payer?.name || 'cliente').split(' ')[0]}!</h2>
    <p style="color:#9e9e9e;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Pedido <strong style="color:#c9912a;">#${order.id}</strong> recebido com sucesso. Vamos preparar tudo com carinho e enviar em breve.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">${itemsTable(order)}</table>
    <p style="color:#757575;font-size:12px;line-height:1.6;border-top:1px solid #2a2a2a;padding-top:16px;margin-top:8px;">
      Você receberá um novo e-mail quando o pedido for despachado, com o código de rastreio.
    </p>
  `)
}

export function customerOrderShippedHtml(order: any, lojaNome: string, trackingCode: string): string {
  return emailShell(lojaNome, `
    <div style="background:#0d2638;border:1px solid #2a5e7a;padding:14px;margin-bottom:24px;text-align:center;">
      <p style="margin:0;color:#7ac6df;font-size:13px;letter-spacing:0.1em;">📦 SEU PEDIDO FOI ENVIADO</p>
    </div>
    <h2 style="color:#F5F0E8;font-weight:400;font-size:20px;margin:0 0 8px;">Já está a caminho, ${(order.payer?.name || 'cliente').split(' ')[0]}!</h2>
    <p style="color:#9e9e9e;font-size:14px;line-height:1.6;margin:0 0 16px;">
      Pedido <strong style="color:#c9912a;">#${order.id}</strong> despachado.
    </p>
    <div style="background:#1a1a1a;border:1px solid #c9912a55;padding:16px;margin-bottom:24px;">
      <p style="color:#9e9e9e;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 6px;">Código de Rastreio</p>
      <p style="color:#c9912a;font-size:18px;font-weight:700;margin:0 0 12px;letter-spacing:0.05em;">${trackingCode}</p>
      <a href="https://rastreamento.correios.com.br/app/index.php?objetos=${trackingCode}"
        style="display:inline-block;background:#c9912a;color:#0a0a0a;padding:10px 20px;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">
        Rastrear nos Correios
      </a>
    </div>
    <p style="color:#757575;font-size:12px;line-height:1.6;border-top:1px solid #2a2a2a;padding-top:16px;margin-top:8px;">
      Mal podemos esperar para você receber sua joia! Qualquer dúvida, é só responder este e-mail.
    </p>
  `)
}

export function passwordResetEmailHtml(name: string, resetLink: string, lojaNome: string): string {
  return emailShell(lojaNome, `
    <h2 style="color:#F5F0E8;font-weight:400;font-size:20px;margin:0 0 8px;">Olá, ${name.split(' ')[0]}</h2>
    <p style="color:#9e9e9e;font-size:14px;line-height:1.6;margin:0 0 24px;">
      Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova:
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${resetLink}" style="display:inline-block;background:#c9912a;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">
        Redefinir Senha
      </a>
    </div>
    <p style="color:#757575;font-size:12px;line-height:1.6;border-top:1px solid #2a2a2a;padding-top:16px;margin-top:8px;">
      Este link expira em 1 hora. Se você não pediu essa redefinição, pode ignorar este e-mail.
    </p>
  `)
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
