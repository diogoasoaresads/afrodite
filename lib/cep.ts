export interface CepData {
  cep: string
  rua: string
  bairro: string
  cidade: string
  uf: string
  erro?: boolean
}

export async function fetchCep(cep: string): Promise<CepData | null> {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) return null

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
    if (!res.ok) return null
    const data = await res.json()
    if (data.erro) return null
    return {
      cep: data.cep || '',
      rua: data.logradouro || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      uf: data.uf || '',
    }
  } catch {
    return null
  }
}
