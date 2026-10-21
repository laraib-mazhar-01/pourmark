import { ArrowRight, Clock } from 'lucide-react'
import { STEPS } from '../data/content'
import { useInView } from '../hooks/useInView'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { GlowCard } from './ui/GlowCard'
import { SectionHeading } from './ui/SectionHeading'
import { ButtonLink } from './ui/Button'

const META = [
  { when: 'Day 1', detail: 'Mix sizes in one order — 330ml for lunch, 500ml for dinner — and we print the same label across all of them.' },
  { when: 'Day 1', detail: 'Vector files (SVG, AI, PDF) print sharpest, but a PNG works too. No logo yet? Our designers will create one.' },
  { when: 'Within 48h', detail: 'Your proof arrives as a PDF and an on-bottle mockup. Two rounds of revisions are included.' },
  { when: '10–15 days', detail: 'Palletized and delivered to your door, with free local delivery on 1,000+ bottles.' },
]

export function HowItWorks() {
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.3 })

  return (
    <section id="how-it-works" aria-labelledby="how-title" className="section grain relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="orb absolute -left-32 top-0 h-96 w-96 rounded-full bg-aqua-600/25 blur-3xl" />
        <div className="orb-slow absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-aqua-400/15 blur-3xl" />
      </div>
      <div className="container-x relative">
        <SectionHeading
          dark
          id="how-title"
          eyebrow="How It Works"
          title={
            <>
              From logo to table <span className="italic text-aqua-300">in four steps</span>
            </>
          }
          intro="A simple, guided process. You focus on your guests — we handle design, production and delivery."
        />

        <ol ref={ref} className="relative mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Animated connector (desktop) */}
          <svg className="pointer-events-none absolute inset-x-0 top-[72px] hidden h-4 w-full lg:block" viewBox="0 0 1000 16" preserveAspectRatio="none" aria-hidden>
            <path d="M 125 8 H 875" stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
            <path d="M 125 8 H 875" stroke="url(#how-grad)" strokeWidth="2" fill="none" className={`draw-line ${inView ? 'is-visible' : ''}`} />
            <defs>
              <linearGradient id="how-grad" x1="0" x2="1">
                <stop offset="0" stopColor="#559CDF" />
                <stop offset="1" stopColor="#86BCEB" />
              </linearGradient>
            </defs>
          </svg>

          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 130} className="group relative">
              <GlowCard dark tilt={4} lift={6} className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur hover:border-aqua-400/40 hover:bg-white/[0.07] sm:p-7">
                {/* Node on the connector */}
                <span
                  className={`absolute -top-[9px] left-1/2 hidden h-[18px] w-[18px] -translate-x-1/2 rounded-full border-[3px] border-ink bg-aqua-400 shadow-glow lg:block ${inView ? 'node-pop' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.5 + i * 0.5}s` }}
                  aria-hidden
                />

                <div className="flex items-start justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-aqua-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aqua-200">
                    <Clock className="h-3 w-3" aria-hidden /> {META[i].when}
                  </span>
                  <span className="font-display text-5xl leading-none text-white/15 transition-colors duration-500 group-hover:text-aqua-300/40">{s.n}</span>
                </div>

                <div className="relative mt-5 flex h-32 items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02]">
                  <Illustration index={i} active={inView} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-white/65">{s.text}</p>

                <div className="grid transition-[grid-template-rows] duration-500 ease-out lg:grid-rows-[0fr] lg:group-hover:grid-rows-[1fr] lg:group-focus-within:grid-rows-[1fr]">
                  <div className="overflow-hidden">
                    <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-aqua-100/80">{META[i].detail}</p>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <ButtonLink href="#customizer" variant="light" size="lg">
            Create Your Bottle <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <a href="#quote" className="link-underline text-sm font-medium text-white/70 hover:text-white">
            or talk to us about your order
          </a>
        </Reveal>
      </div>
    </section>
  )
}

/** Small scene illustrations drawn in the same style as the bottle mockups. */
function Illustration({ index, active }: { index: number; active: boolean }) {
  if (index === 0) {
    return (
      <div className="flex items-end gap-2 pb-3">
        <Bottle size="330" color="#559CDF" style="classic" name="Yours" className="h-16 opacity-80 drop-shadow-lg" title="330ml bottle" />
        <div className="animate-float-slow">
          <Bottle size="500" color="#2F7FD0" style="classic" name="Yours" className="h-24 drop-shadow-xl" title="500ml bottle" />
        </div>
        <Bottle size="750" color="#1B508C" style="wrap" name="Yours" className="h-[88px] opacity-80 drop-shadow-lg" title="750ml bottle" />
      </div>
    )
  }
  if (index === 1) {
    return (
      <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden>
        <rect x="30" y="22" width="100" height="76" rx="12" fill="#FFFFFF" fillOpacity="0.08" stroke="#FFFFFF" strokeOpacity="0.2" strokeDasharray="5 4" />
        <g className="upload-arrow" style={{ transformOrigin: '80px 60px' }}>
          <path d="M80 72V40M68 52l12-12 12 12" stroke="#86BCEB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </g>
        <g transform="translate(96 66)">
          <circle r="16" fill="#6E2A2E" />
          <text y="5" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" fill="#fff">
            HG
          </text>
        </g>
        <rect x="46" y="84" width="46" height="5" rx="2.5" fill="#FFFFFF" fillOpacity="0.25" />
        <rect x="46" y="84" width={active ? 46 : 8} height="5" rx="2.5" fill="#559CDF" style={{ transition: 'width 1.6s cubic-bezier(.2,.8,.2,1) 0.6s' }} />
      </svg>
    )
  }
  if (index === 2) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden>
          <rect x="34" y="14" width="92" height="96" rx="8" fill="#FFFFFF" fillOpacity="0.92" />
          <rect x="46" y="26" width="36" height="5" rx="2.5" fill="#0B1A2A" fillOpacity="0.5" />
          <rect x="46" y="36" width="52" height="3" rx="1.5" fill="#0B1A2A" fillOpacity="0.18" />
          <rect x="46" y="43" width="44" height="3" rx="1.5" fill="#0B1A2A" fillOpacity="0.18" />
          <rect x="100" y="24" width="18" height="22" rx="3" fill="#1B508C" />
        </svg>
        <div className="absolute bottom-0 left-[38%]">
          <Bottle size="500" color="#1B508C" style="classic" name="Approved" className="h-[72px] drop-shadow-lg" title="Label proof" />
        </div>
        <span
          className={`absolute right-[14%] top-[44%] rounded border-2 border-emerald-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 ${active ? 'stamp' : 'opacity-0'}`}
          style={{ animationDelay: '1.1s' }}
        >
          Approved
        </span>
      </div>
    )
  }
  return (
    <svg viewBox="0 0 160 110" className="h-full w-full" aria-hidden>
      <rect x="0" y="92" width="160" height="2" fill="#FFFFFF" fillOpacity="0.15" />
      <g className="van-drive">
        <rect x="22" y="40" width="78" height="46" rx="8" fill="#FFFFFF" fillOpacity="0.92" />
        <path d="M100 52h22l14 16v18h-36z" fill="#86BCEB" />
        <rect x="104" y="56" width="14" height="10" rx="2" fill="#0B1A2A" fillOpacity="0.5" />
        <circle cx="44" cy="88" r="9" fill="#0B1A2A" />
        <circle cx="44" cy="88" r="4" fill="#86BCEB" />
        <circle cx="118" cy="88" r="9" fill="#0B1A2A" />
        <circle cx="118" cy="88" r="4" fill="#86BCEB" />
        <g transform="translate(38 50)">
          <rect width="14" height="20" rx="2" fill="#1B508C" />
          <rect x="18" width="14" height="20" rx="2" fill="#2F7FD0" />
          <rect x="36" width="14" height="20" rx="2" fill="#1B508C" />
          <rect x="2" y="7" width="10" height="6" fill="#fff" fillOpacity="0.9" />
          <rect x="20" y="7" width="10" height="6" fill="#fff" fillOpacity="0.9" />
          <rect x="38" y="7" width="10" height="6" fill="#fff" fillOpacity="0.9" />
        </g>
      </g>
      <path d="M6 70h10M2 78h8" stroke="#86BCEB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  )
}
