import { create } from 'zustand'

export type DeviceId = 'web' | 'mobile' | 'games'
export type View = 'office' | DeviceId

interface NavigationState {
  view: View
  hovered: DeviceId | null
  transitioning: boolean
  navigate: (view: View) => void
  setHovered: (device: DeviceId | null) => void
  setTransitioning: (value: boolean) => void
}

export const useNavigation = create<NavigationState>((set) => ({
  view: 'office',
  hovered: null,
  transitioning: false,
  navigate: (view) => set({ view, hovered: null }),
  setHovered: (hovered) => set({ hovered }),
  setTransitioning: (transitioning) => set({ transitioning }),
}))
