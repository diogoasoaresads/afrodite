import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductById, getRelatedProducts } from '@/lib/products'
import ProductPageClient from './ProductPageClient'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductById(params.id)
  if (!product) return { title: 'Produto não encontrado' }

  return {
    title: `${product.name} — Afrodite Joias`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : [],
      type: 'website',
      locale: 'pt_BR',
    },
  }
}

export default function ProductPage({ params }: Props) {
  const product = getProductById(params.id)
  if (!product) notFound()

  const related = getRelatedProducts(product)

  return <ProductPageClient product={product} related={related} />
}
