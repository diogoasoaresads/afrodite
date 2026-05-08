import type { MetadataRoute } from 'next'
import path from 'path'
import fs from 'fs/promises'

async function getBaseUrl(): Promise<string> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'settings.json'), 'utf-8')
    const settings = JSON.parse(raw)
    if (settings.loja?.siteUrl) return settings.loja.siteUrl.replace(/\/$/, '')
  } catch {}
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://afroditejoias.com.br'
}

async function getProducts(): Promise<{ id: string; updatedAt?: string }[]> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), 'data', 'products.json'), 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = await getBaseUrl()
  const products = await getProducts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                          lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${baseUrl}/produtos`,            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/sobre`,               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/como-comprar`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/trocas-devolucoes`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/garantia`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/cuidados-joias`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/politica-privacidade`,lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${baseUrl}/termos-uso`,          lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.3 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${baseUrl}/produtos/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticPages, ...productPages]
}
