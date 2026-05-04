import fs from 'fs/promises'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json')

export interface StoreSettings {
  mercadopago: {
    accessToken: string
    publicKey: string
    installments: number
    pixDiscount: number
  }
  loja: {
    nome: string
    cnpj: string
    telefone: string
    whatsapp: string
    email: string
    endereco: string
    cidade: string
    siteUrl: string
  }
  frete: {
    gratisPorValor: number
    valorFixo: number
  }
  social: {
    instagram: string
    facebook: string
  }
  seguranca: {
    adminPassword: string
  }
  smtp: {
    host: string          // ex: smtp.gmail.com
    port: number          // 587 ou 465
    user: string          // e-mail remetente
    pass: string          // senha ou app password
    notifyEmail: string   // e-mail para receber alertas de pedido
  }
}

const defaultSettings: StoreSettings = {
  mercadopago: {
    accessToken: process.env.MP_ACCESS_TOKEN || '',
    publicKey: process.env.MP_PUBLIC_KEY || '',
    installments: 12,
    pixDiscount: 5,
  },
  loja: {
    nome: 'Afrodite Joias',
    cnpj: '',
    telefone: '',
    whatsapp: '',
    email: 'contato@afroditejoias.com.br',
    endereco: '',
    cidade: 'São Paulo, SP — Brasil',
    siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  },
  frete: {
    gratisPorValor: 500,
    valorFixo: 0,
  },
  social: {
    instagram: '',
    facebook: '',
  },
  seguranca: {
    adminPassword: process.env.ADMIN_PASSWORD || 'afrodite2024',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    notifyEmail: process.env.SMTP_NOTIFY_EMAIL || '',
  },
}

export async function getSettings(): Promise<StoreSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_FILE, 'utf-8')
    const saved = JSON.parse(raw)
    // Merge com defaults para garantir que novos campos apareçam
    return {
      mercadopago: { ...defaultSettings.mercadopago, ...saved.mercadopago },
      loja:        { ...defaultSettings.loja,        ...saved.loja },
      frete:       { ...defaultSettings.frete,       ...saved.frete },
      social:      { ...defaultSettings.social,      ...saved.social },
      seguranca:   { ...defaultSettings.seguranca,   ...saved.seguranca },
      smtp:        { ...defaultSettings.smtp,        ...saved.smtp },
    }
  } catch {
    return defaultSettings
  }
}

export async function saveSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings()
  const updated: StoreSettings = {
    mercadopago: { ...current.mercadopago, ...data.mercadopago },
    loja:        { ...current.loja,        ...data.loja },
    frete:       { ...current.frete,       ...data.frete },
    social:      { ...current.social,      ...data.social },
    seguranca:   { ...current.seguranca,   ...data.seguranca },
    smtp:        { ...current.smtp,        ...data.smtp },
  }
  await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true })
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(updated, null, 2))
  return updated
}

// Retorna apenas campos seguros para o frontend (sem tokens)
export function publicSettings(s: StoreSettings) {
  return {
    loja: s.loja,
    frete: s.frete,
    social: s.social,
    mercadopago: {
      publicKey: s.mercadopago.publicKey,
      installments: s.mercadopago.installments,
      pixDiscount: s.mercadopago.pixDiscount,
    },
  }
}
