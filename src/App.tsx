import { QuoteProvider } from './context/QuoteContext'
import { Navbar } from './components/Navbar'
import { ScrollProgress } from './components/ui/ScrollProgress'
import { Hero } from './components/Hero'
import { TrustBar } from './components/TrustBar'
import { BottleCustomizer } from './components/BottleCustomizer'
import { Products } from './components/Products'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { BeforeAfter } from './components/BeforeAfter'
import { QuoteCalculator } from './components/QuoteCalculator'
import { UseCases } from './components/UseCases'
import { Testimonials } from './components/Testimonials'
import { About } from './components/About'
import { FAQ } from './components/FAQ'
import { QuoteForm } from './components/QuoteForm'
import { CTABanner } from './components/CTABanner'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <QuoteProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <ScrollProgress />
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Products />
        <BottleCustomizer />
        <HowItWorks />
        <Features />
        <BeforeAfter />
        <QuoteCalculator />
        <UseCases />
        <Testimonials />
        <CTABanner />
        <About />
        <FAQ />
        <QuoteForm />
      </main>
      <Footer />
    </QuoteProvider>
  )
}
