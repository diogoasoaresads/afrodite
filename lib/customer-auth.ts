// Autenticação de clientes via arquivo JSON + cookie de sessão
// Senhas armazenadas com bcrypt (migração automática de SHA256 legado)

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export interface Customer {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
  phone?: string
}

export const CUSTOMER_COOKIE = 'afrodite_session'
const DATA_FILE = path.join(process.cwd(), 'data', 'customers.json')
const BCRYPT_ROUNDS = 12

async function readCustomers(): Promise<Customer[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeCustomers(customers: Customer[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
  await fs.writeFile(DATA_FILE, JSON.stringify(customers, null, 2))
}

// Legacy SHA256 hash (para migração automática)
function legacyHash(password: string): string {
  return crypto.createHash('sha256').update(password + 'afrodite_salt').digest('hex')
}

function isBcryptHash(hash: string): boolean {
  return hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (isBcryptHash(hash)) {
    return bcrypt.compare(password, hash)
  }
  // Legacy SHA256 — aceita e migra no próximo login
  return hash === legacyHash(password)
}

export async function registerCustomer(name: string, email: string, password: string): Promise<Customer | null> {
  const customers = await readCustomers()
  if (customers.find(c => c.email.toLowerCase() === email.toLowerCase())) return null

  const customer: Customer = {
    id: `cust_${Date.now()}`,
    name,
    email: email.toLowerCase(),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  customers.push(customer)
  await writeCustomers(customers)
  return customer
}

export async function loginCustomer(email: string, password: string): Promise<Customer | null> {
  const customers = await readCustomers()
  const customer = customers.find(c => c.email.toLowerCase() === email.toLowerCase())
  if (!customer) return null

  const valid = await verifyPassword(password, customer.passwordHash)
  if (!valid) return null

  // Migração automática: se a senha estava em SHA256, re-hasheia com bcrypt
  if (!isBcryptHash(customer.passwordHash)) {
    const idx = customers.indexOf(customer)
    customers[idx].passwordHash = await hashPassword(password)
    await writeCustomers(customers)
  }

  return customer
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customers = await readCustomers()
  return customers.find(c => c.id === id) ?? null
}

export function createSessionToken(customerId: string): string {
  return Buffer.from(`${customerId}:${Date.now()}`).toString('base64')
}

export function parseSessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.split(':')[0]
  } catch {
    return null
  }
}
