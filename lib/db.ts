// Banco de dados baseado em arquivos JSON (simples, sem instalação extra)
// Para escalar, substitua por Supabase, PlanetScale ou MongoDB

import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

async function readJSON<T>(filename: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, filename), 'utf-8')
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

async function writeJSON(filename: string, data: unknown): Promise<void> {
  await ensureDir()
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2))
}

// ─── Produtos ──────────────────────────────────────────────────────────────

export interface DBProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  description: string
  details: string[]
  material: string
  images: string[]
  inStock: boolean
  featured: boolean
  isNew?: boolean
  isSale?: boolean
  createdAt: string
  updatedAt: string
}

export async function getDBProducts(): Promise<DBProduct[]> {
  return readJSON<DBProduct[]>('products.json', [])
}

export async function saveDBProduct(product: Omit<DBProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DBProduct> {
  const products = await getDBProducts()
  const now = new Date().toISOString()
  const newProduct: DBProduct = {
    ...product,
    id: `db_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  }
  products.unshift(newProduct)
  await writeJSON('products.json', products)
  return newProduct
}

export async function updateDBProduct(id: string, data: Partial<DBProduct>): Promise<DBProduct | null> {
  const products = await getDBProducts()
  const idx = products.findIndex(p => p.id === id)
  if (idx === -1) return null
  products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() }
  await writeJSON('products.json', products)
  return products[idx]
}

export async function deleteDBProduct(id: string): Promise<boolean> {
  const products = await getDBProducts()
  const filtered = products.filter(p => p.id !== id)
  if (filtered.length === products.length) return false
  await writeJSON('products.json', filtered)
  return true
}

// ─── Produtos ocultos (estáticos ocultados pelo admin) ─────────────────────

export async function getHiddenProductIds(): Promise<string[]> {
  return readJSON<string[]>('hidden_products.json', [])
}

export async function hideStaticProduct(id: string): Promise<void> {
  const hidden = await getHiddenProductIds()
  if (!hidden.includes(id)) {
    hidden.push(id)
    await writeJSON('hidden_products.json', hidden)
  }
}

export async function unhideProduct(id: string): Promise<void> {
  const hidden = await getHiddenProductIds()
  await writeJSON('hidden_products.json', hidden.filter(h => h !== id))
}

// ─── Pedidos ───────────────────────────────────────────────────────────────

export interface Order {
  id: string
  preference_id?: string
  payment_id?: string
  payment_status?: string
  payment_method?: string
  items: { id: string; title: string; quantity: number; unit_price: number }[]
  payer: { name: string; email: string; identification: { type: string; number: string } }
  shipping_address?: {
    cep: string; rua: string; numero: string; complemento?: string;
    bairro: string; cidade: string; uf: string
  }
  total: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  shipping_status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  tracking_code?: string
  shipped_at?: string
  delivered_at?: string
  created_at: string
  updated_at?: string
}

export async function getOrders(): Promise<Order[]> {
  return readJSON<Order[]>('orders.json', [])
}

export async function getOrderStats() {
  const orders = await getOrders()
  const approved = orders.filter(o => o.payment_status === 'approved' || o.status === 'approved')

  return {
    total: orders.length,
    approved: approved.length,
    pending: orders.filter(o => o.payment_status === 'pending' || o.status === 'pending').length,
    revenue: approved.reduce((sum, o) => sum + o.total, 0),
  }
}

// ─── Clientes ──────────────────────────────────────────────────────────────

export interface Customer {
  email: string
  name: string
  cpf: string
  orderCount: number
  totalSpent: number
  lastOrder: string
}

export async function getCustomers(): Promise<Customer[]> {
  const orders = await getOrders()
  const map = new Map<string, Customer>()

  for (const order of orders) {
    if (!order.payer?.email) continue
    const existing = map.get(order.payer.email)
    const isApproved = order.payment_status === 'approved'

    if (existing) {
      existing.orderCount++
      if (isApproved) existing.totalSpent += order.total
      if (order.created_at > existing.lastOrder) existing.lastOrder = order.created_at
    } else {
      map.set(order.payer.email, {
        email: order.payer.email,
        name: order.payer.name || '',
        cpf: order.payer.identification?.number || '',
        orderCount: 1,
        totalSpent: isApproved ? order.total : 0,
        lastOrder: order.created_at,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent)
}
