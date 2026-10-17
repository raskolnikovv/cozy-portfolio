import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useNavigation, type DeviceId } from './state/navigation'
import { deviceList, devices } from './scene/devices'
import { Icon, type IconName } from './ui/Icon'
import { DevicePanel } from './ui/DevicePanel'
import { AboutDialog } from './ui/AboutDialog'
import { SceneLabels } from './ui/SceneLabels'

const OfficeCanvas = lazy(() => import('./scene/OfficeCanvas'))
const icons: Record<string, IconName> = { web: 'desktop', mobile: 'phone', games: 'gamepad' }

export default function App() {
  const view = useNavigation((s) => s.view)
  const hovered = useNavigation((s) => s.hovered)
  const navigate = useNavigation((s) => s.navigate)
  const setHovered = useNavigation((s) => s.setHovered)
  const [aboutOpen, setAboutOpen] = useState(false)
  const previousView = useRef(view)
  const deviceButtons = useRef<Record<string, HTMLButtonElement | null>>({})
  const aboutButton = useRef<HTMLButtonElement>(null)
  const labelElements = useRef<Partial<Record<DeviceId, HTMLDivElement | null>>>({})

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !aboutOpen && view !== 'office') navigate('office')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [aboutOpen, navigate, view])

  useEffect(() => {
    if (view === 'office' && previousView.current !== 'office') {
      deviceButtons.current[previousView.current]?.focus({ preventScroll: true })
    }
    previousView.current = view
  }, [view])

  return (
    <div className="site-shell">
      <a href="#explore" className="skip-link">Skip to device navigation</a>
      <header className="site-header">
        <a href="#" className="brand" aria-label="Quiet Space, return to the office" onClick={(event) => { event.preventDefault(); navigate('office') }}>
          <span className="brand-mark"><Icon name="terminal" size={23} /></span>
          <span>quiet space<span className="brand-dot">.</span><small>A DEVELOPER’S LITTLE CORNER</small></span>
        </a>
        <nav className="header-nav" aria-label="Main navigation">
          <button className={!aboutOpen ? 'active' : ''} onClick={() => navigate('office')}>The office</button>
          <button ref={aboutButton} onClick={() => setAboutOpen(true)}>About this space <Icon name="arrow" size={12} className="diagonal-arrow" /></button>
        </nav>
        <span className="header-note"><span className="small-dot" /> Built slowly. With care.</span>
      </header>

      <main>
        <section className="introduction" aria-labelledby="welcome-title">
          <div>
            <div className="eyebrow intro-eyebrow"><span className="tiny-star" aria-hidden="true">✳</span> A QUIET CORNER OF THE INTERNET</div>
            <h1 id="welcome-title">A little space.<br />A lot of <em>possibility.</em></h1>
          </div>
          <div className="intro-aside">
            <p>Somewhere between a line of code<br className="desktop-break" /> and a cup of coffee, ideas come to life.</p>
            <div className="weather"><Icon name="rain" size={23} /><span>A rainy afternoon<small>THE PERFECT WEATHER TO MAKE SOMETHING</small></span></div>
          </div>
        </section>

        <section className={`office-section ${view !== 'office' ? 'device-open' : ''}`} aria-label="Interactive developer office">
          <div className="scene-frame">
            <div className="scene-topbar">
              {view === 'office' ? <span className="room-label"><span className="live-dot" /> THE OFFICE <span className="room-divider">/</span> MAKE YOURSELF AT HOME</span> : <button className="back-button" onClick={() => navigate('office')}><Icon name="back" size={16} /> Back to the office <kbd>esc</kbd></button>}
              <span className="scene-mode">{view === 'office' ? 'A LITTLE WORLD, BUILT WITH CODE' : `${devices[view].number} / ${devices[view].category.toUpperCase()}`}</span>
            </div>
            <div className="canvas-wrap">
              <Suspense fallback={<div className="scene-loading" role="status"><span className="loading-ring" /><span>Making room for you…</span></div>}><OfficeCanvas labelElements={labelElements} /></Suspense>
            </div>
            {view === 'office' && <SceneLabels elements={labelElements} />}
            {view === 'office' && <><div className="scene-caption"><span className="caption-line" /><span>Click a device.<br /><strong>Follow your curiosity.</strong></span></div><div className="scene-corner-note"><Icon name="leaf" size={15} /><span>No rush. You’re right on time.</span></div></>}
            {view !== 'office' && <DevicePanel key={view} device={view} />}
            <div className="sr-only" role="status" aria-live="polite">{view === 'office' ? 'Office overview. Choose a device to explore.' : `${devices[view].category} selected. Placeholder content is open. Press Escape to return.`}</div>
          </div>

          <div className="exploration-bar" id="explore">
            <div className="exploration-heading"><span className="eyebrow">THREE WAYS TO EXPLORE</span><p>Pick a little adventure.</p></div>
            <nav className="device-navigation" aria-label="Explore portfolio devices">
              {deviceList.map((device) => (
                <button
                  key={device.id}
                  ref={(node) => { deviceButtons.current[device.id] = node }}
                  className={`device-card ${hovered === device.id ? 'is-hovered' : ''} ${view === device.id ? 'is-selected' : ''}`}
                  onClick={() => navigate(device.id)}
                  onPointerEnter={() => setHovered(device.id)}
                  onPointerLeave={() => setHovered(null)}
                  onFocus={() => setHovered(device.id)}
                  onBlur={() => setHovered(null)}
                  aria-pressed={view === device.id}
                  aria-label={`Open ${device.category.toLowerCase()}`}
                >
                  <span className={`device-card-icon icon-${device.id}`}><Icon name={icons[device.id]} size={23} /></span>
                  <span className="device-card-text"><small>{device.name} <span>{device.number}</span></small><strong>{device.category}</strong></span>
                  <Icon name="arrow" size={16} className="card-arrow diagonal-arrow" />
                </button>
              ))}
            </nav>
          </div>
        </section>

        <div className="under-scene"><p><span className="tiny-star" aria-hidden="true">✳</span> A space for building, experimenting, and enjoying the process.</p><span>AN INTERACTIVE PORTFOLIO · CHAPTER 01</span></div>
      </main>
      <footer className="site-footer"><span>Made with curiosity <span className="footer-spark" aria-hidden="true">✧</span> and a little coffee.</span><span>Some good things are still growing.<Icon name="leaf" size={14} /></span></footer>
      {aboutOpen && <AboutDialog onClose={() => { setAboutOpen(false); aboutButton.current?.focus() }} />}
    </div>
  )
}
