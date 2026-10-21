import { useEffect, useRef, useState } from 'react'

/** Animates a number towards `target` whenever it changes (or when `start` becomes true). */
export function useCountUp(target: number, { duration = 900, start = true } = {}) {
  const [value, setValue] = useState(start ? target : 0)
  const fromRef = useRef(0)
  const valueRef = useRef(value)
  valueRef.current = value

  useEffect(() => {
    if (!start) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    fromRef.current = valueRef.current
    const from = fromRef.current
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(from + (target - from) * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])

  return value
}
