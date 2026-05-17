import { NextResponse } from 'next/server'

// Webhook Mercado Pago desativado — loja opera via WhatsApp
export async function POST() {
  return NextResponse.json({ received: true })
}
