import { useMemo, useState } from 'react'
import { ArrowRight, Check, Copy, Info, Repeat, TrendingDown, Zap } from 'lucide-react'
import { DELIVERY_ZONES, LABEL_DESIGNS, QUANTITIES, estimate, unitPrice, usd, type Quantity } from '../lib/pricing'
import type { BottleSize, DeliveryZone, LabelDesign } from '../lib/types'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { useQuote } from '../context/QuoteContext'
import { Bottle } from './Bottle'
import { SectionHeading } from './ui/SectionHeading'
import { Reveal } from './ui/Reveal'
import { GlowCard } from './ui/GlowCard'
import { Button } from './ui/Button'

const SIZE_OPTIONS: BottleSize[] = ['330', '500', '750', '1000']
const SIZE_COLOR: Record<BottleSize, string> = { '330': '#1B508C', '500': '#0B1A2A', '750': '#6E2A2E', '1000': '#2F6B4F' }

/** One-tap presets that set every field at once. */
const PRESETS: { id: string; label: string; hint: string; size: BottleSize; qty: Quantity; design: LabelDesign; zone: DeliveryZone }[] = [
  { id: 'cafe', label: 'Café starter', hint: '330ml · 1,000', size: '330', qty: 1000, design: 'design', zone: 'local' },
  { id: 'dinner', label: 'Dinner service', hint: '500ml · 2,500', size: '500', qty: 2500, design: 'design', zone: 'regional' },
  { id: 'hotel', label: 'Hotel rooms', hint: '500ml · 5,000', size: '500', qty: 5000, design: 'premium', zone: 'national' },
  { id: 'event', label: 'Event', hint: '750ml · 500', size: '750', qty: 500, design: 'own', zone: 'local' },
]

const RECURRING_DISCOUNT = 0.05

export function QuoteCalculator() {
  const { startQuote } = useQuote()
  const [size, setSize] = useState<BottleSize>('500')
  const [qty, setQty] = useState<Quantity>(1000)
  const [design, setDesign] = useState<LabelDesign>('design')
  const [zone, setZone] = useState<DeliveryZone>('local')
  const [recurring, setRecurring] = useState(false)
  const [copied, setCopied] = useState(false)
  const { ref, inView } = useInView<HTMLDivElement>()

  const base = useMemo(() => estimate(size, qty, design, zone), [size, qty, design, zone])
  const est = useMemo(() => {
    if (!recurring) return base
    const f = 1 - RECURRING_DISCOUNT
    return { ...base, unit: base.unit * f, bottles: base.bottles * f, total: base.total - base.bottles * RECURRING_DISCOUNT, low: Math.round((base.low * f) / 10) * 10, high: Math.round((base.high * f) / 10) * 10 }
  }, [base, recurring])
  const activePreset = PRESETS.find((p) => p.size === size && p.qty === qty && p.design === design && p.zone === zone)?.id
  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setSize(p.size)
    setQty(p.qty)
    setDesign(p.design)
    setZone(p.zone)
  }
  const share = [est.bottles, est.setup, est.delivery]
  const shareTotal = Math.max(1, share.reduce((a, b) => a + b, 0))

  const copySummary = async () => {
    const zoneLabel = DELIVERY_ZONES.find((z) => z.id === zone)!.label
    const designLabel = LABEL_DESIGNS.find((d) => d.id === design)!.label
    const text = `Pourmark estimate: ${qty.toLocaleString('en-US')} × ${size === '1000' ? '1 L' : `${size}ml`} bottles · ${designLabel} · ${zoneLabel}${recurring ? ' · recurring' : ''} → ${usd(est.low)}–${usd(est.high)} (≈ ${usd(est.unit, 2)}/bottle)`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }
  const low = useCountUp(est.low, { start: inView })
  const high = useCountUp(est.high, { start: inView })
  const unit = useCountUp(est.unit, { start: inView })
  const bottles = useCountUp(qty, { start: inView })

  const maxUnit = unitPrice(size, 500)
  const saving = Math.round((1 - unitPrice(size, qty) / maxUnit) * 100)

  const request = () => {
    const zoneLabel = DELIVERY_ZONES.find((z) => z.id === zone)!.label
    const designLabel = LABEL_DESIGNS.find((d) => d.id === design)!.label
    startQuote({
      size,
      quantity: String(qty),
      note: `Calculator estimate: ${usd(est.low)}–${usd(est.high)} · ${designLabel} · ${zoneLabel}`,
    })
  }

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section bg-mist">
      <div className="container-x">
        <SectionHeading
          id="pricing-title"
          eyebrow="Pricing"
          title={
            <>
              Estimate your order <span className="italic text-aqua-600">instantly</span>
            </>
          }
          intro="Pricing depends on bottle size, quantity, label finish and delivery. Get a ballpark in seconds, then request your exact quote."
        />

        <Reveal className="mt-14">
          <GlowCard className="card grid overflow-hidden lg:grid-cols-[1.25fr_1fr]">
            <div ref={ref} className="space-y-8 p-6 sm:p-10">
              {/* Presets */}
              <div>
                <p className="field-label flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-aqua-500" aria-hidden /> Start from a typical order
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      aria-pressed={activePreset === p.id}
                      onClick={() => applyPreset(p)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition ${
                        activePreset === p.id ? 'border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgba(11,26,42,0.6)]' : 'border-ink/10 bg-white hover:-translate-y-0.5 hover:border-aqua-300'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{p.label}</span>
                      <span className={`block text-[11px] ${activePreset === p.id ? 'text-white/70' : 'text-ink-muted'}`}>{p.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <fieldset>
                <legend className="field-label">Bottle size</legend>
                <div className="grid grid-cols-4 gap-2 rounded-2xl bg-mist p-1.5">
                  {SIZE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={size === s}
                      onClick={() => setSize(s)}
                      className={`flex h-14 flex-col items-center justify-center rounded-xl text-sm font-semibold transition ${size === s ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'}`}
                    >
                      <span>{s === '1000' ? '1 L' : `${s}ml`}</span>
                      <span className="text-[10px] font-medium text-ink-muted">from {usd(unitPrice(s, 10000), 2)}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Quantity */}
              <fieldset>
                <div className="flex items-center justify-between">
                  <legend className="field-label">Quantity</legend>
                  {saving > 0 && (
                    <span className="tick-in mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden /> Save {saving}% per bottle
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {QUANTITIES.map((q) => (
                    <button
                      key={q}
                      type="button"
                      aria-pressed={qty === q}
                      onClick={() => setQty(q)}
                      className={`relative h-12 rounded-xl border text-sm font-semibold transition ${
                        qty === q ? 'border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgba(11,26,42,0.6)]' : 'border-ink/10 bg-white text-ink-soft hover:-translate-y-0.5 hover:border-aqua-300'
                      }`}
                    >
                      {q === 10000 ? '10,000+' : q.toLocaleString('en-US')}
                      {q === 1000 && <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-aqua-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">Popular</span>}
                    </button>
                  ))}
                </div>
                {/* Tier bars */}
                <div className="mt-3 grid grid-cols-5 gap-2" aria-hidden>
                  {QUANTITIES.map((q) => {
                    const u = unitPrice(size, q)
                    return (
                      <div key={q} className="flex flex-col items-center gap-1">
                        <div className="flex h-10 w-full items-end rounded-md bg-mist px-1">
                          <div
                            className={`w-full rounded-sm transition-all duration-700 ${q === qty ? 'bg-aqua-500' : 'bg-aqua-200'}`}
                            style={{ height: `${Math.max(18, (u / maxUnit) * 100)}%` }}
                          />
                        </div>
                        <span className={`text-[10px] tabular-nums ${q === qty ? 'font-semibold text-ink' : 'text-ink-muted'}`}>{usd(u, 2)}</span>
                      </div>
                    )
                  })}
                </div>
              </fieldset>

              {/* Label design */}
              <fieldset>
                <legend className="field-label">Label design</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {LABEL_DESIGNS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      aria-pressed={design === d.id}
                      onClick={() => setDesign(d.id)}
                      className={`rounded-xl border p-3.5 text-left transition ${
                        design === d.id ? 'border-aqua-500 bg-aqua-50/60 ring-4 ring-aqua-100' : 'border-ink/10 bg-white hover:-translate-y-0.5 hover:border-aqua-300'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink">{d.label}</span>
                        <span className="text-xs font-medium text-ink-muted">{d.setup ? `+${usd(d.setup)}` : 'Free'}</span>
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-muted">{d.hint}</span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* Delivery */}
              <div>
                <label htmlFor="calc-zone" className="field-label">
                  Delivery location
                </label>
                <select id="calc-zone" className="field select-field" value={zone} onChange={(e) => setZone(e.target.value as DeliveryZone)}>
                  {DELIVERY_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-ink-muted">{DELIVERY_ZONES.find((z) => z.id === zone)!.hint}</p>
              </div>

              {/* Recurring toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={recurring}
                onClick={() => setRecurring((v) => !v)}
                className={`w-full rounded-2xl border p-4 text-left transition ${recurring ? 'border-aqua-500 bg-aqua-50/60 ring-4 ring-aqua-100' : 'border-ink/10 bg-white hover:border-aqua-300'}`}
              >
                <span className="flex items-center gap-3">
                  <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${recurring ? 'bg-aqua-500' : 'bg-ink/15'}`} aria-hidden>
                    <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${recurring ? 'translate-x-6' : 'translate-x-1'}`} />
                  </span>
                  <span className="flex flex-1 items-center gap-2 text-sm font-semibold text-ink">
                    <Repeat className="h-4 w-4 text-aqua-600" aria-hidden /> Recurring supply
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${recurring ? 'bg-aqua-500 text-white' : 'bg-mist text-ink-muted'}`}>−5%</span>
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-ink-muted">Same order every month or quarter — save 5% on bottles and skip setup on reorders.</span>
              </button>
            </div>

            {/* Result */}
            <div className="grain relative flex flex-col justify-between overflow-hidden bg-ink p-6 text-white sm:p-10">
              <div className="orb pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-aqua-500/30 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-aqua-300">Estimated Price</p>
                <p className="mt-4 font-display text-5xl leading-none sm:text-6xl" aria-live="polite">
                  {usd(low)}
                  <span className="text-white/40"> – </span>
                  <br className="sm:hidden" />
                  {usd(high)}
                </p>
                <p className="mt-4 inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-sm text-white/80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <Bottle key={size} size={size} color={SIZE_COLOR[size]} style="classic" name="Yours" className="h-7 animate-label-in" />
                  </span>
                  for {Math.round(bottles).toLocaleString('en-US')}
                  {qty === 10000 ? '+' : ''} × {size === '1000' ? '1 L' : `${size}ml`} bottles
                  {recurring && <span className="ml-1 rounded-full bg-aqua-500/30 px-2 py-0.5 text-[11px] font-semibold text-aqua-100">recurring −5%</span>}
                </p>

                <dl className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
                  <Row label="Per bottle (approx.)" value={usd(unit, 2)} />
                  <Row label="Bottles & labels" value={usd(est.bottles)} />
                  <Row label="Design & setup" value={est.setup ? usd(est.setup) : 'Included'} />
                  <Row label="Delivery" value={est.delivery ? usd(est.delivery) : zone === 'pickup' ? 'Pickup' : 'Free'} />
                </dl>

                {/* Cost split */}
                <div className="mt-5" aria-hidden>
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                    {share.map((v, i) => (
                      <div key={i} className={`h-full transition-all duration-700 ${['bg-aqua-400', 'bg-aqua-200', 'bg-white/60'][i]}`} style={{ width: `${(v / shareTotal) * 100}%` }} />
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/60">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-aqua-400" /> Bottles & labels</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-aqua-200" /> Design & setup</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/60" /> Delivery</span>
                  </div>
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/10 pt-5 text-xs text-white/70">
                  {['Purified water, bottled & capped', 'Full-color waterproof label', 'Free label proof in 48h', 'Two rounds of revisions'].map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aqua-300" strokeWidth={3} aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative mt-8">
                <div className="flex gap-2">
                  <Button variant="light" size="lg" className="flex-1" onClick={request}>
                    Request Final Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <button
                    type="button"
                    onClick={copySummary}
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                    aria-label={copied ? 'Copied' : 'Copy estimate summary'}
                    title="Copy estimate"
                  >
                    {copied ? <Check className="tick-in h-5 w-5 text-emerald-300" strokeWidth={3} /> : <Copy className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-4 flex gap-2 text-xs leading-relaxed text-white/55">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                  This is an estimate only. Your final price depends on your exact quantity, label finish, artwork and delivery requirements.
                </p>
              </div>
            </div>
          </GlowCard>
        </Reveal>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}
