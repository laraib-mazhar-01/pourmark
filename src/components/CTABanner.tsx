import { ArrowRight, Clock, Package, Star, Truck } from 'lucide-react'
import { BRAND } from '../data/content'
import { Bottle } from './Bottle'
import { ButtonLink } from './ui/Button'
import { Reveal } from './ui/Reveal'

const CHIPS = [
  { icon: Clock, text: 'Free proof in 48h', pos: 'left-[4%] top-[16%]', delay: '0s' },
  { icon: Package, text: 'From 500 bottles', pos: 'right-[2%] top-[8%]', delay: '1.1s' },
  { icon: Truck, text: 'Nationwide delivery', pos: 'right-[6%] bottom-[14%]', delay: '2s' },
]

const BOTTLES = [
  { size: '330' as const, color: '#B8935A', style: 'wrap' as const, name: 'Golden Hour', tagline: 'Rooftop Bar', h: 'h-[62%]', d: '0s' },
  { size: '500' as const, color: '#FFFFFF', style: 'classic' as const, name: 'Blanc', tagline: 'Brasserie', h: 'h-[82%]', d: '-1.5s', glint: true },
  { size: '750' as const, color: '#2F6B4F', style: 'minimal' as const, name: 'Verde', tagline: 'Farm to Table', h: 'h-full', d: '-3s' },
]

export function CTABanner() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 sm:pb-24 lg:pb-32">
      <div className="container-x">
        <Reveal>
          <div className="group grain relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-aqua-700 via-aqua-800 to-ink text-white shadow-lift">
            {/* Light sweep + orbs */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="orb absolute -right-24 -top-24 h-96 w-96 rounded-full bg-aqua-400/30 blur-3xl" />
              <div className="orb-slow absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-aqua-300/20 blur-3xl" />
              <div className="absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent animate-shimmer" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>

            <div className="relative grid items-center gap-10 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:px-16 lg:py-20">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-aqua-100">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden /> Now booking spring orders
                </span>
                <h2 id="cta-title" className="mt-5 font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  Turn every water bottle <span className="italic text-aqua-200">into your brand.</span>
                </h2>
                <p className="mt-5 max-w-xl text-lg text-white/70">Get a free label proof and a tailored quote within 24 hours. Minimum order just 500 bottles.</p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="#quote" variant="light" size="lg">
                    Request a Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink href="#customizer" size="lg" className="border border-white/25 !bg-white/10 !shadow-none hover:!bg-white/20">
                    Create Your Bottle
                  </ButtonLink>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                  <span className="flex items-center gap-3">
                    <span className="flex -space-x-2" aria-hidden>
                      {['#1B508C', '#6E2A2E', '#2F6B4F', '#B8935A'].map((c, i) => (
                        <span key={c} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-aqua-800 font-display text-sm text-white" style={{ background: c }}>
                          {['O', 'W', 'S', 'M'][i]}
                        </span>
                      ))}
                    </span>
                    Joined by 1,200+ venues
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="flex text-amber-400" aria-label="Rated 4.9 out of 5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" aria-hidden />
                      ))}
                    </span>
                    4.9 average
                  </span>
                  <a href={BRAND.phoneHref} className="link-underline text-white/80 hover:text-white">
                    or call {BRAND.phone}
                  </a>
                </div>
              </div>

              {/* Bottle stage */}
              <div className="relative mx-auto h-72 w-full max-w-md sm:h-80" aria-hidden>
                <div className="absolute inset-x-[10%] bottom-[10%] top-[20%] rounded-full bg-aqua-300/20 blur-3xl" />
                <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2">
                  <span className="ripple h-56 w-56 !border-white/20" />
                  <span className="ripple h-56 w-56 !border-white/20" style={{ animationDelay: '-2.5s' }} />
                </div>
                <div className="absolute inset-x-0 bottom-[12%] top-[8%] flex items-end justify-center gap-4">
                  {BOTTLES.map((b) => (
                    <div key={b.name} className={`relative ${b.h} animate-float-slow`} style={{ animationDelay: b.d }}>
                      <Bottle size={b.size} color={b.color} style={b.style} name={b.name} tagline={b.tagline} glint={b.glint} className="h-full drop-shadow-2xl" />
                      <div className="pointer-events-none absolute left-0 top-full h-full w-full -scale-y-100 opacity-[0.14] [mask-image:linear-gradient(to_bottom,transparent_60%,#000_100%)]">
                        <Bottle size={b.size} color={b.color} style={b.style} name={b.name} tagline={b.tagline} className="h-full" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-x-[8%] bottom-[9%] h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                {CHIPS.map(({ icon: Icon, text, pos, delay }) => (
                  <div key={text} className={`absolute ${pos} animate-float-slow`} style={{ animationDelay: delay }}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-lift backdrop-blur">
                      <Icon className="h-3.5 w-3.5 text-aqua-200" /> {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
