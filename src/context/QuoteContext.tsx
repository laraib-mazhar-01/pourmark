import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { BottleDesign, BottleFinish, BottleSize, LabelStyle, WaterType } from '../lib/types'

export interface QuotePrefill {
  size?: BottleSize
  quantity?: string
  business?: string
  location?: string
  note?: string
  design?: BottleDesign
  logoFile?: File | null
}

export interface DesignStart {
  size: BottleSize
  color?: string
  finish?: BottleFinish
  water?: WaterType
  style?: LabelStyle
  /** Increments on every call so the customizer can react to repeat requests. */
  seq: number
}

interface QuoteContextValue {
  prefill: QuotePrefill
  /** Merge values into the quote form and scroll to it. */
  startQuote: (values?: QuotePrefill) => void
  designStart: DesignStart | null
  /** Open the customizer with a size (and optionally a color) preselected. */
  startDesign: (values: Omit<DesignStart, 'seq'>) => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<QuotePrefill>({})
  const [designStart, setDesignStart] = useState<DesignStart | null>(null)

  const startQuote = useCallback((values?: QuotePrefill) => {
    if (values) setPrefill((p) => ({ ...p, ...values }))
    requestAnimationFrame(() => scrollToId('quote'))
  }, [])

  const startDesign = useCallback((values: Omit<DesignStart, 'seq'>) => {
    setDesignStart((d) => ({ ...values, seq: (d?.seq ?? 0) + 1 }))
    requestAnimationFrame(() => scrollToId('customizer'))
  }, [])

  const value = useMemo(() => ({ prefill, startQuote, designStart, startDesign }), [prefill, startQuote, designStart, startDesign])
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
