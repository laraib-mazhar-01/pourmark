export type BottleSize = '330' | '500' | '750' | '1000'

export type BottleFinish = 'clear' | 'glass' | 'frosted' | 'tinted' | 'amber' | 'cobalt' | 'smoke' | 'aluminum'

export type WaterType = 'still' | 'light' | 'sparkling' | 'alkaline' | 'mineral' | 'infused'

export type LabelStyle = 'classic' | 'minimal' | 'wrap'

export type LabelDesign = 'own' | 'design' | 'premium'

export type CapId = 'match' | 'midnight' | 'white' | 'silver' | 'gold' | 'copper' | 'sky' | 'olive' | 'custom'

export type DeliveryZone = 'local' | 'regional' | 'national' | 'pickup'

export interface BottleDesign {
  size: BottleSize
  finish: BottleFinish
  water: WaterType
  logo: string | null
  name: string
  color: string
  style: LabelStyle
  cap: CapId
  /** Hex used when cap === 'custom'. */
  capCustom: string
  tagline: string
  website: string
  phone: string
  instagram: string
}

export interface QuoteRequest {
  name: string
  business: string
  email: string
  phone: string
  size: BottleSize | ''
  quantity: string
  location: string
  requirements: string
  logo: File | null
  design?: Partial<BottleDesign>
}
