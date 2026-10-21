import { forwardRef, useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react'
import { ArrowRight, Check, Clock, Droplets, FileImage, Loader2, Mail, MapPin, Phone, Sparkles, UploadCloud, X } from 'lucide-react'
import { BRAND, CAP_OPTIONS } from '../data/content'
import { useQuote } from '../context/QuoteContext'
import { useObjectUrl } from '../hooks/useObjectUrl'
import { submitQuote } from '../lib/api'
import type { BottleSize, QuoteRequest } from '../lib/types'
import { Bottle } from './Bottle'
import { Button } from './ui/Button'
import { GlowCard } from './ui/GlowCard'
import { Reveal } from './ui/Reveal'

type Fields = Omit<QuoteRequest, 'logo' | 'design'>
type Errors = Partial<Record<keyof Fields | 'logo', string>>

const EMPTY: Fields = { name: '', business: '', email: '', phone: '', size: '', quantity: '', location: '', requirements: '' }

const SIZE_OPTIONS: { value: BottleSize; label: string }[] = [
  { value: '330', label: '330ml' },
  { value: '500', label: '500ml' },
  { value: '750', label: '750ml' },
  { value: '1000', label: '1 Litre' },
]

const QTY_OPTIONS = [
  { value: '500', label: '500' },
  { value: '1000', label: '1,000' },
  { value: '2500', label: '2,500' },
  { value: '5000', label: '5,000' },
  { value: '10000', label: '10,000+' },
  { value: 'unsure', label: 'Not sure' },
]

const REQUIRED: (keyof Fields)[] = ['name', 'business', 'email', 'size', 'quantity', 'location']
const MAX_LOGO = 10 * 1024 * 1024
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Please enter your name.'
  if (!f.business.trim()) e.business = 'Please enter your restaurant or business name.'
  if (!f.email.trim()) e.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Please enter a valid email address.'
  if (f.phone.trim() && f.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number.'
  if (!f.size) e.size = 'Please choose a bottle size.'
  if (!f.quantity) e.quantity = 'Please choose a quantity.'
  if (!f.location.trim()) e.location = 'Please enter a delivery city or ZIP code.'
  return e
}

export function QuoteForm() {
  const { prefill } = useQuote()
  const [fields, setFields] = useState<Fields>(EMPTY)
  const [logo, setLogo] = useState<File | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [reference, setReference] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const logoUrl = useObjectUrl(logo)

  // Apply values coming from the customizer, product cards or calculator
  useEffect(() => {
    setFields((f) => ({
      ...f,
      size: prefill.size ?? f.size,
      quantity: prefill.quantity ?? f.quantity,
      business: prefill.business ?? f.business,
      requirements: prefill.note && !f.requirements.includes(prefill.note) ? (f.requirements ? `${f.requirements}\n${prefill.note}` : prefill.note) : f.requirements,
    }))
    if (prefill.logoFile) setLogo(prefill.logoFile)
    if (prefill.size || prefill.quantity) setStatus((s) => (s === 'success' ? 'idle' : s))
  }, [prefill])

  const liveErrors = useMemo(() => validate(fields), [fields])
  const completed = REQUIRED.filter((k) => fields[k].trim() && !liveErrors[k])
  const progress = completed.length / REQUIRED.length
  const ready = progress === 1
  const isValid = (k: keyof Fields) => Boolean(fields[k].trim()) && !liveErrors[k]

  const set = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setFields((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }
  const choose = (key: 'size' | 'quantity', value: string) => {
    setFields((f) => ({ ...f, [key]: value }))
    setTouched((t) => ({ ...t, [key]: true }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }
  const blur = (key: keyof Fields) => () => setTouched((t) => ({ ...t, [key]: true }))

  const acceptFile = (file: File | undefined) => {
    if (!file) return
    if (file.size > MAX_LOGO) {
      setErrors((er) => ({ ...er, logo: 'Please upload a file smaller than 10 MB.' }))
      return
    }
    setErrors((er) => ({ ...er, logo: undefined }))
    setLogo(file)
  }
  const onLogo = (e: ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0])
    e.target.value = ''
  }
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setDragging(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(fields)
    setErrors(errs)
    setTouched(Object.fromEntries(REQUIRED.map((k) => [k, true])))
    const first = Object.keys(errs)[0]
    if (first) {
      const target = formRef.current?.querySelector<HTMLElement>(`[name="${first}"], [data-field="${first}"] button`)
      target?.focus()
      return
    }
    setStatus('submitting')
    try {
      const res = await submitQuote({ ...fields, logo, design: prefill.design })
      setReference(res.reference)
      setStatus('success')
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('error')
    }
  }

  const startOver = () => {
    setFields(EMPTY)
    setLogo(null)
    setErrors({})
    setTouched({})
    setStatus('idle')
  }

  const design = prefill.design
  const shownError = (k: keyof Fields) => errors[k] ?? (touched[k] ? liveErrors[k] : undefined)

  return (
    <section id="quote" aria-labelledby="quote-title" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="orb absolute -left-40 top-20 h-[480px] w-[480px] rounded-full bg-aqua-100/70 blur-3xl" />
        <div className="orb-slow absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-sand blur-3xl" />
      </div>

      <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        {/* Intro / contact */}
        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-aqua-500" aria-hidden />
              Request a Quote
            </span>
            <h2 id="quote-title" className="h-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.5rem]">
              Let’s create your <span className="italic text-aqua-600">custom bottle</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Tell us about your restaurant and your order. We’ll reply within one business day with pricing and next steps — no obligation.
            </p>
          </Reveal>

          {design && (
            <Reveal className="mt-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-aqua-200 via-aqua-100 to-white p-px shadow-soft">
                <div className="flex items-center gap-5 rounded-[23px] bg-white/80 p-5 backdrop-blur">
                  <div className="animate-float-slow shrink-0">
                    <Bottle
                      size={design.size}
                      color={design.color}
                      style={design.style}
                      name={design.name}
                      logo={design.logo}
                      tagline={design.tagline}
                      finish={design.finish}
                      water={design.water}
                      capColor={design.cap === 'custom' ? design.capCustom : (CAP_OPTIONS.find((c) => c.id === design.cap)?.color ?? undefined)}
                      capMetallic={design.cap === 'custom' ? false : CAP_OPTIONS.find((c) => c.id === design.cap)?.metallic}
                      className="h-32 drop-shadow-xl"
                      title="Your customized bottle design"
                    />
                  </div>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-aqua-700">
                      <Sparkles className="h-4 w-4" aria-hidden /> Your design is attached
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {design.size === '1000' ? '1 Litre' : `${design.size}ml`}
                      {design.name ? ` · ${design.name}` : ''}. Our designers will turn it into a print-ready proof.
                    </p>
                    <a href="#customizer" className="link-underline mt-2 inline-block text-sm font-medium text-aqua-600 hover:text-aqua-800">
                      Edit design →
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          <Reveal className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-muted">What happens next</h3>
            <ol className="relative mt-5 space-y-5">
              <div className="absolute bottom-4 left-4 top-4 w-px bg-gradient-to-b from-ink via-aqua-300 to-transparent" aria-hidden />
              {['We review your requirements and branding', 'You receive a detailed quote within 24 hours', 'Approve your free label proof, then we produce'].map((t, i) => (
                <li key={t} className="relative flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white ring-4 ring-white">{i + 1}</span>
                  <span className="text-ink-soft">{t}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <ContactItem icon={Mail} label="Email us" value={BRAND.email} href={`mailto:${BRAND.email}`} />
            <ContactItem icon={Phone} label="Call us" value={BRAND.phone} href={BRAND.phoneHref} />
            <ContactItem icon={MapPin} label="Visit" value="Oakland, California" />
            <ContactItem icon={Clock} label="Hours" value={BRAND.hours} />
          </Reveal>
        </div>

        {/* Form */}
        <Reveal>
          <GlowCard className="card relative overflow-hidden">
            {status === 'success' ? (
              <SuccessState ref={successRef} email={fields.email} reference={reference} onReset={startOver} />
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                {/* Progress header */}
                <div className="border-b border-ink/[0.06] px-6 py-5 sm:px-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-2xl text-ink">Your quote request</p>
                      <p className="mt-0.5 text-sm text-ink-muted" aria-live="polite">
                        {ready ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-aqua-700">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Ready to send
                          </span>
                        ) : (
                          <>
                            {completed.length} of {REQUIRED.length} required fields
                          </>
                        )}
                      </p>
                    </div>
                    <span className="font-display text-3xl tabular-nums text-ink/70">{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-mist">
                    <div
                      className={`h-full origin-left rounded-full bg-gradient-to-r from-aqua-400 to-aqua-600 transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${ready ? 'shadow-glow' : ''}`}
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </div>
                </div>

                <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-10">
                  <Field label="Name" error={shownError('name')} valid={isValid('name')} htmlFor="q-name" required>
                    <input id="q-name" name="name" className="field" autoComplete="name" value={fields.name} onChange={set('name')} onBlur={blur('name')} placeholder="Jane Cooper" />
                  </Field>
                  <Field label="Restaurant / Business Name" error={shownError('business')} valid={isValid('business')} htmlFor="q-business" required>
                    <input id="q-business" name="business" className="field" autoComplete="organization" value={fields.business} onChange={set('business')} onBlur={blur('business')} placeholder="The Harbor Grill" />
                  </Field>
                  <Field label="Email" error={shownError('email')} valid={isValid('email')} htmlFor="q-email" required>
                    <input id="q-email" name="email" type="email" inputMode="email" className="field" autoComplete="email" value={fields.email} onChange={set('email')} onBlur={blur('email')} placeholder="jane@harborgrill.com" />
                  </Field>
                  <Field label="Phone" error={shownError('phone')} valid={Boolean(fields.phone.trim()) && !liveErrors.phone} htmlFor="q-phone">
                    <input id="q-phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" value={fields.phone} onChange={set('phone')} onBlur={blur('phone')} placeholder="(555) 010-2030" />
                  </Field>

                  <Choice label="Bottle Size" error={shownError('size')} name="size" required className="sm:col-span-2">
                    {SIZE_OPTIONS.map((o) => (
                      <Pill key={o.value} selected={fields.size === o.value} onClick={() => choose('size', o.value)}>
                        {o.label}
                      </Pill>
                    ))}
                  </Choice>
                  <Choice label="Quantity" error={shownError('quantity')} name="quantity" required className="sm:col-span-2" hint="Minimum 500 bottles per design">
                    {QTY_OPTIONS.map((o) => (
                      <Pill key={o.value} selected={fields.quantity === o.value} onClick={() => choose('quantity', o.value)}>
                        {o.label}
                      </Pill>
                    ))}
                  </Choice>

                  <Field label="Delivery Location" error={shownError('location')} valid={isValid('location')} htmlFor="q-location" required className="sm:col-span-2">
                    <input id="q-location" name="location" className="field" autoComplete="address-level2" value={fields.location} onChange={set('location')} onBlur={blur('location')} placeholder="City, state or ZIP code" />
                  </Field>

                  <div className="sm:col-span-2">
                    <span className="field-label">Upload Logo</span>
                    {logo ? (
                      <div className="tick-in flex items-center gap-3 rounded-xl border border-aqua-200 bg-aqua-50/50 p-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-white">
                          {logoUrl && logo.type.startsWith('image/') ? (
                            <img src={logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                          ) : (
                            <FileImage className="h-5 w-5 text-ink-muted" aria-hidden />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">{logo.name}</span>
                          <span className="block text-xs text-ink-muted">{logo.size ? `${(logo.size / 1024).toFixed(0)} KB` : 'Attached from the customizer'}</span>
                        </span>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-aqua-500 text-white">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                        </span>
                        <button type="button" onClick={() => setLogo(null)} className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-white hover:text-red-600" aria-label="Remove logo">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        onDragOver={(e) => {
                          e.preventDefault()
                          setDragging(true)
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                        className={`group/drop flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition ${
                          dragging ? 'border-aqua-500 bg-aqua-50' : 'border-ink/15 hover:border-aqua-400 hover:bg-mist'
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600 transition-transform group-hover/drop:-translate-y-0.5 group-hover/drop:scale-105">
                          <UploadCloud className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="text-sm">
                          <span className="block font-medium text-ink">
                            <span className="hidden sm:inline">Drag &amp; drop or </span>choose a file
                          </span>
                          <span className="block text-ink-muted">PNG, JPG, SVG or PDF · up to 10 MB · optional</span>
                        </span>
                        <input type="file" name="logo" accept=".png,.jpg,.jpeg,.svg,.pdf,.webp,image/*,application/pdf" className="sr-only" onChange={onLogo} />
                      </label>
                    )}
                    {errors.logo && <p className="mt-1.5 text-sm text-red-600">{errors.logo}</p>}
                  </div>

                  <Field label="Additional Requirements" htmlFor="q-req" className="sm:col-span-2">
                    <textarea
                      id="q-req"
                      name="requirements"
                      rows={4}
                      className="field resize-y"
                      value={fields.requirements}
                      onChange={set('requirements')}
                      placeholder="Event date, label ideas, QR code link, delivery timing…"
                    />
                  </Field>

                  {status === 'error' && (
                    <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 sm:col-span-2" role="alert">
                      Something went wrong sending your request. Please try again, or email us at {BRAND.email}.
                    </p>
                  )}

                  <div className="flex flex-col gap-4 pt-1 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-ink-muted">We’ll never share your details. No spam, ever.</p>
                    <Button type="submit" size="lg" disabled={status === 'submitting'} className={`w-full sm:w-auto ${ready ? 'shadow-glow' : ''}`}>
                      {status === 'submitting' ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> Sending…
                        </>
                      ) : (
                        <>
                          Request My Quote <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </GlowCard>
        </Reveal>
      </div>
    </section>
  )
}


const SuccessState = forwardRef<HTMLDivElement, { email: string; reference: string; onReset: () => void }>(function SuccessState({ email, reference, onReset }, ref) {
  return (
    <div ref={ref} tabIndex={-1} className="relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden p-8 text-center outline-none" role="status" aria-live="polite">
      {/* Floating droplets */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <Droplets
            key={i}
            className="drop-float absolute text-aqua-300"
            style={{ left: `${10 + i * 10}%`, bottom: `${20 + (i % 3) * 12}%`, width: 14 + (i % 3) * 6, animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>

      <span className="ring-pop relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-aqua-400 to-aqua-600 shadow-glow">
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 25l8 8 16-18" className="draw-check" />
        </svg>
      </span>
      <h3 className="h-display mt-8 text-4xl sm:text-5xl">Thank you!</h3>
      <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">We’ve received your request. Our team will review your requirements and contact you shortly.</p>
      {reference && (
        <p className="mt-5 rounded-full bg-mist px-4 py-2 text-sm text-ink-soft">
          Reference: <span className="font-mono font-semibold text-ink">{reference}</span>
        </p>
      )}
      <p className="mt-5 text-sm text-ink-muted">
        A confirmation will be sent to <span className="font-medium text-ink">{email}</span>.
      </p>

      <ol className="mt-8 grid w-full max-w-md gap-2 text-left text-sm">
        {[
          ['Today', 'We review your branding and requirements'],
          ['Within 24h', 'Your detailed quote lands in your inbox'],
          ['Within 48h', 'Free label proof ready for your approval'],
        ].map(([when, what], i) => (
          <li key={when} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3" style={{ ['--reveal-delay' as string]: `${i * 120}ms` }}>
            <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-aqua-700">{when}</span>
            <span className="text-ink-soft">{what}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href="#customizer" className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow">
          Design another bottle <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <Button variant="secondary" onClick={onReset}>
          Submit another request
        </Button>
      </div>
    </div>
  )
})

function Field({
  label,
  htmlFor,
  error,
  valid,
  required,
  className = '',
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  valid?: boolean
  required?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`${className} ${error ? '[&_.field]:border-red-400 [&_.field]:ring-red-100' : valid ? '[&_.field]:border-aqua-300' : ''}`}>
      <label htmlFor={htmlFor} className="field-label relative pr-6">
        <span>
          {label}
          {required && <span className="text-aqua-600"> *</span>}
        </span>
        {valid && !error && (
          <span className="tick-in absolute right-0 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aqua-500 text-white" aria-label="Looks good">
            <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-red-600" id={`${htmlFor}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

function Choice({
  label,
  name,
  error,
  required,
  hint,
  className = '',
  children,
}: {
  label: string
  name: string
  error?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <fieldset className={className} data-field={name}>
      <legend className="field-label flex w-full items-center justify-between">
        <span>
          {label}
          {required && <span className="text-aqua-600"> *</span>}
        </span>
        {hint && <span className="text-xs font-normal text-ink-muted">{hint}</span>}
      </legend>
      <div className={`flex flex-wrap gap-2 ${error ? 'rounded-xl ring-2 ring-red-200 ring-offset-4' : ''}`}>{children}</div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </fieldset>
  )
}

function Pill({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-all duration-300 ${
        selected ? 'border-ink bg-ink text-white shadow-[0_8px_20px_-10px_rgba(11,26,42,0.6)]' : 'border-ink/10 bg-white text-ink-soft hover:-translate-y-0.5 hover:border-aqua-300 hover:text-ink'
      }`}
    >
      {selected && <Check className="tick-in h-3.5 w-3.5" strokeWidth={3} aria-hidden />}
      {children}
    </button>
  )
}

function ContactItem({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-aqua-600 shadow-soft transition-transform duration-300 group-hover/contact:-translate-y-0.5 group-hover/contact:bg-ink group-hover/contact:text-white">
        <Icon className="h-[18px] w-[18px]" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-ink-muted">{label}</span>
        <span className="block break-words text-sm font-medium text-ink">{value}</span>
      </span>
    </>
  )
  return href ? (
    <a href={href} className="group/contact flex items-center gap-3 rounded-2xl p-2 transition hover:bg-mist">
      {content}
    </a>
  ) : (
    <div className="flex items-center gap-3 p-2">{content}</div>
  )
}
