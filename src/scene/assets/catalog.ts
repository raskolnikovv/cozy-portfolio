import type { DeviceId } from '../../state/navigation'
import type { Point3 } from '../devices'

export type ModelId = DeviceId | 'television'

export interface ModelAsset {
  path: `models/${string}.glb` | `models/${string}.gltf`
  position?: Point3
  rotation?: Point3
  scale?: number
}

// Opt in per visual slot. An absent entry never requests a model or its loader.
// Example: computer: { path: 'models/computer/computer-v1.glb' }
export const modelAssets: Partial<Record<ModelId, ModelAsset>> = {}

export function getAssetUrl(base: string, asset: ModelAsset) {
  return `${base}${asset.path}`
}
