import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'

export const metadata: Metadata = {
  title: 'Afrodite Joias | Beleza que Dura para Sempre',
  description: 'Joias exclusivas em ouro, prata e pedras preciosas. Elegância e sofisticação para cada momento especial.',
  keywords: 'joias, ouro, prata, anéis, colares, brincos, pulseiras, joalheria, afrodite',
  openGraph: {
    title: 'Afrodite Joias',
    description: 'Joias exclusivas em ouro, prata e pedras preciosas.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
