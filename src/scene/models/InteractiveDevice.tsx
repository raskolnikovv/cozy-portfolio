import { useEffect, type ReactNode } from 'react'
import { useThree } from '@react-three/fiber'
import { useNavigation, type DeviceId } from '../../state/navigation'
import { devices } from '../devices'

export function InteractiveDevice({ id, children }: { id: DeviceId; children: ReactNode }) {
  const config = devices[id]
  const hovered = useNavigation((s) => s.hovered === id)
  const view = useNavigation((s) => s.view)
  const setHovered = useNavigation((s) => s.setHovered)
  const navigate = useNavigation((s) => s.navigate)
  const canvas = useThree((s) => s.gl.domElement)

  useEffect(() => {
    if (hovered) canvas.style.setProperty('cursor', 'pointer')
    return () => { canvas.style.removeProperty('cursor') }
  }, [canvas, hovered])

  return (
    <>
      <group
        position={config.position}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(id) }}
        onPointerOut={() => setHovered(null)}
        onClick={(event) => { event.stopPropagation(); navigate(id) }}
      >
        <group scale={hovered && view === 'office' ? 1.035 : 1}>{children}</group>
      </group>
    </>
  )
}
