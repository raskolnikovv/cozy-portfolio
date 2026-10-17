import { useEffect, type ReactNode } from 'react'
import { useThree } from '@react-three/fiber'
import { useNavigation, type DeviceId } from '../../state/navigation'
import { getPlacement, isCompact } from '../devices'

export function InteractiveDevice({ id, children, placed = false }: { id: DeviceId; children: ReactNode; placed?: boolean }) {
  const compact = useThree((s) => isCompact(s.size.width / s.size.height))
  const canvas = useThree((s) => s.gl.domElement)
  const hovered = useNavigation((s) => s.hovered === id)
  const view = useNavigation((s) => s.view)
  const transitioning = useNavigation((s) => s.transitioning)
  const setHovered = useNavigation((s) => s.setHovered)
  const navigate = useNavigation((s) => s.navigate)
  const placement = getPlacement(id, compact)
  const enabled = view === 'office' && !transitioning
  useEffect(() => {
    if (hovered && enabled) canvas.style.setProperty('cursor', 'pointer')
    return () => { canvas.style.removeProperty('cursor') }
  }, [canvas, enabled, hovered])
  return (
    <group
      position={placed ? undefined : placement.position}
      scale={placed ? undefined : placement.scale}
      onPointerOver={(event) => { event.stopPropagation(); if (enabled) setHovered(id) }}
      onPointerOut={() => setHovered(null)}
      onClick={(event) => { event.stopPropagation(); if (enabled) navigate(id) }}
    >
      <group scale={hovered && enabled ? 1.015 : 1}>{children}</group>
    </group>
  )
}
