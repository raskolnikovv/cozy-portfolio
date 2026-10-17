import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { CameraRig } from './CameraRig'
import { Office } from './models/Office'
import { CAMERA_FOV, HOME_POSITION } from './devices'
import { LabelProjection, type LabelElements } from './LabelProjection'
import { ScreenProjection, type ScreenElement } from './ScreenProjection'
import { PCFShadowMap } from 'three'

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return <SceneFallback onUnavailable={this.props.onUnavailable} />
    return this.props.children
  }
}

function SceneFallback({ onUnavailable }: { onUnavailable: () => void }) {
  useEffect(() => { onUnavailable() }, [onUnavailable])
  return (
    <div className="scene-fallback" role="status">
      <span className="fallback-icon" aria-hidden="true">⌘</span>
      <h2>A little less dimension.</h2>
      <p>The 3D room needs WebGL. Open the device menu to explore the same interfaces.</p>
    </div>
  )
}

export default function OfficeCanvas({ labelElements, screenElement, onUnavailable }: { labelElements: LabelElements; screenElement: ScreenElement; onUnavailable: () => void }) {
  return (
    <SceneBoundary onUnavailable={onUnavailable}>
      <Canvas
        shadows={{ type: PCFShadowMap }}
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: HOME_POSITION, fov: CAMERA_FOV, near: 0.1, far: 90 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        fallback={<p>WebGL is required. Open the device menu to explore.</p>}
        role="group"
        aria-label="A cozy 3D office with a desktop computer, phone, and game console. Open the device menu to explore."
      >
        <color attach="background" args={['#bfc6b6']} />
        <fog attach="fog" args={['#bfc6b6', 25, 55]} />
        <hemisphereLight args={['#e4ecda', '#8c7055', 1.25]} />
        <ambientLight intensity={0.35} color="#ffe9c5" />
        <directionalLight
          position={[3, 8, 5]}
          intensity={2.2}
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
        <ScreenProjection element={screenElement} />
        <AdaptiveDpr pixelated />
      </Canvas>
    </SceneBoundary>
  )
}
