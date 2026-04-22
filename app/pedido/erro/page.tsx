import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function ErroPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <XCircle size={72} className="text-red-400" strokeWidth={1} />
        </div>
        <h1 className="font-serif text-4xl text-cream font-light mb-4">Pagamento não aprovado</h1>
        <p className="text-dark-300 leading-relaxed mb-10">
          Houve um problema ao processar seu pagamento. Nenhum valor foi cobrado. Tente novamente ou entre em contato conosco.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/checkout" className="btn-gold">Tentar Novamente</Link>
          <Link href="/" className="btn-outline-gold">Voltar ao Início</Link>
        </div>
      </div>
    </div>
  )
}
