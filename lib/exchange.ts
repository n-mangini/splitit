const RATES_URL = 'https://open.er-api.com/v6/latest/USD'
const CACHE_TTL_MS = 30 * 60 * 1000

type RatesCache = { rates: Record<string, number>; fetchedAt: number }

let cache: RatesCache | null = null
let inflight: Promise<Record<string, number>> | null = null

export async function getExchangeRates(): Promise<Record<string, number>> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rates
  }
  if (inflight) return inflight

  inflight = (async () => {
    try {
      const response = await fetch(RATES_URL)
      if (!response.ok) throw new Error('No se pudo obtener el tipo de cambio')
      const data = (await response.json()) as { result?: string; rates?: Record<string, number> }
      if (data.result !== 'success' || !data.rates) {
        throw new Error('Respuesta invalida de la API de cambio')
      }
      cache = { rates: data.rates, fetchedAt: Date.now() }
      return data.rates
    } finally {
      inflight = null
    }
  })()

  return inflight
}

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount
  const fromRate = rates[from]
  const toRate = rates[to]
  if (!fromRate || !toRate) {
    throw new Error(`Tipo de cambio no disponible para ${from} a ${to}`)
  }
  return amount * (toRate / fromRate)
}
