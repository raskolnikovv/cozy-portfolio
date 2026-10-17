import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useNavigation, type DeviceId } from '../state/navigation'
import { deviceList, getPlacement, isCompact } from './devices'

export type LabelElements = RefObject<Partial<Record<DeviceId, HTMLDivElement | null>>>

export function LabelProjection({ elements }: { elements: LabelElements }) {
  const point = useRef(new Vector3())
  useFrame(({ camera, size }) => {
    camera.updateMatrixWorld()
    const state = useNavigation.getState()
    const compact = isCompact(size.width / size.height)
    for (const device of deviceList) {
      const element = elements.current[device.id]
      if (!element) continue
      const placement = getPlacement(device.id, compact)
      const screen = device.screen
      point.current.set(placement.position[0], placement.position[1] + (screen.center[1] + screen.height / 2) * placement.scale + 0.18, placement.position[2]).project(camera)
      element.style.setProperty('transform', `translate(${(point.current.x * 0.5 + 0.5) * size.width}px, ${(-point.current.y * 0.5 + 0.5) * size.height}px) translate(-50%, -100%)`)
      element.style.setProperty('visibility', state.view === 'office' && point.current.z < 1 ? 'visible' : 'hidden')
    }
  })
  return null
}
