import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useNavigation } from '../state/navigation'
import { getCameraPose, HOME_TARGET } from './devices'

export function CameraRig() {
  const { camera, size, invalidate, gl } = useThree()
  const view = useNavigation((s) => s.view)
  const transitionId = useNavigation((s) => s.transitionId)
  const reducedMotion = useReducedMotion()
  const target = useRef(new Vector3(...HOME_TARGET))
  const look = useRef(new Vector3())
  const offset = useRef(new Vector3())
  const wantedOffset = useRef(new Vector3())

  useEffect(() => {
    const pose = getCameraPose(view, size.width / size.height)
    const duration = reducedMotion || transitionId === 0 ? 0 : 0.9
    offset.current.set(0, 0, 0)
    wantedOffset.current.set(0, 0, 0)
    if (duration > 0) useNavigation.getState().beginTransition()
    const timeline = gsap.timeline({
      defaults: { duration, ease: 'power2.inOut' },
      onUpdate: () => { camera.lookAt(target.current); camera.updateMatrixWorld(); invalidate() },
      onComplete: () => { useNavigation.getState().finishTransition(transitionId); invalidate() },
    })
    timeline.to(camera.position, { x: pose.position[0], y: pose.position[1], z: pose.position[2] }, 0)
    timeline.to(target.current, { x: pose.target[0], y: pose.target[1], z: pose.target[2] }, 0)
    return () => { timeline.kill() }
  }, [camera, invalidate, reducedMotion, size.height, size.width, transitionId, view])

  useEffect(() => {
    const canvas = gl.domElement
    const reset = () => { wantedOffset.current.set(0, 0, 0); invalidate() }
    const move = (event: PointerEvent) => {
      const state = useNavigation.getState()
      if (reducedMotion || event.pointerType !== 'mouse' || state.view !== 'office' || state.transitioning) return
      const rect = canvas.getBoundingClientRect()
      wantedOffset.current.set(
        MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1) * 0.16,
        -MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1) * 0.09,
        0,
      )
      invalidate()
    }
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', reset)
    return () => { canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', reset) }
  }, [gl, invalidate, reducedMotion])

  useFrame((_, delta) => {
    const state = useNavigation.getState()
    if (state.view === 'office' && !state.transitioning && !reducedMotion) {
      offset.current.lerp(wantedOffset.current, 1 - Math.exp(-7 * Math.min(delta, 0.05)))
      if (offset.current.distanceToSquared(wantedOffset.current) > 0.000001) invalidate()
    } else offset.current.set(0, 0, 0)
    look.current.copy(target.current).add(offset.current)
    camera.lookAt(look.current)
    camera.updateMatrixWorld()
  })
  return null
}
