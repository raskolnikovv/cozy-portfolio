import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Raycaster, Vector3 } from 'three'
import { useAssets } from '../src/state/assets.ts'
import { useNavigation } from '../src/state/navigation.ts'
import { deviceList, getCameraPose, getConsolePosition, getHitboxes } from '../src/scene/devices.ts'
import { getAssetUrl, modelAssets } from '../src/scene/assets/catalog.ts'
import { createModelInstance } from '../src/scene/assets/modelInstance.ts'

beforeEach(() => {
  useAssets.setState(useAssets.getInitialState(), true)
  useNavigation.setState(useNavigation.getInitialState(), true)
})

test('model readiness and failure cannot unlock or change navigation', () => {
  useNavigation.getState().navigate('phone')
  const traveling = useNavigation.getState()
  for (const status of ['loading', 'ready', 'error']) {
    useAssets.getState().setStatus('phone', status)
    assert.equal(useNavigation.getState(), traveling)
    assert.equal(useAssets.getState().models.phone, status)
  }
  useAssets.getState().setStatus('computer', 'ready')
  useAssets.getState().clear('phone')
  assert.deepEqual(useAssets.getState().models, { computer: 'ready' })
})

test('every screen is covered by an independent hitbox in both layouts', () => {
  for (const compact of [false, true]) {
    for (const { id, screen } of deviceList) {
      const hitbox = getHitboxes(id, compact)[0]
      assert.ok(Math.abs(screen.center[0] - hitbox.center[0]) + screen.width / 2 <= hitbox.size[0] / 2)
      assert.ok(Math.abs(screen.center[1] - hitbox.center[1]) + screen.height / 2 <= hitbox.size[1] / 2)
      assert.ok(Math.abs(screen.center[2] - hitbox.center[2]) <= hitbox.size[2] / 2)
    }
    assert.deepEqual(getHitboxes('console', compact).at(-1).center, getConsolePosition(compact))
    assert.notDeepEqual(getConsolePosition(true), getConsolePosition(false))
  }
})

test('asset opt-in and visual calibration leave camera and hitboxes unchanged', () => {
  const previous = modelAssets.phone
  const cameras = deviceList.map(({ id }) => getCameraPose(id, 390 / 844))
  const hitboxes = structuredClone(deviceList.map(({ id }) => getHitboxes(id, true)))
  try {
    modelAssets.phone = { path: 'models/phone/phone-v1.glb', scale: 0.01, rotation: [0, Math.PI, 0] }
    assert.deepEqual(deviceList.map(({ id }) => getCameraPose(id, 390 / 844)), cameras)
    assert.deepEqual(deviceList.map(({ id }) => getHitboxes(id, true)), hitboxes)
    assert.equal(getAssetUrl('/', modelAssets.phone), '/models/phone/phone-v1.glb')
    assert.equal(getAssetUrl('/portfolio/', modelAssets.phone), '/portfolio/models/phone/phone-v1.glb')
  } finally {
    if (previous) modelAssets.phone = previous
    else delete modelAssets.phone
  }
})

test('invisible hitboxes remain raycastable without any visual mesh', () => {
  const { center, size } = getHitboxes('computer', false)[0]
  const geometry = new BoxGeometry(...size)
  const material = new MeshStandardMaterial()
  const target = new Mesh(geometry, material)
  target.visible = false
  target.position.set(...center)
  target.updateMatrixWorld()
  const ray = new Raycaster(new Vector3(center[0], center[1], 5), new Vector3(0, 0, -1))
  assert.ok(ray.intersectObject(target).length > 0)
  geometry.dispose()
  material.dispose()
})

test('model instances isolate transforms and shadows without disposing shared resources', () => {
  const source = new Group()
  const geometry = new BoxGeometry()
  const material = new MeshStandardMaterial()
  source.add(new Mesh(geometry, material))
  let disposed = false
  geometry.addEventListener('dispose', () => { disposed = true })
  material.addEventListener('dispose', () => { disposed = true })
  const first = createModelInstance(source)
  const second = createModelInstance(source)
  assert.notEqual(first.children[0], second.children[0])
  first.children[0].position.x = 5
  assert.equal(source.children[0].position.x, 0)
  assert.equal(second.children[0].position.x, 0)
  assert.equal(source.children[0].castShadow, false)
  assert.equal(first.children[0].castShadow, true)
  assert.equal(first.children[0].receiveShadow, true)
  assert.equal(first.children[0].geometry, geometry)
  assert.equal(first.children[0].material, material)
  assert.equal(disposed, false)
  geometry.dispose()
  material.dispose()
})

test('an empty GLTF scene is rejected so its slot can recover to a placeholder', () => {
  assert.throws(() => createModelInstance(new Group()), /no meshes/)
})
