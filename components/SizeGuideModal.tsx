'use client'

import { useEffect, useState } from 'react'
import { X, Ruler } from 'lucide-react'

interface Props {
  onClose: () => void
}

const ringSizes = [
  { numero: '10', diametro: '15,9', circunferencia: '50' },
  { numero: '11', diametro: '16,5', circunferencia: '52' },
  { numero: '12', diametro: '17,2', circunferencia: '54' },
  { numero: '13', diametro: '17,8', circunferencia: '56' },
  { numero: '14', diametro: '18,5', circunferencia: '58' },
  { numero: '15', diametro: '19,1', circunferencia: '60' },
  { numero: '16', diametro: '19,7', circunferencia: '62' },
  { numero: '17', diametro: '20,4', circunferencia: '64' },
  { numero: '18', diametro: '21,0', circunferencia: '66' },
  { numero: '19', diametro: '21,6', circunferencia: '68' },
  { numero: '20', diametro: '22,3', circunferencia: '70' },
  { numero: '21', diametro: '22,9', circunferencia: '72' },
  { numero: '22', diametro: '23,6', circunferencia: '74' },
]

export default function SizeGuideModal({ onClose }: Props) {
  const [whatsapp, setWhatsapp] = useState('5511999999999')

  useEffect(() => {
    fetch('/api/configuracoes/publicas')
      .then(r => r.json())
      .then(d => {
        const raw = (d?.loja?.whatsapp || '').replace(/\D/g, '')
        if (raw.length >= 10) setWhatsapp(raw.startsWith('55') ? raw : `55${raw}`)
      })
      .catch(() => {})
  }, [])

  // Fecha com Esc
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Trava scroll do body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm z-[80] animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-dark-800 border border-gold-500/20 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold-500/10 sticky top-0 bg-dark-800 z-10">
            <div className="flex items-center gap-3">
              <Ruler size={18} className="text-gold-400" />
              <h2 className="font-serif text-xl text-cream font-light tracking-wide">
                Guia de Tamanhos
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-dark-400 hover:text-gold-400 transition-colors p-1"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* Como medir */}
            <div>
              <h3 className="text-cream text-sm tracking-[0.3em] uppercase mb-4">
                Como Descobrir Seu Tamanho
              </h3>

              <div className="space-y-4">
                {/* Método 1 */}
                <div className="flex gap-4 p-4 bg-dark-700/50 border border-gold-500/10">
                  <span className="text-gold-400 font-serif text-2xl font-light leading-none mt-0.5">1</span>
                  <div>
                    <p className="text-cream text-sm font-semibold mb-1">Com um barbante ou fio</p>
                    <p className="text-dark-300 text-xs leading-relaxed">
                      Envolva um barbante fino ao redor do dedo onde vai usar o anel.
                      Marque o ponto onde se encontra, estique sobre uma régua e anote
                      a medida em milímetros. Essa é a <strong className="text-cream">circunferência</strong>.
                    </p>
                  </div>
                </div>

                {/* Método 2 */}
                <div className="flex gap-4 p-4 bg-dark-700/50 border border-gold-500/10">
                  <span className="text-gold-400 font-serif text-2xl font-light leading-none mt-0.5">2</span>
                  <div>
                    <p className="text-cream text-sm font-semibold mb-1">Com um anel que já serve</p>
                    <p className="text-dark-300 text-xs leading-relaxed">
                      Coloque um anel que já veste bem sobre uma régua e meça o
                      <strong className="text-cream"> diâmetro interno</strong> (de borda a borda, por dentro).
                      Use a tabela abaixo para encontrar o número correspondente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gold-500/5 border border-gold-500/20">
                <p className="text-gold-400 text-xs leading-relaxed">
                  <strong>Dica:</strong> Meça no final do dia, quando os dedos estão levemente
                  maiores. Evite medir com frio. Para anéis mais largos, suba meio número.
                </p>
              </div>
            </div>

            {/* Tabela */}
            <div>
              <h3 className="text-cream text-sm tracking-[0.3em] uppercase mb-4">
                Tabela de Equivalência
              </h3>

              <div className="overflow-hidden border border-gold-500/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gold-500/10 border-b border-gold-500/10">
                      <th className="text-left px-4 py-3 text-gold-400 text-xs tracking-widest uppercase">
                        Nº (Brasil)
                      </th>
                      <th className="text-left px-4 py-3 text-gold-400 text-xs tracking-widest uppercase">
                        Diâmetro (mm)
                      </th>
                      <th className="text-left px-4 py-3 text-gold-400 text-xs tracking-widest uppercase">
                        Circunferência (mm)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {ringSizes.map((row, i) => (
                      <tr
                        key={row.numero}
                        className={`transition-colors hover:bg-gold-500/5 ${i % 2 === 0 ? '' : 'bg-dark-700/20'}`}
                      >
                        <td className="px-4 py-3 text-cream font-semibold">{row.numero}</td>
                        <td className="px-4 py-3 text-dark-300">{row.diametro} mm</td>
                        <td className="px-4 py-3 text-dark-300">{row.circunferencia} mm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dúvidas */}
            <div className="border-t border-gold-500/10 pt-6 text-center">
              <p className="text-dark-400 text-xs mb-3">
                Ainda com dúvida sobre o tamanho?
              </p>
              <a
                href={`https://wa.me/${whatsapp}?text=Olá!%20Preciso%20de%20ajuda%20para%20descobrir%20meu%20tamanho%20de%20anel.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 text-sm transition-colors"
              >
                Fale conosco pelo WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
