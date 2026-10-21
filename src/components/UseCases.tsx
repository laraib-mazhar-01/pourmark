import { useState } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { USE_CASES, FINISH_OPTIONS, WATER_OPTIONS } from '../data/content'
import { useQuote } from '../context/QuoteContext'
import type { BottleFinish, BottleSize, LabelStyle, WaterType } from '../lib/types'
import { unitPrice, usd } from '../lib/pricing'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { SmartImage } from './ui/SmartImage'
import { GlowCard } from './ui/GlowCard'

interface Setup {
  color: string
  name: string
  tagline: string
  style: LabelStyle
  size: BottleSize
  qty: string
  finish: BottleFinish
  water: WaterType
  why: string
}

/** A recommended starting setup per use case. */
const SETUP: Setup[] = [
  { color: '#6E2A2E', name: 'Osteria', tagline: 'Cucina', style: 'classic', size: '500', qty: '2500', finish: 'clear', water: 'still', why: 'One bottle per table, refilled through dinner service.' },
  { color: '#B4552F', name: 'Daily Grind', tagline: 'Coffee', style: 'minimal', size: '330', qty: '1000', finish: 'clear', water: 'still', why: 'Grab-and-go size that fits a cup holder and a tote.' },
  { color: '#0B1A2A', name: 'The Wren', tagline: 'Hotel', style: 'wrap', size: '500', qty: '5000', finish: 'glass', water: 'still', why: 'Two per room, every night — glass reads as a premium amenity.' },
  { color: '#C98A8A', name: 'A & J', tagline: 'Sept 2026', style: 'minimal', size: '330', qty: '500', finish: 'frosted', water: 'light', why: 'Monogram and date on a frosted bottle guests keep.' },
  { color: '#2F7FD0', name: 'Summit', tagline: 'Launch', style: 'wrap', size: '500', qty: '2500', finish: 'clear', water: 'sparkling', why: 'Full-color wrap carries sponsor or event artwork edge to edge.' },
  { color: '#1B508C', name: 'Northwind', tagline: 'Offsite', style: 'classic', size: '500', qty: '1000', finish: 'aluminum', water: 'still', why: 'Reusable aluminum for boardrooms and welcome desks.' },
  { color: '#2F6B4F', name: 'Forage Co.', tagline: 'Catering', style: 'minimal', size: '750', qty: '2500', finish: 'glass', water: 'still', why: 'Sharing size for buffets and long tables.' },
  { color: '#B8935A', name: 'Expo 26', tagline: 'Conference', style: 'wrap', size: '330', qty: '10000', finish: 'clear', water: 'still', why: 'Thousands of attendees, one lightweight pour each.' },
]

const QTY_LABEL: Record<string, string> = { '500': '500', '1000': '1,000', '2500': '2,500', '5000': '5,000', '10000': '10,000+' }

export function UseCases() {
  const { startQuote, startDesign } = useQuote()
  const [active, setActive] = useState(0)
  const u = USE_CASES[active]
  const s = SETUP[active]
  const finishName = FINISH_OPTIONS.find((f) => f.id === s.finish)!.name
  const waterName = WATER_OPTIONS.find((w) => w.id === s.water)!.name
  const sizeLabel = s.size === '1000' ? '1 L' : `${s.size}ml`
  const qtyNum = Number(s.qty) as 500 | 1000 | 2500 | 5000 | 10000

  return (
    <section aria-labelledby="usecases-title" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="orb-slow absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-aqua-100/70 blur-3xl" />
      </div>
      <div className="container-x">
        <SectionHeading
          id="usecases-title"
          eyebrow="Who It’s For"
          title={
            <>
              Made for every <span className="italic text-aqua-600">table</span>
            </>
          }
          intro="From neighborhood cafés to 500-guest conferences, branded bottled water fits wherever your guests are. Pick your business to see a recommended setup."
        />

        {/* Recommended setup panel */}
        <Reveal className="mt-12">
          <GlowCard className="grid overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-white shadow-lift lg:grid-cols-[0.55fr_1fr]">
            <div className="relative flex items-end justify-center overflow-hidden bg-gradient-to-b from-mist to-aqua-50 px-8 pb-8 pt-10">
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-aqua-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Recommended setup
              </span>
              <span className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 select-none whitespace-nowrap font-display text-[5rem] leading-none text-ink/[0.04]" aria-hidden>
                {u.title}
              </span>
              <div key={active} className="step-in-right relative h-56 sm:h-64">
                <div className="h-full animate-float-slow">
                  <Bottle size={s.size} color={s.color} style={s.style} name={s.name} tagline={s.tagline} finish={s.finish} water={s.water} className="h-full drop-shadow-2xl" title={`Recommended bottle for ${u.title}`} />
                </div>
              </div>
            </div>

            <div key={`p${active}`} className="step-in-right flex flex-col p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-xl" aria-hidden>
                  {u.emoji}
                </span>
                <div>
                  <h3 className="font-display text-3xl leading-none text-ink">{u.title}</h3>
                  <p className="mt-1 text-sm text-ink-soft">{s.why}</p>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Size', sizeLabel],
                  ['Quantity', `${QTY_LABEL[s.qty]} bottles`],
                  ['Material', finishName],
                  ['Water', waterName],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-mist px-3 py-2.5">
                    <dt className="text-[11px] uppercase tracking-wide text-ink-muted">{k}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                <Check className="mr-1.5 inline h-4 w-4 align-[-3px] text-aqua-600" strokeWidth={3} aria-hidden />
                From about <span className="font-semibold text-ink">{usd(unitPrice(s.size, qtyNum), 2)}</span> per bottle at this quantity, label and design included.
              </p>

              <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => startDesign({ size: s.size, color: s.color, finish: s.finish, water: s.water, style: s.style })}
                  className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow"
                >
                  Design this setup <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => startQuote({ size: s.size, quantity: s.qty, note: `Recommended setup for ${u.title}: ${sizeLabel} · ${finishName} · ${waterName}` })}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-6 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-soft"
                >
                  Quote this setup
                </button>
              </div>
            </div>
          </GlowCard>
        </Reveal>

        {/* Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="tablist" aria-label="Business types">
          {USE_CASES.map((c, i) => {
            const st = SETUP[i]
            const selected = i === active
            return (
              <Reveal key={c.title} delay={(i % 4) * 90}>
                <GlowCard tilt={4} lift={6} className={`group h-full rounded-3xl border bg-white shadow-soft transition-colors hover:shadow-lift ${selected ? 'border-aqua-400 ring-4 ring-aqua-100' : 'border-ink/[0.06]'}`}>
                  <button type="button" role="tab" aria-selected={selected} onClick={() => setActive(i)} className="flex h-full w-full flex-col text-left">
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <SmartImage
                        src={c.image}
                        alt={`${c.title} serving custom branded water bottles`}
                        className="aspect-[4/3] w-full [&>img]:transition-transform [&>img]:duration-700 group-hover:[&>img]:scale-110"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden />
                      <span className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-xl shadow-soft transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" aria-hidden>
                        {c.emoji}
                      </span>
                      {selected && (
                        <span className="tick-in absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-aqua-500 text-white shadow-glow">
                          <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                        </span>
                      )}
                      <div className="absolute bottom-0 right-5 h-[62%] translate-y-3 opacity-90 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100" aria-hidden>
                        <Bottle size="500" color={st.color} style={st.style} name={st.name} className="h-full drop-shadow-2xl" />
                      </div>
                      <h3 className="absolute bottom-4 left-5 font-display text-2xl text-white drop-shadow">{c.title}</h3>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[15px] leading-relaxed text-ink-soft">{c.text}</p>
                      <p className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs">
                        <span className="text-ink-muted">
                          Typical: <span className="font-semibold text-ink">{st.size === '1000' ? '1 L' : `${st.size}ml`} · {QTY_LABEL[st.qty]}</span>
                        </span>
                        <span className={`inline-flex items-center gap-1 font-semibold transition ${selected ? 'text-aqua-700' : 'text-ink-muted group-hover:text-aqua-600'}`}>
                          {selected ? 'Selected' : 'See setup'} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </span>
                      </p>
                    </div>
                  </button>
                </GlowCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
