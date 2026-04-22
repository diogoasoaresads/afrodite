'use client'

import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-gold-500/20">
      {/* Newsletter */}
      <div className="border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl text-cream font-light">Receba Nossas Novidades</h3>
            <p className="text-dark-300 text-sm mt-1">Ofertas exclusivas e lançamentos em primeira mão.</p>
          </div>
          <form className="flex w-full md:w-auto gap-0" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Seu e-mail"
              className="bg-dark-700 border border-gold-500/30 text-cream placeholder:text-dark-400 px-5 py-3 text-sm flex-1 md:w-72 outline-none focus:border-gold-400 transition-colors"
            />
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-400 text-dark-900 font-semibold px-6 py-3 text-sm tracking-widest uppercase transition-colors whitespace-nowrap"
            >
              Assinar
            </button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Marca */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex flex-col">
            <span className="font-serif text-2xl text-cream tracking-[0.2em] font-light">AFRODITE</span>
            <span className="text-gold-400 text-[9px] tracking-[0.4em] uppercase">joias</span>
          </Link>
          <p className="text-dark-400 text-sm mt-4 leading-relaxed">
            Joias exclusivas criadas para mulheres que celebram sua própria divindade.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="text-dark-400 hover:text-gold-400 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-dark-400 hover:text-gold-400 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
          </div>
        </div>

        {/* Coleções */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Coleções</h4>
          <ul className="space-y-3">
            {[
              { href: '/produtos?categoria=aneis',     label: 'Anéis' },
              { href: '/produtos?categoria=colares',   label: 'Colares' },
              { href: '/produtos?categoria=brincos',   label: 'Brincos' },
              { href: '/produtos?categoria=pulseiras', label: 'Pulseiras' },
              { href: '/produtos',                     label: 'Todas as Joias' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Ajuda</h4>
          <ul className="space-y-3">
            {[
              'Como Comprar',
              'Trocas e Devoluções',
              'Garantia',
              'Guia de Tamanhos',
              'Cuidados com Joias',
            ].map(item => (
              <li key={item}>
                <a href="#" className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="text-cream text-xs tracking-[0.3em] uppercase mb-5">Contato</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <Mail size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>contato@afroditejoias.com.br</span>
            </li>
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <Phone size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>(11) 99999-9999</span>
            </li>
            <li className="flex items-start gap-3 text-dark-400 text-sm">
              <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
              <span>São Paulo, SP — Brasil</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-dark-500 text-xs">
          <p>© 2024 Afrodite Joias. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-gold-400 transition-colors">CNPJ: 00.000.000/0001-00</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
