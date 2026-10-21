/** Small inline SVG logos so visitors can try the customizer without a file. */
const svg = (body: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`)}`

export const DEMO_LOGOS: { id: string; name: string; src: string }[] = [
  {
    id: 'monogram',
    name: 'Monogram',
    src: svg(
      `<circle cx="50" cy="50" r="46" fill="#6E2A2E"/><circle cx="50" cy="50" r="39" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.5"/><text x="50" y="63" text-anchor="middle" font-family="Georgia,serif" font-size="36" fill="#fff">HG</text>`,
    ),
  },
  {
    id: 'cutlery',
    name: 'Bistro',
    src: svg(
      `<rect x="4" y="4" width="92" height="92" rx="20" fill="#0B1A2A"/><path d="M36 22v56M30 22v18a6 6 0 0 0 12 0V22M62 22c-6 4-8 12-8 20 0 6 4 8 8 8v28" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
    ),
  },
  {
    id: 'leaf',
    name: 'Garden',
    src: svg(
      `<circle cx="50" cy="50" r="46" fill="#2F6B4F"/><path d="M68 30c-24 0-38 12-38 34 0 3 .3 6 1 8 22 0 37-14 37-42z" fill="#fff"/><path d="M34 70c6-12 16-22 30-32" stroke="#2F6B4F" stroke-width="3" stroke-linecap="round" fill="none"/>`,
    ),
  },
  {
    id: 'cup',
    name: 'Café',
    src: svg(
      `<rect x="4" y="4" width="92" height="92" rx="46" fill="#B4552F"/><path d="M28 40h38v18a16 16 0 0 1-16 16h-6a16 16 0 0 1-16-16V40z" fill="#fff"/><path d="M66 44h6a8 8 0 0 1 0 16h-6" stroke="#fff" stroke-width="5" fill="none"/><path d="M40 24c0 6-4 6-4 12M52 24c0 6-4 6-4 12" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    ),
  },
]
