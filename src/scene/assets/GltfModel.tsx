import { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useAssets } from '../../state/assets'
import { getAssetUrl, type ModelAsset, type ModelId } from './catalog'
import { createModelInstance } from './modelInstance'

export default function GltfModel({ id, asset }: { id: ModelId; asset: ModelAsset }) {
  // No remote decoder/CDN dependency. Compressed formats need a separate budgeted change.
  const { scene } = useGLTF(getAssetUrl(import.meta.env.BASE_URL, asset), false, false)
  const instance = useMemo(() => createModelInstance(scene), [scene])
  useEffect(() => { useAssets.getState().setStatus(id, 'ready') }, [id, instance])
  return (
    <group position={asset.position} rotation={asset.rotation} scale={asset.scale} dispose={null}>
      {/* Instances share cached geometry/materials; never dispose the loader's cache here. */}
      <primitive object={instance} />
    </group>
  )
}
