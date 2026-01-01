import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Project } from '../types'

interface ProjectStoreState {
  chatProjects: Project[]
  createProject: (projectName: string) => void
  deleteProject: (projectId: number) => void
  renameProject: (projectId: number, newName: string) => void
  getProjectById: (projectId: number) => Project | undefined
}

export const useProjectStore = create<ProjectStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        chatProjects: [],

        // Actions
        createProject: (projectName) =>
          set((state) => {
            const newProject: Project = {
              id: Date.now(),
              name: projectName,
              createdAt: new Date().toISOString(),
            }

            return {
              chatProjects: [...state.chatProjects, newProject],
            }
          }),

        deleteProject: (projectId) =>
          set((state) => ({
            chatProjects: state.chatProjects.filter((project) => project.id !== projectId),
          })),

        renameProject: (projectId, newName) =>
          set((state) => ({
            chatProjects: state.chatProjects.map((project) =>
              project.id === projectId ? { ...project, name: newName } : project
            ),
          })),

        getProjectById: (projectId) => {
          return get().chatProjects.find((project) => project.id === projectId)
        },
      }),
      {
        name: 'project-storage',
      }
    )
  )
)
