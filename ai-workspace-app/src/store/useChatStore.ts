import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChatSession, Message, Attachment, Workspace, ReplyContext, ChatMember } from '../types'

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
        status: 'pending',
        content: '分析を開始しています。データベースからVIPカスタマーのレコードを取得中...',
        timestamp: new Date(Date.now() - 595000).toISOString(),
        trace: '🔄 Retrieving VIP customer segments from database...\n⏳ Processing behavioral patterns...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '👑 **VIPカスタマー層の分析結果**\n\n📈 **購買パターン**\n- 月平均購買回数: 8.2回\n- 平均注文額: ¥28,500\n- リピート率: 92%\n- LTV: ¥342,000\n\n🎯 **セグメント特性**\n- 主な購入時間帯: 平日午後1-3時\n- 好む商品カテゴリ: プレミアム製品\n- 平均セッション継続時間: 12.5分',
        timestamp: new Date(Date.now() - 590000).toISOString(),
        trace: 'Step 1: Segment VIP customers\nStep 2: Extract behavioral data\nStep 3: Analyze purchase patterns\nStep 4: Calculate LTV metrics',
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
        content: 'Q3とQ4の開発優先順位を整理してください。Jiraのチケットデータを参照してください。',
        timestamp: new Date(Date.now() - 480000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Jiraに接続してプロジェクトデータを取得しています...',
        timestamp: new Date(Date.now() - 475000).toISOString(),
        trace: '🔧 [Tool: Jira] Connecting to Jira server...\n⏳ Fetching sprint data...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📋 **推奨ロードマップ（Jiraデータに基づく）**\n\n**Q3優先課題（8週間）**\n1. 🔴 APIレート制限機能（ユーザー要望: 47件）\n2. 🟡 ダッシュボード大幅改善（見積もり: 40h）\n3. 🟡 検索機能の最適化（見積もり: 32h）\n\n**Q4優先課題（8週間）**\n1. 🟢 モバイルアプリβ版\n2. 🟢 チーム協業機能\n3. 🟢 分析レポート強化\n\n📊 総タスク数: 24件 | 完了: 8件 | 進行中: 12件',
        timestamp: new Date(Date.now() - 470000).toISOString(),
        trace: '✅ [Tool: Jira] Retrieved 24 issues from Q3-Q4 backlog\n📊 Analyzed sprint velocity\n🎯 Sorted by priority and dependencies',
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
        status: 'error',
        content:
          'エラーが発生しました: GitHubへの接続に失敗しました。',
        timestamp: new Date(Date.now() - 355000).toISOString(),
        trace: '❌ [Tool: GitHub] Connection timeout (30+ seconds)\n⚠️ Failed to fetch issues from repository\n🔄 Retry attempt 1/3 in 5 seconds...\n\nエラー詳細:\n- タイムアウト: 30秒以上応答なし\n- エンドポイント: https://api.github.com/repos\n- 理由: ネットワーク接続の遅延またはサーバーダウン',
      },
      {
        role: 'user',
        content: 'もう一度試してみてください',
        timestamp: new Date(Date.now() - 350000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🐛 **本番バグ・問題一覧**\n\n**重大度: 高**\n- ユーザー認証タイムアウト (影響: 3.2%)\n- データ同期遅延 (影響: 8.1%)\n\n**重大度: 中**\n- UI描画の不具合（特定ブラウザ）\n- 検索結果の順序異常\n\n**対応状況**\n✅ 認証タイムアウト → 本日修正完了\n🔄 データ同期 → QA中\n⏳ UI描画 → 来週着手予定\n\n**進捗**: GitHub Issues から 8 件のバグを同期しました',
        timestamp: new Date(Date.now() - 345000).toISOString(),
        trace: '✅ [Tool: GitHub] Connection established (retry 2/3)\n📊 Retrieved 8 open issues\n✅ Filtered by priority and severity',
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
        content: 'REST APIの新エンドポイント設計とドキュメントを作成してください。GraphQL スキーマと REST API 仕様の差分を分析してください。',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'APIドキュメント生成中...',
        timestamp: new Date(Date.now() - 235000).toISOString(),
        trace: '🔧 [Tool: REST API] Retrieving endpoint definitions...\n🔧 [Tool: GraphQL] Fetching schema...\n⏳ Analyzing API differences...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📚 **新APIエンドポイント設計**\n\n**ユーザー管理API v2**\n- `GET /api/v2/users` - ユーザー一覧取得\n- `POST /api/v2/users` - ユーザー新規作成\n- `PUT /api/v2/users/{id}` - ユーザー情報更新\n\n**GraphQL クエリ例**\n```graphql\nquery GetUsers($limit: Int!) {\n  users(limit: $limit) {\n    id\n    email\n    displayName\n  }\n}\n```\n\n**認証フロー**\n1. OAuth 2.0対応\n2. JWT トークン有効期限: 24時間\n3. Refresh token: 30日\n\n📊 **スキーマ比較**: REST 12エンドポイント ↔ GraphQL 8クエリ+5ミューテーション\n📖 完全なドキュメント: https://api.example.com/docs',
        timestamp: new Date(Date.now() - 230000).toISOString(),
        trace: '✅ [Tool: REST API] Retrieved 12 endpoints\n✅ [Tool: GraphQL] Analyzed 13 GraphQL operations\n✅ Generated comparison report\n📊 Created documentation',
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
  {
    id: 8,
    title: 'データ処理パイプラインの最適化',
    messages: [
      {
        role: 'user',
        content: 'PostgreSQLのログデータを処理して、パフォーマンス統計を生成してください。',
        timestamp: new Date(Date.now() - 420000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'データ処理パイプラインを実行中です...',
        timestamp: new Date(Date.now() - 415000).toISOString(),
        trace: '🔧 [Tool: PostgreSQL] Connecting to database...\n⏳ Executing query to retrieve logs...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'クエリを実行していますー、データを処理中です...',
        timestamp: new Date(Date.now() - 410000).toISOString(),
        trace: '✅ [Tool: PostgreSQL] Retrieved 2.5M records\n🔄 [Tool: Python Executor] Processing data...\n⏳ Generating statistics...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📊 **パフォーマンス統計レポート**\n\n**クエリパフォーマンス分析**\n- 平均応答時間: 142ms → 87ms (38%改善)\n- 95パーセンタイル: 580ms → 320ms\n- ボトルネック: インデックス不足のテーブル 3 個\n\n**最適化推奨事項**\n1. `users` テーブルに複合インデックス追加\n2. `orders` テーブルに非クラスタ化インデックス追加\n3. クエリプランのリビルド\n\n**推定改善効果**: クエリ実行時間を全体で 45% 削減可能\n\n📈 **処理統計**\n- 処理件数: 2,532,847 件\n- 処理時間: 284秒\n- スループット: 8,912 件/秒',
        timestamp: new Date(Date.now() - 405000).toISOString(),
        trace: '✅ [Tool: PostgreSQL] Retrieved logs\n✅ [Tool: Python Executor] Processed and analyzed 2.5M records\n✅ [Tool: Data Visualization] Generated charts\n✅ Report generated successfully',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    title: 'リサーチエージェント実行',
    messages: [
      {
        role: 'user',
        content: '最新のAI技術トレンドについてリサーチエージェントに調査させてください。',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Research Agentを起動しています...',
        timestamp: new Date(Date.now() - 295000).toISOString(),
        trace: '🔧 [Agent: Research Agent] Starting...\n⏳ Initializing web search tools...\n⏳ Connecting to information sources...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🤖 **AI技術トレンド調査レポート**\n\n**主要なトレンド**\n\n1. 🧠 **大規模言語モデル（LLM）**\n   - マルチモーダル化: テキスト+画像+音声対応\n   - 推論能力の向上: 複雑な問題解決が可能に\n   - コンテキストウィンドウの拡張: 100K+ トークン対応\n\n2. ⚡ **効率化技術**\n   - LoRA / QLoRA: パラメータ効率的なファインチューニング\n   - 量子化: モデルサイズ削減（8bit, 4bit）\n   - グループクエリアテンション: 推論速度 2-3倍向上\n\n3. 🔗 **エージェント技術の進化**\n   - ReAct パターン: 思考と行動を統合\n   - ツールチェーン: 複数ツールの連携\n   - 自己改善メカニズム\n\n4. 🛡️ **セーフティと信頼性**\n   - 説明可能AI（XAI）の重要性\n   - アライメント技術の発展\n   - 偏見検出と軽減\n\n**市場動向**\n- 投資額: 前年比 +156%\n- 企業導入率: 62% (前年 38%)\n- 主要企業: OpenAI, Anthropic, Google, Meta, Alibaba\n\n**推奨事項**\n1. マルチモーダル対応の検討\n2. 量子化技術の導入評価\n3. エージェント型アーキテクチャの採用検討',
        timestamp: new Date(Date.now() - 290000).toISOString(),
        trace: '✅ [Agent: Research Agent] Completed\n✅ [Tool: Web Search] Fetched 47 articles\n✅ [Tool: Data Analysis] Analyzed trends\n✅ [Tool: Report Generation] Created comprehensive report',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    title: 'ツール実行テスト',
    messages: [
      {
        role: 'user',
        content: 'メールを送信してください。宛先: admin@example.com, 件名: テストメール, 本文: これはテストメールです。',
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'メール送信処理を開始しています...',
        timestamp: new Date(Date.now() - 175000).toISOString(),
        trace: '🔧 [Tool: Gmail] Authenticating with Gmail API...\n⏳ Preparing email composition...\n⏳ Building message...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content: 'メール送信が完了しました。\n\n📧 **送信結果**\n- 宛先: admin@example.com\n- 件名: テストメール\n- メッセージID: msg_12345\n- 配信状態: 送信済み\n- タイムスタンプ: 2024-11-01 10:30:00',
        timestamp: new Date(Date.now() - 170000).toISOString(),
        trace: '✅ [Tool: Gmail] Authentication successful\n✅ [Tool: Gmail] Email composed\n✅ [Tool: Gmail] Message sent successfully\n📊 Delivery confirmed to: admin@example.com\n📨 Message ID: msg_12345',
      },
      {
        role: 'user',
        content: '別のメールアドレスにも同じメールを送ってください: user@example.com',
        timestamp: new Date(Date.now() - 165000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'user@example.com へのメール送信を処理中...',
        timestamp: new Date(Date.now() - 162000).toISOString(),
        trace: '🔧 [Tool: Gmail] Preparing second message...\n⏳ Building message for user@example.com...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'error',
        content: 'エラーが発生しました。メール送信に失敗しました。',
        timestamp: new Date(Date.now() - 160000).toISOString(),
        trace: '❌ [Tool: Gmail] API rate limit exceeded\n⚠️ Error: Too many requests in a short period\n📊 Rate limit: 10 requests per minute\n⏳ Retry after: 45 seconds\n\nエラー詳細:\n- エラーコード: RATE_LIMIT_EXCEEDED\n- 理由: 短時間に過度のリクエストを送信\n- 推奨: 45秒後に再実行してください\n- キューイングオプション: リクエストをキューに入れて自動リトライ',
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
  addSystemMessage: (userName: string, type: 'join' | 'leave') => void
  addChatMember: (chatId: number, member: ChatMember) => void
  removeChatMember: (chatId: number, memberId: number | string) => void
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

        addSystemMessage: (userName, type) =>
          set((state) => {
            const messageText =
              type === 'join'
                ? `--- ${userName} has joined the chat ---`
                : `--- ${userName} has left the chat ---`

            const systemMessage: Message = {
              role: 'system',
              type,
              content: messageText,
              timestamp: new Date().toISOString(),
              userName,
            }

            return {
              chatSessions: state.chatSessions.map((chat) =>
                chat.id === state.currentChatId
                  ? { ...chat, messages: [...chat.messages, systemMessage] }
                  : chat
              ),
            }
          }),

        addChatMember: (chatId, member) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) => {
              if (chat.id === chatId) {
                const members = chat.members || []
                // Avoid duplicate members
                if (!members.find((m) => m.id === member.id)) {
                  return { ...chat, members: [...members, member] }
                }
              }
              return chat
            }),
          })),

        removeChatMember: (chatId, memberId) =>
          set((state) => ({
            chatSessions: state.chatSessions.map((chat) =>
              chat.id === chatId
                ? { ...chat, members: (chat.members || []).filter((m) => m.id !== memberId) }
                : chat
            ),
          })),
      }),
      {
        name: 'chat-storage', // localStorage key
        version: 5,
        partialize: (state) => ({
          chatSessions: state.chatSessions,
          currentChatId: state.currentChatId,
        }),
        migrate: (persistedState: any, version: number) => {
          // Always reset to initial chats when version changes to load new sample data
          if (version < 5) {
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
