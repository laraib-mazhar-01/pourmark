# Pourmark — Custom Branded Water Bottles

Marketing and lead-generation site for a business selling custom-labeled bottled water to restaurants, cafés, hotels and events.

Built with React 18, TypeScript, Vite and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
```

## Structure

```
src/
  components/
    Bottle.tsx            SVG bottle mockup (size, color, logo, name, text, label style)
    BottleCustomizer.tsx  6-step live customizer → hands design + logo to the quote form
    QuoteCalculator.tsx   Estimate by size / quantity / label design / delivery
    QuoteForm.tsx         Validated quote request with logo upload + success state
    Navbar, Hero, TrustBar, Products, ProductCard, HowItWorks, Features,
    BeforeAfter, UseCases, Testimonials, CTABanner, About, FAQ, Footer
    ui/                   Button, Reveal (scroll fade-in), SectionHeading, SmartImage
  context/QuoteContext    Shared quote prefill + "scroll to quote" action
  data/content.ts         All copy: products, FAQs, testimonials, use cases, contact info
  lib/pricing.ts          Indicative pricing model (edit numbers here)
  lib/api.ts              Quote submission (mock or real API)
```

## Connecting a real backend

Set `VITE_QUOTE_API_URL` in `.env` (see `.env.example`). The form then POSTs
`multipart/form-data` with fields `name, business, email, phone, size, quantity,
location, requirements`, an optional `logo` file, and `design` (JSON from the
customizer). The endpoint should return `{ "reference": "..." }`. Without the
variable, a mock submission is used.

## Placeholder content

Brand name, contact details, testimonials, stats and prices are placeholders.
Replace them in `src/data/content.ts`, `src/lib/pricing.ts` and `index.html`.
Use-case photos are loaded from Unsplash, and swap in real product photography
when you have it.
