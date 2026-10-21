import { useState } from 'react'
import { ArrowRight, Check, Minus, Smartphone, Star, UtensilsCrossed, Wifi } from 'lucide-react'
import { useQuote } from '../context/QuoteContext'
import { useInView } from '../hooks/useInView'
import { QUANTITIES, unitPrice, usd } from '../lib/pricing'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { GlowCard } from './ui/GlowCard'
import { SectionHeading } from './ui/SectionHeading'

const SWATCHES = ['#1B508C', '#6E2A2E', '#2F6B4F', '#B8935A', '#0B1A2A']

const COMPARE: { label: string; us: string | true; them: string | false }[] = [
  { label: 'Your logo on every bottle', us: true, them: false },
  { label: 'Label design included', us: true, them: false },
  { label: 'QR code to menu or promo', us: true, them: false },
  { label: 'Minimum order', us: '500 bottles', them: '5,000+ bottles' },
  { label: 'Proof turnaround', us: '48 hours', them: '2–3 weeks' },
  { label: 'Sizes & materials', us: '4 sizes · 8 finishes', them: '1–2 options' },
]

const cardCls = 'group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/[0.06] bg-white shadow-soft hover:border-aqua-200 hover:shadow-lift'

function Copy({ n, title, text, proof }: { n: string; title: string; text: string; proof: string }) {
  return (
    <div className="flex flex-1 flex-col p-6 sm:p-7">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-xl font-semibold text-ink">{title}</h3>
        <span className="font-display text-2xl text-ink/15 transition-colors duration-500 group-hover:text-aqua-500/50">{n}</span>
      </div>
      <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
      <p className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-aqua-700">
        <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" aria-hidden />
        {proof}
      </p>
    </div>
  )
}

export function Features() {
  const { startQuote } = useQuote()
  const [color, setColor] = useState(SWATCHES[0])
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const maxUnit = unitPrice('500', 500)

  return (
    <section aria-labelledby="features-title" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="orb absolute right-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-aqua-100/60 blur-3xl" />
      </div>
      <div className="container-x">
        <SectionHeading
          id="features-title"
          eyebrow="Why Restaurants Choose Us"
          title={
            <>
              Every detail, <span className="italic text-aqua-600">considered</span>
            </>
          }
          intro="Restaurant water bottles are one of the few things every guest touches. We make sure yours says something about you."
        />

        <div ref={ref} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 01 Custom Branding — wide, interactive */}
          <Reveal className="sm:col-span-2">
            <GlowCard tilt={2} lift={4} className={cardCls}>
              <div className="flex h-full flex-col sm:flex-row">
                <Copy n="01" title="Custom Branding" text="Your logo and branding printed directly onto a waterproof, full-color bottle label — the same artwork across every size." proof="Pantone-matched · matte or gloss" />
                <div className="relative flex flex-col justify-end overflow-hidden bg-gradient-to-b from-mist to-aqua-50 sm:w-[46%]">
                  <span className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 select-none font-display text-[7rem] leading-none text-ink/[0.04]" aria-hidden>
                    Aa
                  </span>
                  <div className="relative flex items-end justify-center gap-3 px-8 pt-10" aria-hidden>
                    {[
                      { s: 'wrap' as const, n: 'Maison', h: 'h-28', d: 0 },
                      { s: 'classic' as const, n: 'Harbor Grill', h: 'h-36', d: 70 },
                      { s: 'minimal' as const, n: 'Verde', h: 'h-32', d: 140 },
                    ].map((b) => (
                      <div key={b.n} className={`${b.h} transition-transform duration-700 ease-out group-hover:-translate-y-2`} style={{ transitionDelay: `${b.d}ms` }}>
                        <Bottle size="500" color={color} style={b.s} name={b.n} animateKey={color} className="h-full drop-shadow-xl" />
                      </div>
                    ))}
                  </div>
                  <div className="relative mt-4 flex items-center justify-center gap-2 pb-4" role="radiogroup" aria-label="Try a brand color">
                    {SWATCHES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={color === c}
                        aria-label={`Preview label color ${c}`}
                        onClick={() => setColor(c)}
                        className={`h-6 w-6 rounded-full transition hover:scale-110 ${color === c ? 'ring-2 ring-ink ring-offset-2 ring-offset-aqua-50' : 'ring-1 ring-ink/10'}`}
                        style={{ background: c }}
                      />
                    ))}
                    <span className="ml-2 text-xs text-ink-muted">Try your color</span>
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>

          {/* 02 Premium Water — ripple droplet */}
          <Reveal delay={110}>
            <GlowCard tilt={3} lift={4} className={cardCls}>
              <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-b from-aqua-50 to-white" aria-hidden>
                <span className="ripple h-24 w-24" />
                <span className="ripple h-24 w-24" style={{ animationDelay: '-1.7s' }} />
                <span className="ripple h-24 w-24" style={{ animationDelay: '-3.4s' }} />
                <svg viewBox="0 0 48 56" className="relative h-16 w-14 drop-shadow-lg transition-transform duration-700 group-hover:-translate-y-1">
                  <path d="M24 4c10 13 20 24 20 34a20 20 0 0 1-40 0C4 28 14 17 24 4z" fill="url(#drop-g)" />
                  <path d="M14 36a10 10 0 0 0 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".9" />
                  <defs>
                    <linearGradient id="drop-g" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#86BCEB" />
                      <stop offset="1" stopColor="#1F64AF" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-3 flex gap-1.5">
                  {['Purified', 'UV treated', 'Batch tested'].map((t) => (
                    <span key={t} className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-aqua-700 shadow-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Copy n="02" title="Premium Water" text="High-quality purified drinking water, bottled in a certified, food-safe facility." proof="BPA-free bottles · certified facility" />
            </GlowCard>
          </Reveal>

          {/* 03 Professional Appearance — table setting */}
          <Reveal>
            <GlowCard tilt={3} lift={4} className={cardCls}>
              <div className="relative h-40 overflow-hidden bg-gradient-to-b from-[#f7f3ec] to-[#ebe4d8]" aria-hidden>
                <svg viewBox="0 0 320 160" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice">
                  <ellipse cx="160" cy="150" rx="200" ry="26" fill="#B8935A" fillOpacity="0.12" />
                  <ellipse cx="110" cy="132" rx="62" ry="16" fill="#FFFFFF" />
                  <ellipse cx="110" cy="132" rx="46" ry="11" fill="none" stroke="#B8935A" strokeOpacity="0.4" strokeWidth="1.5" />
                  <ellipse cx="110" cy="130" rx="18" ry="6" fill="#6E2A2E" fillOpacity="0.85" />
                  <path d="M36 118v34M42 118v34M39 152v8" stroke="#8A7A66" strokeWidth="3" strokeLinecap="round" />
                  <path d="M190 118v42" stroke="#8A7A66" strokeWidth="3" strokeLinecap="round" />
                  <path d="M186 118h8v12h-8z" fill="#8A7A66" />
                  <ellipse cx="262" cy="96" rx="14" ry="5" fill="#FFFFFF" fillOpacity="0.8" />
                  <path d="M250 96c0 12 5 20 12 24c7-4 12-12 12-24z" fill="#FFFFFF" fillOpacity="0.55" stroke="#B8935A" strokeOpacity="0.4" />
                  <path d="M262 120v18" stroke="#B8935A" strokeOpacity="0.5" strokeWidth="2" />
                </svg>
                <div className="absolute bottom-3 left-1/2 h-[82%] -translate-x-1/2 transition-transform duration-700 group-hover:-translate-y-1">
                  <Bottle size="500" color={color} style="minimal" name="Your Table" className="h-full drop-shadow-xl" />
                </div>
              </div>
              <Copy n="03" title="Professional Appearance" text="Make every table look more polished, intentional and on-brand." proof="Designed to match your tableware" />
            </GlowCard>
          </Reveal>

          {/* 04 Bulk Ordering — tier bars */}
          <Reveal delay={110}>
            <GlowCard tilt={3} lift={4} className={cardCls}>
              <div className="relative flex h-40 items-end justify-between gap-2 overflow-hidden bg-gradient-to-b from-mist to-white px-6 pb-5 pt-8" aria-hidden>
                <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">−36% at 10,000+</span>
                {QUANTITIES.map((q, i) => {
                  const u = unitPrice('500', q)
                  return (
                    <div key={q} className="flex flex-1 flex-col items-center gap-1.5">
                      <span className="text-[10px] tabular-nums text-ink-muted">{usd(u, 2)}</span>
                      <div className="flex h-16 w-full items-end rounded-md bg-ink/[0.04] px-1">
                        <div
                          className={`w-full origin-bottom rounded-sm transition-transform duration-700 ease-out ${i === 4 ? 'bg-aqua-600' : 'bg-aqua-300'}`}
                          style={{ height: `${(u / maxUnit) * 100}%`, transform: inView ? 'scaleY(1)' : 'scaleY(0)', transitionDelay: `${i * 90}ms` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-ink-soft">{q >= 1000 ? `${q / 1000}k` : q}</span>
                    </div>
                  )
                })}
              </div>
              <Copy n="04" title="Bulk Ordering" text="Tiered pricing for larger restaurant, hotel and event orders — the more you pour, the less you pay." proof="Mix sizes within one order" />
            </GlowCard>
          </Reveal>

          {/* 05 Fast Production — timeline */}
          <Reveal delay={220}>
            <GlowCard tilt={3} lift={4} className={cardCls}>
              <div className="relative flex h-40 flex-col justify-center overflow-hidden bg-gradient-to-b from-mist to-white px-6" aria-hidden>
                <div className="relative h-1.5 rounded-full bg-ink/[0.06]">
                  <div
                    className="h-full origin-left rounded-full bg-gradient-to-r from-aqua-400 to-aqua-600 transition-transform duration-[1600ms] ease-out"
                    style={{ transform: inView ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  {[
                    { at: '0%', t: 'Brief', s: 'Day 1' },
                    { at: '38%', t: 'Proof', s: '48h' },
                    { at: '100%', t: 'Delivered', s: '10–15 days' },
                  ].map((m, i) => (
                    <div key={m.t} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: m.at }}>
                      <span
                        className={`block h-4 w-4 rounded-full border-[3px] border-white bg-aqua-500 shadow-glow transition-transform duration-500 ${inView ? 'scale-100' : 'scale-0'}`}
                        style={{ transitionDelay: `${400 + i * 500}ms` }}
                      />
                      <span className={`absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-center ${i === 0 ? 'translate-x-0' : i === 2 ? '-translate-x-full' : ''}`}>
                        <span className="block text-xs font-semibold text-ink">{m.t}</span>
                        <span className="block text-[10px] text-ink-muted">{m.s}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <Copy n="05" title="Fast Production" text="Proof within 48 hours. Bottles produced and shipped in as little as 10 business days." proof="Rush slots for events" />
            </GlowCard>
          </Reveal>

          {/* 06 QR Codes — wide */}
          <Reveal className="sm:col-span-2">
            <GlowCard tilt={2} lift={4} className={cardCls}>
              <div className="flex h-full flex-col sm:flex-row">
                <Copy n="06" title="QR Codes" text="Add a QR code to your bottle linking to your menu, website, reviews, social media or a seasonal promotion." proof="Dynamic codes — change the link anytime" />
                <div className="relative flex items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-ink to-aqua-900 p-6 sm:w-[46%]" aria-hidden>
                  <div className="orb absolute -right-10 -top-10 h-40 w-40 rounded-full bg-aqua-500/30 blur-3xl" />
                  <div className="relative rounded-2xl bg-white p-3 shadow-lift transition-transform duration-700 group-hover:-rotate-3">
                    <QrMark className="h-20 w-20 text-ink" />
                    <span className="mt-1.5 block text-center text-[9px] font-semibold uppercase tracking-wider text-ink-muted">Scan me</span>
                  </div>
                  <ArrowRight className="relative h-5 w-5 text-white/60" />
                  <div className="relative w-28 rounded-[1.2rem] border-[3px] border-white/20 bg-ink/60 p-2 shadow-lift backdrop-blur transition-transform duration-700 group-hover:rotate-3">
                    <div className="mx-auto mb-2 h-1 w-8 rounded-full bg-white/30" />
                    {[
                      { i: UtensilsCrossed, t: 'Menu' },
                      { i: Star, t: 'Reviews' },
                      { i: Wifi, t: 'Wi-Fi' },
                      { i: Smartphone, t: 'Order' },
                    ].map(({ i: I, t }) => (
                      <div key={t} className="mb-1.5 flex items-center gap-2 rounded-lg bg-white/10 px-2 py-1.5 text-[10px] font-medium text-white">
                        <I className="h-3 w-3 text-aqua-300" /> {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowCard>
          </Reveal>

          {/* 07 Specialist CTA tile */}
          <Reveal delay={110}>
            <GlowCard dark className="grain flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-ink p-7 text-white shadow-lift">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aqua-200">Talk to us</span>
                <p className="mt-4 font-display text-3xl leading-tight">Not sure what fits your tables?</p>
                <p className="mt-2 text-sm text-white/65">A specialist will suggest sizes, materials and quantities for your service — free, within one business day.</p>
              </div>
              <button
                type="button"
                onClick={() => startQuote({ note: 'Please recommend sizes, materials and quantities for my venue.' })}
                className="btn-shine mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-aqua-50"
              >
                Get a recommendation <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </GlowCard>
          </Reveal>
        </div>

        {/* Comparison strip */}
        <Reveal className="mt-10">
          <div className="overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-white shadow-soft">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 border-b border-ink/[0.06] bg-mist px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] sm:px-8">
              <span className="text-ink-muted">What you get</span>
              <span className="flex items-center gap-2 text-ink">
                <span className="h-2 w-2 rounded-full bg-aqua-500" aria-hidden /> Pourmark
              </span>
              <span className="text-ink-muted">Generic bottled water</span>
            </div>
            <ul className="divide-y divide-ink/[0.06]">
              {COMPARE.map((row) => (
                <li key={row.label} className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 px-5 py-3.5 text-sm sm:px-8">
                  <span className="text-ink-soft">{row.label}</span>
                  <span className="flex items-center gap-2 font-medium text-ink">
                    {row.us === true ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-aqua-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                      </span>
                    ) : (
                      row.us
                    )}
                  </span>
                  <span className="flex items-center gap-2 text-ink-muted">
                    {row.them === false ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mist text-ink-muted">
                        <Minus className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    ) : (
                      row.them
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-start justify-between gap-3 border-t border-ink/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:px-8">
              <p className="text-sm text-ink-muted">Typical figures for private-label bottled water suppliers. Your quote is always itemized.</p>
              <button
                type="button"
                onClick={() => startQuote()}
                className="btn-shine inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow"
              >
                Get your itemized quote <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/** Decorative QR-style mark (not a real code). */
function QrMark({ className = '' }: { className?: string }) {
  const cells: [number, number][] = [
    [0, 0], [1, 0], [2, 0], [4, 0], [6, 0], [7, 0], [8, 0],
    [0, 1], [2, 1], [4, 1], [6, 1], [8, 1],
    [0, 2], [1, 2], [2, 2], [5, 2], [6, 2], [7, 2], [8, 2],
    [1, 4], [3, 4], [4, 4], [6, 4], [8, 4],
    [0, 5], [2, 5], [5, 5], [7, 5],
    [0, 6], [1, 6], [2, 6], [4, 6], [6, 6], [8, 6],
    [0, 7], [2, 7], [5, 7], [7, 7], [8, 7],
    [0, 8], [1, 8], [2, 8], [4, 8], [5, 8], [8, 8],
  ]
  return (
    <svg viewBox="0 0 9 9" className={className} aria-hidden>
      {cells.map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  )
}
