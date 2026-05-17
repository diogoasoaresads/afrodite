/**
 * Evolution API — integração WhatsApp
 * Documentação: https://doc.evolution-api.com/v2/api-reference/message-controller/send-text-message
 */

export interface EvolutionConfig {
  url: string       // ex: https://evolution.seuserver.com
  apiKey: string    // API Key da instância
  instance: string  // nome da instância
}

export interface SendTextResult {
  ok: boolean
  messageId?: string
  error?: string
}

/**
 * Envia mensagem de texto via Evolution API
 */
export async function sendEvolutionText(
  config: EvolutionConfig,
  to: string,        // número destino: 5511999999999
  text: string,      // texto da mensagem (suporta *bold*, _italic_, \n)
): Promise<SendTextResult> {
  const baseUrl = config.url.replace(/\/$/, '')

  try {
    const res = await fetch(`${baseUrl}/message/sendText/${config.instance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey,
      },
      body: JSON.stringify({
        number: to,
        text,
        delay: 500,   // pequeno delay para não parecer spam
      }),
      // Timeout de 10s para não travar o checkout
      signal: AbortSignal.timeout(10_000),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Evolution] Erro ao enviar mensagem:', res.status, err)
      return { ok: false, error: `HTTP ${res.status}: ${err}` }
    }

    const data = await res.json()
    // A Evolution retorna { key: { id: "..." }, ... } em v2
    const messageId = data?.key?.id ?? data?.id ?? undefined
    return { ok: true, messageId }
  } catch (err: any) {
    console.error('[Evolution] Falha na requisição:', err?.message)
    return { ok: false, error: err?.message ?? 'Erro desconhecido' }
  }
}

/**
 * Verifica se a instância está conectada
 * Retorna true se status === 'open' (WhatsApp conectado)
 */
export async function checkEvolutionStatus(config: EvolutionConfig): Promise<{
  connected: boolean
  status?: string
  error?: string
}> {
  const baseUrl = config.url.replace(/\/$/, '')
  try {
    const res = await fetch(`${baseUrl}/instance/connectionState/${config.instance}`, {
      headers: { 'apikey': config.apiKey },
      signal: AbortSignal.timeout(8_000),
    })
    if (!res.ok) return { connected: false, error: `HTTP ${res.status}` }
    const data = await res.json()
    // Evolution v2: { instance: { state: "open" } }
    const state = data?.instance?.state ?? data?.state ?? ''
    return { connected: state === 'open', status: state }
  } catch (err: any) {
    return { connected: false, error: err?.message }
  }
}

/**
 * Monta a mensagem de notificação de novo pedido para a dona da loja
 */
export function buildOwnerOrderMessage(order: {
  id: string
  customerName?: string
  customerPhone?: string
  items: Array<{ title: string; quantity: number; unit_price: number; size?: string }>
  total: number
  coupon?: { code: string; discount: number } | null
}): string {
  const name  = order.customerName?.trim() || 'não informado'
  const phone = order.customerPhone?.trim()

  const itemLines = order.items
    .map(i => {
      const size  = i.size ? ` (${i.size})` : ''
      const price = (i.unit_price * i.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      return `  • ${i.quantity}x ${i.title}${size} — ${price}`
    })
    .join('\n')

  const total = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  let msg = `🛍️ *NOVO PEDIDO RECEBIDO — #${order.id.slice(-6).toUpperCase()}*\n\n`
  msg += `👤 *Cliente:* ${name}\n`
  if (phone) msg += `📱 *Telefone:* ${phone}\n`
  msg += `\n*Itens:*\n${itemLines}\n`

  if (order.coupon) {
    const discount = order.coupon.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    msg += `\n🏷️ *Cupom ${order.coupon.code}:* −${discount}\n`
  }

  msg += `\n💰 *Total: ${total}*`
  msg += `\n\n⏰ ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`
  msg += `\n\n_O cliente pode entrar em contato pelo WhatsApp a qualquer momento. Se precisar, você já tem os dados acima para chamar primeiro._ 😊`

  return msg
}
