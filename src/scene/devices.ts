import type { DeviceId } from '../state/navigation'

export type Point3 = [number, number, number]
export type ScreenBounds = { center: Point3; width: number; height: number }

interface DeviceConfig {
  id: DeviceId
  number: string
  name: string
  category: string
  position: Point3
  compactPosition: Point3
  compactScale: number
  screen: ScreenBounds
}

// A model's local origin, interaction wrapper, and screen anchor survive GLB swaps.
export const devices: Record<DeviceId, DeviceConfig> = {
  computer: {
    id: 'computer', number: '01', name: 'Computer', category: 'Web projects',
    position: [0.15, 1.94, -0.7], compactPosition: [0.15, 1.94, -0.7], compactScale: 0.85,
    screen: { center: [0, 0.91, 0.081], width: 1.88, height: 1.1 },
  },
  phone: {
    id: 'phone', number: '02', name: 'Smartphone', category: 'Mobile apps',
    position: [2.02, 1.94, 0.05], compactPosition: [1.3, 1.94, 0.05], compactScale: 1,
    screen: { center: [0, 0.5, 0.052], width: 0.4, height: 0.8 },
  },
  console: {
    id: 'console', number: '03', name: 'Gaming setup', category: 'Games & experiments',
    position: [-3.1, 1.27, -1.55], compactPosition: [-1.18, 1.94, -1.35], compactScale: 0.6,
    screen: { center: [0, 0.9, 0.09], width: 2.03, height: 1.17 },
  },
}

export const deviceList = [devices.computer, devices.phone, devices.console]
export const CAMERA_FOV = 52
export const HOME_POSITION: Point3 = [0.15, 2.95, 4.7]
export const HOME_TARGET: Point3 = [0.15, 2.77, -0.7]
export const isCompact = (aspect: number) => aspect < 1.1

export function getPlacement(id: DeviceId, compact: boolean, pickedUp = false) {
  const item = devices[id]
  if (id === 'phone' && pickedUp) return { position: [0.15, 2.3, 1.1] as Point3, scale: 1.4 }
  return { position: compact ? item.compactPosition : item.position, scale: compact ? item.compactScale : 1 }
}

export function getScreen(id: DeviceId, compact: boolean): ScreenBounds {
  const { position, scale } = getPlacement(id, compact, id === 'phone')
  const screen = devices[id].screen
  return {
    center: screen.center.map((value, i) => position[i] + value * scale) as Point3,
    width: screen.width * scale, height: screen.height * scale,
  }
}

export function getCameraPose(view: 'office' | DeviceId, aspect: number) {
  const compact = isCompact(aspect)
  if (view === 'office') {
    // Stay at eye level inside the extended room, even in narrow portrait views.
    const distance = compact ? Math.max(5.6, Math.min(10.8, 3.8 / aspect)) : HOME_POSITION[2]
    return { position: [HOME_POSITION[0], HOME_POSITION[1], distance] as Point3, target: HOME_TARGET }
  }
  const screen = getScreen(view, compact)
  const tangent = Math.tan(CAMERA_FOV * Math.PI / 360)
  const distance = Math.max(screen.height / (2 * tangent * 0.72), screen.width / (2 * tangent * aspect * 0.9))
  return {
    position: [screen.center[0], screen.center[1], screen.center[2] + distance] as Point3,
    target: screen.center,
  }
}
