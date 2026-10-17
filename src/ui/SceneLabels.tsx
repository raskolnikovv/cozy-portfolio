import { deviceList } from '../scene/devices'
import type { LabelElements } from '../scene/LabelProjection'
import { useNavigation } from '../state/navigation'
import { Icon } from './Icon'

export function SceneLabels({ elements }: { elements: LabelElements }) {
  const hovered = useNavigation((s) => s.hovered)
  const navigate = useNavigation((s) => s.navigate)
  const setHovered = useNavigation((s) => s.setHovered)
  return deviceList.map((device) => (
    <div key={device.id} className="scene-label-anchor" ref={(node) => { elements.current[device.id] = node }}>
      <button
        className={`scene-label ${hovered === device.id ? 'is-hovered' : ''}`}
        onClick={() => navigate(device.id)}
        onPointerEnter={() => setHovered(device.id)}
        onPointerLeave={() => setHovered(null)}
        onFocus={() => setHovered(device.id)}
        onBlur={() => setHovered(null)}
        aria-label={`Explore ${device.category.toLowerCase()}`}
      >
        <span className="label-number">{device.number}</span>
        <span className="label-full">{device.id === 'web' ? 'Web projects' : device.id === 'games' ? 'Games' : device.category}</span>
        <span className="label-short">{device.id === 'web' ? 'Desktop' : device.id === 'mobile' ? 'Phone' : 'Games'}</span>
        <Icon name="arrow" size={12} className="label-arrow diagonal-arrow" />
      </button>
    </div>
  ))
}
