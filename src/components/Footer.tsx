import { useState, type FormEvent } from 'react'
import { ArrowRight, ArrowUp, Check, FileText, Leaf, Mail, MapPin, Package, Palette, Phone, ShieldCheck, Truck } from 'lucide-react'
import { BRAND } from '../data/content'
import { Bottle } from './Bottle'
import { Logo } from './Logo'

const LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Custom Bottles', href: '#customizer' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About Us', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#quote' },
]

const SOLUTIONS = ['Restaurants', 'Cafés', 'Hotels', 'Weddings', 'Corporate Events', 'Catering', 'Conferences']

const RESOURCES = [
  { icon: FileText, label: 'Label spec sheet', hint: 'Sizes, bleed & file formats', href: '#faq' },
  { icon: Package, label: 'Order a sample pack', hint: 'Credited against your first order', href: '#quote' },
  { icon: Palette, label: 'Label style guide', hint: 'Classic, minimal, full-color', href: '#customizer' },
  { icon: Leaf, label: 'Sustainability', hint: 'rPET, glass & aluminum', href: '#about' },
]

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/',
    path: 'M13.5 21.9v-8.2h2.8l.4-3.2h-3.2V8.4c0-.9.3-1.6 1.6-1.6h1.7V4a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8v8.2a10 10 0 1 1 3.4 0z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/',
    path: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zm1.8 13.1H3.6V9h3.5v11.5z',
  },
  {
    label: 'Pinterest',
    href: 'https://www.pinterest.com/',
    path: 'M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.6 1.3 1.4 0 .9-.5 2.1-.8 3.3-.2 1 .5 1.8 1.5 1.8 1.8 0 3.1-1.9 3.1-4.6 0-2.4-1.7-4.1-4.2-4.1-2.9 0-4.5 2.1-4.5 4.4 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.2.2-.4.1-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2.1-.6-2.4-1.2l-.7 2.5c-.2.9-.9 2.1-1.3 2.8A10 10 0 1 0 12 2z',
  },
]

const BADGES = [
  { icon: ShieldCheck, text: 'Certified bottling facility' },
  { icon: Leaf, text: 'rPET & reusable glass' },
  { icon: Truck, text: 'Nationwide delivery' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const subscribe = (e: FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return
    setDone(true)
  }

  return (
    <footer className="grain relative overflow-hidden bg-ink text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-aqua-400/70 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-aqua-600/20 blur-3xl orb" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-aqua-400/10 blur-3xl orb-slow" aria-hidden />

      <div className="container-x relative">
        {/* Newsletter strip */}
        <div className="grid items-center gap-8 border-b border-white/10 py-14 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex items-center gap-6">
            <div className="hidden h-28 items-end gap-2 sm:flex" aria-hidden>
              <Bottle size="330" color="#B8935A" style="wrap" name="Golden Hour" className="h-[70%] drop-shadow-2xl" />
              <div className="animate-float-slow">
                <Bottle size="500" color="#559CDF" style="classic" name="Yours" className="h-24 drop-shadow-2xl" />
              </div>
              <Bottle size="750" color="#FFFFFF" style="minimal" name="Blanc" className="h-full drop-shadow-2xl" />
            </div>
            <div>
              <p className="font-display text-3xl leading-tight sm:text-4xl">Label ideas, pricing updates and seasonal finishes.</p>
              <p className="mt-2 text-white/60">One short email a month. No spam, unsubscribe any time.</p>
            </div>
          </div>
          {done ? (
            <p className="tick-in flex items-center gap-3 rounded-2xl border border-aqua-400/30 bg-aqua-500/10 px-5 py-4 text-sm text-white" role="status">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-aqua-500 text-white">
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
              </span>
              You’re on the list. Watch your inbox for the first issue.
            </p>
          ) : (
            <form onSubmit={subscribe} className="flex flex-col gap-3 sm:flex-row" noValidate>
              <label className="relative flex-1">
                <span className="sr-only">Email address</span>
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" aria-hidden />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@restaurant.com"
                  className="h-12 w-full rounded-full border border-white/15 bg-white/5 pl-11 pr-4 text-[15px] text-white placeholder:text-white/40 transition focus:border-aqua-400 focus:outline-none focus:ring-4 focus:ring-aqua-500/20"
                />
              </label>
              <button
                type="submit"
                className="btn-shine inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-aqua-50"
              >
                Subscribe <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          )}
        </div>

        {/* Main columns */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr_1.1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs leading-relaxed text-white/60">{BRAND.description}</p>
            <ul className="mt-6 space-y-2.5">
              {BADGES.map((b) => (
                <li key={b.text} className="flex items-center gap-2.5 text-sm text-white/70">
                  <b.icon className="h-4 w-4 text-aqua-300" aria-hidden />
                  {b.text}
                </li>
              ))}
            </ul>
            <ul className="mt-7 flex gap-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Pourmark on ${s.label}`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-aqua-400 hover:bg-aqua-500/10 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/40">Company</h3>
            <ul className="mt-5 space-y-3">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="link-underline text-white/75 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/40">Solutions</h3>
            <ul className="mt-5 space-y-3">
              {SOLUTIONS.map((s) => (
                <li key={s}>
                  <a href="#quote" className="link-underline text-white/75 transition hover:text-white">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/40">Resources</h3>
            <ul className="mt-5 space-y-2">
              {RESOURCES.map((r) => (
                <li key={r.label}>
                  <a href={r.href} className="group flex items-start gap-3 rounded-xl p-2 -ml-2 transition hover:bg-white/[0.06]">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-aqua-300 transition group-hover:bg-aqua-500 group-hover:text-white">
                      <r.icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-medium text-white/85 group-hover:text-white">{r.label}</span>
                      <span className="block text-xs text-white/45">{r.hint}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/40">Contact</h3>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Replying today · avg. 2h
            </p>
            <address className="mt-4 space-y-3 not-italic">
              <a href={`mailto:${BRAND.email}`} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-aqua-400/40 hover:bg-white/[0.07]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aqua-500/15 text-aqua-300">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs text-white/50">Email</span>
                  <span className="block text-sm font-medium text-white">{BRAND.email}</span>
                </span>
              </a>
              <a href={BRAND.phoneHref} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 transition hover:border-aqua-400/40 hover:bg-white/[0.07]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-aqua-500/15 text-aqua-300">
                  <Phone className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-xs text-white/50">Call · {BRAND.hours}</span>
                  <span className="block text-sm font-medium text-white">{BRAND.phone}</span>
                </span>
              </a>
              <p className="flex items-start gap-3 px-3 pt-1 text-sm text-white/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300" aria-hidden /> {BRAND.address}
              </p>
            </address>
            <a href="#quote" className="btn-shine mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:bg-aqua-50">
              Get a Quote <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>

      {/* Ghost wordmark */}
      <div className="pointer-events-none relative select-none overflow-hidden" aria-hidden>
        <p className="container-x -mb-[0.26em] font-display text-[20vw] leading-none tracking-tight text-white/[0.04] lg:text-[13rem]">Pourmark</p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Pourmark Water Co. · Made with <span className="text-aqua-300">♥</span> in Oakland, California
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a href="#" className="link-underline hover:text-white">
              Privacy
            </a>
            <a href="#" className="link-underline hover:text-white">
              Terms
            </a>
            <a href="#" className="link-underline hover:text-white">
              Accessibility
            </a>
            <a
              href="#home"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:-translate-y-0.5 hover:border-aqua-400 hover:text-white"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
