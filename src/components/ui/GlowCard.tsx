import type { HTMLAttributes, ReactNode } from 'react'
import { usePointerGlow } from '../../hooks/usePointerGlow'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Max tilt in degrees. 0 = spotlight only. */
  tilt?: number
  lift?: number
  dark?: boolean
}

/** Card wrapper with a cursor-following glow and optional 3D tilt. */
export function GlowCard({ children, tilt = 0, lift = 6, dark = false, className = '', ...rest }: Props) {
  const { ref, onPointerMove, onPointerLeave } = usePointerGlow<HTMLDivElement>({ tilt, lift })
  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`spotlight ${dark ? 'spotlight-dark' : ''} ${tilt ? 'tilt' : ''} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
