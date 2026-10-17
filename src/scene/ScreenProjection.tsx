import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'
import { useNavigation } from '../state/navigation'
import { getScreen, isCompact } from './devices'

export type ScreenElement = RefObject<HTMLDivElement | null>

// Active cameras face screen planes directly. Projecting their corners produces
// an exact HTML rectangle, with no second React root, iframe, or texture renderer.
export function ScreenProjection({ element }: { element: ScreenElement }) {
  const topLeft = useRef(new Vector3())
  const bottomRight = useRef(new Vector3())
  useFrame(({ camera, size }) => {
    const node = element.current
    if (!node) return
    const { view, transitioning } = useNavigation.getState()
    if (view === 'office' || transitioning) { node.style.setProperty('visibility', 'hidden'); return }
    const screen = getScreen(view, isCompact(size.width / size.height))
    topLeft.current.set(screen.center[0] - screen.width / 2, screen.center[1] + screen.height / 2, screen.center[2]).project(camera)
    bottomRight.current.set(screen.center[0] + screen.width / 2, screen.center[1] - screen.height / 2, screen.center[2]).project(camera)
    const x = (topLeft.current.x + 1) * size.width / 2
    const y = (1 - topLeft.current.y) * size.height / 2
    const width = (bottomRight.current.x - topLeft.current.x) * size.width / 2
    const height = (topLeft.current.y - bottomRight.current.y) * size.height / 2
    node.style.setProperty('left', `${x}px`)
    node.style.setProperty('top', `${y}px`)
    node.style.setProperty('width', `${width}px`)
    node.style.setProperty('height', `${height}px`)
    node.style.setProperty('visibility', 'visible')
  })
  return null
}
