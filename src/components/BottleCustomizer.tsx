import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { ArrowLeft, ArrowRight, Check, Citrus, Download, Droplet, Droplets, ImagePlus, Layers, Mountain, RotateCcw, Scale, Sparkles, Trash2, UploadCloud, type LucideIcon } from 'lucide-react'
import { Bottle } from './Bottle'
import { Button } from './ui/Button'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'
import { CAP_OPTIONS, FINISH_OPTIONS, LABEL_COLORS, WATER_OPTIONS } from '../data/content'
import { DEMO_LOGOS } from '../data/demoLogos'
import { downloadSvgAsPng } from '../lib/exportPreview'
import { useQuote } from '../context/QuoteContext'
import type { BottleDesign, BottleSize, LabelStyle } from '../lib/types'

const STEPS = ['Bottle', 'Logo', 'Name', 'Color', 'Text', 'Preview'] as const

const WATER_ICONS: Record<string, LucideIcon> = { droplet: Droplet, droplets: Droplets, sparkles: Sparkles, scale: Scale, mountain: Mountain, citrus: Citrus }

const SIZES: { id: BottleSize; label: string; note: string }[] = [
  { id: '330', label: '330ml', note: 'Cafés & catering' },
  { id: '500', label: '500ml', note: 'Most popular' },
  { id: '750', label: '750ml', note: 'Fine dining' },
  { id: '1000', label: '1 Litre', note: 'Sharing & events' },
]

const STYLES: { id: LabelStyle; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'wrap', label: 'Full Color' },
]

const SCENES = [
  { id: 'studio', label: 'Studio', className: 'bg-gradient-to-b from-mist to-aqua-100' },
  { id: 'table', label: 'Table', className: 'bg-gradient-to-b from-[#2a2420] to-[#14110f]' },
  { id: 'linen', label: 'Linen', className: 'bg-gradient-to-b from-[#f7f3ec] to-[#e9e0d2]' },
] as const

const ACCEPTED = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

const INITIAL: BottleDesign = {
  size: '500',
  finish: 'clear',
  water: 'still',
  logo: null,
  name: '',
  color: '#1B508C',
  style: 'classic',
  cap: 'match',
  capCustom: '#B8935A',
  tagline: '',
  website: '',
  phone: '',
  instagram: '',
}

export function BottleCustomizer() {
  const { startQuote, designStart } = useQuote()
  const [step, setStep] = useState(0)
  const [design, setDesign] = useState<BottleDesign>(INITIAL)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [scene, setScene] = useState<(typeof SCENES)[number]['id']>('studio')
  const [dir, setDir] = useState<1 | -1>(1)
  const [pulseKey, setPulseKey] = useState(0)
  const [exporting, setExporting] = useState(false)
  const [exploded, setExploded] = useState(false)
  const [hoverExplode, setHoverExplode] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  const goTo = useCallback((i: number) => {
    setStep((s) => {
      setDir(i >= s ? 1 : -1)
      return i
    })
  }, [])

  // Product cards can open the customizer with a size/color preselected
  useEffect(() => {
    if (!designStart) return
    setDesign((d) => ({
      ...d,
      size: designStart.size,
      color: designStart.color ?? d.color,
      finish: designStart.finish ?? d.finish,
      water: designStart.water ?? d.water,
      style: designStart.style ?? d.style,
    }))
    goTo(1)
  }, [designStart, goTo])

  const update = useCallback(<K extends keyof BottleDesign>(key: K, value: BottleDesign[K]) => {
    setDesign((d) => ({ ...d, [key]: value }))
  }, [])

  const handleFile = useCallback(
    (file: File | undefined) => {
      setUploadError('')
      if (!file) return
      if (!ACCEPTED.includes(file.type)) {
        setUploadError('Please upload a PNG, JPG, SVG or WEBP image.')
        return
      }
      if (file.size > MAX_BYTES) {
        setUploadError('That file is larger than 5 MB. Please upload a smaller version.')
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        update('logo', String(reader.result))
        setLogoFile(file)
      }
      reader.onerror = () => setUploadError('We couldn’t read that file. Please try another.')
      reader.readAsDataURL(file)
    },
    [update],
  )

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0])
    e.target.value = ''
  }

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const removeLogo = () => {
    update('logo', null)
    setLogoFile(null)
  }

  const reset = () => {
    setDesign(INITIAL)
    setLogoFile(null)
    setUploadError('')
    goTo(0)
  }

  const details = useMemo(
    () =>
      [
        design.website.trim(),
        design.phone.trim(),
        design.instagram.trim() ? `@${design.instagram.trim().replace(/^@/, '')}` : '',
      ].filter(Boolean),
    [design.website, design.phone, design.instagram],
  )

  const capOpt = CAP_OPTIONS.find((c) => c.id === design.cap) ?? CAP_OPTIONS[0]
  const capColor = design.cap === 'custom' ? design.capCustom : (capOpt.color ?? undefined)
  const capProps = { capColor, capMetallic: design.cap === 'custom' ? false : capOpt.metallic, finish: design.finish, water: design.water }

  const animateKey = `${design.size}-${design.finish}-${design.style}-${design.color}-${design.logo ? design.logo.length : 0}`

  // Flash a "label updated" cue whenever the design changes (skip initial mount)
  const changeKey = `${animateKey}|${design.water}|${design.cap}|${design.capCustom}|${design.name}|${design.tagline}|${details.join()}`
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setPulseKey((k) => k + 1)
  }, [changeKey])

  const exportPreview = async () => {
    const svg = stageRef.current?.querySelector('svg')
    if (!svg) return
    setExporting(true)
    try {
      const slug = (design.name.trim() || 'your-bottle').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await downloadSvgAsPng(svg, `${slug}-${design.size}ml-preview.png`)
    } catch {
      /* ignore - the browser blocked the download */
    } finally {
      setExporting(false)
    }
  }

  const useDemoLogo = (src: string, name: string) => {
    setUploadError('')
    update('logo', src)
    setLogoFile(new File([], `${name.toLowerCase()}-demo-logo.svg`, { type: 'image/svg+xml' }))
  }

  const requestQuote = () => {
    startQuote({
      size: design.size,
      business: design.name.trim() || undefined,
      design,
      logoFile,
      note: 'Designed with the online Bottle Customizer.',
    })
  }

  const isLast = step === STEPS.length - 1
  const sceneClass = SCENES.find((s) => s.id === scene)!.className

  return (
    <section id="customizer" aria-labelledby="customizer-title" className="section relative bg-mist">
      <div className="container-x">
        <SectionHeading
          id="customizer-title"
          eyebrow="Bottle Customizer"
          title={
            <>
              Design your bottle <span className="italic text-aqua-600">in minutes</span>
            </>
          }
          intro="Upload your logo, add your restaurant name, pick your colors and see your custom label come to life instantly. Our designers will perfect it before print."
        />

        <Reveal className="mt-14">
          <div className="card grid w-full max-w-full overflow-hidden [&>*]:min-w-0 lg:grid-cols-[1fr_1.05fr]">
            {/* Preview */}
            <div className={`relative flex flex-col transition-colors duration-500 ${sceneClass}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 sm:gap-3 sm:p-5">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                    scene === 'table' ? 'bg-white/10 text-white/80' : 'bg-white/80 text-ink-soft'
                  }`}
                >
                  <span className="hidden sm:inline">Live preview · </span>{design.size === '1000' ? '1 L' : `${design.size}ml`}
                </span>
                <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={exploded}
                  onClick={() => setExploded((v) => !v)}
                  title="Show bottle parts"
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition ${
                    exploded || hoverExplode
                      ? 'bg-ink text-white shadow-glow'
                      : scene === 'table'
                        ? 'bg-white/10 text-white/80 hover:bg-white/20'
                        : 'bg-white/70 text-ink-soft hover:text-ink'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden /> Parts
                </button>
                <div
                  className={`flex rounded-full p-1 text-xs font-medium ${scene === 'table' ? 'bg-white/10' : 'bg-white/70'}`}
                  role="radiogroup"
                  aria-label="Preview background"
                >
                  {SCENES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      role="radio"
                      aria-checked={scene === s.id}
                      onClick={() => setScene(s.id)}
                      className={`rounded-full px-3 py-1.5 transition ${
                        scene === s.id
                          ? 'bg-white text-ink shadow-sm'
                          : scene === 'table'
                            ? 'text-white/70 hover:text-white'
                            : 'text-ink-muted hover:text-ink'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                </div>
              </div>

              <div ref={stageRef} className="relative flex flex-1 items-end justify-center overflow-hidden px-6 pb-16 pt-0 sm:pb-20 sm:pt-2">
                {/* Ghost numeral */}
                <span
                  key={`num-${design.size}`}
                  className={`pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 select-none font-display text-[11rem] leading-none animate-label-in sm:text-[15rem] ${
                    scene === 'table' ? 'text-white/[0.05]' : 'text-ink/[0.045]'
                  }`}
                  aria-hidden
                >
                  {design.size}
                </span>

                {/* Pulse ring on change */}
                {pulseKey > 0 && (
                  <span
                    key={`pulse-${pulseKey}`}
                    className={`stage-pulse pointer-events-none absolute left-1/2 top-[55%] h-[70%] w-[70%] rounded-full border ${
                      scene === 'table' ? 'border-white/40' : 'border-aqua-400/60'
                    }`}
                    aria-hidden
                  />
                )}

                {/* Updated chip */}
                {pulseKey > 0 && (
                  <span
                    key={`chip-${pulseKey}`}
                    className="chip-pop pointer-events-none absolute left-1/2 top-4 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white shadow-lift"
                    aria-hidden
                  >
                    <Sparkles className="h-3.5 w-3.5 text-aqua-300" /> Label updated
                  </span>
                )}

                <div
                  className={`absolute bottom-12 left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[50%] blur-2xl ${scene === 'table' ? 'bg-black/60' : 'bg-aqua-400/25'}`}
                  aria-hidden
                />
                <div className="relative flex h-[300px] items-end sm:h-[420px] lg:h-[500px]">
                  <div
                    className="relative h-full animate-float-slow"
                    onMouseEnter={() => setHoverExplode(true)}
                    onMouseLeave={() => setHoverExplode(false)}
                  >
                    <Bottle
                      exploded={exploded || hoverExplode}
                      size={design.size}
                      color={design.color}
                      style={design.style}
                      name={design.name}
                      logo={design.logo}
                      tagline={design.tagline}
                      details={details}
                      animateKey={animateKey}
                      {...capProps}
                      className="h-full max-w-full drop-shadow-2xl transition-[height] duration-500"
                      title={`Live preview of your ${design.size}ml bottle${design.name ? ` for ${design.name}` : ''}`}
                    />
                    {/* Reflection */}
                    <div
                      className={`pointer-events-none absolute left-0 top-full h-full w-full -scale-y-100 [mask-image:linear-gradient(to_bottom,transparent_60%,#000_100%)] ${
                        scene === 'table' ? 'opacity-[0.14]' : 'opacity-[0.2]'
                      }`}
                      aria-hidden
                    >
                      <Bottle size={design.size} color={design.color} style={design.style} name={design.name} logo={design.logo} tagline={design.tagline} details={details} {...capProps} className="h-full max-w-full" />
                    </div>
                  </div>
                </div>

                {/* Stage footer */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 pb-4 sm:px-5">
                  <span className={`text-xs ${scene === 'table' ? 'text-white/50' : 'text-ink-muted'}`}>
                    {exploded || hoverExplode ? (
                      'Cap · Label · Bottle'
                    ) : (
                      <>
                        <span className="sm:hidden">Tap “Parts” to see the bottle apart</span>
                        <span className="hidden sm:inline">Hover the bottle to see its parts</span>
                      </>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={exportPreview}
                    disabled={exporting}
                    className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60 ${
                      scene === 'table' ? 'bg-white/10 text-white backdrop-blur hover:bg-white/20' : 'bg-white text-ink hover:bg-aqua-50'
                    }`}
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden /> {exporting ? 'Saving…' : 'Save preview'}
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex min-w-0 flex-col border-t border-ink/[0.06] lg:border-l lg:border-t-0">
              {/* Stepper */}
              <ol className="relative grid grid-cols-6 border-b border-ink/[0.06]" aria-label="Customizer steps">
                <div className="pointer-events-none absolute inset-x-[8.33%] top-[31px] h-0.5 bg-ink/[0.06]" aria-hidden>
                  <div
                    className="h-full origin-left bg-gradient-to-r from-aqua-400 to-aqua-600 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)]"
                    style={{ transform: `scaleX(${step / (STEPS.length - 1)})` }}
                  />
                </div>
                {STEPS.map((label, i) => {
                  const done = i < step
                  const current = i === step
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        onClick={() => goTo(i)}
                        aria-current={current ? 'step' : undefined}
                        className={`group relative z-10 flex w-full flex-col items-center gap-1.5 px-1 py-4 text-[11px] font-medium transition sm:text-xs ${
                          current ? 'text-ink' : 'text-ink-muted hover:text-ink'
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-4 ring-white transition-all duration-500 ${
                            current
                              ? 'scale-110 bg-ink text-white shadow-glow'
                              : done
                                ? 'bg-aqua-500 text-white'
                                : 'bg-mist text-ink-muted group-hover:bg-aqua-50'
                          }`}
                        >
                          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className="hidden min-[400px]:block">{label}</span>
                        <span className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition ${current ? 'bg-aqua-500' : 'bg-transparent'}`} />
                      </button>
                    </li>
                  )
                })}
              </ol>

              <div className="flex-1 overflow-hidden p-5 sm:p-8">
                <div key={step} className={dir === 1 ? 'step-in-right' : 'step-in-left'}>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aqua-600">
                  Step {step + 1} of {STEPS.length}
                </p>

                {/* Step 1 — Bottle */}
                {step === 0 && (
                  <StepPanel title="Choose your bottle" text="Pick the size, material and water that suit your tables and service style.">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Bottle size">
                      {SIZES.map((s) => {
                        const selected = design.size === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update('size', s.id)}
                            className={`relative flex flex-col items-center rounded-2xl border p-3 pt-4 transition sm:p-4 ${
                              selected ? 'border-aqua-500 bg-aqua-50/60 ring-4 ring-aqua-100' : 'border-ink/10 hover:border-aqua-300 hover:bg-mist'
                            }`}
                          >
                            {selected && (
                              <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-aqua-500 text-white">
                                <Check className="h-3 w-3" strokeWidth={3} />
                              </span>
                            )}
                            <div className="flex h-28 items-end sm:h-36">
                              <Bottle
                                size={s.id}
                                color={design.color}
                                style={design.style}
                                name={design.name}
                                logo={design.logo}
                                {...capProps}
                                className={s.id === '330' ? 'h-[66%]' : s.id === '500' ? 'h-[78%]' : s.id === '750' ? 'h-[92%]' : 'h-full'}
                                title={`${s.label} bottle`}
                              />
                            </div>
                            <span className="mt-3 font-semibold text-ink">{s.label}</span>
                            <span className="text-[11px] text-ink-muted sm:text-xs">{s.note}</span>
                          </button>
                        )
                      })}
                    </div>

                    <p className="field-label mt-6">Bottle material</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Bottle material">
                      {FINISH_OPTIONS.map((f) => {
                        const selected = design.finish === f.id
                        return (
                          <button
                            key={f.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update('finish', f.id)}
                            className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                              selected ? 'border-aqua-500 bg-aqua-50/60 ring-4 ring-aqua-100' : 'border-ink/10 hover:border-aqua-300 hover:bg-mist'
                            }`}
                          >
                            <span className="flex h-10 w-7 shrink-0 items-end justify-center">
                              <Bottle size="500" finish={f.id} color={design.color} style={design.style} className="h-full" title={`${f.name} bottle`} />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-ink">{f.name}</span>
                              <span className="block text-[11px] leading-tight text-ink-muted">{f.hint}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    <p className="field-label mt-6">Water</p>
                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-mist p-1.5 sm:grid-cols-3" role="radiogroup" aria-label="Water type">
                      {WATER_OPTIONS.map((w) => {
                        const selected = design.water === w.id
                        return (
                          <button
                            key={w.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => update('water', w.id)}
                            className={`flex flex-col items-center rounded-xl px-2 py-2.5 text-center transition ${selected ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink'}`}
                          >
                            {(() => {
                              const Icon = WATER_ICONS[w.icon] ?? Droplet
                              return (
                                <span className={`flex h-8 w-8 items-center justify-center rounded-full transition ${selected ? 'bg-aqua-50 text-aqua-600' : 'bg-white/60 text-ink-muted'}`}>
                                  <Icon className="h-4 w-4" aria-hidden />
                                </span>
                              )
                            })()}
                            <span className="mt-1 text-sm font-semibold leading-tight">{w.name}</span>
                            <span className="text-[11px] leading-tight opacity-70">{w.hint}</span>
                          </button>
                        )
                      })}
                    </div>
                  </StepPanel>
                )}

                {/* Step 2 — Logo */}
                {step === 1 && (
                  <StepPanel title="Upload your logo" text="PNG, JPG, SVG or WEBP up to 5 MB. A transparent PNG or SVG looks best.">
                    {design.logo ? (
                      <div className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-mist p-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-white p-2">
                          <img src={design.logo} alt="Your uploaded logo" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-ink">{logoFile?.name ?? 'Logo uploaded'}</p>
                          <p className="text-sm text-ink-muted">Looking good — it’s on your label.</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => fileInput.current?.click()}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-ink shadow-sm hover:text-aqua-700"
                            >
                              <ImagePlus className="h-4 w-4" /> Replace
                            </button>
                            <button
                              type="button"
                              onClick={removeLogo}
                              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted hover:bg-white hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragging(true)
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
                          dragging ? 'border-aqua-500 bg-aqua-50' : 'border-ink/15 hover:border-aqua-400 hover:bg-mist'
                        }`}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aqua-50 text-aqua-600">
                          <UploadCloud className="h-7 w-7" />
                        </span>
                        <span className="mt-4 font-semibold text-ink">Upload your logo</span>
                        <span className="mt-1 text-sm text-ink-muted">
                          <span className="hidden sm:inline">Drag &amp; drop or </span>
                          <span className="font-medium text-aqua-600">tap to browse</span>
                        </span>
                        <span className="mt-3 text-xs text-ink-muted">PNG · JPG · SVG · WEBP</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
                          className="sr-only"
                          onChange={onInputChange}
                          aria-label="Upload your logo"
                        />
                      </label>
                    )}
                    <input
                      ref={fileInput}
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg,.webp,image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={onInputChange}
                      tabIndex={-1}
                      aria-hidden
                    />
                    {uploadError && (
                      <p className="mt-3 text-sm text-red-600" role="alert">
                        {uploadError}
                      </p>
                    )}
                    {!design.logo && (
                      <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">Or try a sample logo</p>
                        <div className="mt-2.5 flex flex-wrap gap-2.5">
                          {DEMO_LOGOS.map((l) => (
                            <button
                              key={l.id}
                              type="button"
                              onClick={() => useDemoLogo(l.src, l.name)}
                              className="group/logo flex items-center gap-2 rounded-full border border-ink/10 bg-white py-1 pl-1 pr-3 text-sm font-medium text-ink-soft transition hover:-translate-y-0.5 hover:border-aqua-300 hover:text-ink hover:shadow-soft"
                            >
                              <img src={l.src} alt="" className="h-7 w-7 rounded-full transition-transform group-hover/logo:scale-110" />
                              {l.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="mt-4 text-sm text-ink-muted">No logo yet? Skip this step — our designers can create one for your label.</p>
                  </StepPanel>
                )}

                {/* Step 3 — Name */}
                {step === 2 && (
                  <StepPanel title="Add your restaurant name" text="This is the hero of your label. Keep it as it appears on your sign.">
                    <label className="field-label" htmlFor="cz-name">
                      Restaurant Name
                    </label>
                    <input
                      id="cz-name"
                      className="field text-lg"
                      placeholder="e.g. The Harbor Grill"
                      value={design.name}
                      maxLength={32}
                      autoComplete="organization"
                      onChange={(e) => update('name', e.target.value)}
                    />
                    <p className="mt-2 text-right text-xs text-ink-muted">{design.name.length}/32</p>
                  </StepPanel>
                )}

                {/* Step 4 — Color */}
                {step === 3 && (
                  <StepPanel title="Choose your label color" text="Match your brand palette, or pick any color you like.">
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8" role="radiogroup" aria-label="Label color">
                      {LABEL_COLORS.map((c) => {
                        const selected = design.color.toLowerCase() === c.value.toLowerCase()
                        return (
                          <button
                            key={c.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-label={c.name}
                            title={c.name}
                            onClick={() => update('color', c.value)}
                            className={`relative aspect-square rounded-full transition hover:scale-105 ${selected ? 'ring-2 ring-ink ring-offset-2' : 'ring-1 ring-ink/10'}`}
                            style={{ background: c.value }}
                          >
                            {selected && <Check className="absolute inset-0 m-auto h-4 w-4 text-white" strokeWidth={3} />}
                          </button>
                        )
                      })}
                    </div>

                    <label className="mt-5 flex items-center gap-3 rounded-2xl border border-ink/10 p-3 hover:border-aqua-300">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10" style={{ background: design.color }}>
                        <input
                          type="color"
                          value={design.color}
                          onChange={(e) => update('color', e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Custom label color"
                        />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-ink">Custom color</span>
                        <span className="block font-mono text-xs uppercase text-ink-muted">{design.color}</span>
                      </span>
                      <span className="text-sm font-medium text-aqua-600">Pick</span>
                    </label>

                    <p className="field-label mt-6">Label style</p>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Label style">
                      {STYLES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          role="radio"
                          aria-checked={design.style === s.id}
                          onClick={() => update('style', s.id)}
                          className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                            design.style === s.id ? 'border-ink bg-ink text-white' : 'border-ink/10 text-ink-soft hover:border-aqua-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>

                    <p className="field-label mt-6">Cap finish</p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8" role="radiogroup" aria-label="Cap finish">
                      {CAP_OPTIONS.map((c) => {
                        const selected = design.cap === c.id
                        const swatch = c.color ?? design.color
                        return (
                          <button
                            key={c.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            aria-label={c.name}
                            title={c.name}
                            onClick={() => update('cap', c.id)}
                            className={`group/cap flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition hover:bg-mist ${selected ? 'bg-mist' : ''}`}
                          >
                            <span
                              className={`relative h-9 w-9 rounded-full transition group-hover/cap:scale-105 ${selected ? 'ring-2 ring-ink ring-offset-2' : 'ring-1 ring-ink/10'}`}
                              style={{
                                background: c.metallic
                                  ? `linear-gradient(135deg, ${swatch} 0%, #ffffff 38%, ${swatch} 55%, #0B1A2A33 100%)`
                                  : c.id === 'match'
                                    ? `conic-gradient(from 200deg, ${design.color}, ${design.color} 60%, #ffffff 60%, #ffffff 100%)`
                                    : swatch,
                              }}
                            >
                              {selected && <Check className={`absolute inset-0 m-auto h-4 w-4 ${c.id === 'white' || c.metallic ? 'text-ink' : 'text-white'}`} strokeWidth={3} />}
                            </span>
                            <span className="text-[10px] leading-tight text-ink-muted">{c.id === 'match' ? 'Match' : c.name.split(' ').pop()!.replace(/^./, (ch) => ch.toUpperCase())}</span>
                          </button>
                        )
                      })}
                    </div>

                    <label
                      className={`mt-3 flex items-center gap-3 rounded-2xl border p-3 transition hover:border-aqua-300 ${
                        design.cap === 'custom' ? 'border-aqua-500 bg-aqua-50/60 ring-4 ring-aqua-100' : 'border-ink/10'
                      }`}
                    >
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-ink/10" style={{ background: design.capCustom }}>
                        <input
                          type="color"
                          value={design.capCustom}
                          onChange={(e) => setDesign((d) => ({ ...d, capCustom: e.target.value, cap: 'custom' }))}
                          onClick={() => update('cap', 'custom')}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                          aria-label="Custom cap color"
                        />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-medium text-ink">Custom cap color</span>
                        <span className="block font-mono text-xs uppercase text-ink-muted">{design.capCustom}</span>
                      </span>
                      <span className="text-sm font-medium text-aqua-600">{design.cap === 'custom' ? 'Selected' : 'Pick'}</span>
                    </label>
                  </StepPanel>
                )}

                {/* Step 5 — Text */}
                {step === 4 && (
                  <StepPanel title="Add your details" text="All optional. Add the details you want guests to remember.">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextField id="cz-tag" label="Tagline" placeholder="e.g. Seafood & Steak" value={design.tagline} max={28} onChange={(v) => update('tagline', v)} className="sm:col-span-2" />
                      <TextField id="cz-web" label="Website" placeholder="harborgrill.com" value={design.website} max={30} onChange={(v) => update('website', v)} inputMode="url" />
                      <TextField id="cz-phone" label="Phone number" placeholder="(555) 010-2030" value={design.phone} max={20} onChange={(v) => update('phone', v)} inputMode="tel" />
                      <TextField
                        id="cz-ig"
                        label="Instagram handle"
                        placeholder="@theharborgrill"
                        value={design.instagram}
                        max={30}
                        onChange={(v) => update('instagram', v)}
                        className="sm:col-span-2"
                      />
                    </div>
                  </StepPanel>
                )}

                {/* Step 6 — Preview */}
                {step === 5 && (
                  <StepPanel title="Your bottle is ready to quote" text="Happy with the look? Send it to our team and we’ll prepare a print-ready proof and price.">
                    <dl className="divide-y divide-ink/[0.06] rounded-2xl border border-ink/10 text-sm">
                      <SummaryRow
                        label="Bottle"
                        value={`${design.size === '1000' ? '1 Litre' : `${design.size}ml`} · ${FINISH_OPTIONS.find((f) => f.id === design.finish)!.name} · ${WATER_OPTIONS.find((w) => w.id === design.water)!.name}`}
                        onEdit={() => goTo(0)}
                      />
                      <SummaryRow label="Logo" value={logoFile?.name ?? (design.logo ? 'Uploaded' : 'Not added — we can design one')} onEdit={() => goTo(1)} />
                      <SummaryRow label="Name" value={design.name || 'Not added'} onEdit={() => goTo(2)} />
                      <SummaryRow
                        label="Color"
                        value={
                          <span className="inline-flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full ring-1 ring-ink/10" style={{ background: design.color }} />
                            {STYLES.find((s) => s.id === design.style)!.label} · <span className="font-mono uppercase">{design.color}</span>
                          </span>
                        }
                        onEdit={() => goTo(3)}
                      />
                      <SummaryRow
                        label="Cap"
                        value={
                          design.cap === 'custom' ? (
                            <span className="inline-flex items-center gap-2">
                              <span className="h-4 w-4 rounded-full ring-1 ring-ink/10" style={{ background: design.capCustom }} />
                              Custom · <span className="font-mono uppercase">{design.capCustom}</span>
                            </span>
                          ) : (
                            capOpt.name
                          )
                        }
                        onEdit={() => goTo(3)}
                      />
                      <SummaryRow label="Details" value={[design.tagline, ...details].filter(Boolean).join(' · ') || 'None'} onEdit={() => goTo(4)} />
                    </dl>
                  </StepPanel>
                )}
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex items-center justify-between gap-3 border-t border-ink/[0.06] p-4 sm:px-8 sm:py-5">
                {step > 0 ? (
                  <Button variant="ghost" size="sm" onClick={() => goTo(step - 1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={reset} aria-label="Reset design">
                    <RotateCcw className="h-4 w-4" /> Reset
                  </Button>
                )}
                {isLast ? (
                  <Button onClick={requestQuote}>
                    Request Quote <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    {step > 0 && (
                      <button type="button" onClick={requestQuote} className="hidden px-3 text-sm font-medium text-ink-soft hover:text-aqua-700 sm:block">
                        Request Quote
                      </button>
                    )}
                    <Button onClick={() => goTo(step + 1)}>
                      {step === 4 ? 'Preview' : 'Continue'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function StepPanel({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="h-display mt-2 text-3xl sm:text-[2.1rem]">{title}</h3>
      <p className="mt-2 text-ink-soft">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

function TextField({
  id,
  label,
  placeholder,
  value,
  onChange,
  max,
  className = '',
  inputMode,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  max: number
  className?: string
  inputMode?: 'url' | 'tel' | 'text'
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="field" placeholder={placeholder} value={value} maxLength={max} inputMode={inputMode} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function SummaryRow({ label, value, onEdit }: { label: string; value: React.ReactNode; onEdit: () => void }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <dt className="w-16 shrink-0 text-ink-muted">{label}</dt>
      <dd className="min-w-0 flex-1 truncate font-medium text-ink">{value}</dd>
      <button type="button" onClick={onEdit} className="shrink-0 text-sm font-medium text-aqua-600 hover:text-aqua-800">
        Edit
      </button>
    </div>
  )
}
