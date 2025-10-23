import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const initialChatSessions = [
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
]

export const useChatStore = create(
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
            const newMessage = {
              role: 'user',
              content: userMessage,
              timestamp: new Date().toISOString(),
            }

            if (replyContext?.replyingToContent) {
              newMessage.replyingTo = replyContext.replyingToContent
            }

            if (replyContext?.attachedWorkspaces?.length > 0) {
              newMessage.attachedWorkspaces = replyContext.attachedWorkspaces
            }

            if (attachments.length > 0) {
              newMessage.attachments = attachments.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: file.preview,
              }))
            }

            // AI response (mock)
            const aiResponse = {
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
            const newChat = {
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
        partialize: (state) => ({
          chatSessions: state.chatSessions,
          currentChatId: state.currentChatId,
        }),
      }
    )
  )
)
