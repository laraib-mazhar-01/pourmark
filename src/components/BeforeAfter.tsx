import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { useInView } from '../hooks/useInView'
import { ArrowRight, Check, ChevronsLeftRight, Camera, MessageCircle, QrCode, Repeat, Star } from 'lucide-react'
import type { BottleFinish, LabelStyle } from '../lib/types'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { ButtonLink } from './ui/Button'

const POINTS = [
  { icon: Star, title: 'A more memorable experience', text: 'Guests notice the details. A bottle with your name signals care before the first course arrives.' },
  { icon: Camera, title: 'Shared on social', text: 'Branded bottles show up in table photos and stories — putting your name in front of new diners.' },
  { icon: Repeat, title: 'Brand that leaves with them', text: 'Unfinished bottles travel home, to the office and the gym, reminding guests where they dined.' },
  { icon: MessageCircle, title: 'Conversation starter', text: '“Where are these from?” is the kind of question every restaurant owner wants to hear.' },
]

interface Scenario {
  id: string
  label: string
  name: string
  tagline: string
  details: string[]
  color: string
  style: LabelStyle
  finish: BottleFinish
  reaction: string
  bg: string
}

const SCENARIOS: Scenario[] = [
  { id: 'restaurant', label: 'Restaurant', name: 'Trattoria Nonna', tagline: 'Handmade Pasta', details: ['trattorianonna.com', '@trattorianonna'], color: '#6E2A2E', style: 'classic', finish: 'clear', reaction: '\u201cWhere are these from?\u201d', bg: 'from-aqua-50 to-aqua-200' },
  { id: 'hotel', label: 'Hotel', name: 'The Wren', tagline: 'Hotel & Suites', details: ['thewren.com', 'Room service \u00b7 dial 0'], color: '#0B1A2A', style: 'minimal', finish: 'glass', reaction: '\u201cSuch a nice touch in the room.\u201d', bg: 'from-[#eef3f7] to-[#cfdbe6]' },
  { id: 'wedding', label: 'Wedding', name: 'A & J', tagline: 'September 12, 2026', details: ['Thank you for celebrating with us'], color: '#C98A8A', style: 'minimal', finish: 'frosted', reaction: '\u201cCan we keep one?\u201d', bg: 'from-[#fbf3f3] to-[#f0d9d9]' },
  { id: 'event', label: 'Event', name: 'Summit 26', tagline: 'Keynote Day', details: ['summit26.com', '#summit26'], color: '#2F7FD0', style: 'wrap', finish: 'clear', reaction: '\u201cPosted it to the event feed.\u201d', bg: 'from-aqua-50 to-aqua-300' },
]

const CHANGES = [
  { icon: Star, text: 'Your logo on every table' },
  { icon: Repeat, text: 'Brand colors, matched' },
  { icon: QrCode, text: 'QR code to your menu' },
  { icon: MessageCircle, text: 'Your name in every photo' },
]

export function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const [scenario, setScenario] = useState(0)
  const sc = SCENARIOS[scenario]
  const branded = pos <= 50
  const [interacted, setInteracted] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const touched = useRef(false)
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.3 })

  // Auto-sweep the divider once when the comparison scrolls into view
  useEffect(() => {
    if (!inView || touched.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const t0 = performance.now() + 400
    const dur = 1800
    const tick = (t: number) => {
      if (touched.current) return
      const p = Math.min(1, Math.max(0, (t - t0) / dur))
      const e = 0.5 - Math.cos(p * Math.PI) / 2
      // 50 → 12 → 50
      setPos(50 - Math.sin(e * Math.PI) * 38)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView])

  const moveTo = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    touched.current = true
    setInteracted(true)
    dragging.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(e.clientX)
  }
  const stop = () => {
    dragging.current = false
  }

  return (
    <section aria-labelledby="ba-title" className="section bg-gradient-to-b from-white to-mist">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <div ref={inViewRef}>
          <div className="mx-auto mb-4 flex w-full max-w-[520px] gap-1 rounded-full bg-white p-1 shadow-soft" role="tablist" aria-label="Choose a venue type">
            {SCENARIOS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={i === scenario}
                onClick={() => {
                  setScenario(i)
                  touched.current = true
                  setInteracted(true)
                  setPos(22)
                }}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-medium transition ${i === scenario ? 'bg-ink text-white shadow-soft' : 'text-ink-soft hover:text-ink'}`}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div
            ref={frame}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={stop}
            onPointerCancel={stop}
            className="relative mx-auto aspect-[4/5] w-full max-w-[520px] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[2rem] shadow-lift"
          >
            {/* Before */}
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-b from-[#eef0f2] to-[#d9dde1] pb-[9%]">
              <TableScene tone="grey" />
              <Bottle size="500" generic className="relative h-[78%]" />
            </div>
            {/* After */}
            <div
              className={`absolute inset-0 flex items-end justify-center bg-gradient-to-b pb-[9%] transition-colors duration-700 ${sc.bg}`}
              style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
            >
              <TableScene tone="blue" />
              <div key={sc.id} className="animate-label-in relative h-[78%]">
                <Bottle size="500" color={sc.color} style={sc.style} finish={sc.finish} name={sc.name} tagline={sc.tagline} details={sc.details} className="h-full drop-shadow-2xl" />
              </div>
              {/* Guest reactions */}
              <span key={`r${sc.id}`} className="animate-label-in absolute left-[8%] top-[30%] inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-lift">
                <MessageCircle className="h-3.5 w-3.5 text-aqua-600" aria-hidden /> {sc.reaction}
              </span>
              <span className="absolute right-[6%] top-[46%] inline-flex animate-float-slow items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-ink shadow-lift" style={{ animationDelay: '1.4s' }}>
                <Camera className="h-3.5 w-3.5 text-aqua-600" aria-hidden /> Tagged in 3 stories
              </span>
              <span className="absolute bottom-[14%] right-[10%] inline-flex animate-float-slow items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-lift" style={{ animationDelay: '0.7s' }}>
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden /> 5.0 review
              </span>
            </div>

            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink-soft shadow-sm">Regular Water Bottle</span>
            <span className="absolute right-4 top-4 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-sm">Your Branded Bottle</span>

            {/* Divider */}
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.25)]" style={{ left: `${pos}%` }} aria-hidden>
              {!interacted && <span className="ripple h-16 w-16 !border-white/80" style={{ animationDuration: '2.2s' }} />}
              <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lift transition-transform duration-300 hover:scale-110">
                <ChevronsLeftRight className="h-5 w-5" />
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => {
                touched.current = true
                setInteracted(true)
                setPos(Number(e.target.value))
              }}
              className="peer sr-only"
              aria-label="Compare a regular bottle with a branded bottle"
            />
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <span className={`transition ${pos < 50 ? 'font-semibold text-ink' : 'text-ink-muted'}`}>Generic</span>
            <span className="text-xs uppercase tracking-[0.2em] text-ink-muted">{interacted ? 'Drag to compare' : 'Try dragging →'}</span>
            <span className={`transition ${pos >= 50 ? 'font-semibold text-ink' : 'text-ink-muted'}`}>Your brand</span>
          </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" aria-hidden />
              Before / After
            </span>
            <h2 id="ba-title" className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
              Don’t Serve Generic Water. <span className="italic text-aqua-600">Serve Your Brand.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              A generic bottle is a missed opportunity sitting on every table. Branded bottled water turns a basic necessity into part of your restaurant’s identity — as
              considered as your menu, your plates and your playlist.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <div className="rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">What changes on the table</p>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${branded ? 'bg-aqua-50 text-aqua-700' : 'bg-mist text-ink-muted'}`}>
                  {branded ? 'Branded' : 'Generic'}
                </span>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {CHANGES.map((c, i) => (
                  <li key={c.text} className="flex items-center gap-2.5 text-sm">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${branded ? 'bg-aqua-500 text-white' : 'bg-mist text-ink-muted'}`}
                      style={{ transitionDelay: branded ? `${i * 90}ms` : '0ms' }}
                    >
                      {branded ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : <c.icon className="h-3 w-3" aria-hidden />}
                    </span>
                    <span className={`transition-colors ${branded ? 'text-ink' : 'text-ink-muted line-through decoration-ink/20'}`}>{c.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mist" aria-hidden>
                <div className="h-full rounded-full bg-gradient-to-r from-aqua-400 to-aqua-600 transition-[width] duration-200" style={{ width: `${100 - pos}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-muted">Drag the divider to see how much of your table shows your brand.</p>
            </div>
          </Reveal>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2">
            {POINTS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 90} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-600 shadow-soft">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10">
            <ButtonLink href="#customizer" size="lg">
              Get Your Custom Bottle <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Soft table-setting backdrop: plate, cutlery and a linen fold. */
function TableScene({ tone }: { tone: 'grey' | 'blue' }) {
  const line = tone === 'blue' ? '#2F7FD0' : '#8A99A8'
  const plate = tone === 'blue' ? '#FFFFFF' : '#F7F8FA'
  return (
    <svg viewBox="0 0 400 500" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMax slice" aria-hidden>
      <ellipse cx="200" cy="470" rx="260" ry="40" fill={line} fillOpacity="0.08" />
      <ellipse cx="118" cy="440" rx="78" ry="22" fill={plate} fillOpacity="0.9" />
      <ellipse cx="118" cy="440" rx="58" ry="16" fill="none" stroke={line} strokeOpacity="0.25" strokeWidth="1.5" />
      <ellipse cx="300" cy="452" rx="62" ry="17" fill={plate} fillOpacity="0.85" />
      <ellipse cx="300" cy="452" rx="44" ry="12" fill="none" stroke={line} strokeOpacity="0.22" strokeWidth="1.5" />
      <path d="M28 430v30M34 430v30M31 460v22" stroke={line} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <path d="M372 428v54" stroke={line} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
      <path d="M369 428h6v12h-6z" fill={line} fillOpacity="0.5" />
      <path d="M0 500c90-30 150-20 230-26s110-10 170-4v30H0z" fill={line} fillOpacity="0.06" />
    </svg>
  )
}
