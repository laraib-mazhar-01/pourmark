import { useState, type ImgHTMLAttributes } from 'react'

/** Image with lazy loading, fade-in and a graceful gradient fallback if the source fails. */
export function SmartImage({ className = '', alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { alt: string }) {
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-aqua-100 via-mist to-sand ${className}`}>
      {state !== 'error' && (
        <img
          loading="lazy"
          decoding="async"
          alt={alt}
          onLoad={() => setState('ok')}
          onError={() => setState('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'}`}
          {...rest}
        />
      )}
      {state === 'error' && <span className="sr-only">{alt}</span>}
    </div>
  )
}
