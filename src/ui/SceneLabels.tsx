import { deviceList } from '../scene/devices'
import type { LabelElements } from '../scene/LabelProjection'
import { useNavigation } from '../state/navigation'
import { Icon } from './Icon'

export function SceneLabels({ elements }: { elements: LabelElements }) {
  const hovered = useNavigation((s) => s.hovered)
  const transitioning = useNavigation((s) => s.transitioning)
  const navigate = useNavigation((s) => s.navigate)
  const setHovered = useNavigation((s) => s.setHovered)
  return deviceList.map((device) => (
    <div key={device.id} className="scene-label-anchor" ref={(node) => { elements.current[device.id] = node }}>
      <button className={`scene-label ${hovered === device.id ? 'is-hovered' : ''}`} disabled={transitioning}
        onClick={() => navigate(device.id)} onPointerEnter={() => setHovered(device.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(device.id)} onBlur={() => setHovered(null)} aria-label={`Explore ${device.category.toLowerCase()}`}>
        <span className="label-number">{device.number}</span><span className="label-full">{device.category}</span><span className="label-short">{device.id === 'computer' ? 'Web projects' : device.id === 'phone' ? 'Apps' : 'Games'}</span><Icon name="arrow" size={13} />
      </button>
    </div>
  ))
}
