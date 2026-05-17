import { redirect } from 'next/navigation'

// Rota legada do Mercado Pago — redireciona para o checkout
export default function ErroRedirect() {
  redirect('/checkout')
}
