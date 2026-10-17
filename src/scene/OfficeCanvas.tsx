import { Component, Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { Office } from './models/Office'
import { HOME_POSITION } from './devices'
import { LabelProjection, type LabelElements } from './LabelProjection'
import { PCFShadowMap } from 'three'

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <SceneFallback />
    return this.props.children
  }
}

function SceneFallback() {
  return (
    <div className="scene-fallback" role="status">
      <span className="fallback-icon" aria-hidden="true">⌘</span>
      <h2>A little less dimension.</h2>
      <p>The 3D room needs WebGL. You can still explore every device using the buttons below.</p>
    </div>
  )
}

export default function OfficeCanvas({ labelElements }: { labelElements: LabelElements }) {
  return (
    <SceneBoundary>
      <Canvas
        shadows={{ type: PCFShadowMap }}
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: HOME_POSITION, fov: 40, near: 0.1, far: 90 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        fallback={<SceneFallback />}
        role="group"
        aria-label="A cozy 3D office with a desktop computer, phone, and game console. Use the device buttons to explore."
      >
        <color attach="background" args={['#bfc6b6']} />
        <fog attach="fog" args={['#bfc6b6', 25, 55]} />
        <hemisphereLight args={['#e4ecda', '#8c7055', 2.0]} />
        <ambientLight intensity={0.35} color="#ffe9c5" />
        <directionalLight
          position={[3, 8, 5]}
          intensity={3.3}
          color="#ffddb0"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-normalBias={0.045}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[0, 5, -5]} intensity={1.2} color="#bfd7cd" />
        <Suspense fallback={null}><Office /></Suspense>
        <CameraRig />
        <LabelProjection elements={labelElements} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </SceneBoundary>
  )
}
