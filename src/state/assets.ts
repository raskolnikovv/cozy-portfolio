import { create } from 'zustand'
import type { ModelId } from '../scene/assets/catalog'

export type AssetStatus = 'loading' | 'ready' | 'error'

interface AssetState {
  models: Partial<Record<ModelId, AssetStatus>>
  setStatus: (id: ModelId, status: AssetStatus) => void
  clear: (id: ModelId) => void
}

// Separate from navigation: model readiness must never lock device access.
export const useAssets = create<AssetState>((set) => ({
  models: {},
  setStatus: (id, status) => set((state) => state.models[id] === status ? state : { models: { ...state.models, [id]: status } }),
  clear: (id) => set((state) => {
    const models = { ...state.models }
    delete models[id]
    return { models }
  }),
}))
