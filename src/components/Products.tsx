import { PRODUCTS } from '../data/content'
import { useQuote } from '../context/QuoteContext'
import { ProductCard } from './ProductCard'
import { Bottle } from './Bottle'
import { Reveal } from './ui/Reveal'
import { SectionHeading } from './ui/SectionHeading'

const GUIDE = [
  { size: '330', cm: 17, glass: '1 glass', use: 'Lunch · cafés · catering' },
  { size: '500', cm: 21, glass: '2 glasses', use: 'Dinner tables · hotel rooms' },
  { size: '750', cm: 30, glass: '3–4 glasses', use: 'Sharing · fine dining · events' },
  { size: '1000', cm: 33, glass: '4–5 glasses', use: 'Large tables · buffets' },
] as const

export function Products() {
  const { startQuote, startDesign } = useQuote()
  return (
    <section id="products" aria-labelledby="products-title" className="section">
      <div className="container-x">
        <SectionHeading
          id="products-title"
          eyebrow="Products"
          title="Choose Your Bottle"
          intro="Four sizes, one standard of quality. Every bottle is filled with premium purified water and finished with your own custom label."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-6">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.size} delay={i * 100}>
              <ProductCard
                product={p}
                onQuote={(prod) => startQuote({ size: prod.size })}
                onCustomize={(prod, color) => startDesign({ size: prod.size, color })}
              />
            </Reveal>
          ))}
        </div>

        {/* Size guide */}
        <Reveal className="mt-14">
          <div className="grid items-center gap-8 rounded-[2rem] border border-ink/[0.06] bg-gradient-to-br from-mist to-white p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
            <div>
              <span className="eyebrow">
                <span className="h-px w-6 bg-aqua-500" aria-hidden />
                Size guide
              </span>
              <h3 className="h-display mt-3 text-3xl sm:text-4xl">Not sure which size?</h3>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Most restaurants pair the 500ml for dinner service with the 330ml for lunch and takeaway; the 1 litre suits large tables and buffets. Every size comes in clear rPET or glass — mixed orders are welcome and we print the same label across sizes.
              </p>
              <p className="mt-5 text-sm text-ink-muted">
                Prices shown are indicative for 10,000+ bottles including a standard full-color label.{' '}
                <a href="#pricing" className="link-underline font-medium text-aqua-600">
                  Estimate your order →
                </a>
              </p>
            </div>

            <ul className="grid grid-cols-4 items-end gap-3 border-t border-ink/[0.06] pt-6 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              {GUIDE.map((g) => (
                <li key={g.size} className="group flex flex-col items-center text-center">
                  <div className="relative flex h-44 items-end sm:h-52">
                    <div className="absolute inset-x-0 bottom-0 border-b border-dashed border-ink/15" aria-hidden />
                    <div style={{ height: `${(g.cm / 33) * 100}%` }} className="transition-transform duration-500 group-hover:-translate-y-1">
                      <Bottle size={g.size} color="#1B508C" style="classic" name="Your Brand" className="h-full drop-shadow-md" title={`${g.size}ml bottle, ${g.cm} cm tall`} />
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-ink">{g.size === '1000' ? '1 L' : `${g.size}ml`}</p>
                  <p className="text-xs text-ink-muted">{g.cm} cm · {g.glass}</p>
                  <p className="mt-1 hidden text-xs text-ink-soft sm:block">{g.use}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
