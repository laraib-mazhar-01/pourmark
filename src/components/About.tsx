import { ArrowRight, Award, Leaf, MapPin, PenTool } from 'lucide-react'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import { Reveal } from './ui/Reveal'
import { GlowCard } from './ui/GlowCard'
import { SmartImage } from './ui/SmartImage'
import { Bottle } from './Bottle'

const STATS = [
  { value: 1200, suffix: '+', label: 'Restaurants & venues served' },
  { value: 18, suffix: 'M', label: 'Branded bottles delivered' },
  { value: 48, suffix: 'h', label: 'Average label proof time' },
  { value: 4.9, suffix: '/5', label: 'Average customer rating', decimals: 1 },
]

const TIMELINE = [
  { year: '2016', title: 'One trattoria', text: 'First 500 bottles for a single Oakland restaurant, labelled by hand.' },
  { year: '2019', title: 'Glass arrives', text: 'Glass and frosted bottles join the range for hotels and fine dining.' },
  { year: '2022', title: 'In-house studio', text: 'Our own design team and the 48-hour proof promise.' },
  { year: '2025', title: 'Coast to coast', text: 'Nationwide delivery, the 1 litre format and eight finishes.' },
]

const VALUES = [
  { icon: Award, title: 'Certified facility', text: 'Every batch bottled and tested in a food-safe, certified plant.' },
  { icon: Leaf, title: 'rPET & reusable glass', text: 'Recycled PET as standard; glass and aluminum for reuse.' },
  { icon: PenTool, title: 'Design included', text: 'A real designer on every order — no template generators.' },
  { icon: MapPin, title: 'Made in Oakland', text: 'Family-run since 2016, shipped from our own warehouse.' },
]

const TEAM = [
  { initials: 'EM', name: 'Elena Marsh', role: 'Founder', color: '#1B508C' },
  { initials: 'JK', name: 'Jonah Kim', role: 'Head of Design', color: '#6E2A2E' },
  { initials: 'RA', name: 'Rosa Alvarez', role: 'Production Lead', color: '#2F6B4F' },
  { initials: 'TN', name: 'Theo Nakamura', role: 'Customer Success', color: '#B8935A' },
]

function Stat({ value, suffix, label, decimals = 0, start }: { value: number; suffix: string; label: string; decimals?: number; start: boolean }) {
  const v = useCountUp(value, { start, duration: 1400 })
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="font-display text-5xl text-white tabular-nums sm:text-6xl">
          {decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US')}
          <span className="text-aqua-300">{suffix}</span>
        </span>
        <span className="mt-1 block text-sm text-white/60" aria-hidden>
          {label}
        </span>
      </dd>
    </div>
  )
}

export function About() {
  const { ref, inView } = useInView<HTMLDListElement>()
  const { ref: tlRef, inView: tlIn } = useInView<HTMLOListElement>({ threshold: 0.3 })

  return (
    <section id="about" aria-labelledby="about-title" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="orb absolute -left-32 top-24 h-96 w-96 rounded-full bg-aqua-100/70 blur-3xl" />
      </div>

      <div className="container-x">
        {/* Story */}
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="group relative overflow-hidden rounded-[2rem] shadow-lift">
              <SmartImage
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1100&q=70"
                alt="Elegant restaurant dining room with set tables"
                className="aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[4/5] [&>img]:transition-transform [&>img]:duration-[1.6s] group-hover:[&>img]:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink/30" aria-hidden />
              <div className="absolute left-5 right-5 top-5 lg:pr-12">
                <p className="font-display text-xl italic leading-snug text-white drop-shadow sm:text-2xl">“Water is the first thing on the table. It should look like it belongs.”</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">— Elena Marsh, founder</p>
              </div>
            </div>

            {/* Second photo */}
            <div className="absolute -bottom-8 hidden w-[46%] rotate-[-3deg] overflow-hidden rounded-2xl border-4 border-white shadow-lift transition-transform duration-500 hover:rotate-0 sm:-left-6 sm:block">
              <SmartImage
                src="https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?auto=format&fit=crop&w=600&q=70"
                alt="Bottles being filled on a small bottling line"
                className="aspect-[4/3] w-full"
              />
              <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm">Our bottling line</span>
            </div>

            {/* Since card */}
            <div className="absolute -bottom-6 right-4 flex items-end gap-3 rounded-3xl bg-white/95 p-4 pr-6 shadow-lift backdrop-blur sm:-right-6 sm:bottom-10">
              <div className="animate-float-slow">
                <Bottle size="500" color="#0B1A2A" style="minimal" name="Pourmark" tagline="Pure & Simple" className="h-28" title="Pourmark sample bottle" />
              </div>
              <div className="pb-2">
                <p className="font-display text-2xl leading-none text-ink">Since 2016</p>
                <p className="mt-1 text-xs text-ink-muted">Family-run, Oakland CA</p>
              </div>
            </div>
          </Reveal>

          <div className="pt-6 lg:pt-0">
            <Reveal>
              <span className="eyebrow">
                <span className="h-px w-6 bg-aqua-500" aria-hidden />
                About Pourmark
              </span>
              <h2 id="about-title" className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
                We started with one restaurant <span className="italic text-aqua-600">and one bottle</span>
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                <p>
                  Pourmark began when our founder — a former restaurant manager — couldn’t find a branded bottled water supplier that cared about design as much as the kitchen
                  cared about the food. So we built one.
                </p>
                <p>
                  Today we partner with restaurants, hotels, caterers and event planners across the country, producing custom bottle labels with the same attention to detail
                  our clients bring to every plate. Real people, real proofs, and water we’re proud to put our own name on.
                </p>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 80}>
                  <GlowCard tilt={2} lift={3} className="group flex h-full gap-3 rounded-2xl border border-ink/[0.06] bg-white p-4 shadow-soft hover:border-aqua-200">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600 transition group-hover:bg-ink group-hover:text-white">
                      <v.icon className="h-[18px] w-[18px]" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-ink">{v.title}</span>
                      <span className="block text-sm leading-snug text-ink-soft">{v.text}</span>
                    </span>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Stats band */}
        <Reveal className="mt-20">
          <div className="grain relative overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-12 sm:py-12">
            <div className="orb pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-aqua-500/25 blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-6 right-6 hidden h-44 items-end gap-2 opacity-70 lg:flex" aria-hidden>
              <Bottle size="330" color="#B8935A" style="wrap" name="Golden Hour" className="h-[70%] drop-shadow-2xl" />
              <Bottle size="500" color="#559CDF" style="classic" name="Harbor" className="h-[85%] drop-shadow-2xl" />
              <Bottle size="750" color="#FFFFFF" style="minimal" name="Blanc" className="h-full drop-shadow-2xl" />
            </div>
            <dl ref={ref} className="relative grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:pr-56">
              {STATS.map((s) => (
                <Stat key={s.label} {...s} start={inView} />
              ))}
            </dl>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="mt-20">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" aria-hidden />
              Our story so far
            </span>
          </Reveal>
          <ol ref={tlRef} className="relative mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[9px] hidden h-0.5 bg-ink/[0.08] lg:block" aria-hidden>
              <div className="h-full origin-left bg-gradient-to-r from-aqua-400 to-aqua-600 transition-transform duration-[1800ms] ease-out" style={{ transform: tlIn ? 'scaleX(1)' : 'scaleX(0)' }} />
            </div>
            {TIMELINE.map((t, i) => (
              <li
                key={t.year}
                className={`relative transition-all duration-700 lg:text-center ${tlIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${300 + i * 350}ms` }}
              >
                <span className="relative z-10 mx-0 block h-5 w-5 rounded-full border-[3px] border-white bg-aqua-500 shadow-glow lg:mx-auto" aria-hidden />
                <p className="mt-4 font-display text-3xl text-ink">{t.year}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{t.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Team */}
        <Reveal className="mt-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-ink/[0.06] bg-white p-6 shadow-soft sm:p-8 lg:flex-row lg:items-center">
            <div>
              <p className="eyebrow">
                <span className="h-px w-6 bg-aqua-500" aria-hidden />
                The people behind the bottle
              </p>
              <p className="mt-3 max-w-md text-ink-soft">A small team that answers the phone, draws your proof and loads your pallet. You’ll know us by name.</p>
            </div>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {TEAM.map((m) => (
                <li key={m.name} className="group flex items-center gap-3">
                  <span className="rounded-full bg-gradient-to-br from-aqua-300 to-aqua-600 p-[2px] transition-transform duration-300 group-hover:-translate-y-0.5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white font-semibold text-white" style={{ background: m.color }} aria-hidden>
                      {m.initials}
                    </span>
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{m.name}</span>
                    <span className="block text-xs text-ink-muted">{m.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a href="#quote" className="btn-shine inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow">
              Say hello <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
