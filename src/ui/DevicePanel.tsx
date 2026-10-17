import { useEffect, useRef } from 'react'
import { useNavigation, type DeviceId } from '../state/navigation'
import { devices } from '../scene/devices'
import { Icon, type IconName } from './Icon'

const content: Record<DeviceId, { title: string; text: string; icon: IconName; tags: string[] }> = {
  web: {
    title: 'A home for things I build.',
    text: 'Web projects will live here. For now, this little desktop is the beginning of something good.',
    icon: 'code', tags: ['React', 'TypeScript', 'Made with care'],
  },
  mobile: {
    title: 'Small screen. New possibilities.',
    text: 'A pocket-sized home for future mobile apps. The first ideas are still taking shape.',
    icon: 'phone', tags: ['Mobile apps', 'Thoughtful interactions'],
  },
  games: {
    title: 'Leave a little room for play.',
    text: 'Future games and playful experiments will appear here. No games to launch just yet—this is where they’ll begin.',
    icon: 'gamepad', tags: ['Games', 'Creative experiments'],
  },
}

export function DevicePanel({ device }: { device: DeviceId }) {
  const heading = useRef<HTMLHeadingElement>(null)
  const transitioning = useNavigation((s) => s.transitioning)
  const navigate = useNavigation((s) => s.navigate)
  const item = content[device]

  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [device])

  return (
    <section className={`device-panel ${transitioning ? 'is-traveling' : ''}`} aria-labelledby="device-heading">
      <div className="panel-header">
        <span className="eyebrow">{devices[device].number} / {devices[device].category}</span>
        <button className="icon-button" onClick={() => navigate('office')} aria-label="Close device and return to the office"><Icon name="close" size={17} /></button>
      </div>
      <div className={`mini-interface mini-${device}`} aria-hidden="true">
        {device === 'web' && <><div className="mini-browser"><i /><i /><i /><span>localhost / ideas</span></div><div className="mini-web-content"><Icon name="code" size={26} /><span>Hello, world<span className="accent">.</span><small>Something thoughtful is on its way.</small></span><div className="mini-web-art"><i /><i /><i /></div></div></>}
        {device === 'mobile' && <><div className="mini-phone"><div className="mini-notch" /><div className="mini-app-grid">{['✿', '✓', '☀', '◈', '♡', '♫'].map((icon) => <span key={icon}>{icon}</span>)}</div><span className="mini-phone-bar" /></div><div className="mini-mobile-note"><Icon name="leaf" size={26} /><span>Good ideas<br />go places.</span></div></>}
        {device === 'games' && <><div className="mini-game-sun" /><div className="mini-mountain one" /><div className="mini-mountain two" /><div className="mini-game-caption"><Icon name="gamepad" size={25} /><span>LET’S MAKE SOMETHING FUN</span></div></>}
      </div>
      <div className="panel-copy">
        <h2 id="device-heading" ref={heading} tabIndex={-1}>{item.title}</h2>
        <p>{item.text}</p>
        <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <div className="panel-footer"><span className="small-dot" /> A little preview of what’s next <span className="coming-soon">COMING SOON</span></div>
    </section>
  )
}
