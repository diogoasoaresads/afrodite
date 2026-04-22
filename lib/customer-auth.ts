// Autenticação de clientes via arquivo JSON + cookie de sessão
// Em produção, substitua por NextAuth + banco de dados

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export interface Customer {
  id: string
  name: string
  email: string
  passwordHash: string
  createdAt: string
}

export const CUSTOMER_COOKIE = 'afrodite_session'
const DATA_FILE = path.join(process.cwd(), 'data', 'customers.json')

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

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'afrodite_salt').digest('hex')
}

export async function registerCustomer(name: string, email: string, password: string): Promise<Customer | null> {
  const customers = await readCustomers()
  if (customers.find(c => c.email === email)) return null // já existe

  const customer: Customer = {
    id: `cust_${Date.now()}`,
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  customers.push(customer)
  await writeCustomers(customers)
  return customer
}

export async function loginCustomer(email: string, password: string): Promise<Customer | null> {
  const customers = await readCustomers()
  const customer = customers.find(c => c.email === email && c.passwordHash === hashPassword(password))
  return customer ?? null
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
