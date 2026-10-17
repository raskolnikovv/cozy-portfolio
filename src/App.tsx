import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useNavigation, type DeviceId } from './state/navigation'
import { deviceList, devices } from './scene/devices'
import { Icon, type IconName } from './ui/Icon'
import { DeviceExperience } from './ui/DeviceExperience'
import { SceneLabels } from './ui/SceneLabels'

const OfficeCanvas = lazy(() => import('./scene/OfficeCanvas'))
const icons: Record<DeviceId, IconName> = { computer: 'desktop', phone: 'phone', console: 'gamepad' }

export default function App() {
  const view = useNavigation((s) => s.view)
  const transitioning = useNavigation((s) => s.transitioning)
  const navigate = useNavigation((s) => s.navigate)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sceneUnavailable, setSceneUnavailable] = useState(false)
  const markUnavailable = useCallback(() => setSceneUnavailable(true), [])
  const transitionId = useNavigation((s) => s.transitionId)
  const labelElements = useRef<Partial<Record<DeviceId, HTMLDivElement | null>>>({})
  const screenElement = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const lastDevice = useRef<DeviceId | null>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (sceneUnavailable) useNavigation.getState().finishTransition(transitionId)
  }, [sceneUnavailable, transitionId])

  useEffect(() => {
    if (view !== 'office') lastDevice.current = view
    else if (!transitioning && lastDevice.current) {
      const id = lastDevice.current
      const frame = requestAnimationFrame(() => {
        const label = labelElements.current[id]?.querySelector('button')
        if (label && getComputedStyle(label.parentElement!).visibility === 'visible') label.focus({ preventScroll: true })
        else menuButton.current?.focus({ preventScroll: true })
        lastDevice.current = null
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [transitioning, view])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
      else if (view !== 'office') navigate('office')
    }
    const outside = (event: PointerEvent) => {
      if (menuOpen && !menu.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('pointerdown', outside) }
  }, [menuOpen, navigate, view])

  return (
    <main className={`immersive-office ${sceneUnavailable ? 'without-webgl' : ''}`} aria-label="Quiet Space interactive portfolio">
      <h1 className="sr-only">Quiet Space — an office for ideas</h1>
      <div className="office-canvas"><Suspense fallback={<div className="scene-loading" role="status"><span className="loading-ring" />Opening the office…</div>}><OfficeCanvas labelElements={labelElements} screenElement={screenElement} onUnavailable={markUnavailable} /></Suspense></div>
      <div className="scene-vignette" aria-hidden="true" />
      <header className="office-hud">
        <span className="brand"><span className="brand-mark"><Icon name="terminal" size={21} /></span><span>quiet space<span className="brand-dot">.</span><small>AN OFFICE FOR IDEAS</small></span></span>
        <div className="hud-controls">
          {view !== 'office' && <button className="back-button" onClick={() => navigate('office')}><Icon name="back" size={17} /><span>Back to Office</span><kbd aria-hidden="true">esc</kbd></button>}
          <button ref={menuButton} className="menu-button" aria-expanded={menuOpen} aria-controls="device-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Device menu"><span /><span /><span /></button>
        </div>
      </header>
      {menuOpen && <div id="device-menu" ref={menu} className="device-menu"><span className="eyebrow">FIND YOUR WAY</span><nav aria-label="Portfolio devices">{deviceList.map((device) => <button key={device.id} disabled={transitioning || view !== 'office'} onClick={() => { navigate(device.id); setMenuOpen(false) }}><Icon name={icons[device.id]} /><span>{device.category}</span><Icon name="arrow" size={15} /></button>)}</nav><p>Click a device, or use Tab and Enter.<br />Escape brings you back to the office.</p></div>}
      {view === 'office' && !sceneUnavailable && <SceneLabels elements={labelElements} />}
      <div ref={screenElement} inert={view === 'office' || transitioning} className={`screen-anchor ${view === 'office' || transitioning ? 'screen-inactive' : ''}`}>
        {view !== 'office' && <DeviceExperience key={view} device={view} ready={!transitioning} />}
      </div>
      <footer className="office-hints">
        <span className="room-status"><span className="status-dot" />{view === 'office' ? 'A RAINY AFTERNOON' : `${devices[view].number} / ${devices[view].category.toUpperCase()}`}</span>
        <span className="interaction-hint">{transitioning ? 'A little closer…' : view === 'office' ? 'Click an object. Follow your curiosity.' : 'A small preview of what comes next.'}</span>
        <span className="room-status hint-right"><Icon name="leaf" size={14} />MAKE YOURSELF AT HOME</span>
      </footer>
      <div role="status" aria-live="polite" className="sr-only">{transitioning ? 'Moving camera. Back or Escape can cancel.' : view === 'office' ? 'Office overview. Explore the computer, smartphone, or gaming setup.' : `${devices[view].name} ready. Its interactive screen is open.`}</div>
    </main>
  )
}
