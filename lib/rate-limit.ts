// Rate limiter in-memory simples
// Máx. N tentativas por IP em uma janela de tempo
// Em produção com múltiplas instâncias, use Redis

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export interface RateLimitOptions {
  windowMs: number  // janela em ms
  max: number       // máx tentativas na janela
}

export interface RateLimitResult {
  limited: boolean
  remaining: number
  resetAt: number
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    // Nova janela
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return { limited: false, remaining: options.max - 1, resetAt: now + options.windowMs }
  }

  entry.count++
  store.set(key, entry)

  if (entry.count > options.max) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt }
  }

  return { limited: false, remaining: options.max - entry.count, resetAt: entry.resetAt }
}

// Presets
export const loginRateLimit = (ip: string) =>
  rateLimit(`login:${ip}`, { windowMs: 15 * 60 * 1000, max: 5 })

export const recoveryRateLimit = (ip: string) =>
  rateLimit(`recovery:${ip}`, { windowMs: 15 * 60 * 1000, max: 3 })
