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
  password?: string // For mock auth only
}

interface AuthStoreState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  mockUsers: User[] // Mock user database

  // Actions
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  clearError: () => void
}

// Mock initial users
const initialMockUsers: User[] = [
  {
    id: 1,
    email: 'demo@example.com',
    displayName: 'Demo User',
    password: 'demo123',
    theme: 'dark',
    role: 'user',
    createdAt: new Date().toISOString(),
    preferences: {},
  },
  {
    id: 2,
    email: 'admin@example.com',
    displayName: 'Admin User',
    password: 'admin123',
    theme: 'dark',
    role: 'admin',
    createdAt: new Date().toISOString(),
    preferences: {},
  },
]

// Generate mock tokens
const generateMockToken = (userId: number | string): string => {
  return `mock_token_${userId}_${Date.now()}`
}

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,
        mockUsers: initialMockUsers,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null })

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          try {
            const { mockUsers } = get()
            const user = mockUsers.find((u) => u.email === email && u.password === password)

            if (!user) {
              throw new Error('Invalid email or password')
            }

            // Remove password from returned user object
            const { password: _, ...userWithoutPassword } = user
            const accessToken = generateMockToken(user.id)
            const refreshToken = generateMockToken(`refresh_${user.id}`)

            set({
              user: userWithoutPassword,
              accessToken,
              refreshToken,
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

          // Simulate network delay
          await new Promise((resolve) => setTimeout(resolve, 500))

          try {
            const { mockUsers } = get()

            // Check if user already exists
            if (mockUsers.find((u) => u.email === email)) {
              throw new Error('Email already registered')
            }

            // Create new user
            const newUser: User = {
              id: Math.max(...mockUsers.map((u) => (typeof u.id === 'number' ? u.id : 0))) + 1,
              email,
              displayName,
              password,
              theme: 'dark',
              role: 'user',
              createdAt: new Date().toISOString(),
              preferences: {},
            }

            // Add to mock users
            set((state) => ({
              mockUsers: [...state.mockUsers, newUser],
            }))

            // Auto-login after signup
            const { password: _, ...userWithoutPassword } = newUser
            const accessToken = generateMockToken(newUser.id)
            const refreshToken = generateMockToken(`refresh_${newUser.id}`)

            set({
              user: userWithoutPassword,
              accessToken,
              refreshToken,
              isLoading: false,
            })
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Signup failed'
            set({ error: errorMessage, isLoading: false })
            throw error
          }
        },

        logout: () => {
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
          mockUsers: state.mockUsers,
        }),
      }
    )
  )
)
