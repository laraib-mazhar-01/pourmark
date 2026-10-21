export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 36 36" className="h-9 w-9" aria-hidden>
        <rect width="36" height="36" rx="11" fill={light ? '#FFFFFF' : '#0B1A2A'} />
        <path d="M18 7.5c4 5 8 9.6 8 14.2a8 8 0 0 1-16 0c0-4.6 4-9.2 8-14.2z" fill="#559CDF" />
        <path d="M14.6 22.4a3.6 3.6 0 0 0 3.6 3.6" stroke={light ? '#0B1A2A' : '#FFFFFF'} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
      <span className={`font-display text-[26px] leading-none tracking-tight ${light ? 'text-white' : 'text-ink'}`}>Pourmark</span>
    </span>
  )
}
