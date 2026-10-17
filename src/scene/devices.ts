import type { DeviceId } from '../state/navigation'

export type Point3 = [number, number, number]

interface DeviceConfig {
  id: DeviceId
  number: string
  name: string
  category: string
  description: string
  position: Point3
  label: Point3
  camera: { position: Point3; target: Point3 }
}

// These transforms are shared by models, labels, and the camera. A GLB can replace
// a model's children later without changing navigation or the HTML interface.
export const devices: Record<DeviceId, DeviceConfig> = {
  web: {
    id: 'web', number: '01', name: 'The desktop', category: 'Web development',
    description: 'Thoughtful things for the web.',
    position: [0.15, 1.94, -0.7], label: [0.15, 3.65, -0.7],
    camera: { position: [0.15, 3.2, 4.7], target: [0.15, 2.65, -0.7] },
  },
  mobile: {
    id: 'mobile', number: '02', name: 'The phone', category: 'Mobile apps',
    description: 'Little ideas. Pocket-sized.',
    position: [2.02, 1.94, 0.05], label: [2.45, 2.95, 0.1],
    camera: { position: [2.35, 2.95, 3.05], target: [2.02, 2.38, 0.05] },
  },
  games: {
    id: 'games', number: '03', name: 'The console', category: 'Games & experiments',
    description: 'A little curiosity. A little play.',
    position: [-3.48, 1.12, -1.55], label: [-4.45, 3.3, -1.55],
    camera: { position: [-3.48, 2.85, 4.3], target: [-3.48, 2.03, -1.55] },
  },
}

export const deviceList = [devices.web, devices.mobile, devices.games]
export const HOME_TARGET: Point3 = [0, 1.9, -0.6]
export const HOME_POSITION: Point3 = [8.6, 7.1, 12.6]
