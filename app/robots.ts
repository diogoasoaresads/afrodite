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

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = await getBaseUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/conta', '/checkout'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
