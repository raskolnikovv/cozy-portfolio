import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useNavigation } from '../state/navigation'
import { devices, HOME_POSITION, HOME_TARGET } from './devices'

export function CameraRig() {
  const { camera, size, invalidate } = useThree()
  const view = useNavigation((s) => s.view)
  const reducedMotion = useReducedMotion()
  const target = useRef(new Vector3(...HOME_TARGET))
  const initialized = useRef(false)

  useEffect(() => {
    const pose = view === 'office'
      ? { position: HOME_POSITION, target: HOME_TARGET }
      : devices[view].camera
    const position = new Vector3(...pose.position)
    const destinationTarget = new Vector3(...pose.target)
    // The mobile content panel lives below the device: aim slightly lower to
    // compose the device in the upper half instead of hiding it behind HTML.
    if (view !== 'office' && size.width < 760) {
      destinationTarget.y -= position.distanceTo(destinationTarget) * 0.16
    }
    // Pull back on portrait displays so all three devices stay in the frame.
    const fit = view === 'office' ? Math.max(1, 1.5 / (size.width / size.height)) : 1
    position.sub(new Vector3(...pose.target)).multiplyScalar(fit).add(new Vector3(...pose.target))
    const duration = initialized.current && !reducedMotion ? 1.25 : 0
    initialized.current = true
    useNavigation.getState().setTransitioning(duration > 0)
    const timeline = gsap.timeline({
      defaults: { duration, ease: 'power3.inOut' },
      onUpdate: () => { camera.lookAt(target.current); invalidate() },
      onComplete: () => { useNavigation.getState().setTransitioning(false); invalidate() },
    })
    timeline.to(camera.position, { x: position.x, y: position.y, z: position.z }, 0)
    timeline.to(target.current, { x: destinationTarget.x, y: destinationTarget.y, z: destinationTarget.z }, 0)
    return () => { timeline.kill() }
  }, [camera, invalidate, reducedMotion, size.height, size.width, view])

  return null
}
