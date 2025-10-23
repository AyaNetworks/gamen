import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useWorkspaceStore = create(
  devtools((set) => ({
    // State
    attachedWorkspaces: [],

    // Actions
    attachWorkspace: (workspace) =>
      set((state) => ({
        attachedWorkspaces: [...state.attachedWorkspaces, workspace],
      })),

    removeAttachment: (index) =>
      set((state) => ({
        attachedWorkspaces: state.attachedWorkspaces.filter((_, i) => i !== index),
      })),

    clearAllAttachments: () => set({ attachedWorkspaces: [] }),
  }))
)
