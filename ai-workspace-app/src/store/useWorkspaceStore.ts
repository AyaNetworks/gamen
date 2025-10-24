import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Workspace } from '../types'

interface WorkspaceStoreState {
  attachedWorkspaces: Workspace[]
  attachWorkspace: (workspace: Workspace) => void
  removeAttachment: (index: number) => void
  clearAllAttachments: () => void
}

export const useWorkspaceStore = create<WorkspaceStoreState>()(
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
