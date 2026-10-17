import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'

const apps = [
  { name: 'Notes', symbol: '≡', color: 'sand', description: 'A little space to collect thoughts.' },
  { name: 'Weather', symbol: '☂', color: 'sage', description: 'A window into the world outside.' },
  { name: 'Focus', symbol: '◷', color: 'clay', description: 'One thing at a time. A calmer kind of timer.' },
  { name: 'Habits', symbol: '✓', color: 'moss', description: 'Small steps, made a little more often.' },
]

export function PhoneInterface() {
  const [selected, setSelected] = useState<number | null>(null)
  const appHeading = useRef<HTMLHeadingElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const previous = useRef<number | null>(null)
  useEffect(() => {
    if (selected !== null) appHeading.current?.focus({ preventScroll: true })
    else if (previous.current !== null) buttons.current[previous.current]?.focus({ preventScroll: true })
    previous.current = selected
  }, [selected])
  const app = selected === null ? null : apps[selected]
  return (
    <div className="phone-interface">
      <div className="phone-status"><span>14:32</span><span className="phone-island" aria-hidden="true" /><span aria-label="Full signal and battery">▥ ▰</span></div>
      {app ? (
        <div className="phone-app">
          <button className="text-button" onClick={() => setSelected(null)}><Icon name="back" size={16} /> All apps</button>
          <div className={`app-symbol theme-${app.color}`} aria-hidden="true">{app.symbol}</div>
          <h2 ref={appHeading} tabIndex={-1}>{app.name}</h2><p>{app.description}</p>
          <div className="app-placeholder"><span className="eyebrow">A LITTLE PREVIEW</span><p>Your future mobile experience starts here. This is a placeholder screen, ready for a real app in a later chapter.</p></div>
        </div>
      ) : (
        <div className="phone-launcher"><span className="eyebrow">YOUR POCKET OF POSSIBILITIES</span><h2>Little things.<br /><em>Good ideas.</em></h2><p>Pick something to explore.</p>
          <div className="app-grid">{apps.map((item, index) => <button key={item.name} ref={(node) => { buttons.current[index] = node }} onClick={() => setSelected(index)} aria-label={`Open ${item.name} app`}><span className={`app-symbol theme-${item.color}`} aria-hidden="true">{item.symbol}</span><span>{item.name}</span></button>)}</div>
          <div className="phone-note"><Icon name="leaf" size={22} /><span>Some good things<br />are still growing.</span></div>
        </div>
      )}
      <div className="phone-home"><span />PROTOTYPE / NOT A REAL APP</div>
    </div>
  )
}
