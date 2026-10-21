import type { BottleSize, DeliveryZone, LabelDesign } from './types'

/** Indicative per-bottle price (USD) incl. water, bottle, cap and a standard full-color label. */
export const BASE_UNIT: Record<BottleSize, number> = {
  '330': 0.68,
  '500': 0.82,
  '750': 1.45,
  '1000': 1.85,
}

export const QUANTITIES = [500, 1000, 2500, 5000, 10000] as const
export type Quantity = (typeof QUANTITIES)[number]

const TIER_FACTOR: Record<Quantity, number> = {
  500: 1,
  1000: 0.9,
  2500: 0.8,
  5000: 0.72,
  10000: 0.64,
}

export const LABEL_DESIGNS: { id: LabelDesign; label: string; hint: string; setup: number; perUnit: number }[] = [
  { id: 'own', label: 'I have my artwork', hint: 'Print-ready logo or label file', setup: 0, perUnit: 0 },
  { id: 'design', label: 'Design it for me', hint: 'Our designers create your label', setup: 149, perUnit: 0 },
  { id: 'premium', label: 'Premium finish', hint: 'Custom design + matte/foil label', setup: 249, perUnit: 0.06 },
]

export const DELIVERY_ZONES: { id: DeliveryZone; label: string; hint: string; flat: number; perUnit: number }[] = [
  { id: 'local', label: 'Local (within 50 mi)', hint: 'Free on 1,000+ bottles', flat: 45, perUnit: 0 },
  { id: 'regional', label: 'Regional (50–300 mi)', hint: 'Palletized freight', flat: 95, perUnit: 0.02 },
  { id: 'national', label: 'Nationwide', hint: 'Freight to any US address', flat: 180, perUnit: 0.04 },
  { id: 'pickup', label: 'Warehouse pickup', hint: 'Collect from our facility', flat: 0, perUnit: 0 },
]

export function unitPrice(size: BottleSize, qty: Quantity): number {
  return BASE_UNIT[size] * TIER_FACTOR[qty]
}

export function startingPrice(size: BottleSize): number {
  return unitPrice(size, 10000)
}

export interface Estimate {
  unit: number
  bottles: number
  setup: number
  delivery: number
  total: number
  low: number
  high: number
}

export function estimate(size: BottleSize, qty: Quantity, design: LabelDesign, zone: DeliveryZone): Estimate {
  const d = LABEL_DESIGNS.find((x) => x.id === design)!
  const z = DELIVERY_ZONES.find((x) => x.id === zone)!
  const unit = unitPrice(size, qty) + d.perUnit
  const bottles = unit * qty
  const delivery = zone === 'local' && qty >= 1000 ? 0 : z.flat + z.perUnit * qty
  const total = bottles + d.setup + delivery
  return {
    unit,
    bottles,
    setup: d.setup,
    delivery,
    total,
    low: Math.round((total * 0.92) / 10) * 10,
    high: Math.round((total * 1.08) / 10) * 10,
  }
}

export const usd = (n: number, digits = 0) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits })
