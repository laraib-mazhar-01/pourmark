import { useState } from 'react'
import { ArrowRight, Check, Clock, Layers, Package, Ruler } from 'lucide-react'
import { Bottle } from './Bottle'
import { GlowCard } from './ui/GlowCard'
import type { Product } from '../data/content'
import { startingPrice, usd } from '../lib/pricing'

interface Props {
  product: Product
  onQuote: (p: Product) => void
  onCustomize: (p: Product, color: string) => void
}

const SWATCHES = ['#0B1A2A', '#1B508C', '#2F6B4F', '#6E2A2E', '#B8935A']

const SPECS: Record<Product['size'], { height: string; label: string; min: string; lead: string; oz: string }> = {
  '330': { height: '17 cm', label: '5.5 × 8 cm', min: '500', lead: '10–12 days', oz: '11.2 fl oz' },
  '500': { height: '21 cm', label: '6.5 × 9 cm', min: '500', lead: '10–12 days', oz: '16.9 fl oz' },
  '750': { height: '30 cm', label: '7 × 10 cm', min: '500', lead: '12–15 days', oz: '25.4 fl oz' },
  '1000': { height: '33 cm', label: '8 × 11 cm', min: '500', lead: '12–15 days', oz: '33.8 fl oz' },
}

export function ProductCard({ product, onQuote, onCustomize }: Props) {
  const { size, name, description, perfectFor, color: baseColor, style, sample, sampleTagline, popular } = product
  const [color, setColor] = useState(baseColor)
  const spec = SPECS[size]
  const bottleH = size === '330' ? 'h-[70%]' : size === '500' ? 'h-[82%]' : 'h-[94%]'

  return (
    <GlowCard
      tilt={5}
      lift={8}
      className={`group flex h-full flex-col rounded-[2rem] border bg-white hover:shadow-lift ${
        popular ? 'border-aqua-200 shadow-lift' : 'border-ink/[0.06] shadow-soft'
      }`}
    >
      <article className="flex h-full flex-col">
        {/* Stage */}
        <div className="relative flex h-[24rem] items-end justify-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_100%,#dcebf8_0%,#f5f8fb_55%,#ffffff_100%)] pt-12">
          {/* Ghost numeral */}
          <span
            className="pointer-events-none absolute left-1/2 top-[14%] -translate-x-1/2 select-none font-display text-[9rem] leading-none text-ink/[0.045] transition-all duration-700 group-hover:top-[11%] group-hover:text-aqua-600/[0.07]"
            aria-hidden
          >
            {size}
          </span>

          <div className="absolute left-5 top-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-aqua-700 shadow-sm backdrop-blur">Custom Label</span>
            {popular && <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">Most Popular</span>}
          </div>

          {/* Bottle + reflection */}
          <div className="relative mb-10 flex h-full items-end">
            <div className={`relative ${bottleH} transition-transform duration-700 ease-out group-hover:-translate-y-3 group-hover:scale-[1.03]`}>
              <Bottle
                size={size}
                color={color}
                style={style}
                name={sample}
                tagline={sampleTagline}
                animateKey={color}
                className="h-full drop-shadow-xl"
                title={`${name} with a custom restaurant label`}
              />
              <div
                className="pointer-events-none absolute left-0 top-full h-full w-full -scale-y-100 opacity-[0.18] [mask-image:linear-gradient(to_bottom,transparent_55%,#000_100%)]"
                aria-hidden
              >
                <Bottle size={size} color={color} style={style} name={sample} tagline={sampleTagline} className="h-full" />
              </div>
            </div>
            <div className="absolute bottom-[-6px] left-1/2 h-5 w-[140%] -translate-x-1/2 rounded-[50%] bg-ink/10 blur-md" aria-hidden />
          </div>

          {/* Live color swatches */}
          <div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/70 bg-white/80 px-2.5 py-1.5 shadow-soft backdrop-blur"
            role="radiogroup"
            aria-label={`Preview label color for the ${name}`}
          >
            {SWATCHES.map((c) => {
              const active = c === color
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`Label color ${c}`}
                  onClick={() => setColor(c)}
                  className={`h-5 w-5 rounded-full transition-transform hover:scale-110 ${active ? 'ring-2 ring-ink ring-offset-2 ring-offset-white' : 'ring-1 ring-ink/10'}`}
                  style={{ background: c }}
                />
              )
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="h-display text-3xl">{name}</h3>
            <span className="text-sm text-ink-muted">{spec.oz}</span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{description}</p>

          <dl className="mt-5 grid grid-cols-2 gap-2.5">
            <Spec icon={Ruler} label="Height" value={spec.height} />
            <Spec icon={Layers} label="Label area" value={spec.label} />
            <Spec icon={Package} label="Minimum" value={`${spec.min} bottles`} />
            <Spec icon={Clock} label="Lead time" value={spec.lead} />
          </dl>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Perfect for</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {perfectFor.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5 rounded-full border border-ink/[0.06] bg-white px-3 py-1 text-sm text-ink-soft">
                <Check className="h-3.5 w-3.5 text-aqua-600" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7">
            <div className="flex items-baseline justify-between gap-3 border-t border-ink/[0.06] pt-5">
              <p className="text-xs text-ink-muted">Starting from</p>
              <p className="whitespace-nowrap text-2xl font-semibold text-ink">
                {usd(startingPrice(size), 2)}
                <span className="text-sm font-normal text-ink-muted"> / bottle</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => onQuote(product)}
              className="btn-shine mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow"
              aria-label={`Request a quote for the ${name}`}
            >
              Request Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={() => onCustomize(product, color)}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-sm font-medium text-aqua-600 transition hover:text-aqua-800"
            >
              Customize with your logo <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </article>
    </GlowCard>
  )
}

function Spec({ icon: Icon, label, value }: { icon: typeof Ruler; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-mist px-3 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Icon className="h-3 w-3 shrink-0 text-aqua-600" aria-hidden />
        {label}
      </dt>
      <dd className="mt-1 whitespace-nowrap text-[13px] font-semibold text-ink">{value}</dd>
    </div>
  )
}
