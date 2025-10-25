import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface Task {
  id: number
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'completed'
  createdAt: string
  scope: 'project' | 'global'
  projectId?: number
}

interface TaskStoreState {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (taskId: number, updates: Partial<Task>) => void
  deleteTask: (taskId: number) => void
  getSortedTasks: () => Task[]
}

export const useTaskStore = create<TaskStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        tasks: [
          {
            id: 1,
            title: '新機能リリースのスケジュール調整',
            description:
              '次回のスプリントで予定している新機能のリリーススケジュールを調整し、各チームメンバーのタスク配分を最適化してください。',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/28',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 2,
            title: 'リスク評価レポートの作成',
            description:
              '現在進行中のプロジェクトについて、技術的リスク、スケジュールリスク、リソースリスクを評価し、対策案を含むレポートを作成してください。',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/1/29',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 3,
            title: 'ステークホルダー向け進捗報告書',
            description:
              '経営層向けに今四半期のプロジェクト進捗状況をまとめ、主要なマイルストーンの達成状況と今後の見通しを報告する資料を作成してください。',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/1/30',
            scope: 'global',
          },
        ],

        // Actions
        addTask: (task) =>
          set((state) => ({
            tasks: [...state.tasks, task],
          })),

        updateTask: (taskId, updates) =>
          set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
          })),

        deleteTask: (taskId) =>
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
          })),

        getSortedTasks: () => {
          const tasks = get().tasks
          return tasks.sort((a, b) => {
            if (a.scope === 'project' && b.scope === 'global') return -1
            if (a.scope === 'global' && b.scope === 'project') return 1
            return 0
          })
        },
      }),
      {
        name: 'task-storage',
      }
    )
  )
)
