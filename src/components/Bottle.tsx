import { useId } from 'react'
import type { BottleFinish, BottleSize, LabelStyle, WaterType } from '../lib/types'
import { readableOn, shade, tint } from '../lib/color'

export interface BottleProps {
  size?: BottleSize
  color?: string
  name?: string
  logo?: string | null
  tagline?: string
  details?: string[]
  style?: LabelStyle
  /** Render a plain, unbranded bottle (used in the before/after comparison). */
  generic?: boolean
  className?: string
  title?: string
  /** Changes on content update to replay the label animation. */
  animateKey?: string
  /** Adds a slow light sweep across the glass. */
  glint?: boolean
  /** Bottle material / finish. */
  finish?: BottleFinish
  /** Still or sparkling (sparkling shows bubbles). */
  water?: WaterType
  /** Exploded view: lifts the cap and slides the label out. */
  exploded?: boolean
  /** Cap color (defaults to the label color). */
  capColor?: string
  /** Metallic cap finish. */
  capMetallic?: boolean
}

/** Bottle proportions per size, in viewBox units (width is always 200). */
const GEOMETRY: Record<BottleSize, { height: number; body: number; shoulder: number; neck: number; half: number }> = {
  '330': { height: 430, body: 66, shoulder: 52, neck: 34, half: 62 },
  '500': { height: 520, body: 66, shoulder: 64, neck: 40, half: 64 },
  '750': { height: 600, body: 58, shoulder: 92, neck: 62, half: 60 },
  '1000': { height: 660, body: 66, shoulder: 74, neck: 46, half: 70 },
}

/** Fit bold uppercase text (wider glyphs) with letter-spacing into `room`. */
function fitCaps(text: string, max: number, min: number, room: number, spacing: number) {
  const len = Math.max(text.length, 1)
  return Math.max(min, Math.min(max, (room - len * spacing) / (len * 0.66)))
}

function fitFont(text: string, max: number, min: number, room: number) {
  const len = Math.max(text.length, 1)
  return Math.max(min, Math.min(max, room / (len * 0.44)))
}

export function Bottle({
  size = '500',
  color = '#0B1A2A',
  name = '',
  logo = null,
  tagline = '',
  details = [],
  style = 'classic',
  generic = false,
  className = '',
  title,
  animateKey,
  glint = false,
  capColor,
  capMetallic = false,
  finish = 'clear',
  water = 'still',
  exploded = false,
}: BottleProps) {
  const uid = useId().replace(/:/g, '')
  const cap = capColor ?? color
  const g = GEOMETRY[size]
  const cx = 100
  const L = cx - g.half
  const R = cx + g.half
  const W = R - L
  const capTop = 6
  const capH = 38
  const ringY = capTop + capH
  const neckTop = ringY + 7
  const neckBottom = neckTop + g.neck
  const shoulderBottom = neckBottom + g.shoulder
  const bottom = g.height - 8
  const neckHalf = size === '750' ? 15 : size === '1000' ? 21 : 19
  const isGlass = finish !== 'clear'
  const isMetal = finish === 'aluminum'
  const outline =
    finish === 'tinted' ? '#5E9A7E'
    : finish === 'frosted' ? '#AFC2D0'
    : finish === 'glass' ? '#4F86B5'
    : finish === 'amber' ? '#8A5A2B'
    : finish === 'cobalt' ? '#1E3F8A'
    : finish === 'smoke' ? '#5B6670'
    : finish === 'aluminum' ? '#6F7A85'
    : '#7FA9CC'

  // Silhouette: neck → shoulder curve → straight body with subtle waist ribs → rounded base
  const body = [
    `M ${cx - neckHalf} ${neckTop}`,
    `L ${cx - neckHalf} ${neckBottom}`,
    `C ${cx - neckHalf} ${neckBottom + g.shoulder * 0.45}, ${L} ${shoulderBottom - g.shoulder * 0.35}, ${L} ${shoulderBottom}`,
    `L ${L} ${bottom - 22}`,
    `Q ${L} ${bottom}, ${L + 22} ${bottom}`,
    `L ${R - 22} ${bottom}`,
    `Q ${R} ${bottom}, ${R} ${bottom - 22}`,
    `L ${R} ${shoulderBottom}`,
    `C ${R} ${shoulderBottom - g.shoulder * 0.35}, ${cx + neckHalf} ${neckBottom + g.shoulder * 0.45}, ${cx + neckHalf} ${neckBottom}`,
    `L ${cx + neckHalf} ${neckTop}`,
    'Z',
  ].join(' ')

  // Label area
  const bodyLen = bottom - 22 - shoulderBottom
  const labelH = Math.min(size === '330' ? 180 : size === '500' ? 214 : size === '1000' ? 250 : 228, bodyLen * 0.78)
  const labelTop = shoulderBottom + (bodyLen - labelH) * (size === '750' ? 0.5 : 0.42)
  const labelBottom = labelTop + labelH

  const ink = readableOn(color)
  const isWrap = style === 'wrap'
  const isMinimal = style === 'minimal'
  const labelFill = isWrap ? color : isMinimal ? '#FBFAF7' : '#FFFFFF'
  const textColor = isWrap ? ink : color === '#FFFFFF' || readableOn(color) === '#0B1A2A' ? '#0B1A2A' : color

  const displayName = name.trim() || 'Your Restaurant'
  const waterLine =
    water === 'sparkling' ? 'PREMIUM SPARKLING WATER'
    : water === 'light' ? 'LIGHTLY SPARKLING WATER'
    : water === 'alkaline' ? 'PREMIUM ALKALINE WATER'
    : water === 'mineral' ? 'NATURAL MINERAL WATER'
    : water === 'infused' ? 'PREMIUM INFUSED WATER'
    : 'PREMIUM STILL WATER'
  const waterBadge =
    water === 'sparkling' ? 'CARBONATED'
    : water === 'light' ? 'FINE BUBBLES'
    : water === 'alkaline' ? 'pH 9.5 · ELECTROLYTES'
    : water === 'mineral' ? 'SPRING SOURCED'
    : water === 'infused' ? 'LEMON · CUCUMBER · MINT'
    : ''
  const badgeW = Math.min(W - 14, waterBadge.length * 4.6 + 16)
  const lines = details.filter(Boolean).slice(0, 3)
  const hasLogo = Boolean(logo)
  const logoSize = size === '330' ? 52 : 60

  // Vertical layout inside label
  const contentTop = labelTop + (isMinimal ? 26 : 22)
  const logoY = contentTop
  const nameY = hasLogo ? logoY + logoSize + 26 : labelTop + labelH * 0.38
  const nameSize = fitFont(displayName, hasLogo ? 24 : 30, 12, W - 26)
  const tagY = nameY + 18
  const detailsStart = labelBottom - 14 - (lines.length - 1) * 11

  return (
    <svg
      viewBox={`0 0 200 ${g.height}`}
      overflow="visible"
      className={`bottle ${exploded ? 'bottle-explode' : ''} ${className}`}
      role="img"
      aria-label={title ?? (generic ? `Plain ${size}ml water bottle` : `${size}ml water bottle with a custom label for ${displayName}`)}
    >
      <defs>
        {/* Water body: cool, translucent gradient */}
        <linearGradient id={`water-${uid}`} x1="0" x2="1">
          {finish === 'frosted' ? (
            <>
              <stop offset="0" stopColor="#D7E2EB" />
              <stop offset="0.25" stopColor="#F3F7FA" />
              <stop offset="0.6" stopColor="#F7FAFC" />
              <stop offset="1" stopColor="#CFDBE5" />
            </>
          ) : finish === 'tinted' ? (
            <>
              <stop offset="0" stopColor="#7FB49A" stopOpacity="0.9" />
              <stop offset="0.2" stopColor="#C9E4D4" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#E6F3EB" stopOpacity="0.5" />
              <stop offset="0.8" stopColor="#BBDCC9" stopOpacity="0.7" />
              <stop offset="1" stopColor="#5F9B7E" stopOpacity="0.95" />
            </>
          ) : finish === 'amber' ? (
            <>
              <stop offset="0" stopColor="#7A4A1E" stopOpacity="0.95" />
              <stop offset="0.2" stopColor="#C9925A" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#E8C79A" stopOpacity="0.6" />
              <stop offset="0.8" stopColor="#B87B40" stopOpacity="0.8" />
              <stop offset="1" stopColor="#5E3612" stopOpacity="1" />
            </>
          ) : finish === 'cobalt' ? (
            <>
              <stop offset="0" stopColor="#163A86" stopOpacity="0.95" />
              <stop offset="0.2" stopColor="#4C78C9" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#9DB9EA" stopOpacity="0.6" />
              <stop offset="0.8" stopColor="#3B65B8" stopOpacity="0.8" />
              <stop offset="1" stopColor="#0F2A66" stopOpacity="1" />
            </>
          ) : finish === 'smoke' ? (
            <>
              <stop offset="0" stopColor="#4A535C" stopOpacity="0.9" />
              <stop offset="0.2" stopColor="#9AA3AC" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#D5DBE0" stopOpacity="0.5" />
              <stop offset="0.8" stopColor="#8A939C" stopOpacity="0.7" />
              <stop offset="1" stopColor="#3A424A" stopOpacity="0.95" />
            </>
          ) : finish === 'aluminum' ? (
            <>
              <stop offset="0" stopColor="#8C96A0" />
              <stop offset="0.18" stopColor="#D9DEE3" />
              <stop offset="0.34" stopColor="#F4F6F8" />
              <stop offset="0.5" stopColor="#C3CAD1" />
              <stop offset="0.72" stopColor="#E6EAEE" />
              <stop offset="1" stopColor="#7E8893" />
            </>
          ) : finish === 'glass' ? (
            <>
              <stop offset="0" stopColor="#9CC4E6" stopOpacity="0.95" />
              <stop offset="0.2" stopColor="#DCEDF9" stopOpacity="0.6" />
              <stop offset="0.5" stopColor="#F2F9FE" stopOpacity="0.4" />
              <stop offset="0.8" stopColor="#CBE3F5" stopOpacity="0.6" />
              <stop offset="1" stopColor="#7FB1DC" stopOpacity="1" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#B9D9F2" stopOpacity="0.85" />
              <stop offset="0.18" stopColor="#E3F1FB" stopOpacity="0.55" />
              <stop offset="0.5" stopColor="#F4FAFE" stopOpacity="0.35" />
              <stop offset="0.82" stopColor="#D6EAF8" stopOpacity="0.55" />
              <stop offset="1" stopColor="#9CC8EA" stopOpacity="0.9" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`alk-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5FB3F5" stopOpacity="0.18" />
          <stop offset="0.6" stopColor="#2F8BE6" stopOpacity="0.32" />
          <stop offset="1" stopColor="#1B5FB8" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`depth-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="1" stopColor="#5A9BD3" stopOpacity="0.28" />
        </linearGradient>
        {/* Cylindrical shading laid over the label */}
        <linearGradient id={`shade-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#0B1A2A" stopOpacity="0.32" />
          <stop offset="0.12" stopColor="#0B1A2A" stopOpacity="0.08" />
          <stop offset="0.3" stopColor="#FFFFFF" stopOpacity="0.16" />
          <stop offset="0.42" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.8" stopColor="#0B1A2A" stopOpacity="0.04" />
          <stop offset="1" stopColor="#0B1A2A" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id={`cap-${uid}`} x1="0" x2="1">
          {generic ? (
            <>
              <stop offset="0" stopColor="#4B6B8A" />
              <stop offset="0.3" stopColor="#8FB0CC" />
              <stop offset="0.55" stopColor="#5D7F9E" />
              <stop offset="1" stopColor="#2E4A66" stopOpacity="0.85" />
            </>
          ) : capMetallic ? (
            <>
              <stop offset="0" stopColor={shade(cap, 0.35)} />
              <stop offset="0.18" stopColor={tint(cap, 0.25)} />
              <stop offset="0.32" stopColor={tint(cap, 0.75)} />
              <stop offset="0.45" stopColor={cap} />
              <stop offset="0.62" stopColor={shade(cap, 0.18)} />
              <stop offset="0.78" stopColor={tint(cap, 0.4)} />
              <stop offset="1" stopColor={shade(cap, 0.45)} />
            </>
          ) : (
            <>
              <stop offset="0" stopColor={cap} />
              <stop offset="0.3" stopColor={tint(cap, 0.35)} />
              <stop offset="0.55" stopColor={cap} />
              <stop offset="1" stopColor={shade(cap, 0.15)} />
            </>
          )}
        </linearGradient>
        <linearGradient id={`capshade-${uid}`} x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={`floor-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0B1A2A" stopOpacity="0.28" />
          <stop offset="1" stopColor="#0B1A2A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glint-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0.35" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="0.65" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${uid}`}>
          <path d={body} />
        </clipPath>
        <clipPath id={`logo-${uid}`}>
          <rect x={cx - logoSize / 2} y={logoY} width={logoSize} height={logoSize} rx="8" />
        </clipPath>
      </defs>

      {/* Floor shadow */}
      <ellipse cx={cx} cy={bottom + 2} rx={g.half + 6} ry="7" fill={`url(#floor-${uid})`} />

      {/* Bottle body */}
      <path d={body} fill={`url(#water-${uid})`} />
      {!isMetal && <path d={body} fill={`url(#depth-${uid})`} />}

      <g clipPath={`url(#clip-${uid})`}>
        {/* Water line */}
        {!isMetal && <rect x={L - 2} y={neckBottom + 4} width={W + 4} height="3" fill="#FFFFFF" opacity="0.6" />}
        {/* Ribs near the base (PET only) */}
        {!isGlass &&
          [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${L} ${bottom - 52 + i * 9} Q ${cx} ${bottom - 46 + i * 9} ${R} ${bottom - 52 + i * 9}`}
            stroke="#FFFFFF"
            strokeOpacity="0.45"
            strokeWidth="1.4"
            fill="none"
          />
          ))}
        {/* Shoulder ribs */}
        {!isGlass &&
          size !== '750' &&
          [0, 1].map((i) => (
            <path
              key={`s${i}`}
              d={`M ${L} ${shoulderBottom + 8 + i * 8} Q ${cx} ${shoulderBottom + 14 + i * 8} ${R} ${shoulderBottom + 8 + i * 8}`}
              stroke="#FFFFFF"
              strokeOpacity="0.4"
              strokeWidth="1.2"
              fill="none"
            />
          ))}

        {/* Water tint for alkaline / infused */}
        {water === 'mineral' && <path d={body} fill="#7CC6E8" fillOpacity={isMetal ? 0 : 0.2} />}
        {water === 'infused' && <path d={body} fill="#C9DD55" fillOpacity={isMetal ? 0 : 0.36} />}
        {water === 'mineral' && !isMetal && (
          <g>
            {Array.from({ length: 16 }).map((_, k) => {
              const mx = L + 8 + ((k * 47) % (W - 16))
              const my = bottom - 16 - ((k * 29) % (bottom - neckBottom - 40))
              const sz = 1.2 + (k % 3) * 0.6
              return (
                <path
                  key={`mn${k}`}
                  d={`M ${mx} ${my - sz} L ${mx + sz * 0.45} ${my} L ${mx} ${my + sz} L ${mx - sz * 0.45} ${my} Z`}
                  fill="#FFFFFF"
                  opacity={0.55 + (k % 3) * 0.15}
                  className="mineral"
                  style={{ animationDelay: `${-(k * 0.9) % 8}s`, animationDuration: `${7 + (k % 4)}s` }}
                />
              )
            })}
          </g>
        )}
        {water === 'alkaline' && !isMetal && (
          <>
            <path d={body} fill={`url(#alk-${uid})`} />
            {Array.from({ length: 7 }).map((_, k) => (
              <circle key={`ion${k}`} cx={L + 10 + ((k * 61) % (W - 20))} cy={bottom - 26 - ((k * 37) % 120)} r="0.9" fill="#FFFFFF" opacity="0.7" />
            ))}
          </>
        )}
        {(water === 'sparkling' || water === 'light') &&
          Array.from({ length: water === 'light' ? 6 : 12 }).map((_, i) => (
            <circle key={`fz${i}`} cx={L + 6 + ((i * 41) % (W - 12))} cy={neckBottom + 9 + ((i * 13) % 7)} r={water === 'light' ? 0.9 : 1.3} fill="#FFFFFF" opacity="0.9" stroke="#8FB9DC" strokeWidth="0.4" />
          ))}
        {water === 'infused' && !isMetal && (
          <g opacity="0.9">
            {/* Lemon slice */}
            <g className="infusion" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx={cx + W * 0.2} cy={bottom - 40} r="13" fill="#F5D94A" />
              <circle cx={cx + W * 0.2} cy={bottom - 40} r="10.5" fill="#FBF0A8" />
              {Array.from({ length: 8 }).map((_, k) => {
                const ang = (k * Math.PI) / 4
                return <line key={k} x1={cx + W * 0.2} y1={bottom - 40} x2={cx + W * 0.2 + Math.cos(ang) * 9} y2={bottom - 40 + Math.sin(ang) * 9} stroke="#F5D94A" strokeWidth="0.9" />
              })}
              <circle cx={cx + W * 0.2} cy={bottom - 40} r="13" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.6" />
            </g>
            {/* Cucumber slice */}
            <g className="infusion" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '-1.4s' }}>
              <circle cx={cx - W * 0.22} cy={bottom - 72} r="9" fill="#3F8F4E" />
              <circle cx={cx - W * 0.22} cy={bottom - 72} r="7.5" fill="#DDEFCF" />
              <circle cx={cx - W * 0.22} cy={bottom - 72} r="4" fill="#C3E2B4" />
              {Array.from({ length: 6 }).map((_, k) => {
                const ang = (k * Math.PI) / 3
                return <ellipse key={k} cx={cx - W * 0.22 + Math.cos(ang) * 2.6} cy={bottom - 72 + Math.sin(ang) * 2.6} rx="1.1" ry="0.6" fill="#8FBF7D" transform={`rotate(${(k * 60)} ${cx - W * 0.22 + Math.cos(ang) * 2.6} ${bottom - 72 + Math.sin(ang) * 2.6})`} />
              })}
            </g>
            {/* Mint leaves */}
            <g className="infusion" style={{ transformBox: 'fill-box', transformOrigin: 'center', animationDelay: '-2.6s' }}>
              <path d={`M ${cx + W * 0.08} ${bottom - 104} c 10 -2 16 4 15 13 c -9 2 -15 -3 -15 -13z`} fill="#4E9A5C" />
              <path d={`M ${cx + W * 0.08} ${bottom - 104} c 6 3 10 7 15 13`} stroke="#DFF2D8" strokeWidth="0.7" fill="none" />
              <path d={`M ${cx + W * 0.06} ${bottom - 102} c -10 -3 -16 3 -15 12 c 9 2 15 -3 15 -12z`} fill="#5FAE6C" />
              <path d={`M ${cx + W * 0.06} ${bottom - 102} c -6 3 -10 6 -15 12`} stroke="#DFF2D8" strokeWidth="0.7" fill="none" />
            </g>
          </g>
        )}

        {/* Bubbles: light = few fine, sparkling = many */}
        {(water === 'sparkling' || water === 'light') &&
          Array.from({ length: water === 'light' ? 12 : 26 }).map((_, i) => {
            const t = (i * 37) % 100
            const bx = L + 8 + ((i * 53) % (W - 16))
            const r = (water === 'light' ? 0.9 : 1.4) + ((i * 7) % 4) * (water === 'light' ? 0.3 : 0.55)
            return (
              <circle
                key={`b${i}`}
                cx={bx}
                cy={bottom - 10 - (t / 100) * (bottom - neckBottom - 20)}
                r={r}
                fill="#FFFFFF"
                opacity={finish === 'frosted' ? 0.95 : 0.9}
                stroke={finish === 'frosted' ? '#B8C9D6' : '#8FB9DC'}
                strokeWidth="0.4"
                className="bubble"
                style={{ animationDelay: `${-(i * 0.7) % 6}s`, animationDuration: `${5 + (i % 4)}s` }}
              />
            )
          })}


      </g>

      {/* Ghost outline where the label sits (exploded view) */}
      {!generic && <rect className="bottle-label-ghost" x={L} y={labelTop} width={W} height={labelH} fill="none" stroke={outline} strokeWidth="1" strokeDasharray="4 3" />}

      {/* ---------- Label (separable) ---------- */}
      <g className="bottle-label" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {/* ---------- Label ---------- */}
        {generic ? (
          <g>
            <rect x={L} y={labelTop + labelH * 0.2} width={W} height={labelH * 0.6} fill="#F1F4F7" />
            <rect x={L} y={labelTop + labelH * 0.2} width={W} height="3" fill="#C9D3DD" />
            <rect x={L} y={labelTop + labelH * 0.8 - 3} width={W} height="3" fill="#C9D3DD" />
            <text x={cx} y={labelTop + labelH * 0.47} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="15" letterSpacing="3" fill="#8A99A8">
              WATER
            </text>
            <text x={cx} y={labelTop + labelH * 0.6} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="8" letterSpacing="1.5" fill="#A5B1BD">
              DRINKING WATER · {size}ml
            </text>
          </g>
        ) : (
          <g key={animateKey} className="animate-label-in" style={{ transformOrigin: `${cx}px ${labelTop + labelH / 2}px`, transformBox: 'view-box' }}>
            <rect x={L} y={labelTop} width={W} height={labelH} fill={labelFill} />

            {style === 'classic' && (
              <>
                <rect x={L} y={labelTop} width={W} height="9" fill={color} />
                <rect x={L} y={labelBottom - 9} width={W} height="9" fill={color} />
                <rect x={L + 8} y={labelTop + 15} width={W - 16} height={labelH - 30} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="0.8" rx="3" />
              </>
            )}
            {isMinimal && (
              <>
                <rect x={L} y={labelBottom - 34} width={W} height="34" fill={color} />
                <line x1={cx - 16} x2={cx + 16} y1={nameY + 7} y2={nameY + 7} stroke={color} strokeWidth="1" opacity="0.6" />
              </>
            )}
            {isWrap && (
              <>
                <circle cx={L + 6} cy={labelTop + 18} r="44" fill="#FFFFFF" opacity="0.06" />
                <circle cx={R - 4} cy={labelBottom - 10} r="56" fill="#FFFFFF" opacity="0.07" />
              </>
            )}

            {hasLogo && (
              <>
                {!isWrap && <rect x={cx - logoSize / 2} y={logoY} width={logoSize} height={logoSize} rx="8" fill="#FFFFFF" />}
                {isWrap && <rect x={cx - logoSize / 2 - 3} y={logoY - 3} width={logoSize + 6} height={logoSize + 6} rx="10" fill="#FFFFFF" />}
                <image
                  href={logo!}
                  x={cx - logoSize / 2}
                  y={logoY}
                  width={logoSize}
                  height={logoSize}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath={`url(#logo-${uid})`}
                />
              </>
            )}

            {!hasLogo && (
              <g opacity="0.9">
                <circle cx={cx} cy={nameY - 38} r="13" fill="none" stroke={textColor} strokeWidth="1.2" />
                <path d={`M ${cx} ${nameY - 46} c 4 5 7 8 7 11 a 7 7 0 0 1 -14 0 c 0 -3 3 -6 7 -11 z`} fill={textColor} />
              </g>
            )}

            <text
              x={cx}
              y={nameY}
              textAnchor="middle"
              fontFamily='"Instrument Serif", Georgia, serif'
              fontSize={nameSize}
              fill={textColor}
            >
              {displayName}
            </text>

            {tagline && (
              <text
                x={cx}
                y={isMinimal ? tagY + 6 : tagY}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize={fitFont(tagline, 7.5, 5, W - 40)}
                letterSpacing="1.4"
                fill={textColor}
                opacity="0.75"
              >
                {tagline.toUpperCase()}
              </text>
            )}

            {!tagline && (
              <text
                x={cx}
                y={isMinimal ? tagY + 7 : tagY + 1}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontWeight="700"
                fontSize={fitCaps(waterLine, 8.2, 5.8, W - 20, 0.8)}
                letterSpacing="0.8"
                fill={textColor}
              >
                {waterLine}
              </text>
            )}

            {water !== 'still' && (
              <g>
                <rect
                  x={cx - badgeW / 2}
                  y={(isMinimal ? tagY + 7 : tagY + 1) + 7}
                  width={badgeW}
                  height="13"
                  rx="6.5"
                  fill={isWrap ? '#FFFFFF' : textColor}
                />
                <text
                  x={cx}
                  y={(isMinimal ? tagY + 7 : tagY + 1) + 16.2}
                  textAnchor="middle"
                  fontFamily="Inter, sans-serif"
                  fontSize={fitCaps(waterBadge, 6.4, 4.8, badgeW - 10, 0.6)}
                  fontWeight="700"
                  letterSpacing="0.6"
                  fill={isWrap ? color : '#FFFFFF'}
                >
                  {waterBadge}
                </text>
              </g>
            )}

            {lines.map((line, i) => (
              <text
                key={i}
                x={cx}
                y={(isMinimal ? labelBottom - 12 - (lines.length - 1) * 9 : detailsStart - (style === 'classic' ? 6 : 0)) + i * (isMinimal ? 9 : 11)}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize={isMinimal ? 6.2 : 7}
                fill={isMinimal ? ink : textColor}
                opacity={isMinimal ? 0.95 : 0.8}
              >
                {line}
              </text>
            ))}

            {lines.length === 0 && (
              <text
                x={cx}
                y={isMinimal ? labelBottom - 14 : labelBottom - 22}
                textAnchor="middle"
                fontFamily="Inter, sans-serif"
                fontSize="6.5"
                letterSpacing="1.5"
                fill={isMinimal ? ink : textColor}
                opacity="0.7"
              >
                {size} ML
              </text>
            )}

            {/* Label shading so it reads as wrapped around a cylinder */}
            <rect x={L} y={labelTop} width={W} height={labelH} fill={`url(#shade-${uid})`} />
          </g>
        )}
      </g>

      {/* Glass highlights over the label */}
      <g clipPath={`url(#clip-${uid})`}>
        {glint && (
          <rect x={L - 120} y={0} width={W + 240} height={g.height} fill={`url(#glint-${uid})`} className="bottle-glint" style={{ mixBlendMode: 'screen' }} />
        )}

        {/* Glass highlights */}
        <rect x={L + W * 0.16} y={shoulderBottom - 10} width={W * 0.07} height={bottom - shoulderBottom - 20} rx={W * 0.035} fill="#FFFFFF" opacity={finish === 'frosted' ? 0.35 : finish === 'glass' ? 0.7 : 0.55} />
        <rect x={L + W * 0.27} y={shoulderBottom + 4} width={W * 0.025} height={bottom - shoulderBottom - 50} rx="2" fill="#FFFFFF" opacity="0.4" />
        <rect x={R - W * 0.12} y={shoulderBottom} width={W * 0.04} height={bottom - shoulderBottom - 30} rx="3" fill="#FFFFFF" opacity="0.25" />
      </g>

      {/* Outline */}
      <path d={body} fill="none" stroke={outline} strokeOpacity={isGlass ? 0.7 : 0.45} strokeWidth={isGlass ? 1.6 : 1} />
      {isGlass && finish !== 'frosted' && !isMetal && (
        <path d={body} fill="none" stroke={outline} strokeOpacity="0.25" strokeWidth="4" clipPath={`url(#clip-${uid})`} />
      )}

      {/* Neck ring + cap (lift off in exploded view) */}
      <g className="bottle-cap">
      <rect x={cx - neckHalf - 5} y={ringY} width={(neckHalf + 5) * 2} height="7" rx="2" fill={generic ? '#9DB4C8' : capMetallic ? tint(cap, 0.3) : tint(cap, 0.55)} />
      <rect x={cx - neckHalf - 5} y={ringY} width={(neckHalf + 5) * 2} height="7" rx="2" fill={`url(#capshade-${uid})`} opacity="0.6" />

      {/* Cap */}
      <rect x={cx - neckHalf - 3} y={capTop} width={(neckHalf + 3) * 2} height={capH} rx="5" fill={`url(#cap-${uid})`} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect
          key={i}
          x={cx - neckHalf + 1 + i * (((neckHalf + 3) * 2 - 8) / 9)}
          y={capTop + 5}
          width="1.4"
          height={capH - 10}
          fill="#000"
          opacity={capMetallic ? 0.08 : 0.14}
        />
      ))}
      {capMetallic && <rect x={cx - neckHalf - 3} y={capTop + 2} width={(neckHalf + 3) * 2} height="3" rx="1.5" fill="#FFFFFF" opacity="0.45" />}
      <rect x={cx - neckHalf - 3} y={capTop} width={(neckHalf + 3) * 2} height={capH} rx="5" fill={`url(#capshade-${uid})`} opacity="0.7" />
      </g>

      {/* Part tags (exploded view) */}
      {exploded && !generic && (
        <g className="animate-label-in" fontFamily="Inter, sans-serif" fontSize="7" fontWeight="600" letterSpacing="1.2" fill={outline}>
          <line x1={cx + neckHalf + 6} y1={capTop + capH / 2 - 46} x2={cx + neckHalf + 24} y2={capTop + capH / 2 - 46} stroke={outline} strokeWidth="0.8" />
          <text x={cx + neckHalf + 27} y={capTop + capH / 2 - 43}>CAP</text>
          <line x1={R + 60} y1={labelTop - 8} x2={R + 60} y2={labelTop - 2} stroke={outline} strokeWidth="0.8" />
          <text x={R + 60} y={labelTop - 11} textAnchor="middle">LABEL</text>
          <text x={L - 6} y={bottom - 10} textAnchor="end">BOTTLE</text>
        </g>
      )}
    </svg>
  )
}
