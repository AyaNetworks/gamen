import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChatSession, Message, Attachment, Workspace, ReplyContext } from '../types'

const initialChatSessions: ChatSession[] = [
  {
    id: 1,
    title: 'Q2マーケティング分析',
    messages: [
      {
        role: 'user',
        content: 'Q2の顧客データを分析してください。campaign_data.csvを参照してください。',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '承知しました。Q2のマーケティングキャンペーンデータを分析します。データから以下のポイントが確認できました：\n\n📊 **キャンペーン成果サマリー**\n- 総インプレッション数: 2.5M\n- クリック率: 3.2%\n- コンバージョン率: 1.8%\n- 平均CPC: ¥245\n\n🎯 **パフォーマンス分析**\n- Email キャンペーン: 最高のROI (420%)\n- Social Media: 最多クリック数 (89K)\n- Display Ads: 最低CPC (¥180)\n\n💡 **推奨事項**\nEmail キャンペーンへの予算配分を増やすことで、全体ROIが約15%向上する可能性があります。',
        timestamp: new Date(Date.now() - 890000).toISOString(),
        trace:
          'Step 1: Load campaign_data.csv\nStep 2: Parse CSV structure\nStep 3: Calculate KPIs (CTR, CVR, CPC, ROI)\nStep 4: Segment by channel\nStep 5: Identify top performers\nStep 6: Generate insights and recommendations',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: '新規顧客セグメント戦略',
    messages: [
      {
        role: 'user',
        content: 'VIPカスタマー層の行動パターン分析をしてください',
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '👑 **VIPカスタマー層の分析結果**\n\n📈 **購買パターン**\n- 月平均購買回数: 8.2回\n- 平均注文額: ¥28,500\n- リピート率: 92%\n- LTV: ¥342,000',
        timestamp: new Date(Date.now() - 590000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'プロダクトロードマップQ3-Q4',
    messages: [
      {
        role: 'user',
        content: 'Q3とQ4の開発優先順位を整理してください',
        timestamp: new Date(Date.now() - 480000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📋 **推奨ロードマップ**\n\n**Q3優先課題（8週間）**\n1. 🔴 APIレート制限機能（ユーザー要望多数）\n2. 🟡 ダッシュボード大幅改善\n3. 🟡 検索機能の最適化\n\n**Q4優先課題（8週間）**\n1. 🟢 モバイルアプリβ版\n2. 🟢 チーム協業機能\n3. 🟢 分析レポート強化',
        timestamp: new Date(Date.now() - 470000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'バグ報告と対応策',
    messages: [
      {
        role: 'user',
        content: '本番環境で報告されたバグ一覧をまとめてください',
        timestamp: new Date(Date.now() - 360000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🐛 **本番バグ・問題一覧**\n\n**重大度: 高**\n- ユーザー認証タイムアウト (影響: 3.2%)\n- データ同期遅延 (影響: 8.1%)\n\n**重大度: 中**\n- UI描画の不具合（特定ブラウザ）\n- 検索結果の順序異常\n\n**対応状況**\n✅ 認証タイムアウト → 本日修正完了\n🔄 データ同期 → QA中\n⏳ UI描画 → 来週着手予定',
        timestamp: new Date(Date.now() - 350000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'APIドキュメント整理',
    messages: [
      {
        role: 'user',
        content: 'REST APIの新エンドポイント設計とドキュメントを作成してください',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📚 **新APIエンドポイント設計**\n\n**ユーザー管理API v2**\n- `GET /api/v2/users` - ユーザー一覧取得\n- `POST /api/v2/users` - ユーザー新規作成\n- `PUT /api/v2/users/{id}` - ユーザー情報更新\n\n**認証フロー**\n1. OAuth 2.0対応\n2. JWT トークン有効期限: 24時間\n3. Refresh token: 30日\n\n📖 完全なドキュメント: https://api.example.com/docs',
        timestamp: new Date(Date.now() - 230000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'チームミーティング議事録',
    messages: [
      {
        role: 'user',
        content: '今週のスタンドアップミーティング内容をまとめてください',
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📅 **スタンドアップミーティング 2024年10月25日**\n\n**参加者**: 8名\n**進捗状況**\n✅ Aliceさん - 認証機能実装完了\n🔄 Bobさん - UI改善作業中（予定比85%）\n✅ Carolさん - テストスイート完成\n\n**議論事項**\n💬 モバイル対応時期: Q4開始を決定\n💬 API性能: キャッシング戦略を次週詳詰め\n\n**次回**: 2024年11月1日 10:00',
        timestamp: new Date(Date.now() - 110000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'セキュリティ監査レポート',
    messages: [
      {
        role: 'user',
        content: '10月のセキュリティ監査結果を報告書にまとめてください',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🔒 **2024年10月 セキュリティ監査報告**\n\n**脆弱性検出数**\n- 重大: 0\n- 高: 2 (修正完了)\n- 中: 5 (対応中)\n- 低: 12 (優先度付け済み)\n\n**対応状況**\n✅ SQL インジェクション対策: 完了\n✅ CORS設定: 完了\n🔄 レート制限: 実装中\n\n**推奨事項**\n1. 定期的なペネトレーションテスト実施\n2. WAFルール更新の自動化\n3. セキュリティトレーニング強化',
        timestamp: new Date(Date.now() - 50000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
]

interface ChatStoreState {
  // State
  chatSessions: ChatSession[]
  currentChatId: number

  // Computed (getters)
  getCurrentChat: () => ChatSession | undefined
  getCurrentMessages: () => Message[]

  // Actions
  setCurrentChatId: (id: number) => void
  addMessage: (message: Message) => void
  sendMessage: (userMessage: string, attachments?: File[], replyContext?: ReplyContext) => void
  createNewChat: () => void
  deleteChat: (chatId: number) => void
  updateChatTitle: (chatId: number, newTitle: string) => void
  addChatToProject: (chatId: number, projectId: number) => void
  removeChatFromProject: (chatId: number) => void
}

export const useChatStore = create<ChatStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        chatSessions: initialChatSessions,
        currentChatId: 1,

        // Computed (getters)
        getCurrentChat: () => {
          const { chatSessions, currentChatId } = get()
          return chatSessions.find((chat) => chat.id === currentChatId)
        },

        getCurrentMessages: () => {
          const currentChat = get().getCurrentChat()
          return currentChat?.messages || []
        },

        // Actions
        setCurrentChatId: (id) => set({ currentChatId: id }),

        addMessage: (message) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) =>
              chat.id === state.currentChatId
                ? { ...chat, messages: [...chat.messages, message] }
                : chat
            ),
          })),

        sendMessage: (userMessage, attachments = [], replyContext = null) =>
          set((state) => {
            const newMessage: Message = {
              role: 'user',
              content: userMessage,
              timestamp: new Date().toISOString(),
            }

            if (replyContext?.replyingToContent) {
              newMessage.replyingTo = replyContext.replyingToContent
            }

            if (replyContext?.attachedWorkspaces?.length) {
              newMessage.attachedWorkspaces = replyContext.attachedWorkspaces
            }

            if (attachments.length > 0) {
              newMessage.attachments = attachments.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: undefined,
              }))
            }

            // AI response (mock)
            const aiResponse: Message = {
              role: 'ai',
              type: 'dione',
              status: 'success',
              content: 'メッセージを受け取りました。処理中です...',
              timestamp: new Date(Date.now() + 1000).toISOString(),
            }

            return {
              chatSessions: state.chatSessions.map((chat) =>
                chat.id === state.currentChatId
                  ? {
                      ...chat,
                      messages: [...chat.messages, newMessage, aiResponse],
                      title: chat.messages.length === 0 ? userMessage.substring(0, 30) : chat.title,
                    }
                  : chat
              ),
            }
          }),

        createNewChat: () =>
          set((state) => {
            const newChatId = Math.max(...state.chatSessions.map((c) => c.id)) + 1
            const newChat: ChatSession = {
              id: newChatId,
              title: `新しいチャット ${newChatId}`,
              messages: [],
              createdAt: new Date().toISOString(),
            }

            return {
              chatSessions: [newChat, ...state.chatSessions],
              currentChatId: newChatId,
            }
          }),

        deleteChat: (chatId) =>
          set((state) => {
            const updatedSessions = state.chatSessions.filter((chat) => chat.id !== chatId)
            let newCurrentChatId = state.currentChatId

            if (chatId === state.currentChatId && updatedSessions.length > 0) {
              newCurrentChatId = updatedSessions[0].id
            }

            return {
              chatSessions: updatedSessions,
              currentChatId: newCurrentChatId,
            }
          }),

        updateChatTitle: (chatId, newTitle) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) =>
              chat.id === chatId ? { ...chat, title: newTitle } : chat
            ),
          })),

        addChatToProject: (chatId, projectId) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) =>
              chat.id === chatId ? { ...chat, projectId } : chat
            ),
          })),

        removeChatFromProject: (chatId) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) =>
              chat.id === chatId ? { ...chat, projectId: undefined } : chat
            ),
          })),
      }),
      {
        name: 'chat-storage', // localStorage key
        version: 2,
        partialize: (state) => ({
          chatSessions: state.chatSessions,
          currentChatId: state.currentChatId,
        }),
        migrate: (persistedState: any, version: number) => {
          // If persisted state is empty or old version, reset to initial chats
          if (version < 2 || !persistedState?.chatSessions || persistedState.chatSessions.length === 0) {
            return {
              chatSessions: initialChatSessions,
              currentChatId: 1,
            }
          }
          return persistedState
        },
      }
    )
  )
)
