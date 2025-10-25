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
          {
            id: 4,
            title: 'UIデザインシステムの構築',
            description:
              'プロジェクト全体で使用するUIコンポーネント、カラーパレット、タイポグラフィーをまとめたデザインシステムを構築し、ドキュメント化してください。',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/25',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 5,
            title: 'バグ修正: ログイン画面の不具合',
            description:
              'モバイルデバイスからのログイン時に、認証トークンが正しく保存されないバグを修正してください。iOS とAndroidの両プラットフォームでテストしてください。',
            priority: 'high',
            status: 'in_progress',
            createdAt: '2025/1/31',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 6,
            title: 'データベースパフォーマンス最適化',
            description:
              'ユーザーデータクエリの処理時間が多く、全体的なシステムパフォーマンスに影響を与えています。インデックスの最適化とクエリの改善を実施してください。',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/2/1',
            scope: 'global',
          },
          {
            id: 7,
            title: 'APIドキュメント作成',
            description:
              '新しく開発したREST APIの完全なドキュメントを作成してください。エンドポイント、パラメータ、レスポンス形式、エラーコードを含めてください。',
            priority: 'medium',
            status: 'completed',
            createdAt: '2025/1/15',
            scope: 'global',
          },
          {
            id: 8,
            title: 'チームミーティング議事録作成',
            description:
              '先週のスプリント計画ミーティングの議事録を作成し、決定事項とアクションアイテムをまとめてください。',
            priority: 'low',
            status: 'completed',
            createdAt: '2025/1/20',
            scope: 'global',
          },
          {
            id: 9,
            title: 'ユーザーフィードバック分析',
            description:
              'アプリストアのレビューとサポートチケットから顧客の主な不満点と要望を抽出し、優先度付けして報告してください。',
            priority: 'medium',
            status: 'not_started',
            createdAt: '2025/2/2',
            scope: 'global',
          },
          {
            id: 10,
            title: 'セキュリティ監査の実施',
            description:
              'システム全体のセキュリティ脆弱性をチェックし、潜在的なリスクを特定して対策案を提示してください。OWASP Top 10をベースにしてください。',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/2/3',
            scope: 'global',
          },
          {
            id: 11,
            title: 'テスト環境のセットアップ',
            description:
              'CI/CDパイプライン用の新しいテスト環境を構築し、既存のテストスイートが正しく動作することを確認してください。',
            priority: 'medium',
            status: 'in_progress',
            createdAt: '2025/1/27',
            scope: 'project',
            projectId: 1,
          },
          {
            id: 12,
            title: 'ウェビナー資料の準備',
            description:
              '来月のウェビナー「APIセキュリティベストプラクティス」のスライドと説明資料を準備してください。',
            priority: 'low',
            status: 'not_started',
            createdAt: '2025/2/4',
            scope: 'global',
          },
          {
            id: 13,
            title: 'クライアント要件ヒアリング',
            description:
              '新規プロジェクト案件の技術要件を詳しくヒアリングし、実装可能性を検討してレポートを作成してください。',
            priority: 'high',
            status: 'not_started',
            createdAt: '2025/2/5',
            scope: 'global',
          },
          {
            id: 14,
            title: 'パフォーマンス測定とモニタリング',
            description:
              'アプリケーションのCPU使用率、メモリ消費量、レスポンスタイムを監視するダッシュボードを構築してください。',
            priority: 'low',
            status: 'in_progress',
            createdAt: '2025/1/26',
            scope: 'project',
            projectId: 1,
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
