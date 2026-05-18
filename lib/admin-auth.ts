// Autenticação admin via cookie com token HMAC — a senha nunca fica no cookie

import crypto from 'crypto'

export const ADMIN_COOKIE = 'afrodite_admin_session'

// ─── Helpers ────────────────────────────────────────────────────────────────

async function getAdminPassword(): Promise<string> {
  try {
    const { getSettings } = await import('./settings')
    const s = await getSettings()
    return s.seguranca?.adminPassword || process.env.ADMIN_PASSWORD || 'afrodite2024'
  } catch {
    return process.env.ADMIN_PASSWORD || 'afrodite2024'
  }
}

/**
 * Gera um token HMAC-SHA256 usando a senha como key e um payload fixo.
 * O token muda automaticamente quando a senha muda — sessions anteriores expiram.
 * A senha nunca fica exposta no valor do cookie.
 */
function makeToken(password: string): string {
  return crypto
    .createHmac('sha256', password)
    .update('afrodite-admin-session-v1')
    .digest('hex')
}

// ─── Edge-runtime safe (middleware) ──────────────────────────────────────────
// O middleware não tem acesso à senha real (sem fs, sem async getSettings).
// Usa apenas uma verificação de formato: o token deve ser um hex de 64 chars.
// A verificação real da senha acontece nas API routes via isValidSessionAsync.
export function isValidSession(cookieValue: string | undefined): boolean {
  return typeof cookieValue === 'string' && /^[0-9a-f]{64}$/.test(cookieValue)
}

// ─── Node-runtime (API routes) ───────────────────────────────────────────────
export async function isValidSessionAsync(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false
  const password = await getAdminPassword()
  const expected = makeToken(password)
  // Comparação em tempo constante para evitar timing attack
  try {
    return crypto.timingSafeEqual(Buffer.from(cookieValue), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function createSessionValue(): Promise<string> {
  const password = await getAdminPassword()
  return makeToken(password)
}
