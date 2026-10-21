import type { BottleFinish, BottleSize, CapId, LabelStyle, WaterType } from '../lib/types'

export const BRAND = {
  name: 'Pourmark',
  tagline: 'Turn every water bottle into your brand.',
  description: 'Premium custom-branded water bottles for restaurants, hotels, cafés, events, and businesses.',
  email: 'hello@pourmark.com',
  phone: '+1 (555) 014-2290',
  phoneHref: 'tel:+15550142290',
  address: '1180 Harbor Way, Suite 4, Oakland, CA 94607',
  hours: 'Mon–Fri, 8am–6pm PT',
}

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Custom Bottles', href: '#customizer' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#quote' },
]

const img = (id: string, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`

export interface Product {
  size: BottleSize
  name: string
  description: string
  perfectFor: string[]
  color: string
  style: LabelStyle
  sample: string
  sampleTagline: string
  popular?: boolean
}

export const PRODUCTS: Product[] = [
  {
    size: '330',
    name: '330ml Bottle',
    description: 'A compact, elegant pour for café counters, lunch service and catering trays — one glass, perfectly portioned.',
    perfectFor: ['Restaurants', 'Cafés', 'Catering', 'Events'],
    color: '#1B508C',
    style: 'classic',
    sample: 'Café Marlow',
    sampleTagline: 'Coffee & Kitchen',
  },
  {
    size: '500',
    name: '500ml Bottle',
    description: 'Our most-ordered size. The classic table bottle for dinner service, hotel rooms and corporate meetings.',
    perfectFor: ['Restaurants', 'Hotels', 'Corporate events'],
    color: '#0B1A2A',
    style: 'minimal',
    sample: 'The Copper Table',
    sampleTagline: 'Est. 2014',
    popular: true,
  },
  {
    size: '750',
    name: '750ml Bottle',
    description: 'A tall, statement bottle made to be shared — designed for fine dining tables, suites and celebrations.',
    perfectFor: ['Premium restaurants', 'Hotels', 'Weddings', 'Special events'],
    color: '#6E2A2E',
    style: 'wrap',
    sample: 'Maison Rouge',
    sampleTagline: 'Fine Dining',
  },
  {
    size: '1000',
    name: '1 Litre Bottle',
    description: 'Our largest format for big tables, buffets and banquets — one bottle keeps a whole party poured.',
    perfectFor: ['Large tables', 'Buffets', 'Banquets', 'Conferences'],
    color: '#2F6B4F',
    style: 'minimal',
    sample: 'Verde Kitchen',
    sampleTagline: 'Farm to Table',
  },
]

export const STEPS = [
  { n: '01', title: 'Choose Your Bottle', text: 'Select the size and quantity that fits your service.' },
  { n: '02', title: 'Send Your Branding', text: 'Upload your restaurant logo, colors and any details.' },
  { n: '03', title: 'Approve Your Design', text: 'We create a custom label proof for you to approve.' },
  { n: '04', title: 'Receive Your Bottles', text: 'Your custom-branded bottles are produced and delivered.' },
]

export const FEATURES = [
  { icon: 'palette', title: 'Custom Branding', text: 'Your logo and branding printed directly onto a waterproof, full-color bottle label.' },
  { icon: 'droplet', title: 'Premium Water', text: 'High-quality purified drinking water, bottled in a certified, food-safe facility.' },
  { icon: 'sparkles', title: 'Professional Appearance', text: 'Make every table look more polished, intentional and on-brand.' },
  { icon: 'boxes', title: 'Bulk Ordering', text: 'Tiered pricing for larger restaurant, hotel and event orders — the more you pour, the less you pay.' },
  { icon: 'zap', title: 'Fast Production', text: 'Proof within 48 hours. Bottles produced and shipped in as little as 10 business days.' },
  { icon: 'qr', title: 'QR Codes', text: 'Add a QR code linking to your menu, website, reviews, social media or a seasonal promotion.' },
] as const

export const USE_CASES = [
  { emoji: '🍽', title: 'Restaurants', text: 'Branded table water that matches your menu, your linens and your story.', image: img('1517248135467-4c7edcad34c4') },
  { emoji: '☕', title: 'Cafés', text: 'Grab-and-go bottles that put your logo in every customer’s bag.', image: img('1554118811-1e0d58224f24') },
  { emoji: '🏨', title: 'Hotels', text: 'Welcome every guest with in-room water carrying your hotel’s name.', image: img('1566073771259-6a8506099945') },
  { emoji: '💍', title: 'Weddings', text: 'Monogrammed bottles with your names and date — a keepsake on every table.', image: img('1519741497674-611481863552') },
  { emoji: '🎉', title: 'Events', text: 'Launches, galas and festivals with water that looks like part of the production.', image: img('1492684223066-81342ee5ff30') },
  { emoji: '🏢', title: 'Corporate Events', text: 'Boardrooms, offsites and trade shows — your brand in every attendee’s hand.', image: img('1556761175-5973dc0f32e7') },
  { emoji: '🍴', title: 'Catering Companies', text: 'Finish every spread with bottles that carry your catering brand to the client.', image: img('1555244162-803834f70033') },
  { emoji: '🎪', title: 'Conferences', text: 'Keep thousands of attendees hydrated with sponsor-ready custom labels.', image: img('1540575467063-178a50c2df87') },
]

export const TESTIMONIALS = [
  {
    quote: 'The custom bottles completely changed the look of our tables. Our customers constantly ask where they came from.',
    name: 'Marco Bellini',
    role: 'Owner, Osteria Bellini',
    location: 'San Francisco, CA',
    initials: 'MB',
    color: '#1B508C',
  },
  {
    quote: 'We switched from a generic brand to Pourmark for all 140 rooms. Guests photograph the bottles and tag us — it’s free marketing on every nightstand.',
    name: 'Danielle Okafor',
    role: 'General Manager, The Wren Hotel',
    location: 'Austin, TX',
    initials: 'DO',
    color: '#6E2A2E',
  },
  {
    quote: 'The proof came back in two days and the bottles arrived a week before our opening. The QR code to our menu gets scanned every single night.',
    name: 'Priya Raman',
    role: 'Co-founder, Saffron Room',
    location: 'Chicago, IL',
    initials: 'PR',
    color: '#2F6B4F',
  },
  {
    quote: 'We order 5,000 bottles a quarter for our catering clients. Consistent quality, fair pricing, and the team actually picks up the phone.',
    name: 'James Whitfield',
    role: 'Director, Whitfield Catering Co.',
    location: 'Denver, CO',
    initials: 'JW',
    color: '#0B1A2A',
  },
]

export const FAQS = [
  {
    q: 'What is the minimum order quantity?',
    a: 'Our minimum order is 500 bottles per design. Most restaurants start with 1,000–2,500 bottles, and pricing per bottle drops at 1,000, 2,500, 5,000 and 10,000+.',
  },
  {
    q: 'Can I use my own logo?',
    a: 'Absolutely. Upload your logo as a PNG, JPG, SVG or PDF. Vector files (SVG, AI, EPS, PDF) print sharpest, but our team will check every file and let you know if anything needs adjusting before printing.',
  },
  {
    q: 'Can you design the label for us?',
    a: 'Yes. Our in-house designers can create a label from scratch using your logo, colors and style references, or refine an idea you already have. Design includes up to two rounds of revisions.',
  },
  {
    q: 'How long does production take?',
    a: 'You’ll receive a digital label proof within 48 hours of sending your branding. Once you approve it, production and delivery typically take 10–15 business days. Rush production is available for events.',
  },
  {
    q: 'What bottle sizes are available?',
    a: 'We offer 330ml, 500ml and 750ml bottles. The 500ml is our most popular size for restaurant tables; the 750ml is ideal for fine dining and sharing; the 330ml suits cafés, catering and events.',
  },
  {
    q: 'Can I order for a wedding or event?',
    a: 'Yes — weddings, galas, launches, conferences and festivals are some of our favorite projects. We can add names, dates, monograms or sponsor logos. Tell us your event date and we’ll plan production around it.',
  },
  {
    q: 'Do you deliver?',
    a: 'We deliver nationwide across the US by palletized freight, with free local delivery on orders of 1,000+ bottles. Warehouse pickup is also available.',
  },
  {
    q: 'Can I add a QR code?',
    a: 'Yes. We can print a QR code linking to your menu, website, online ordering, reviews or social media. Use a dynamic QR code and you can change the destination any time without reprinting.',
  },
  {
    q: 'Can I order a sample before placing a bulk order?',
    a: 'Yes. We offer a sample pack of printed bottles with your label so you can see and feel the final result on your tables. The sample fee is credited back against your first bulk order.',
  },
  {
    q: 'How much does custom labeling cost?',
    a: 'Custom labeling is included in the per-bottle price. Final pricing depends on bottle size, quantity, label finish and delivery location — use our quote calculator for an estimate, then request a final quote.',
  },
]

export const FINISH_OPTIONS: { id: BottleFinish; name: string; hint: string }[] = [
  { id: 'clear', name: 'Clear', hint: 'Lightweight rPET' },
  { id: 'glass', name: 'Glass', hint: 'Premium, reusable' },
  { id: 'frosted', name: 'Frosted', hint: 'Matte satin glass' },
  { id: 'tinted', name: 'Tinted', hint: 'Sea-green glass' },
  { id: 'amber', name: 'Amber', hint: 'Warm brown glass' },
  { id: 'cobalt', name: 'Cobalt', hint: 'Deep blue glass' },
  { id: 'smoke', name: 'Smoke', hint: 'Charcoal-tint glass' },
  { id: 'aluminum', name: 'Aluminum', hint: 'Brushed metal, reusable' },
]

export const WATER_OPTIONS: { id: WaterType; name: string; hint: string; icon: string }[] = [
  { id: 'still', name: 'Still', hint: 'Purified, smooth', icon: 'droplet' },
  { id: 'light', name: 'Lightly sparkling', hint: 'Soft, fine bubbles', icon: 'droplets' },
  { id: 'sparkling', name: 'Sparkling', hint: 'Fully carbonated', icon: 'sparkles' },
  { id: 'alkaline', name: 'Alkaline', hint: 'pH 9.5, electrolytes', icon: 'scale' },
  { id: 'mineral', name: 'Natural mineral', hint: 'Spring-sourced', icon: 'mountain' },
  { id: 'infused', name: 'Infused', hint: 'Lemon · cucumber · mint', icon: 'citrus' },
]

export const CAP_OPTIONS: { id: CapId; name: string; color: string | null; metallic?: boolean }[] = [
  { id: 'match', name: 'Match label', color: null },
  { id: 'midnight', name: 'Midnight', color: '#0B1A2A' },
  { id: 'white', name: 'White', color: '#F4F6F8' },
  { id: 'silver', name: 'Brushed silver', color: '#B9C2CC', metallic: true },
  { id: 'gold', name: 'Champagne gold', color: '#C9A85C', metallic: true },
  { id: 'copper', name: 'Copper', color: '#B4714C', metallic: true },
  { id: 'sky', name: 'Sky', color: '#2F7FD0' },
  { id: 'olive', name: 'Olive', color: '#2F6B4F' },
]

export const LABEL_COLORS = [
  { name: 'Midnight', value: '#0B1A2A' },
  { name: 'Harbor Blue', value: '#1B508C' },
  { name: 'Sky', value: '#2F7FD0' },
  { name: 'Olive Grove', value: '#2F6B4F' },
  { name: 'Bordeaux', value: '#6E2A2E' },
  { name: 'Terracotta', value: '#B4552F' },
  { name: 'Champagne', value: '#B8935A' },
  { name: 'Blush', value: '#C98A8A' },
]
