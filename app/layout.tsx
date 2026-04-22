import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/lib/theme'
import ConditionalShell from '@/components/ConditionalShell'

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
    <html lang="pt-BR" data-theme="dark">
      <body>
        <ThemeProvider>
          <ConditionalShell>
            <main>{children}</main>
          </ConditionalShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
