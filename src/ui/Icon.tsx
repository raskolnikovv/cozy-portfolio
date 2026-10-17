export type IconName = 'terminal' | 'desktop' | 'phone' | 'gamepad' | 'arrow' | 'back' | 'rain' | 'volume' | 'close' | 'leaf' | 'sun' | 'code'

const paths: Record<IconName, React.ReactNode> = {
  terminal: <><path d="m5 6 5 6-5 6m9 0h5" /></>,
  desktop: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8m-4-4v4" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="3" /><path d="M10 5h4m-3 14h2" /></>,
  gamepad: <><path d="M7 7h10c3 0 4 3 4.5 7l.2 3a2 2 0 0 1-3.5 1.5L15 16H9l-3.2 2.5A2 2 0 0 1 2.3 17l.2-3C3 10 4 7 7 7Z" /><path d="M7 10v5m-2.5-2.5h5m6-1h.01m3 3h.01" /></>,
  arrow: <><path d="M5 12h14m-5-5 5 5-5 5" /></>,
  back: <><path d="M19 12H5m5-5-5 5 5 5" /></>,
  rain: <><path d="M6 15a5 5 0 0 1-1-9.9 6 6 0 0 1 11.4-1A4.5 4.5 0 0 1 18 13h-1M7 17l-1 3m6-3-1 3m6-3-1 3" /></>,
  volume: <><path d="m10 5-5 4H2v6h3l5 4V5Zm5 4 6 6m0-6-6 6" /></>,
  close: <><path d="m6 6 12 12M6 18 18 6" /></>,
  leaf: <><path d="M20 3C7 2 2 7 5 14c3 7 14 5 15-11ZM4 21 15 10" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1" /></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-5 3 2-16" /></>,
}

export function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>
}
