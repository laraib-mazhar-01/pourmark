import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
type Size = 'md' | 'lg' | 'sm'

const base =
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'btn-shine bg-ink text-white shadow-[0_8px_24px_-8px_rgba(11,26,42,0.5)] hover:-translate-y-0.5 hover:bg-aqua-700 hover:shadow-glow',
  secondary: 'border border-ink/10 bg-white text-ink shadow-soft hover:-translate-y-0.5 hover:border-aqua-300 hover:text-aqua-700 hover:shadow-lift',
  ghost: 'text-ink hover:bg-ink/5',
  light: 'btn-shine bg-white text-ink shadow-soft hover:-translate-y-0.5 hover:bg-aqua-50 hover:shadow-lift',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-[15px]',
  lg: 'h-14 px-7 text-base',
}

interface Common {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </a>
  )
}
