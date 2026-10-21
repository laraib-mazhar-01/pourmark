import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, MessageCircle, Plus, Search, Sparkles, ThumbsDown, ThumbsUp, X } from 'lucide-react'
import { FAQS, BRAND } from '../data/content'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const FAQ_SCHEMA = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
})

const TOPICS: { id: string; label: string; match?: RegExp }[] = [
  { id: 'all', label: 'All' },
  { id: 'ordering', label: 'Ordering', match: /minimum|sample|cost|order for a wedding/i },
  { id: 'design', label: 'Design', match: /logo|design the label|QR/i },
  { id: 'production', label: 'Production & delivery', match: /production|deliver|sizes/i },
]

/** A relevant next step per question, keyed by a word in the question. */
const NEXT: { match: RegExp; label: string; href: string }[] = [
  { match: /cost|minimum/i, label: 'Estimate your order', href: '#pricing' },
  { match: /logo|design the label|QR/i, label: 'Open the customizer', href: '#customizer' },
  { match: /sizes/i, label: 'Compare bottle sizes', href: '#products' },
  { match: /sample|deliver|production|wedding/i, label: 'Request a quote', href: '#quote' },
]

const POPULAR = [0, 3, 9]

function highlight(text: string, q: string): ReactNode {
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig')
  return text.split(re).map((part, i) => (part.toLowerCase() === q.toLowerCase() ? <mark key={i} className="rounded bg-aqua-100 px-0.5 text-ink">{part}</mark> : part))
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState('all')
  const [helpful, setHelpful] = useState<Record<number, 'yes' | 'no'>>({})
  const listRef = useRef<HTMLDivElement>(null)

  const q = query.trim()
  const counts = useMemo(() => Object.fromEntries(TOPICS.map((t) => [t.id, FAQS.filter((f) => !t.match || t.match.test(f.q)).length])), [])

  const visible = useMemo(() => {
    const t = TOPICS.find((x) => x.id === topic)
    const lq = q.toLowerCase()
    return FAQS.map((f, i) => ({ ...f, i })).filter((f) => {
      const topicOk = !t?.match || t.match.test(f.q)
      const queryOk = !lq || f.q.toLowerCase().includes(lq) || f.a.toLowerCase().includes(lq)
      return topicOk && queryOk
    })
  }, [q, topic])

  // A single search result opens itself
  useEffect(() => {
    if (q && visible.length === 1) setOpen(visible[0].i)
  }, [q, visible])

  const jumpTo = (i: number) => {
    setTopic('all')
    setQuery('')
    setOpen(i)
    requestAnimationFrame(() => document.getElementById(`faq-${i}-btn`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="section relative overflow-hidden bg-mist">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_SCHEMA }} />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="orb absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-aqua-200/40 blur-3xl" />
      </div>

      <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            align="left"
            id="faq-title"
            eyebrow="FAQ"
            title={
              <>
                Questions, <span className="italic text-aqua-600">answered</span>
              </>
            }
            intro="Everything you need to know about ordering custom branded water bottles. Can’t find your answer?"
          />
          <Reveal className="mt-6 flex flex-wrap gap-3">
            <a href="#quote" className="btn-shine inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow">
              <MessageCircle className="h-4 w-4" aria-hidden /> Talk to Us
            </a>
            <a href={BRAND.phoneHref} className="inline-flex h-11 items-center rounded-full border border-ink/10 bg-white px-5 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-aqua-300 hover:shadow-soft">
              {BRAND.phone}
            </a>
          </Reveal>

          <Reveal className="mt-8">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions… e.g. “minimum”, “QR”"
                aria-label="Search questions"
                className="field pl-11 pr-10"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-mist hover:text-ink" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
            <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Filter by topic">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={topic === t.id}
                  onClick={() => setTopic(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${topic === t.id ? 'bg-ink text-white shadow-soft' : 'bg-white text-ink-soft hover:text-ink'}`}
                >
                  {t.label}
                  <span className={`rounded-full px-1.5 text-[11px] ${topic === t.id ? 'bg-white/15 text-white/80' : 'bg-mist text-ink-muted'}`}>{counts[t.id]}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted" aria-live="polite">
              {q ? `${visible.length} result${visible.length === 1 ? '' : 's'} for “${q}”` : `${visible.length} questions`}
            </p>
          </Reveal>

          <Reveal className="mt-8 rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              <Sparkles className="h-3.5 w-3.5 text-aqua-500" aria-hidden /> Most asked
            </p>
            <ul className="mt-3 space-y-1">
              {POPULAR.map((i) => (
                <li key={i}>
                  <button type="button" onClick={() => jumpTo(i)} className="group flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left text-sm text-ink-soft transition hover:bg-mist hover:text-ink">
                    {FAQS[i].q}
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition group-hover:translate-x-0.5 group-hover:text-aqua-600" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal>
          <div ref={listRef} className="divide-y divide-ink/[0.07] rounded-3xl border border-ink/[0.06] bg-white shadow-soft">
            {visible.length === 0 && (
              <div className="px-6 py-14 text-center">
                <p className="font-display text-2xl text-ink">No matches for “{q}”</p>
                <p className="mt-2 text-ink-soft">
                  Try another word, or{' '}
                  <a href="#quote" className="link-underline font-medium text-aqua-600">
                    ask us directly
                  </a>
                  .
                </p>
              </div>
            )}
            {visible.map((f, k) => {
              const isOpen = open === f.i
              const id = `faq-${f.i}`
              const next = NEXT.find((n) => n.match.test(f.q))
              const vote = helpful[f.i]
              return (
                <div
                  key={f.q}
                  className={`group/faq relative px-5 transition-colors duration-300 first:rounded-t-3xl last:rounded-b-3xl sm:px-8 ${isOpen ? 'bg-aqua-50/40' : 'hover:bg-mist/60'}`}
                  style={{ animation: `rise 0.6s cubic-bezier(.2,.8,.2,1) both`, animationDelay: `${k * 40}ms` }}
                >
                  <span className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-aqua-500 transition-transform duration-300 ${isOpen ? 'scale-y-100' : 'scale-y-0'}`} aria-hidden />
                  <h3>
                    <button
                      type="button"
                      id={`${id}-btn`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-panel`}
                      onClick={() => setOpen(isOpen ? null : f.i)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold text-ink transition hover:text-aqua-700 sm:py-6"
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 shrink-0 font-display text-base text-ink/30">{String(f.i + 1).padStart(2, '0')}</span>
                        <span>{highlight(f.q, q)}</span>
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen ? 'rotate-45 bg-ink text-white' : 'bg-mist text-ink group-hover/faq:bg-aqua-100'
                        }`}
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={`${id}-btn`}
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-6 pl-9 pr-4">
                        <p className="leading-relaxed text-ink-soft">{highlight(f.a, q)}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          {next ? (
                            <a href={next.href} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-aqua-700 shadow-soft transition hover:-translate-y-0.5 hover:text-aqua-800">
                              {next.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                            </a>
                          ) : (
                            <span />
                          )}
                          <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                            {vote ? (
                              <span className="tick-in font-medium text-aqua-700">{vote === 'yes' ? 'Thanks for the feedback!' : 'Thanks — we’ll improve this answer.'}</span>
                            ) : (
                              <>
                                <span>Helpful?</span>
                                <button type="button" onClick={() => setHelpful((h) => ({ ...h, [f.i]: 'yes' }))} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white hover:text-aqua-700" aria-label="Yes, helpful">
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                                <button type="button" onClick={() => setHelpful((h) => ({ ...h, [f.i]: 'no' }))} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white hover:text-ink" aria-label="No, not helpful">
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-2xl border border-dashed border-ink/15 px-5 py-4 text-sm text-ink-soft sm:flex-row">
            <span>Still have a question? We usually reply within a few hours.</span>
            <a href={`mailto:${BRAND.email}`} className="link-underline font-medium text-aqua-600">
              {BRAND.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
