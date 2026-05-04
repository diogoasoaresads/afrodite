import { getCustomers, getOrders } from '@/lib/db'
import { formatPrice } from '@/lib/formatters'
import { Users } from 'lucide-react'
import ClientesClient from './ClientesClient'

export default async function AdminClientes() {
  const [customers, orders] = await Promise.all([getCustomers(), getOrders()])
  return <ClientesClient customers={customers as any} orders={orders as any} />
}
