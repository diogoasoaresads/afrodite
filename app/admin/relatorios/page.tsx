'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts'

interface SalesData {
  date: string
  revenue: number
  orders: number
}

interface TopProduct {
  name: string
  qty: number
  revenue: number
}

interface ReportData {
  dailySales: SalesData[]
  topProducts: TopProduct[]
  totalRevenue: number
  totalOrders: number
  avgTicket: number
  uniqueCustomers: number
  pendingOrders: number
  approvedOrders: number
}

export default function RelatoriosPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<30 | 60 | 90>(30)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/relatorios?days=${period}`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [period])

  const formatR$ = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const statCards = data ? [
    { icon: DollarSign, label: 'Receita Total', value: formatR$(data.totalRevenue), color: 'text-gold-400' },
    { icon: ShoppingBag, label: 'Pedidos Aprovados', value: data.approvedOrders.toString(), color: 'text-blue-400' },
    { icon: TrendingUp, label: 'Ticket Médio', value: formatR$(data.avgTicket), color: 'text-green-400' },
    { icon: Users, label: 'Clientes Únicos', value: data.uniqueCustomers.toString(), color: 'text-purple-400' },
  ] : []

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-dark-700 border border-gold-500/20 px-3 py-2 text-xs">
        <p className="text-dark-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name === 'revenue' ? formatR$(p.value) : `${p.value} pedidos`}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-cream text-xl font-semibold">Relatórios</h1>
          <p className="text-dark-400 text-sm mt-1">Visão geral do desempenho da loja</p>
        </div>
        <div className="flex gap-2">
          {([30, 60, 90] as const).map(d => (
            <button key={d} onClick={() => setPeriod(d)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                period === d ? 'border-gold-500 text-gold-400 bg-gold-500/10' : 'border-dark-600 text-dark-400 hover:border-dark-400'
              }`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-dark-800 border border-dark-700 p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-dark-800 border border-dark-700 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={color} />
                  <span className="text-dark-400 text-xs">{label}</span>
                </div>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gráfico de receita */}
          <div className="bg-dark-800 border border-dark-700 p-6 mb-6">
            <h2 className="text-cream text-sm font-semibold mb-5">Receita dos últimos {period} dias</h2>
            {data.dailySales.length === 0 ? (
              <p className="text-dark-500 text-sm text-center py-8">Sem dados para o período selecionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data.dailySales} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#C9A84C" fill="url(#revGrad)"
                    strokeWidth={2} name="revenue" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Volume de pedidos */}
            <div className="bg-dark-800 border border-dark-700 p-6">
              <h2 className="text-cream text-sm font-semibold mb-5">Volume de pedidos</h2>
              {data.dailySales.length === 0 ? (
                <p className="text-dark-500 text-sm text-center py-8">Sem dados para o período.</p>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={data.dailySales} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="date" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} />
                    <YAxis tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" fill="#C9A84C" opacity={0.7} name="orders" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Top produtos */}
            <div className="bg-dark-800 border border-dark-700 p-6">
              <h2 className="text-cream text-sm font-semibold mb-5">Top 10 produtos</h2>
              {data.topProducts.length === 0 ? (
                <p className="text-dark-500 text-sm text-center py-8">Sem dados para o período.</p>
              ) : (
                <div className="space-y-3">
                  {data.topProducts.slice(0, 10).map((p, i) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-dark-600 text-xs w-4 flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-cream text-xs truncate pr-2">{p.name}</p>
                          <p className="text-dark-400 text-xs flex-shrink-0">{p.qty}x</p>
                        </div>
                        <div className="h-1 bg-dark-700 rounded">
                          <div
                            className="h-1 bg-gold-500 rounded"
                            style={{ width: `${(p.qty / (data.topProducts[0]?.qty || 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-gold-400 text-xs w-20 text-right flex-shrink-0">
                        {formatR$(p.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <p className="text-dark-400 text-sm">Erro ao carregar relatório.</p>
      )}
    </div>
  )
}
