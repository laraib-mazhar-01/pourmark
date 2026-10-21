import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, Quote, Star } from 'lucide-react'
import { TESTIMONIALS } from '../data/content'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { GlowCard } from './ui/GlowCard'
import { SectionHeading } from './ui/SectionHeading'

const STATS = [
  { value: 4.9, suffix: '', label: 'Average rating', decimals: 1 },
  { value: 1200, suffix: '+', label: 'Venues served' },
  { value: 94, suffix: '%', label: 'Reorder within a year' },
  { value: 48, suffix: 'h', label: 'Average proof time' },
]

/** Venue name + label style for the "their bottle" preview beside each quote. */
const VENUE = [
  { name: 'Osteria Bellini', tagline: 'Cucina Toscana', style: 'classic' as const },
  { name: 'The Wren', tagline: 'Hotel & Suites', style: 'minimal' as const },
  { name: 'Saffron Room', tagline: 'Modern Indian', style: 'wrap' as const },
  { name: 'Whitfield', tagline: 'Catering Co.', style: 'classic' as const },
]

const SHORTS = [
  { q: 'Our sommelier asked who designed the label.', who: 'Lumen, Seattle' },
  { q: 'Guests take the empties home. Free advertising.', who: 'Pier 9 Oyster Bar' },
  { q: 'Proof on Tuesday, pallet the next week.', who: 'Alder & Ash, Portland' },
  { q: 'The 1 litre is perfect for our banquet tables.', who: 'Grand Meridian Hotel' },
  { q: 'Sparkling in cobalt glass — our best-selling add-on.', who: 'Bar Nocturne' },
  { q: 'We reorder every quarter without thinking.', who: 'Hearth Catering' },
]

const INTERVAL = 6500

function Stat({ value, suffix, label, decimals = 0, start }: { value: number; suffix: string; label: string; decimals?: number; start: boolean }) {
  const v = useCountUp(value, { start, duration: 1400 })
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-ink tabular-nums sm:text-5xl">
        {decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US')}
        <span className="text-aqua-600">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  )
}

export function Testimonials() {
  const { ref, inView } = useInView<HTMLDivElement>()
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [paused, setPaused] = useState(false)
  const [tick, setTick] = useState(0) // restarts the progress bar
  const timer = useRef(0)

  const go = (next: number, d: 1 | -1 = 1) => {
    setDir(d)
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length)
    setTick((t) => t + 1)
  }

  useEffect(() => {
    if (paused || !inView) return
    timer.current = window.setTimeout(() => go(index + 1, 1), INTERVAL)
    return () => window.clearTimeout(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, inView, tick])

  const t = TESTIMONIALS[index]
  const v = VENUE[index]

  return (
    <section aria-labelledby="testimonials-title" className="section bg-gradient-to-b from-mist to-white">
      <div className="container-x">
        <SectionHeading
          id="testimonials-title"
          eyebrow="Testimonials"
          title={
            <>
              Loved by restaurant <span className="italic text-aqua-600">owners</span>
            </>
          }
          intro="Hundreds of restaurants, hotels and caterers pour Pourmark every day."
        />

        <Reveal className="mt-12">
          <div ref={ref} className="grid grid-cols-2 gap-6 rounded-3xl border border-ink/[0.06] bg-white/70 p-6 shadow-soft backdrop-blur sm:grid-cols-4 sm:p-8">
            {STATS.map((s) => (
              <Stat key={s.label} {...s} start={inView} />
            ))}
          </div>
        </Reveal>

        {/* Featured testimonial */}
        <Reveal className="mt-8">
          <GlowCard
            className="grid overflow-hidden rounded-[2rem] border border-ink/[0.06] bg-white shadow-lift lg:grid-cols-[0.8fr_1.2fr]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            role="region"
            aria-roledescription="carousel"
            aria-label="Customer testimonials"
          >
            {/* Their bottle */}
            <div className="relative flex items-end justify-center overflow-hidden bg-gradient-to-b from-mist to-aqua-50 px-8 pb-10 pt-12 lg:pb-14">
              <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none whitespace-nowrap font-display text-[5.5rem] leading-none text-ink/[0.045]" aria-hidden>
                {v.name.split(' ')[0]}
              </span>
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-soft shadow-sm">Their bottle</span>
              <div key={`b${index}`} className={`relative h-64 sm:h-72 ${dir === 1 ? 'step-in-right' : 'step-in-left'}`}>
                <div className="h-full animate-float-slow">
                  <Bottle size="500" color={t.color} style={v.style} name={v.name} tagline={v.tagline} className="h-full drop-shadow-2xl" title={`${v.name} custom bottle`} />
                </div>
                <div className="pointer-events-none absolute left-0 top-full h-full w-full -scale-y-100 opacity-[0.16] [mask-image:linear-gradient(to_bottom,transparent_60%,#000_100%)]" aria-hidden>
                  <Bottle size="500" color={t.color} style={v.style} name={v.name} tagline={v.tagline} className="h-full" />
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="relative flex flex-col p-7 sm:p-10">
              <Quote className="absolute right-8 top-8 h-12 w-12 text-aqua-100" aria-hidden />
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5 text-amber-500" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-aqua-50 px-2 py-0.5 text-[11px] font-semibold text-aqua-700">
                  <BadgeCheck className="h-3 w-3" aria-hidden /> Verified order
                </span>
              </div>

              <div key={`q${index}`} className={`flex flex-1 flex-col ${dir === 1 ? 'step-in-right' : 'step-in-left'}`} aria-live="polite">
                <blockquote className="mt-6 flex-1 font-display text-[1.7rem] leading-snug text-ink sm:text-3xl lg:text-[2.1rem]">“{t.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center gap-3.5">
                  <span className="rounded-full bg-gradient-to-br from-aqua-300 to-aqua-600 p-[2px]">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white font-semibold text-white" style={{ background: t.color }} aria-hidden>
                      {t.initials}
                    </span>
                  </span>
                  <span>
                    <span className="block font-semibold text-ink">{t.name}</span>
                    <span className="block text-sm text-ink-muted">
                      {t.role} · {t.location}
                    </span>
                  </span>
                </figcaption>
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/[0.06] pt-6">
                <div className="flex items-center gap-2" role="tablist" aria-label="Choose a testimonial">
                  {TESTIMONIALS.map((x, i) => (
                    <button
                      key={x.name}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`${x.name}, ${x.role}`}
                      onClick={() => go(i, i > index ? 1 : -1)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white transition-all duration-300 ${
                        i === index ? 'scale-110 ring-2 ring-ink ring-offset-2' : 'opacity-55 hover:opacity-100'
                      }`}
                      style={{ background: x.color }}
                    >
                      {x.initials}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => go(index - 1, -1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink transition hover:border-aqua-300 hover:bg-mist" aria-label="Previous testimonial">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => go(index + 1, 1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white transition hover:bg-aqua-700" aria-label="Next testimonial">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 h-0.5 w-full overflow-hidden rounded-full bg-ink/[0.06]" aria-hidden>
                <div
                  key={tick}
                  className="h-full origin-left bg-aqua-500"
                  style={{
                    animation: paused || !inView ? 'none' : `progress ${INTERVAL}ms linear forwards`,
                    transform: paused ? 'scaleX(0)' : undefined,
                  }}
                />
              </div>
            </div>
          </GlowCard>
        </Reveal>

        {/* Short quotes marquee */}
        <Reveal className="mt-8">
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="marquee gap-4 pr-4" style={{ animationDuration: '46s' }}>
              {[...SHORTS, ...SHORTS].map((s, i) => (
                <li key={`${s.who}-${i}`} aria-hidden={i >= SHORTS.length} className="flex shrink-0 items-center gap-3 rounded-full border border-ink/[0.06] bg-white px-4 py-2.5 shadow-soft">
                  <span className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} className="h-3 w-3 fill-current" />
                    ))}
                  </span>
                  <span className="text-sm text-ink">“{s.q}”</span>
                  <span className="text-xs text-ink-muted">— {s.who}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
