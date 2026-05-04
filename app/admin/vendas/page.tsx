import { getOrders } from '@/lib/db'
import VendasClient from './VendasClient'

export default async function AdminVendas() {
  const orders = await getOrders()
  return <VendasClient orders={orders as any} />
}
