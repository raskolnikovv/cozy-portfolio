import { useEffect, useRef } from 'react'
import type { DeviceId } from '../state/navigation'
import { devices } from '../scene/devices'
import { ComputerInterface } from './devices/ComputerInterface'
import { PhoneInterface } from './devices/PhoneInterface'
import { ConsoleInterface } from './devices/ConsoleInterface'

export function DeviceExperience({ device, ready }: { device: DeviceId; ready: boolean }) {
  const surface = useRef<HTMLElement>(null)
  useEffect(() => {
    if (!ready) return
    // Projection makes the parent visible on the next demand-rendered frame.
    const frame = requestAnimationFrame(() => surface.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [ready])
  return (
    <section ref={surface} className={`device-experience device-${device}`} tabIndex={-1} aria-label={`${devices[device].name} interface`}>
      {device === 'computer' && <ComputerInterface />}
      {device === 'phone' && <PhoneInterface />}
      {device === 'console' && <ConsoleInterface />}
    </section>
  )
}
