import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Theme } from '../types'

interface ThemeStoreState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStoreState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === 'dark' ? 'light' : 'dark',
          })),
      }),
      {
        name: 'theme-storage',
      }
    )
  )
)
