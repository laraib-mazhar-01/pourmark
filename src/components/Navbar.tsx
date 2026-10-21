import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Mail, Menu, Phone, Sparkles, X } from 'lucide-react'
import { BRAND, NAV_LINKS, PRODUCTS } from '../data/content'
import { useQuote } from '../context/QuoteContext'
import { Bottle } from './Bottle'
import { ButtonLink } from './ui/Button'
import { Logo } from './Logo'

export function Navbar() {
  const { startDesign } = useQuote()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('#home')
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const closeTimer = useRef(0)

  // Glass on scroll + hide when scrolling down, reveal when scrolling up
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 12)
      if (!open) setHidden(y > 160 && y > last + 4)
      if (y < last - 4 || y < 160) setHidden(false)
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [open])

  // Highlight the section currently in view
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Sliding pill follows the active link
  useLayoutEffect(() => {
    const el = linkRefs.current[active]
    const list = listRef.current
    if (!el || !list) return
    const measure = () => {
      const a = el.getBoundingClientRect()
      const b = list.getBoundingClientRect()
      setPill({ left: a.left - b.left, width: a.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [active, scrolled])

  // Lock scroll while mobile menu is open; Esc closes menus
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setMenu(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const openMenu = () => {
    window.clearTimeout(closeTimer.current)
    setMenu(true)
  }
  const closeMenu = () => {
    closeTimer.current = window.setTimeout(() => setMenu(false), 140)
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${hidden && !open && !menu ? '-translate-y-full' : 'translate-y-0'} ${
          open
            ? 'border-b border-ink/[0.06] bg-white shadow-lift'
            : scrolled
              ? 'border-b border-ink/[0.06] bg-white/70 shadow-[0_8px_30px_-12px_rgba(11,26,42,0.12)] backdrop-blur-2xl backdrop-saturate-150'
              : 'bg-transparent'
        }`}
      >
        <nav className={`container-x flex items-center justify-between transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`} aria-label="Primary">
          <a href="#home" className="shrink-0" aria-label="Pourmark home" onClick={() => setOpen(false)}>
            <Logo />
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
            {pill && (
              <span
                className="pointer-events-none absolute top-1/2 h-9 -translate-y-1/2 rounded-full bg-ink/[0.06] transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
                style={{ left: pill.left, width: pill.width }}
                aria-hidden
              />
            )}
            {NAV_LINKS.map((l) => {
              const isProducts = l.href === '#products'
              return (
                <li key={l.href} className="relative" onMouseEnter={isProducts ? openMenu : undefined} onMouseLeave={isProducts ? closeMenu : undefined}>
                  <a
                    ref={(el) => {
                      linkRefs.current[l.href] = el
                    }}
                    href={l.href}
                    aria-haspopup={isProducts ? 'true' : undefined}
                    aria-expanded={isProducts ? menu : undefined}
                    onFocus={isProducts ? openMenu : undefined}
                    className={`relative z-10 inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${
                      active === l.href ? 'text-ink' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {l.label}
                    {isProducts && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${menu ? 'rotate-180' : ''}`} aria-hidden />}
                  </a>

                  {/* Products dropdown */}
                  {isProducts && (
                    <div
                      className={`absolute left-1/2 top-full z-20 w-[560px] -translate-x-1/2 pt-3 transition-all duration-300 ${
                        menu ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
                      }`}
                      onMouseEnter={openMenu}
                      onMouseLeave={closeMenu}
                    >
                      <div className="overflow-hidden rounded-3xl border border-ink/[0.06] bg-white p-3 shadow-lift">
                        <div className="grid grid-cols-4 gap-2">
                          {PRODUCTS.map((p) => (
                            <button
                              key={p.size}
                              type="button"
                              onClick={() => {
                                setMenu(false)
                                startDesign({ size: p.size, color: p.color, style: p.style })
                              }}
                              className="group/item flex flex-col items-center rounded-2xl p-3 text-center transition hover:bg-mist"
                            >
                              <span className="flex h-20 items-end">
                                <Bottle size={p.size} color={p.color} style={p.style} name={p.sample} className={`${p.size === '330' ? 'h-[66%]' : p.size === '500' ? 'h-[80%]' : p.size === '750' ? 'h-[92%]' : 'h-full'} drop-shadow-md transition-transform duration-500 group-hover/item:-translate-y-1`} title={p.name} />
                              </span>
                              <span className="mt-2 text-sm font-semibold text-ink">{p.size === '1000' ? '1 Litre' : `${p.size}ml`}</span>
                              <span className="text-[11px] text-ink-muted">{p.perfectFor[0]}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-white">
                          <span className="flex items-center gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-aqua-300" aria-hidden /> 8 materials · 6 waters · any label color
                          </span>
                          <a href="#customizer" onClick={() => setMenu(false)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-200 hover:text-white">
                            Open customizer <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a href={BRAND.phoneHref} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink xl:inline-flex">
              <Phone className="h-4 w-4 text-aqua-600" aria-hidden /> {BRAND.phone}
            </a>
            <ButtonLink href="#quote" size="sm" className="hidden sm:inline-flex">
              Get a Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-out lg:hidden ${open ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="container-x max-h-[calc(100vh-5rem)] overflow-y-auto pb-8 pt-2">
            <ul className="divide-y divide-ink/[0.06]">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href} className={open ? 'rise' : ''} style={{ ['--d' as string]: `${i * 50}ms` }}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-4 font-display text-2xl ${active === l.href ? 'text-aqua-700' : 'text-ink'}`}
                    tabIndex={open ? 0 : -1}
                  >
                    {l.label}
                    <ArrowRight className="h-5 w-5 text-ink-muted" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={BRAND.phoneHref} className="flex items-center gap-2 rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-ink" tabIndex={open ? 0 : -1}>
                <Phone className="h-4 w-4 text-aqua-600" aria-hidden /> Call us
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-center gap-2 rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-ink" tabIndex={open ? 0 : -1}>
                <Mail className="h-4 w-4 text-aqua-600" aria-hidden /> Email us
              </a>
            </div>
            <ButtonLink href="#quote" size="lg" className="mt-3 w-full" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              Get a Quote
            </ButtonLink>
          </div>
        </div>
      </header>
    </>
  )
}
