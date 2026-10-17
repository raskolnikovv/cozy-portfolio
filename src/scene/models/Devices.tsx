import { useEffect, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import { Group } from 'three'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useNavigation } from '../../state/navigation'
import { getPlacement, isCompact } from '../devices'
import { Box } from './Primitives'
import { InteractiveDevice } from './InteractiveDevice'

function ScreenLines() {
  return (
    <group position={[-0.72, 1.04, 0.105]}>
      <Box size={[0.045, 0.62, 0.012]} color="#3e5650" position={[0, -0.18, 0]} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <group key={i} position={[0.15 + (i % 2) * 0.08, -i * 0.105, 0]}>
          <Box size={[0.3 + (i % 3) * 0.15, 0.028, 0.014]} color={['#d9a670', '#95b8a1', '#8ba6a5'][i % 3]} />
          <Box size={[0.18, 0.028, 0.014]} color="#5d8176" position={[0.46, 0, 0]} />
        </group>
      ))}
    </group>
  )
}

export function Computer() {
  return (
    <InteractiveDevice id="computer">
      <Box size={[0.7, 0.055, 0.4]} color="#303934" position={[0, 0.03, 0]} />
      <Box size={[0.13, 0.34, 0.12]} color="#424a43" position={[0, 0.2, -0.05]} />
      <Box size={[2.03, 1.27, 0.12]} color="#222e2b" position={[0, 0.9, 0]} />
      <Box size={[1.88, 1.1, 0.012]} color="#253e39" glow={0.5} position={[0, 0.91, 0.068]} />
      <Box size={[1.88, 0.08, 0.018]} color="#61766a" position={[0, 1.42, 0.078]} />
      <ScreenLines />
      <Box size={[0.5, 0.7, 0.015]} color="#344e45" position={[0.62, 0.82, 0.09]} />
      <mesh position={[0.62, 0.95, 0.11]}><circleGeometry args={[0.13, 5]} /><meshBasicMaterial color="#d5b781" /></mesh>
      <Box size={[0.3, 0.03, 0.02]} color="#9cb39b" position={[0.62, 0.66, 0.11]} />
      <Box size={[0.2, 0.025, 0.02]} color="#6f927e" position={[0.62, 0.59, 0.11]} />
      <mesh position={[0, 0.295, 0.067]}><circleGeometry args={[0.018, 8]} /><meshBasicMaterial color="#b9d1a7" /></mesh>
    </InteractiveDevice>
  )
}

export function Smartphone() {
  const compact = useThree((s) => isCompact(s.size.width / s.size.height))
  const pickedUp = useNavigation((s) => s.view === 'phone')
  const reducedMotion = useReducedMotion()
  const model = useRef<Group>(null)
  const [initial] = useState(() => getPlacement('phone', compact))
  const resting = getPlacement('phone', compact)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (!model.current) return
    const placement = getPlacement('phone', compact, pickedUp)
    const duration = reducedMotion ? 0 : 0.75
    const timeline = gsap.timeline({ defaults: { duration, ease: 'power2.inOut' }, onUpdate: invalidate })
    timeline.to(model.current.position, { x: placement.position[0], y: placement.position[1], z: placement.position[2] }, 0)
    timeline.to(model.current.scale, { x: placement.scale, y: placement.scale, z: placement.scale }, 0)
    timeline.to(model.current.rotation, { x: pickedUp ? 0 : -0.1, y: 0, z: pickedUp ? 0 : -0.04 }, 0)
    return () => { timeline.kill() }
  }, [compact, invalidate, pickedUp, reducedMotion])
  return (
    <>
    <Box size={[0.48, 0.055, 0.32]} color="#bb8f61" position={[resting.position[0], resting.position[1] + 0.03, resting.position[2]]} />
    <group ref={model} position={initial.position} scale={initial.scale}>
      <InteractiveDevice id="phone" placed>
        <Box size={[0.47, 0.94, 0.075]} color="#253530" position={[0, 0.5, 0]} />
        <Box size={[0.4, 0.8, 0.014]} color="#a3b59c" glow={0.3} position={[0, 0.5, 0.047]} />
        <Box size={[0.13, 0.025, 0.018]} color="#253530" position={[0, 0.93, 0.056]} />
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} size={[0.075, 0.075, 0.015]} color={['#eff0cf', '#d69364', '#647f6c'][i % 3]} position={[-0.12 + (i % 3) * 0.12, 0.65 - Math.floor(i / 3) * 0.14, 0.059]} />
        ))}
        <Box size={[0.12, 0.018, 0.012]} color="#f5efdb" position={[0, 0.08, 0.056]} />
      </InteractiveDevice>
    </group>
    </>
  )
}

export function GamingSetup() {
  const active = useNavigation((s) => s.view === 'console')
  const compact = useThree((s) => isCompact(s.size.width / s.size.height))
  const consoleY = compact ? 0.12 : -0.6
  const consoleZ = compact ? 0.8 : 0.25
  return (
    <InteractiveDevice id="console">
      <Box size={[0.07, 0.22, 0.34]} color="#303932" position={[-0.67, 0.12, 0.1]} rotation={[0, 0, -0.3]} />
      <Box size={[0.07, 0.22, 0.34]} color="#303932" position={[0.67, 0.12, 0.1]} rotation={[0, 0, 0.3]} />
      <Box size={[2.2, 1.35, 0.13]} color="#28342e" position={[0, 0.88, 0]} />
      <Box size={[2.03, 1.17, 0.015]} color={active ? '#20473e' : '#344b44'} glow={active ? 1 : 0.12} position={[0, 0.9, 0.075]} />
      {!active && <>
        <mesh position={[0.57, 1.15, 0.09]}><circleGeometry args={[0.17, 12]} /><meshBasicMaterial color="#c9c39b" /></mesh>
        <mesh position={[-0.3, 0.78, 0.1]}><circleGeometry args={[0.54, 3]} /><meshBasicMaterial color="#456c60" /></mesh>
        <mesh position={[0.45, 0.73, 0.11]}><circleGeometry args={[0.45, 3]} /><meshBasicMaterial color="#5b8270" /></mesh>
      </>}
      <Box size={[0.64, 0.21, 0.6]} color="#e1d5bb" position={[0.48, consoleY, consoleZ]} />
      <Box size={[0.64, 0.035, 0.6]} color="#303c35" position={[0.48, consoleY + 0.015, consoleZ]} />
      <Box size={[0.03, 0.025, 0.015]} color={active ? '#9eddb0' : '#878e78'} glow={active ? 1 : 0} position={[0.7, consoleY - 0.04, consoleZ + 0.31]} />
      <group position={[-0.22, 0.06, 0.7]} rotation={[0.2, 0.1, 0]}>
        <Box size={[0.44, 0.12, 0.23]} color="#343c36" />
        <Box size={[0.045, 0.018, 0.1]} color="#b6ae94" position={[-0.12, 0.065, 0]} />
        <Box size={[0.1, 0.018, 0.035]} color="#b6ae94" position={[-0.12, 0.065, 0]} />
        <Box size={[0.035, 0.018, 0.035]} color="#c28760" position={[0.12, 0.065, 0]} />
      </group>
    </InteractiveDevice>
  )
}
