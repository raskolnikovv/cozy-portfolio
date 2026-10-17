import { useAssets } from '../state/assets'

export function AssetStatus() {
  const models = useAssets((s) => s.models)
  const statuses = Object.values(models)
  const loading = statuses.filter((status) => status === 'loading').length
  const failed = statuses.some((status) => status === 'error')
  return (
    <div className="asset-notice" role="status" aria-live="polite" aria-atomic="true">
      {loading > 0 ? `Loading ${loading === 1 ? 'a 3D model' : `${loading} 3D models`}… You can keep exploring.` : null}
      {failed && <span>A model could not load. A simplified version is available.</span>}
    </div>
  )
}
