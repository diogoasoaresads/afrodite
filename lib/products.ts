export type Category = 'aneis' | 'colares' | 'brincos' | 'pulseiras'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: Category
  description: string
  details: string[]
  material: string
  images: string[]
  inStock: boolean
  featured: boolean
  isNew?: boolean
  isSale?: boolean
}

export const categories = [
  { id: 'aneis',     label: 'Anéis',      icon: '💍' },
  { id: 'colares',   label: 'Colares',    icon: '📿' },
  { id: 'brincos',   label: 'Brincos',    icon: '✨' },
  { id: 'pulseiras', label: 'Pulseiras',  icon: '💎' },
]

export const products: Product[] = [
  {
    id: '1',
    name: 'Anel Eternidade Diamante',
    price: 2890,
    category: 'aneis',
    description: 'Anel eternidade com diamantes cravejados em ouro 18k. Uma peça atemporal que simboliza amor infinito.',
    details: [
      'Ouro 18k amarelo',
      'Diamantes naturais 0,50ct total',
      'Certificado de autenticidade incluso',
      'Tamanhos: 12 ao 22',
    ],
    material: 'Ouro 18k com Diamantes',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    inStock: true,
    featured: true,
    isNew: true,
  },
  {
    id: '2',
    name: 'Colar Gota de Luz',
    price: 1590,
    category: 'colares',
    description: 'Delicado colar com pingente em formato de gota cravejado de zircônias. Elegância em cada detalhe.',
    details: [
      'Prata 925 banhado a ouro 18k',
      'Zircônias lapidadas',
      'Corrente de 45cm com regulagem',
      'Fecho Lagosta',
    ],
    material: 'Prata 925 banhada a Ouro',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
    ],
    inStock: true,
    featured: true,
  },
  {
    id: '3',
    name: 'Brincos Cascata Dourada',
    price: 980,
    originalPrice: 1200,
    category: 'brincos',
    description: 'Brincos em cascata com design contemporâneo. Perfeitos para ocasiões especiais ou para o dia a dia sofisticado.',
    details: [
      'Ouro 18k',
      'Comprimento: 4,5cm',
      'Fecho tipo trava',
      'Ideal para rostos ovais e longos',
    ],
    material: 'Ouro 18k',
    images: [
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80',
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    ],
    inStock: true,
    featured: true,
    isSale: true,
  },
  {
    id: '4',
    name: 'Pulseira Riviera de Ouro',
    price: 3200,
    category: 'pulseiras',
    description: 'Pulseira riviera com pedras coloridas alternadas. Uma explosão de cor e elegância no seu pulso.',
    details: [
      'Ouro 18k amarelo',
      'Pedras coloridas naturais: rubi, safira e esmeralda',
      'Comprimento: 18cm',
      'Fecho caixa com trava dupla de segurança',
    ],
    material: 'Ouro 18k com Pedras Preciosas',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519eb8db0e4?w=800&q=80',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    ],
    inStock: true,
    featured: true,
  },
  {
    id: '5',
    name: 'Anel Solitário Rose',
    price: 1890,
    category: 'aneis',
    description: 'Clássico anel solitário em ouro rosé com pedra central brilhante. A escolha perfeita para noivados e ocasiões inesquecíveis.',
    details: [
      'Ouro 18k rosé',
      'Zircônia central 6mm AAA',
      'Acabamento polido',
      'Tamanhos: 12 ao 22',
    ],
    material: 'Ouro 18k Rosé',
    images: [
      'https://images.unsplash.com/photo-1589207212797-cfd1e7e7a56c?w=800&q=80',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    ],
    inStock: true,
    featured: false,
    isNew: true,
  },
  {
    id: '6',
    name: 'Colar Corrente Veneziana',
    price: 890,
    category: 'colares',
    description: 'Corrente veneziana em ouro com elos delicados e brilhantes. Pode ser usada sozinha ou com pingentes.',
    details: [
      'Ouro 18k amarelo',
      'Elos venezianos 2mm',
      'Comprimento: 50cm',
      'Fecho Lagosta reforçado',
    ],
    material: 'Ouro 18k',
    images: [
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    ],
    inStock: true,
    featured: false,
  },
  {
    id: '7',
    name: 'Brinco Argola Diamantada',
    price: 720,
    originalPrice: 890,
    category: 'brincos',
    description: 'Argolas com acabamento diamantado que refletem a luz em cada movimento. Versáteis e sofisticadas.',
    details: [
      'Prata 925 banhada a ouro 18k',
      'Diâmetro: 3cm',
      'Acabamento diamantado',
      'Fecho tipo click',
    ],
    material: 'Prata 925 banhada a Ouro',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&q=80',
    ],
    inStock: true,
    featured: false,
    isSale: true,
  },
  {
    id: '8',
    name: 'Pulseira Elos de Amor',
    price: 1290,
    category: 'pulseiras',
    description: 'Pulseira de elos com coração central em ouro. Símbolo do amor eterno que você carrega sempre.',
    details: [
      'Ouro 18k amarelo',
      'Coração central cravejado',
      'Comprimento ajustável: 16-20cm',
      'Fecho borboleta com trava',
    ],
    material: 'Ouro 18k',
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9519eb8db0e4?w=800&q=80',
    ],
    inStock: true,
    featured: false,
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

export function getProductsByCategory(category: Category): Product[] {
  return products.filter(p => p.category === category)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}
