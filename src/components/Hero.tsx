import { useEffect, useRef } from 'react'
import { ArrowRight, Check, Droplets, Package, Palette, Star } from 'lucide-react'
import { Bottle } from './Bottle'
import { ButtonLink } from './ui/Button'

const floating = [
  { icon: Palette, label: '100% Custom Branding', sub: 'Logo, colors & QR', pos: 'left-0 top-[24%] lg:-left-8', delay: '0s', depth: 1.6, d: 900 },
  { icon: Droplets, label: 'Premium Quality Water', sub: 'Purified & certified', pos: 'right-0 top-[7%] lg:-right-4', delay: '1.2s', depth: 1.2, d: 1050 },
  { icon: Package, label: 'Bulk Orders Available', sub: 'From 500 bottles', pos: 'right-0 bottom-[16%] lg:-right-8', delay: '2.1s', depth: 1.9, d: 1200 },
]

export function Hero() {
  const scene = useRef<HTMLDivElement>(null)

  // Gentle mouse parallax across the bottle scene (desktop pointers only)
  useEffect(() => {
    const el = scene.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2
      ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      el.style.setProperty('--px', cx.toFixed(3))
      el.style.setProperty('--py', cy.toFixed(3))
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const layer = (depth: number) => ({
    transform: `translate3d(calc(var(--px, 0) * ${depth * 4}px), calc(var(--py, 0) * ${depth * 3}px), 0)`,
    transition: 'transform 0.1s linear',
  })

  return (
    <section id="home" aria-labelledby="hero-title" className="grain relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-aqua-50 via-white to-white" />
        <div className="orb absolute -right-40 -top-40 h-[620px] w-[620px] rounded-full bg-aqua-200/40 blur-3xl" />
        <div className="orb-slow absolute -left-40 top-40 h-[420px] w-[420px] rounded-full bg-sand/80 blur-3xl" />
        <div className="orb absolute left-1/3 top-2/3 h-[320px] w-[320px] rounded-full bg-aqua-100/60 blur-3xl" style={{ animationDelay: '-9s' }} />
      </div>

      <div className="container-x grid items-center gap-12 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div className="max-w-2xl">
          <p className="rise eyebrow" style={{ ['--d' as string]: '0ms' }}>
            <span className="h-px w-6 bg-aqua-500" aria-hidden />
            Custom water bottles for restaurants
          </p>
          <h1 id="hero-title" className="h-display mt-5 text-[3.2rem] leading-[0.98] sm:text-7xl lg:text-[5.4rem]">
            <span className="rise block" style={{ ['--d' as string]: '120ms' }}>
              Your Water.
            </span>
            <span className="rise block" style={{ ['--d' as string]: '240ms' }}>
              Your Brand.
            </span>
            <span className="rise block" style={{ ['--d' as string]: '360ms' }}>
              <span className="text-gradient italic">Your Table.</span>
            </span>
          </h1>
          <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl" style={{ ['--d' as string]: '520ms' }}>
            Premium bottled water with custom labels designed exclusively for your restaurant, café, hotel, or event.
          </p>

          <div className="rise mt-9 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as string]: '660ms' }}>
            <ButtonLink href="#quote" size="lg">
              Get a Custom Quote
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="#customizer" size="lg" variant="secondary">
              Design Your Bottle
            </ButtonLink>
          </div>

          <ul className="rise mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-ink-soft" style={{ ['--d' as string]: '800ms' }}>
            {['Free label proof in 48h', 'From 500 bottles', 'Nationwide delivery'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-aqua-100 text-aqua-700">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div className="rise mt-10 flex items-center gap-4 border-t border-ink/[0.07] pt-7" style={{ ['--d' as string]: '940ms' }}>
            <div className="flex -space-x-2.5" aria-hidden>
              {['#1B508C', '#6E2A2E', '#2F6B4F', '#B8935A'].map((c, i) => (
                <span
                  key={c}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white font-display text-lg text-white shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  style={{ background: c }}
                >
                  {['O', 'W', 'S', 'M'][i]}
                </span>
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-0.5 text-amber-500" aria-label="Rated 4.9 out of 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                ))}
                <span className="ml-1.5 font-semibold text-ink">4.9</span>
              </div>
              <p className="text-ink-muted">Trusted by 1,200+ restaurants, hotels &amp; venues</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div ref={scene} className="scale-in relative mx-auto w-full max-w-[540px]" style={{ ['--d' as string]: '300ms' }}>
          <div className="relative aspect-[5/6] w-full">
            <div className="absolute inset-[5%] rounded-[3rem] bg-gradient-to-br from-white via-aqua-50 to-aqua-100 shadow-lift" aria-hidden />
            <div className="absolute inset-[5%] overflow-hidden rounded-[3rem]" aria-hidden>
              <span className="ripple h-[70%] w-[70%]" />
              <span className="ripple h-[70%] w-[70%]" style={{ animationDelay: '-1.7s' }} />
              <span className="ripple h-[70%] w-[70%]" style={{ animationDelay: '-3.4s' }} />
            </div>
            <div className="absolute inset-x-[18%] bottom-[12%] top-[16%] rounded-full bg-aqua-300/30 blur-3xl" aria-hidden />

            <div className="absolute bottom-[10%] left-[12%] h-[48%]" style={layer(0.6)}>
              <Bottle
                size="330"
                color="#0B1A2A"
                style="minimal"
                name="Osteria Luna"
                tagline="Cucina Italiana"
                className="h-full drop-shadow-xl"
                title="330ml custom labeled water bottle for Osteria Luna"
              />
            </div>
            <div className="absolute bottom-[10%] right-[11%] h-[60%]" style={layer(0.8)}>
              <Bottle
                size="750"
                color="#6E2A2E"
                style="wrap"
                name="Maison Rouge"
                tagline="Fine Dining"
                className="h-full drop-shadow-xl"
                title="750ml custom labeled water bottle for Maison Rouge"
              />
            </div>
            <div className="absolute bottom-[8%] left-1/2 h-[76%] -translate-x-1/2">
              <div className="h-full" style={layer(1.3)}>
                <div className="h-full animate-float">
                  <Bottle
                    size="500"
                    color="#1B508C"
                    style="classic"
                    name="The Harbor Grill"
                    tagline="Seafood & Steak"
                    details={['harborgrill.com', '@theharborgrill']}
                    glint
                    className="h-full drop-shadow-2xl"
                    title="500ml water bottle with a custom label for The Harbor Grill restaurant"
                  />
                </div>
              </div>
            </div>

            {floating.map(({ icon: Icon, label, sub, pos, delay, depth, d }) => (
              <div key={label} className={`absolute ${pos}`} style={layer(depth)}>
                <div className="rise" style={{ ['--d' as string]: `${d}ms` }}>
                  <div className="animate-float-slow" style={{ animationDelay: delay }}>
                    <div className="flex items-center gap-2.5 rounded-2xl border border-white/80 bg-white/90 py-2 pl-2 pr-3.5 shadow-lift backdrop-blur transition-transform duration-300 hover:scale-[1.04] sm:gap-3 sm:py-2.5 sm:pl-2.5 sm:pr-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600 sm:h-9 sm:w-9">
                        <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[12px] font-semibold text-ink sm:text-[13px]">{label}</span>
                        <span className="block text-[11px] text-ink-muted">{sub}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
