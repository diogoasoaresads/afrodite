import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Afrodite Joias',
  description: 'Saiba como a Afrodite Joias coleta, usa e protege seus dados pessoais conforme a LGPD.',
}

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Política de Privacidade</h1>
      </div>

      <div className="prose prose-sm max-w-none text-dark-300 space-y-6 leading-relaxed">
        <p className="text-dark-400 text-sm">Última atualização: maio de 2025</p>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">1. Quem somos</h2>
          <p>
            A Afrodite Joias é uma loja de joias que respeita e protege a privacidade dos seus clientes. Esta política descreve como coletamos, usamos e protegemos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">2. Dados que coletamos</h2>
          <p>Coletamos apenas os dados necessários para processar seus pedidos e melhorar sua experiência:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-dark-400">
            <li>Nome completo e e-mail (cadastro e pedidos)</li>
            <li>CPF (obrigatório pelo Mercado Pago para emissão de nota fiscal)</li>
            <li>Telefone e endereço de entrega (entrega de pedidos)</li>
            <li>Dados de navegação (via cookies, para melhorar o site)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">3. Como usamos seus dados</h2>
          <ul className="list-disc list-inside space-y-1 text-dark-400">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar confirmações e atualizações de pedido por e-mail</li>
            <li>Enviar novidades e promoções (apenas com seu consentimento)</li>
            <li>Melhorar nosso site e serviços</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">4. Compartilhamento de dados</h2>
          <p>
            Seus dados são compartilhados apenas com o Mercado Pago para processamento de pagamentos. Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">5. Seus direitos (LGPD)</h2>
          <p>De acordo com a LGPD, você tem direito a:</p>
          <ul className="list-disc list-inside space-y-1 mt-2 text-dark-400">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão dos seus dados</li>
            <li>Revogar seu consentimento a qualquer momento</li>
            <li>Solicitar a portabilidade dos seus dados</li>
          </ul>
          <p className="mt-3">Para exercer esses direitos, entre em contato pelo nosso <Link href="/contato" className="text-gold-400 hover:underline">formulário de contato</Link>.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">6. Cookies</h2>
          <p>
            Usamos cookies para manter sua sessão, preferências de carrinho e lista de favoritos. Você pode recusar cookies não essenciais através do banner de cookies ou configurações do seu navegador.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">7. Segurança</h2>
          <p>
            Utilizamos SSL/TLS para proteger a transmissão dos seus dados. Senhas são armazenadas com hash criptográfico. Trabalhamos continuamente para aprimorar a segurança dos nossos sistemas.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">8. Contato</h2>
          <p>
            Para dúvidas sobre esta política ou para exercer seus direitos, entre em contato:{' '}
            <Link href="/contato" className="text-gold-400 hover:underline">Formulário de Contato</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
