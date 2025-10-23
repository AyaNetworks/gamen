import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useThemeStore = create(
  devtools(
    persist(
      (set) => ({
        // State
        theme: 'dark', // 'light' or 'dark'

        // Actions
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
