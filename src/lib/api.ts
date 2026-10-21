import type { QuoteRequest } from './types'

export interface QuoteResponse {
  ok: boolean
  reference: string
}

const API_URL = import.meta.env.VITE_QUOTE_API_URL

/** Flattens the request into form fields a mail-forwarding service can read. */
function toFormData(req: QuoteRequest): FormData {
  const body = new FormData()
  body.append('name', req.name)
  body.append('business', req.business)
  body.append('email', req.email)
  body.append('phone', req.phone)
  body.append('size', req.size === '1000' ? '1 Litre' : `${req.size}ml`)
  body.append('quantity', req.quantity)
  body.append('location', req.location)
  body.append('requirements', req.requirements)
  if (req.logo && req.logo.size > 0) body.append('logo', req.logo)
  if (req.design) {
    const { logo: _logo, ...rest } = req.design
    body.append('design', JSON.stringify(rest))
    body.append('design_summary', `${rest.size}ml · ${rest.finish} · ${rest.water} · label ${rest.style} ${rest.color} · cap ${rest.cap === 'custom' ? rest.capCustom : rest.cap}`)
  }
  // Fields understood by Formspree / Basin style services
  body.append('_subject', `Quote request — ${req.business || req.name}`)
  body.append('_replyto', req.email)
  return body
}

/**
 * Submits a quote request.
 *
 * With VITE_QUOTE_API_URL set (e.g. a Formspree endpoint such as
 * https://formspree.io/f/xxxxxxx), the request is POSTed as multipart/form-data
 * and the service emails it to you. Any JSON `reference` in the response is
 * shown to the customer; otherwise one is generated locally.
 * Without the variable, a mock submission is used so the site works end-to-end.
 */
export async function submitQuote(req: QuoteRequest): Promise<QuoteResponse> {
  const localRef = `PM-${Date.now().toString(36).slice(-6).toUpperCase()}`

  if (API_URL) {
    const res = await fetch(API_URL, { method: 'POST', body: toFormData(req), headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`Quote request failed (${res.status})`)
    let reference = localRef
    try {
      const data = (await res.json()) as { reference?: string }
      if (data.reference) reference = data.reference
    } catch {
      /* non-JSON success body */
    }
    return { ok: true, reference }
  }

  // Mock submission
  await new Promise((r) => setTimeout(r, 1100))
  return { ok: true, reference: localRef }
}

/** Newsletter sign-up: same endpoint convention, optional. */
export async function subscribe(email: string): Promise<boolean> {
  const url = import.meta.env.VITE_NEWSLETTER_API_URL
  if (!url) {
    await new Promise((r) => setTimeout(r, 600))
    return true
  }
  const body = new FormData()
  body.append('email', email)
  body.append('_subject', 'Newsletter sign-up')
  const res = await fetch(url, { method: 'POST', body, headers: { Accept: 'application/json' } })
  return res.ok
}
