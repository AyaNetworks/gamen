import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface User {
  id: number | string
  email: string
  displayName: string
  theme: string
  role: string
  passwordLastUpdated?: string
  createdAt?: string
  preferences?: Record<string, any>
}

interface AuthStoreState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null

  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  clearError: () => void
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await fetch(`${API_URL}/auth/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
              throw new Error('Failed to login')
            }

            const data = await response.json()
            set({
              user: data.user,
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
              isLoading: false,
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed'
            set({ error: errorMessage, isLoading: false })
            throw error
          }
        },

        signup: async (email: string, password: string, displayName: string) => {
          set({ isLoading: true, error: null })
          try {
            const response = await fetch(`${API_URL}/auth/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email,
                password,
                display_name: displayName,
              }),
            })

            if (!response.ok) {
              throw new Error('Failed to signup')
            }

            const data = await response.json()
            set({
              user: data,
              isLoading: false,
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed'
            set({ error: errorMessage, isLoading: false })
            throw error
          }
        },

        logout: async () => {
          const state = get()
          if (state.refreshToken) {
            try {
              await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${state.accessToken}`,
                },
                body: JSON.stringify({ refresh_token: state.refreshToken }),
              })
            } catch (error) {
              console.error('Logout request failed:', error)
            }
          }
          set({ user: null, accessToken: null, refreshToken: null })
        },

        setUser: (user: User | null) => {
          set({ user })
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
      }
    )
  )
)
