import type { QuoteRequest } from './types'

export interface QuoteResponse {
  ok: boolean
  reference: string
}

const API_URL = import.meta.env.VITE_QUOTE_API_URL

/**
 * Submits a quote request.
 *
 * If VITE_QUOTE_API_URL is set, the request is POSTed as multipart/form-data
 * (so the logo file is included) and the endpoint is expected to return
 * `{ reference: string }`. Otherwise a mock submission is used so the
 * prototype works end-to-end without a backend.
 */
export async function submitQuote(req: QuoteRequest): Promise<QuoteResponse> {
  const body = new FormData()
  body.append('name', req.name)
  body.append('business', req.business)
  body.append('email', req.email)
  body.append('phone', req.phone)
  body.append('size', req.size)
  body.append('quantity', req.quantity)
  body.append('location', req.location)
  body.append('requirements', req.requirements)
  if (req.logo) body.append('logo', req.logo)
  if (req.design) {
    const { logo: _logo, ...rest } = req.design
    body.append('design', JSON.stringify(rest))
  }

  if (API_URL) {
    const res = await fetch(API_URL, { method: 'POST', body })
    if (!res.ok) throw new Error(`Quote request failed (${res.status})`)
    const data = (await res.json()) as { reference?: string }
    return { ok: true, reference: data.reference ?? '' }
  }

  // Mock submission
  await new Promise((r) => setTimeout(r, 1100))
  return { ok: true, reference: `PM-${Date.now().toString(36).slice(-6).toUpperCase()}` }
}
