export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatInstallments(price: number, installments = 12): string {
  const perInstallment = price / installments
  return `${installments}x de ${formatPrice(perInstallment)} sem juros`
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}
