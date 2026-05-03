// Autenticação simples via cookie para a área admin

export const ADMIN_COOKIE   = 'afrodite_admin_session'
const PASSWORD_FALLBACK     = process.env.ADMIN_PASSWORD || 'afrodite2024'

// ─── Edge-runtime safe (middleware) ─────────────────────────────────────────
// Apenas valida o formato; a senha real é verificada nas API routes.
export function isValidSession(cookieValue: string | undefined): boolean {
  return typeof cookieValue === 'string' && cookieValue.startsWith('admin_')
}

// ─── Node-runtime (API routes) ───────────────────────────────────────────────
async function getAdminPassword(): Promise<string> {
  try {
    const { getSettings } = await import('./settings')
    const settings = await getSettings()
    return settings.seguranca?.adminPassword || PASSWORD_FALLBACK
  } catch {
    return PASSWORD_FALLBACK
  }
}

export async function isValidSessionAsync(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue) return false
  const password = await getAdminPassword()
  return cookieValue === `admin_${password}`
}

export async function createSessionValue(): Promise<string> {
  const password = await getAdminPassword()
  return `admin_${password}`
}
