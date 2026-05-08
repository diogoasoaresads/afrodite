import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'newsletter.json')

interface Subscriber { email: string; subscribedAt: string }

async function readSubscribers(): Promise<Subscriber[]> {
  try { return JSON.parse(await fs.readFile(FILE, 'utf-8')) }
  catch { return [] }
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  const subscribers = await readSubscribers()
  if (subscribers.find(s => s.email.toLowerCase() === email.toLowerCase())) {
    return NextResponse.json({ ok: true }) // já inscrito, retorna silencioso
  }

  subscribers.push({ email: email.toLowerCase(), subscribedAt: new Date().toISOString() })
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(subscribers, null, 2))

  return NextResponse.json({ ok: true })
}

export async function GET() {
  // Admin endpoint para listar assinantes
  const subscribers = await readSubscribers()
  return NextResponse.json(subscribers)
}
