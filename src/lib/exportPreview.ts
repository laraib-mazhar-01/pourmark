/**
 * Rasterizes an inline <svg> to a PNG and triggers a download.
 * Fonts fall back to the SVG's declared families (serif/sans) when rendered off-screen.
 */
export async function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 3): Promise<void> {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.removeAttribute('class')
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  const vb = svg.viewBox.baseVal
  const width = Math.round(vb.width * scale)
  const height = Math.round(vb.height * scale)
  clone.setAttribute('width', String(width))
  clone.setAttribute('height', String(height))

  const xml = new XMLSerializer().serializeToString(clone)
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`

  const img = new Image()
  img.decoding = 'async'
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Could not render preview'))
    img.src = url
  })

  const pad = Math.round(width * 0.35)
  const canvas = document.createElement('canvas')
  canvas.width = width + pad * 2
  canvas.height = height + pad
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height)
  g.addColorStop(0, '#F5F8FB')
  g.addColorStop(1, '#D9EBFA')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, pad, pad * 0.4, width, height)

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'))
  if (!blob) throw new Error('Could not encode image')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
