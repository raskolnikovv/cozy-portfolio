import { Box, Plant } from './Primitives'
import { Computer, GamingSetup, Smartphone } from './Devices'

function ForestWindow() {
  return (
    <group>
      {/* A real opening in the wall, with layered geometry for a misty view. */}
      <Box size={[5.5, 3.6, 0.06]} color="#a6b9ad" glow={0.14} position={[0.5, 3.47, -5.4]} />
      {[-2.2, -0.8, 1.2, 2.8].map((x, i) => (
        <mesh key={x} position={[x, 2.95 + (i % 2) * 0.45, -5.2]} scale={[2.3, 1.5 + (i % 2) * 0.4, 0.1]}>
          <coneGeometry args={[1, 1.8, 4]} />
          <meshStandardMaterial color={i % 2 ? '#829e93' : '#91a99e'} flatShading />
        </mesh>
      ))}
      {Array.from({ length: 13 }, (_, i) => {
        const x = -2.45 + i * 0.49
        const height = 0.9 + ((i * 7) % 5) * 0.21
        return (
          <group key={i} position={[x, 1.8, -4.45 - (i % 3) * 0.18]}>
            <Box size={[0.07, height, 0.07]} color="#657e6d" position={[0, height / 2, 0]} />
            <mesh position={[0, height * 0.8, 0]}><coneGeometry args={[0.43, height, 5]} /><meshStandardMaterial color={i % 2 ? '#648775' : '#73937f'} flatShading /></mesh>
            <mesh position={[0, height * 1.1, 0]}><coneGeometry args={[0.33, height * 0.8, 5]} /><meshStandardMaterial color="#7b9b87" flatShading /></mesh>
          </group>
        )
      })}
      <Box size={[5.55, 0.13, 0.35]} color="#a5784d" position={[0.5, 1.72, -3.39]} />
      <Box size={[5.55, 0.14, 0.23]} color="#846344" position={[0.5, 5.22, -3.43]} />
      {[-2.23, 0.5, 3.23].map((x) => <Box key={x} size={[0.13, 3.5, 0.22]} color="#7f6348" position={[x, 3.47, -3.43]} />)}
      <Box size={[5.4, 0.09, 0.16]} color="#8d7152" position={[0.5, 3.45, -3.43]} />
      <mesh position={[0.5, 3.47, -3.52]}>
        <planeGeometry args={[5.3, 3.42]} />
        <meshStandardMaterial color="#b0c9b8" transparent opacity={0.09} roughness={0.22} />
      </mesh>
      {/* Static rain marks suggest the weather without a particle simulation. */}
      {Array.from({ length: 24 }, (_, i) => (
        <mesh key={i} position={[-2.05 + ((i * 0.71) % 5.05), 1.95 + ((i * 0.53) % 2.95), -3.54]} rotation={[0, 0, -0.14]}>
          <planeGeometry args={[0.012, 0.055 + (i % 3) * 0.035]} />
          <meshBasicMaterial color="#d6e6d9" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  )
}

function Room() {
  return (
    <group>
      <Box size={[11.2, 0.25, 7.2]} color="#664a35" position={[0, -0.19, 0]} />
      {Array.from({ length: 15 }, (_, i) => (
        <Box key={i} size={[11, 0.07, 0.453]} color={['#b68b5d', '#ae8052', '#be9466', '#ac8157'][i % 4]} position={[0, -0.025, -3.27 + i * 0.466]} />
      ))}
      <Box size={[3.25, 5.7, 0.18]} color="#c7b898" position={[-3.91, 2.83, -3.55]} />
      <Box size={[2.3, 5.7, 0.18]} color="#c7b898" position={[4.46, 2.83, -3.55]} />
      <Box size={[5.55, 1.67, 0.18]} color="#c7b898" position={[0.5, 0.81, -3.55]} />
      <Box size={[5.55, 0.48, 0.18]} color="#c7b898" position={[0.5, 5.47, -3.55]} />
      <Box size={[0.18, 5.7, 7.1]} color="#b0a184" position={[-5.59, 2.83, -0.04]} />
      <Box size={[11.1, 0.15, 0.08]} color="#8c6a48" position={[0, 0.13, -3.42]} />
      <Box size={[0.08, 0.15, 7]} color="#8c6a48" position={[-5.45, 0.13, 0]} />
      <ForestWindow />
    </group>
  )
}

function Furniture() {
  return (
    <group>
      {/* The desk, kept independent of replaceable device models. */}
      <Box size={[5.65, 0.19, 2.35]} color="#be8a54" position={[0.35, 1.83, 0.06]} />
      <Box size={[5.65, 0.065, 2.35]} color="#d2a46d" position={[0.35, 1.93, 0.06]} />
      {[-2.05, 2.7].flatMap((x) => [-0.77, 0.88].map((z) => <Box key={`${x}-${z}`} size={[0.16, 1.76, 0.16]} color="#785237" position={[x, 0.89, z]} />))}
      <Box size={[5.05, 0.15, 0.14]} color="#8b613e" position={[0.35, 0.65, -0.77]} />
      <Box size={[2.85, 0.025, 1.08]} color="#576457" position={[0.35, 1.98, 0.32]} />
      <Box size={[1.42, 0.055, 0.49]} color="#d1c6a9" position={[0.08, 2.02, 0.35]} rotation={[0.02, 0, 0]} />
      {Array.from({ length: 36 }, (_, i) => <Box key={i} size={[0.078, 0.018, 0.066]} color="#737a69" position={[-0.51 + (i % 12) * 0.106, 2.055, 0.21 + Math.floor(i / 12) * 0.1]} />)}
      <mesh position={[1.17, 2.035, 0.37]} scale={[0.105, 0.065, 0.15]} castShadow><sphereGeometry args={[1, 8, 6]} /><meshStandardMaterial color="#c6bfa4" flatShading /></mesh>
      {/* Low media cabinet and its open console shelf. */}
      <Box size={[2.65, 0.12, 1.06]} color="#ae7b4a" position={[-3.48, 1.04, -1.5]} />
      <Box size={[2.65, 0.12, 1.06]} color="#97633d" position={[-3.48, 0.28, -1.5]} />
      {[-4.72, -2.24].map((x) => <Box key={x} size={[0.14, 0.78, 1.06]} color="#a16e43" position={[x, 0.64, -1.5]} />)}
      <Box size={[2.4, 0.62, 0.05]} color="#78583c" position={[-3.48, 0.64, -2]} />
      {[-4.55, -2.4].map((x) => <Box key={x} size={[0.12, 0.25, 0.12]} color="#6d4b32" position={[x, 0.13, -1.5]} />)}
      {/* Woven rug and a compact reading chair. */}
      <Box size={[5.5, 0.028, 2.7]} color="#b5a17c" position={[0.5, 0.03, 1.65]} />
      {[-1.15, -0.97, 2.9, 3.08].map((x) => <Box key={x} size={[0.035, 0.006, 2.65]} color="#7d846c" position={[x, 0.048, 1.65]} />)}
      <group position={[0.1, 0, 2.13]} rotation={[0, -0.16, 0]}>
        {[[-0.44, -0.35], [0.44, -0.35], [-0.44, 0.42], [0.44, 0.42]].map(([x, z], i) => <Box key={i} size={[0.08, 0.73, 0.08]} color="#5c5039" position={[x, 0.36, z]} rotation={[0.12, 0, x > 0 ? -0.1 : 0.1]} />)}
        <Box size={[1.25, 0.24, 1.12]} color="#65735b" position={[0, 0.83, 0]} />
        <Box size={[1.26, 1.05, 0.2]} color="#718165" position={[0, 1.38, 0.45]} rotation={[-0.12, 0, 0]} />
        {[-0.67, 0.67].map((x) => <Box key={x} size={[0.12, 0.14, 0.9]} color="#95744b" position={[x, 1.18, 0.05]} />)}
      </group>
    </group>
  )
}

function DeskLamp() {
  return (
    <group position={[2.75, 1.97, -0.72]}>
      <mesh castShadow><cylinderGeometry args={[0.23, 0.26, 0.075, 12]} /><meshStandardMaterial color="#b99a5b" /></mesh>
      <Box size={[0.045, 0.87, 0.045]} color="#a88b50" position={[0, 0.44, 0]} rotation={[0, 0, -0.2]} />
      <mesh position={[-0.15, 0.98, 0]} castShadow><coneGeometry args={[0.38, 0.4, 12, 1, true]} /><meshStandardMaterial color="#d3b275" side={2} /></mesh>
      <mesh position={[-0.15, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.33, 12]} /><meshStandardMaterial color="#ffe2a1" emissive="#ffd184" emissiveIntensity={1.8} side={2} /></mesh>
      <pointLight position={[-0.15, 0.72, 0]} intensity={5} distance={5} color="#ffc582" decay={2} />
    </group>
  )
}

function SleepingCat() {
  return (
    <group position={[4.12, 0.12, 1.2]} rotation={[0, -0.3, 0]}>
      <mesh receiveShadow><cylinderGeometry args={[0.87, 0.8, 0.18, 16]} /><meshStandardMaterial color="#8b846b" flatShading /></mesh>
      <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.7, 0.12, 5, 20]} /><meshStandardMaterial color="#9e977d" flatShading /></mesh>
      <mesh position={[0, 0.27, 0]} scale={[0.58, 0.28, 0.4]} castShadow><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#cd9a60" flatShading /></mesh>
      <mesh position={[0.36, 0.36, 0.21]} scale={[0.27, 0.24, 0.24]} castShadow><icosahedronGeometry args={[1, 1]} /><meshStandardMaterial color="#dfb57d" flatShading /></mesh>
      {[0.2, 0.48].map((x) => <mesh key={x} position={[x, 0.58, 0.2]} rotation={[0, 0.3, -0.1]}><coneGeometry args={[0.11, 0.21, 3]} /><meshStandardMaterial color="#bf8854" flatShading /></mesh>)}
      {[0.26, 0.46].map((x) => <Box key={x} size={[0.07, 0.017, 0.02]} color="#65513c" position={[x, 0.39, 0.427]} rotation={[0, 0, x < 0.3 ? -0.12 : 0.12]} />)}
      <mesh position={[-0.12, 0.31, 0.24]} rotation={[Math.PI / 2, 0, -0.3]}><torusGeometry args={[0.3, 0.08, 5, 12, Math.PI * 1.4]} /><meshStandardMaterial color="#b8804b" flatShading /></mesh>
    </group>
  )
}

function Decor() {
  return (
    <group>
      <Plant position={[4.5, 0.03, -2.5]} scale={2.1} />
      <Plant position={[-4.65, 0.03, 1.1]} scale={1.65} />
      <Plant position={[-1.72, 1.98, -0.73]} scale={0.68} />
      <DeskLamp />
      <SleepingCat />
      {/* A few books and a plant, rather than an asset-heavy collection. */}
      <Box size={[2.45, 0.12, 0.55]} color="#936841" position={[-3.92, 4.02, -3.16]} />
      <Plant position={[-4.63, 4.1, -3.12]} scale={0.64} />
      {['#727e68', '#b87551', '#ddc69b', '#536e64', '#a58b64'].map((color, i) => <Box key={color} size={[0.17, 0.48 + (i % 2) * 0.13, 0.32]} color={color} position={[-3.9 + i * 0.19, 4.32 + (i % 2) * 0.065, -3.17]} rotation={[0, 0, i === 4 ? -0.14 : 0]} />)}
      <Box size={[1.6, 0.1, 0.45]} color="#936841" position={[4.4, 3.6, -3.23]} />
      <Plant position={[4.7, 3.68, -3.19]} scale={0.72} />
      <Box size={[0.48, 0.08, 0.31]} color="#8b6b52" position={[3.94, 3.7, -3.17]} />
      <Box size={[0.42, 0.06, 0.31]} color="#b2af8b" position={[3.96, 3.77, -3.17]} />
      {/* Framed art on the left wall. */}
      <group position={[-5.45, 3.1, -0.8]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.22, 1.65, 0.08]} color="#715137" />
        <Box size={[1.06, 1.49, 0.015]} color="#dcc8a2" position={[0, 0, 0.05]} />
        <mesh position={[0.21, 0.32, 0.065]}><circleGeometry args={[0.22, 12]} /><meshBasicMaterial color="#ba754d" /></mesh>
        <mesh position={[-0.13, -0.17, 0.07]} scale={[0.7, 1, 1]}><circleGeometry args={[0.6, 3]} /><meshBasicMaterial color="#72846d" /></mesh>
      </group>
      {/* Mug and notebook. */}
      <group position={[1.65, 2.09, 0.65]}>
        <mesh castShadow><cylinderGeometry args={[0.12, 0.1, 0.23, 12]} /><meshStandardMaterial color="#eee0bd" /></mesh>
        <mesh position={[0, 0.12, 0]}><cylinderGeometry args={[0.1, 0.1, 0.012, 12]} /><meshStandardMaterial color="#604732" /></mesh>
        <mesh position={[0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[0.075, 0.025, 6, 12]} /><meshStandardMaterial color="#eee0bd" /></mesh>
      </group>
      <Box size={[0.56, 0.045, 0.73]} color="#ad6f4d" position={[-1.8, 2.005, 0.58]} rotation={[0, -0.18, 0]} />
    </group>
  )
}

export function Office() {
  return (
    <group>
      <Room />
      <Furniture />
      <Computer />
      <Smartphone />
      <GamingSetup />
      <Decor />
    </group>
  )
}
