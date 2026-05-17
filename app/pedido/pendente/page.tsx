import { redirect } from 'next/navigation'

// Rota legada do Mercado Pago — redireciona para página WhatsApp
export default function PendenteRedirect() {
  redirect('/pedido/whatsapp')
}
