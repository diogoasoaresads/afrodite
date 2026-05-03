import { NextResponse } from 'next/server'
import { getSettings, publicSettings } from '@/lib/settings'

// Endpoint público — não retorna tokens nem senha
export async function GET() {
  const settings = await getSettings()
  return NextResponse.json(publicSettings(settings), {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  })
}
