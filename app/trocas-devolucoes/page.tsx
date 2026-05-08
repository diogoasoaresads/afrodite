import Link from 'next/link'
import { ArrowLeft, RefreshCw, Package, Clock, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trocas e Devoluções — Afrodite Joias',
  description: 'Saiba como funciona nossa política de trocas e devoluções.',
}

export default function TrocasDevolucoesPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <Link href="/" className="text-dark-400 hover:text-gold-400 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--c-text)] font-light">Trocas e Devoluções</h1>
      </div>

      {/* Cards rápidos */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock, title: '7 dias', desc: 'Prazo para solicitar troca ou devolução' },
          { icon: Package, title: 'Sem custo', desc: 'Primeira troca por defeito é por nossa conta' },
          { icon: CheckCircle, title: 'Reembolso', desc: 'Devolvemos em até 10 dias úteis' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-dark-800 border border-gold-500/10 p-5 text-center">
            <Icon size={28} className="text-gold-400 mx-auto mb-3" />
            <p className="text-[var(--c-text)] font-semibold text-lg">{title}</p>
            <p className="text-dark-400 text-xs mt-1">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-dark-300 space-y-6 leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Condições para Troca ou Devolução</h2>
          <p>Aceitamos trocas e devoluções nas seguintes condições:</p>
          <ul className="list-disc list-inside space-y-2 mt-3 text-dark-400">
            <li>Solicitação feita em até <strong className="text-cream">7 dias corridos</strong> após o recebimento</li>
            <li>Produto sem uso, sem sinais de desgaste e na embalagem original</li>
            <li>Produto com defeito de fabricação comprovado</li>
            <li>Produto diferente do que foi pedido</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Como Solicitar</h2>
          <ol className="list-decimal list-inside space-y-2 text-dark-400">
            <li>Entre em <Link href="/contato" className="text-gold-400 hover:underline">contato</Link> ou nos envie uma mensagem via WhatsApp</li>
            <li>Informe seu número de pedido e o motivo da troca/devolução</li>
            <li>Aguarde nossas instruções para envio do produto</li>
            <li>Após recebermos e conferirmos o item, processamos a troca ou reembolso</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Custos de Envio</h2>
          <ul className="list-disc list-inside space-y-2 text-dark-400">
            <li><strong className="text-cream">Defeito de fabricação:</strong> frete de retorno por nossa conta</li>
            <li><strong className="text-cream">Troca por preferência:</strong> frete de retorno por conta do cliente</li>
            <li><strong className="text-cream">Arrependimento (CDC art. 49):</strong> frete de retorno por nossa conta para compras online</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Reembolso</h2>
          <p>
            O reembolso é processado em até <strong className="text-cream">10 dias úteis</strong> após recebermos o produto. O crédito aparece na fatura do cartão em até 2 ciclos de cobrança, dependendo da operadora.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[var(--c-text)] font-light mb-3">Itens Não Passíveis de Troca</h2>
          <ul className="list-disc list-inside space-y-1 text-dark-400">
            <li>Joias personalizadas com gravação ou sob medida</li>
            <li>Produtos com sinais claros de uso ou avaria causada pelo cliente</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
