// Autenticação simples via cookie para a área admin
// Em produção, use NextAuth ou similar

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'afrodite2024'
export const ADMIN_COOKIE = 'afrodite_admin_session'

export function isValidSession(cookieValue: string | undefined): boolean {
  return cookieValue === `admin_${ADMIN_PASSWORD}`
}

export function createSessionValue(): string {
  return `admin_${ADMIN_PASSWORD}`
}
