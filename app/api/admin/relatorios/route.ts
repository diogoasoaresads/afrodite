import { NextRequest, NextResponse } from 'next/server'
import { isValidSessionAsync } from '@/lib/admin-auth'
import { cookies } from 'next/headers'
import { getOrders } from '@/lib/db'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value || ''
  if (!await isValidSessionAsync(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const days = parseInt(req.nextUrl.searchParams.get('days') || '30')
  const since = new Date()
  since.setDate(since.getDate() - days)

  const allOrders = await getOrders()
  const orders = allOrders.filter(o => new Date(o.created_at) >= since)
  const approved = orders.filter(o => o.payment_status === 'approved' || o.status === 'approved')

  // Daily sales aggregation
  const dailyMap = new Map<string, { revenue: number; orders: number }>()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    dailyMap.set(key, { revenue: 0, orders: 0 })
  }

  for (const o of approved) {
    const key = new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    const entry = dailyMap.get(key)
    if (entry) { entry.revenue += o.total; entry.orders++ }
  }

  const dailySales = Array.from(dailyMap.entries()).map(([date, v]) => ({ date, ...v }))

  // Top products
  const productMap = new Map<string, { name: string; qty: number; revenue: number }>()
  for (const o of approved) {
    for (const item of (o.items || [])) {
      const existing = productMap.get(item.id)
      if (existing) {
        existing.qty += item.quantity
        existing.revenue += item.unit_price * item.quantity
      } else {
        productMap.set(item.id, {
          name: item.title,
          qty: item.quantity,
          revenue: item.unit_price * item.quantity,
        })
      }
    }
  }
  const topProducts = Array.from(productMap.values()).sort((a, b) => b.qty - a.qty)

  // Unique customers
  const customerEmails = new Set(orders.map(o => o.payer?.email).filter(Boolean))

  const totalRevenue = approved.reduce((s, o) => s + o.total, 0)
  const avgTicket = approved.length > 0 ? totalRevenue / approved.length : 0

  return NextResponse.json({
    dailySales,
    topProducts,
    totalRevenue,
    totalOrders: orders.length,
    approvedOrders: approved.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    avgTicket,
    uniqueCustomers: customerEmails.size,
  })
}
