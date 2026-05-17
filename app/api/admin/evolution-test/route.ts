import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'
import { checkEvolutionStatus, sendEvolutionText } from '@/lib/evolution'
import { ADMIN_COOKIE, isValidSessionAsync } from '@/lib/admin-auth'

export async function POST(req: NextRequest) {
  if (!(await isValidSessionAsync(req.cookies.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const settings = await getSettings()
  const ev = settings.evolution

  if (!ev.url || !ev.apiKey || !ev.instance) {
    return NextResponse.json({ ok: false, error: 'Configuração incompleta. Preencha URL, API Key e Instância.' })
  }

  const config = { url: ev.url, apiKey: ev.apiKey, instance: ev.instance }

  // 1. Verifica status da instância
  const statusResult = await checkEvolutionStatus(config)
  if (!statusResult.connected) {
    return NextResponse.json({
      ok: false,
      error: `Instância "${ev.instance}" não está conectada. Status: ${statusResult.status ?? statusResult.error ?? 'desconhecido'}. Abra o Evolution e escaneie o QR code.`,
    })
  }

  // 2. Se tiver número configurado, envia mensagem de teste
  if (ev.ownerPhone) {
    const sendResult = await sendEvolutionText(
      config,
      ev.ownerPhone,
      `✅ *Teste de conexão — Afrodite Joias*\n\nSua integração com o Evolution API está funcionando! A partir de agora você receberá uma notificação aqui sempre que um novo pedido for registrado no site. 🛍️`,
    )
    if (!sendResult.ok) {
      return NextResponse.json({
        ok: false,
        error: `Instância conectada, mas falhou ao enviar mensagem: ${sendResult.error}`,
        instanceStatus: statusResult.status,
      })
    }
    return NextResponse.json({
      ok: true,
      message: `Mensagem de teste enviada para ${ev.ownerPhone}! Verifique seu WhatsApp.`,
      instanceStatus: statusResult.status,
    })
  }

  return NextResponse.json({
    ok: true,
    message: `Instância "${ev.instance}" está conectada (${statusResult.status}). Configure o número da dona para testar o envio.`,
    instanceStatus: statusResult.status,
  })
}
