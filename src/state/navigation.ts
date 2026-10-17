import { create } from 'zustand'

export type DeviceId = 'computer' | 'phone' | 'console'
export type View = 'office' | DeviceId

interface NavigationState {
  view: View
  hovered: DeviceId | null
  transitioning: boolean
  transitionId: number
  navigate: (view: View) => void
  setHovered: (device: DeviceId | null) => void
  beginTransition: () => void
  finishTransition: (id: number) => void
}

export const useNavigation = create<NavigationState>((set) => ({
  view: 'office', hovered: null, transitioning: false, transitionId: 0,
  navigate: (view) => set((state) => {
    if (view === state.view) return state
    // Back can interrupt travel; new device requests cannot race an active move.
    if (view !== 'office' && (state.transitioning || state.view !== 'office')) return state
    return { view, hovered: null, transitioning: true, transitionId: state.transitionId + 1 }
  }),
  setHovered: (hovered) => set((state) => ({ hovered: state.view === 'office' && !state.transitioning ? hovered : null })),
  beginTransition: () => set({ transitioning: true, hovered: null }),
  finishTransition: (id) => set((state) => state.transitionId === id ? { transitioning: false } : state),
}))
