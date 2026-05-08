import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termos de Uso — Afrodite Joias',
  description: 'Conheça os termos e condições de uso do site e loja Afrodite Joias.',
}

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Termos de Uso</h1>
      </div>

      <div className="text-dark-300 space-y-6 leading-relaxed">
        <p className="text-dark-400 text-sm">Última atualização: maio de 2025</p>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e utilizar o site da Afrodite Joias, você concorda com estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nosso site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">2. Uso do Site</h2>
          <p>Você se compromete a usar este site apenas para fins legítimos e de acordo com a legislação brasileira. É proibido:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-dark-400">
            <li>Tentar acessar áreas restritas sem autorização</li>
            <li>Copiar ou reproduzir conteúdo sem permissão</li>
            <li>Realizar pedidos fraudulentos</li>
            <li>Usar o site para fins ilegais ou prejudiciais</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">3. Produtos e Preços</h2>
          <p>
            Nos reservamos o direito de alterar preços, descrições e disponibilidade de produtos a qualquer momento. Em caso de erro de preço em um pedido já pago, entraremos em contato para resolver da melhor forma para ambas as partes.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">4. Compras e Pagamentos</h2>
          <p>
            Todos os pagamentos são processados pelo Mercado Pago, plataforma certificada PCI-DSS. Não armazenamos dados de cartão de crédito em nossos servidores.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">5. Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo do site — textos, imagens, logotipos e design — é protegido por direitos autorais. A reprodução não autorizada é proibida.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">6. Limitação de Responsabilidade</h2>
          <p>
            A Afrodite Joias não se responsabiliza por danos indiretos decorrentes do uso do site ou de produtos adquiridos, exceto nos casos previstos pelo Código de Defesa do Consumidor (Lei nº 8.078/1990).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">7. Alterações nos Termos</h2>
          <p>
            Podemos atualizar estes termos periodicamente. A versão mais recente estará sempre disponível nesta página. O uso continuado do site após alterações implica aceitação dos novos termos.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">8. Foro</h2>
          <p>
            Estes termos são regidos pela legislação brasileira. Qualquer disputa será resolvida no foro da cidade de São Paulo, SP.
          </p>
        </section>
      </div>
    </div>
  )
}
