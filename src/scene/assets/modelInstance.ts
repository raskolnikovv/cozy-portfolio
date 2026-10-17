import { Mesh, type Object3D } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'

export function createModelInstance(scene: Object3D) {
  const instance = clone(scene)
  let meshCount = 0
  instance.traverse((child) => {
    if (child instanceof Mesh) {
      meshCount++
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  if (!meshCount) throw new Error('The model contains no meshes')
  return instance
}
