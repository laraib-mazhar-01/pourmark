import { useCallback, useRef, type PointerEvent } from 'react'

interface Options {
  /** Max tilt in degrees; 0 disables tilt (spotlight only). */
  tilt?: number
  /** Lift on hover in px. */
  lift?: number
}

/**
 * Tracks the pointer over an element and writes CSS variables used by the
 * `.spotlight` (cursor glow) and `.tilt` (3D tilt) classes.
 */
export function usePointerGlow<T extends HTMLElement>({ tilt = 0, lift = 0 }: Options = {}) {
  const ref = useRef<T | null>(null)
  const raf = useRef(0)

  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      const el = ref.current
      if (!el || e.pointerType === 'touch') return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        el.classList.remove('is-leaving')
        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
        if (tilt) {
          const px = x / rect.width - 0.5
          const py = y / rect.height - 0.5
          el.style.setProperty('--ry', `${(px * tilt).toFixed(2)}deg`)
          el.style.setProperty('--rx', `${(-py * tilt).toFixed(2)}deg`)
          el.style.setProperty('--ty', `${-lift}px`)
        }
      })
    },
    [tilt, lift],
  )

  const onPointerLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.classList.add('is-leaving')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--ty', '0px')
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
