import type { ThreeElements } from '@react-three/fiber'
import type { Point3 } from '../devices'

type BoxProps = Omit<ThreeElements['mesh'], 'args'> & {
  size: Point3
  color: string
  glow?: number
}

export function Box({ size, color, glow = 0, ...props }: BoxProps) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.8} emissive={color} emissiveIntensity={glow} />
    </mesh>
  )
}

export function Plant({ position, scale = 1 }: { position: Point3; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.18, 0.44, 8]} />
        <meshStandardMaterial color="#ba7050" flatShading />
      </mesh>
      <mesh position={[0, 0.45, 0]}><cylinderGeometry args={[0.225, 0.225, 0.025, 8]} /><meshStandardMaterial color="#3d3023" /></mesh>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = i * 2.4
        return (
          <group key={i} rotation={[0.3, angle, 0.5]} position={[0, 0.45, 0]}>
            <mesh position={[0, 0.38 + i * 0.045, 0]} scale={[0.18, 0.55, 0.08]} castShadow>
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color={i % 2 ? '#4b6c49' : '#78915a'} flatShading />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
