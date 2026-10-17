import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { useNavigation } from '../src/state/navigation.ts'
import { CAMERA_FOV, deviceList, getCameraPose, getScreen, isCompact } from '../src/scene/devices.ts'

beforeEach(() => useNavigation.setState(useNavigation.getInitialState(), true))

test('device entry is atomic and rapid competing requests are ignored', () => {
  useNavigation.getState().navigate('computer')
  const moving = useNavigation.getState()
  assert.equal(moving.view, 'computer')
  assert.equal(moving.transitioning, true)
  useNavigation.getState().navigate('phone')
  useNavigation.getState().navigate('console')
  assert.equal(useNavigation.getState().view, 'computer')
  assert.equal(useNavigation.getState().transitionId, moving.transitionId)
})

test('Back interrupts travel and stale completion cannot unlock the newer move', () => {
  useNavigation.getState().navigate('phone')
  const oldId = useNavigation.getState().transitionId
  useNavigation.getState().navigate('office')
  useNavigation.getState().finishTransition(oldId)
  assert.equal(useNavigation.getState().view, 'office')
  assert.equal(useNavigation.getState().transitioning, true)
  useNavigation.getState().finishTransition(oldId + 1)
  assert.equal(useNavigation.getState().transitioning, false)
})

test('one device stays active until an explicit return to the office', () => {
  useNavigation.getState().navigate('console')
  useNavigation.getState().finishTransition(useNavigation.getState().transitionId)
  useNavigation.getState().navigate('computer')
  assert.equal(useNavigation.getState().view, 'console')
  useNavigation.getState().setHovered('phone')
  assert.equal(useNavigation.getState().hovered, null)
})

test('hover feedback is available only in the ready office', () => {
  useNavigation.getState().setHovered('phone')
  assert.equal(useNavigation.getState().hovered, 'phone')
  useNavigation.getState().navigate('computer')
  useNavigation.getState().setHovered('console')
  assert.equal(useNavigation.getState().hovered, null)
})

test('overview stays at eye level inside the room across portrait and landscape', () => {
  for (const aspect of [320 / 844, 390 / 844, 1, 1440 / 900, 844 / 390, 3]) {
    const pose = getCameraPose('office', aspect)
    assert.equal(pose.position[1], 2.95)
    assert.ok(pose.position[2] > 0 && pose.position[2] < 12.3)
    assert.equal(pose.position[0], pose.target[0])
  }
})

test('device screens fit the viewport and cameras face their centers without distortion', () => {
  for (const aspect of [320 / 844, 390 / 844, 1440 / 900, 844 / 390]) {
    for (const { id } of deviceList) {
      const screen = getScreen(id, isCompact(aspect))
      const pose = getCameraPose(id, aspect)
      assert.deepEqual(pose.target, screen.center)
      assert.equal(pose.position[0], screen.center[0])
      assert.equal(pose.position[1], screen.center[1])
      const height = 2 * (pose.position[2] - screen.center[2]) * Math.tan(CAMERA_FOV * Math.PI / 360)
      assert.ok(screen.height / height <= 0.720001)
      assert.ok(screen.width / (height * aspect) <= 0.900001)
    }
  }
})
