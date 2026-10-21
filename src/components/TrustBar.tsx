const NAMES = [
  { name: 'Osteria Bellini', className: 'font-display italic text-2xl' },
  { name: 'THE WREN', className: 'font-sans font-semibold tracking-[0.3em] text-base' },
  { name: 'Saffron Room', className: 'font-display text-2xl' },
  { name: 'HARBOR & CO.', className: 'font-sans font-bold tracking-[0.18em] text-sm' },
  { name: 'Maison Rouge', className: 'font-display italic text-2xl' },
  { name: 'whitfield', className: 'font-sans font-semibold lowercase tracking-tight text-xl' },
  { name: 'Verde Kitchen', className: 'font-display text-2xl' },
  { name: 'BLANC', className: 'font-sans font-semibold tracking-[0.34em] text-base' },
]

export function TrustBar() {
  const items = [...NAMES, ...NAMES]
  return (
    <section aria-label="Trusted by restaurants and hotels" className="relative border-y border-ink/[0.06] bg-white py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">Poured at restaurants, hotels &amp; venues nationwide</p>
      <div className="relative mt-7 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee gap-14 pr-14 text-ink/40 sm:gap-20 sm:pr-20">
          {items.map((n, i) => (
            <li key={`${n.name}-${i}`} aria-hidden={i >= NAMES.length} className={`whitespace-nowrap transition-colors hover:text-ink ${n.className}`}>
              {n.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
