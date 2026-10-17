import { Component, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { useAssets } from '../../state/assets'
import { modelAssets, type ModelId } from './catalog'

const GltfModel = lazy(() => import('./GltfModel'))

class ModelBoundary extends Component<{ id: ModelId; fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { useAssets.getState().setStatus(this.props.id, 'error') }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}

function PendingVisual({ id, children }: { id: ModelId; children: ReactNode }) {
  useEffect(() => { useAssets.getState().setStatus(id, 'loading') }, [id])
  return children
}

export function AssetVisual({ id, children }: { id: ModelId; children: ReactNode }) {
  const asset = modelAssets[id]
  useEffect(() => () => { useAssets.getState().clear(id) }, [id, asset?.path])
  if (!asset) return children
  return (
    <ModelBoundary key={asset.path} id={id} fallback={children}>
      <Suspense fallback={<PendingVisual id={id}>{children}</PendingVisual>}>
        <GltfModel id={id} asset={asset} />
      </Suspense>
    </ModelBoundary>
  )
}
