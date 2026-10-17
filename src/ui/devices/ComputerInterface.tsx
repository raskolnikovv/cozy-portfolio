import { useRef, useState } from 'react'
import { Icon } from '../Icon'

const projects = [
  { name: 'Project 01', title: 'A place for the next idea.', description: 'The first web project will live here. A thoughtful little corner, built one interaction at a time.', color: 'sage' },
  { name: 'Project 02', title: 'Something useful. Something simple.', description: 'A second space for a future web application. This browser is a working prototype; the project is still to come.', color: 'clay' },
  { name: 'Project 03', title: 'Room to try something new.', description: 'An open canvas for a future experiment on the web. Come back for the story behind it.', color: 'sand' },
]

export function ComputerInterface() {
  const [selected, setSelected] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const project = projects[selected]
  return (
    <div className="browser-interface">
      <div className="browser-tabs" role="tablist" aria-label="Web projects">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        {projects.map((item, index) => (
          <button key={item.name} ref={(node) => { tabs.current[index] = node }} role="tab" id={`project-tab-${index}`} aria-controls={`project-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => {
              let next: number | undefined
              if (event.key === 'ArrowRight') next = (index + 1) % projects.length
              if (event.key === 'ArrowLeft') next = (index + projects.length - 1) % projects.length
              if (event.key === 'Home') next = 0
              if (event.key === 'End') next = projects.length - 1
              if (next !== undefined) { event.preventDefault(); setSelected(next); tabs.current[next]?.focus() }
            }}
          ><Icon name="code" size={14} />{item.name}</button>
        ))}
      </div>
      <div className="browser-address"><span aria-hidden="true">↶ &nbsp; ↷</span><span className="address-field"><span className="status-dot" /> portfolio.local / project-0{selected + 1}</span><Icon name="leaf" size={14} /></div>
      <div className={`browser-page theme-${project.color}`} role="tabpanel" id={`project-panel-${selected}`} aria-labelledby={`project-tab-${selected}`} tabIndex={0}>
        <div className="project-navigation"><span className="project-wordmark">small things<span>.</span></span><span>DESIGNED WITH INTENTION</span></div>
        <div className="project-layout">
          <div><span className="eyebrow">A FUTURE WEB PROJECT / 0{selected + 1}</span><h2>{project.title}</h2><p>{project.description}</p><div className="project-tags"><span>React</span><span>TypeScript</span><span>Placeholder</span></div><span className="project-status"><span className="status-dot" /> A good beginning. More to come.</span></div>
          <div className="project-art" aria-hidden="true"><span className="art-circle" /><span className="art-arch" /><span className="art-stem" /><span className="art-caption">GROW AT YOUR OWN PACE.</span></div>
        </div>
        <div className="project-bottom">No real application is embedded yet.<span>CHAPTER 01</span></div>
      </div>
    </div>
  )
}
