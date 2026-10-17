import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import type { DeviceId } from '../state/navigation'
import { deviceList } from './devices'

export type LabelElements = RefObject<Partial<Record<DeviceId, HTMLDivElement | null>>>

// Project into the main React DOM tree rather than creating a second React root
// per label. No React state updates or allocations are needed on animation frames.
export function LabelProjection({ elements }: { elements: LabelElements }) {
  const point = useRef(new Vector3())
  useFrame(({ camera, size }) => {
    // Camera tweens run before the renderer refreshes matrixWorld. Project using
    // the current orientation, including the last frame of a demand-rendered move.
    camera.updateMatrixWorld()
    for (const device of deviceList) {
      const element = elements.current[device.id]
      if (!element) continue
      point.current.set(...device.label).project(camera)
      const x = (point.current.x * 0.5 + 0.5) * size.width
      const y = (-point.current.y * 0.5 + 0.5) * size.height
      element.style.setProperty('transform', `translate(${x}px, ${y}px) translate(-50%, -100%)`)
      element.style.setProperty('visibility', point.current.z < 1 ? 'visible' : 'hidden')
    }
  })
  return null
}
