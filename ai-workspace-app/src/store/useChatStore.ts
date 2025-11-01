import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { ChatSession, Message, Attachment, Workspace, ReplyContext, ChatMember } from '../types'

const initialChatSessions: ChatSession[] = [
  {
    id: 1,
    title: 'Q2 Marketing Analysis',
    messages: [
      {
        role: 'user',
        content: 'Analyze Q2 customer data. Please refer to campaign_data.csv.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          'Understood. I will analyze Q2 marketing campaign data. From the data, I\'ve confirmed the following points:\n\n📊 **Campaign Performance Summary**\n- Total Impressions: 2.5M\n- Click Rate: 3.2%\n- Conversion Rate: 1.8%\n- Average CPC: $245\n\n🎯 **Performance Analysis**\n- Email Campaign: Best ROI (420%)\n- Social Media: Most clicks (89K)\n- Display Ads: Lowest CPC ($180)\n\n💡 **Recommendations**\nBy increasing budget allocation to email campaigns, overall ROI could improve by approximately 15%.',
        timestamp: new Date(Date.now() - 890000).toISOString(),
        trace:
          'Step 1: Load campaign_data.csv\nStep 2: Parse CSV structure\nStep 3: Calculate KPIs (CTR, CVR, CPC, ROI)\nStep 4: Segment by channel\nStep 5: Identify top performers\nStep 6: Generate insights and recommendations',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'New Customer Segment Strategy',
    messages: [
      {
        role: 'user',
        content: 'Please analyze the behavioral patterns of VIP customer segments',
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Starting analysis. Retrieving VIP customer records from database...',
        timestamp: new Date(Date.now() - 595000).toISOString(),
        trace: '🔄 Retrieving VIP customer segments from database...\n⏳ Processing behavioral patterns...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '👑 **VIP Customer Segment Analysis Results**\n\n📈 **Purchase Patterns**\n- Monthly Average Purchases: 8.2 times\n- Average Order Amount: $28,500\n- Repeat Rate: 92%\n- LTV: $342,000\n\n🎯 **Segment Characteristics**\n- Primary Purchase Time: Weekday 1-3 PM\n- Preferred Product Category: Premium Products\n- Average Session Duration: 12.5 minutes',
        timestamp: new Date(Date.now() - 590000).toISOString(),
        trace: 'Step 1: Segment VIP customers\nStep 2: Extract behavioral data\nStep 3: Analyze purchase patterns\nStep 4: Calculate LTV metrics',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Product Roadmap Q3-Q4',
    messages: [
      {
        role: 'user',
        content: 'Organize Q3 and Q4 development priorities. Please refer to Jira ticket data.',
        timestamp: new Date(Date.now() - 480000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Connecting to Jira and retrieving project data...',
        timestamp: new Date(Date.now() - 475000).toISOString(),
        trace: '🔧 [Tool: Jira] Connecting to Jira server...\n⏳ Fetching sprint data...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📋 **Recommended Roadmap (Based on Jira Data)**\n\n**Q3 Priority Items (8 weeks)**\n1. 🔴 API Rate Limiting Feature (User Requests: 47)\n2. 🟡 Dashboard Major Improvement (Estimate: 40h)\n3. 🟡 Search Feature Optimization (Estimate: 32h)\n\n**Q4 Priority Items (8 weeks)**\n1. 🟢 Mobile App Beta\n2. 🟢 Team Collaboration Features\n3. 🟢 Analytics Report Enhancement\n\n📊 Total Tasks: 24 | Completed: 8 | In Progress: 12',
        timestamp: new Date(Date.now() - 470000).toISOString(),
        trace: '✅ [Tool: Jira] Retrieved 24 issues from Q3-Q4 backlog\n📊 Analyzed sprint velocity\n🎯 Sorted by priority and dependencies',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Bug Report and Mitigation',
    messages: [
      {
        role: 'user',
        content: 'Please compile a list of bugs reported in the production environment',
        timestamp: new Date(Date.now() - 360000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'error',
        content:
          'An error occurred: Failed to connect to GitHub.',
        timestamp: new Date(Date.now() - 355000).toISOString(),
        trace: '❌ [Tool: GitHub] Connection timeout (30+ seconds)\n⚠️ Failed to fetch issues from repository\n🔄 Retry attempt 1/3 in 5 seconds...\n\nError Details:\n- Timeout: No response for 30+ seconds\n- Endpoint: https://api.github.com/repos\n- Reason: Network delay or server down',
      },
      {
        role: 'user',
        content: 'Please try again',
        timestamp: new Date(Date.now() - 350000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🐛 **Production Bug and Issue List**\n\n**Severity: High**\n- User Authentication Timeout (Impact: 3.2%)\n- Data Sync Delay (Impact: 8.1%)\n\n**Severity: Medium**\n- UI Rendering Issue (Specific browsers)\n- Search Results Order Anomaly\n\n**Status**\n✅ Authentication Timeout → Fixed today\n🔄 Data Sync → In QA\n⏳ UI Rendering → Scheduled for next week\n\n**Progress**: Synced 8 bugs from GitHub Issues',
        timestamp: new Date(Date.now() - 345000).toISOString(),
        trace: '✅ [Tool: GitHub] Connection established (retry 2/3)\n📊 Retrieved 8 open issues\n✅ Filtered by priority and severity',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: 'API Documentation Organization',
    messages: [
      {
        role: 'user',
        content: 'Create new REST API endpoint design and documentation. Analyze the differences between GraphQL schema and REST API specification.',
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Generating API documentation...',
        timestamp: new Date(Date.now() - 235000).toISOString(),
        trace: '🔧 [Tool: REST API] Retrieving endpoint definitions...\n🔧 [Tool: GraphQL] Fetching schema...\n⏳ Analyzing API differences...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📚 **New API Endpoint Design**\n\n**User Management API v2**\n- `GET /api/v2/users` - Get users list\n- `POST /api/v2/users` - Create new user\n- `PUT /api/v2/users/{id}` - Update user info\n\n**GraphQL Query Example**\n```graphql\nquery GetUsers($limit: Int!) {\n  users(limit: $limit) {\n    id\n    email\n    displayName\n  }\n}\n```\n\n**Authentication Flow**\n1. OAuth 2.0 support\n2. JWT token expiry: 24 hours\n3. Refresh token: 30 days\n\n📊 **Schema Comparison**: 12 REST endpoints ↔ 8 GraphQL queries + 5 mutations\n📖 Full Documentation: https://api.example.com/docs',
        timestamp: new Date(Date.now() - 230000).toISOString(),
        trace: '✅ [Tool: REST API] Retrieved 12 endpoints\n✅ [Tool: GraphQL] Analyzed 13 GraphQL operations\n✅ Generated comparison report\n📊 Created documentation',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: 'Team Meeting Minutes',
    messages: [
      {
        role: 'user',
        content: 'Please summarize this week\'s standup meeting',
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📅 **Standup Meeting - October 25, 2024**\n\n**Attendees**: 8 people\n**Progress Updates**\n✅ Alice - Authentication feature implementation complete\n🔄 Bob - UI improvements in progress (85% on schedule)\n✅ Carol - Test suite complete\n\n**Discussion Topics**\n💬 Mobile support timeline: Decided to start Q4\n💬 API performance: Caching strategy to be finalized next week\n\n**Next Meeting**: November 1, 2024 at 10:00 AM',
        timestamp: new Date(Date.now() - 110000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: 'Security Audit Report',
    messages: [
      {
        role: 'user',
        content: 'Please compile the October security audit results into a report',
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🔒 **October 2024 Security Audit Report**\n\n**Vulnerabilities Detected**\n- Critical: 0\n- High: 2 (Fixed)\n- Medium: 5 (In Progress)\n- Low: 12 (Prioritized)\n\n**Status**\n✅ SQL Injection Mitigation: Complete\n✅ CORS Configuration: Complete\n🔄 Rate Limiting: In Implementation\n\n**Recommendations**\n1. Conduct regular penetration testing\n2. Automate WAF rule updates\n3. Enhance security training',
        timestamp: new Date(Date.now() - 50000).toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    title: 'Data Processing Pipeline Optimization',
    messages: [
      {
        role: 'user',
        content: 'Process PostgreSQL log data and generate performance statistics.',
        timestamp: new Date(Date.now() - 420000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Running data processing pipeline...',
        timestamp: new Date(Date.now() - 415000).toISOString(),
        trace: '🔧 [Tool: PostgreSQL] Connecting to database...\n⏳ Executing query to retrieve logs...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Executing query, processing data...',
        timestamp: new Date(Date.now() - 410000).toISOString(),
        trace: '✅ [Tool: PostgreSQL] Retrieved 2.5M records\n🔄 [Tool: Python Executor] Processing data...\n⏳ Generating statistics...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '📊 **Performance Statistics Report**\n\n**Query Performance Analysis**\n- Average Response Time: 142ms → 87ms (38% improvement)\n- 95th Percentile: 580ms → 320ms\n- Bottlenecks: 3 tables missing indexes\n\n**Optimization Recommendations**\n1. Add composite index to `users` table\n2. Add non-clustered index to `orders` table\n3. Rebuild query plan\n\n**Estimated Improvement**: 45% reduction in overall query execution time\n\n📈 **Processing Statistics**\n- Records Processed: 2,532,847\n- Processing Time: 284 seconds\n- Throughput: 8,912 records/second',
        timestamp: new Date(Date.now() - 405000).toISOString(),
        trace: '✅ [Tool: PostgreSQL] Retrieved logs\n✅ [Tool: Python Executor] Processed and analyzed 2.5M records\n✅ [Tool: Data Visualization] Generated charts\n✅ Report generated successfully',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    title: 'Research Agent Execution',
    messages: [
      {
        role: 'user',
        content: 'Please have the Research Agent investigate the latest AI technology trends.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Initializing Research Agent...',
        timestamp: new Date(Date.now() - 295000).toISOString(),
        trace: '🔧 [Agent: Research Agent] Starting...\n⏳ Initializing web search tools...\n⏳ Connecting to information sources...',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content:
          '🤖 **AI Technology Trends Research Report**\n\n**Key Trends**\n\n1. 🧠 **Large Language Models (LLM)**\n   - Multimodal expansion: Text + Image + Audio support\n   - Improved reasoning: Complex problem solving capability\n   - Extended context window: 100K+ token support\n\n2. ⚡ **Efficiency Technologies**\n   - LoRA / QLoRA: Parameter-efficient fine-tuning\n   - Quantization: Model size reduction (8bit, 4bit)\n   - Grouped Query Attention: 2-3x inference speedup\n\n3. 🔗 **Agent Technology Evolution**\n   - ReAct Pattern: Unified thinking and action\n   - Tool Chaining: Multi-tool orchestration\n   - Self-improvement mechanisms\n\n4. 🛡️ **Safety and Reliability**\n   - Explainable AI (XAI) importance\n   - Alignment techniques advancement\n   - Bias detection and mitigation\n\n**Market Trends**\n- Investment increase: +156% YoY\n- Enterprise adoption: 62% (vs 38% last year)\n- Major players: OpenAI, Anthropic, Google, Meta, Alibaba\n\n**Recommendations**\n1. Evaluate multimodal capabilities\n2. Assess quantization technology adoption\n3. Consider agent-based architecture',
        timestamp: new Date(Date.now() - 290000).toISOString(),
        trace: '✅ [Agent: Research Agent] Completed\n✅ [Tool: Web Search] Fetched 47 articles\n✅ [Tool: Data Analysis] Analyzed trends\n✅ [Tool: Report Generation] Created comprehensive report',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    title: 'Tool Execution Test',
    messages: [
      {
        role: 'user',
        content: 'Send an email. To: admin@example.com, Subject: Test Email, Body: This is a test email.',
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Received email sending request. Processing with Gmail tool...',
        timestamp: new Date(Date.now() - 175000).toISOString(),
        trace: '🧠 Analyzing request: Email sending task detected\n🔧 Selected tool: Gmail\n⏳ Preparing parameters...',
      },
      {
        role: 'ai',
        type: 'tool',
        status: 'pending',
        content: '[Tool: Gmail] Executing email send...',
        timestamp: new Date(Date.now() - 173000).toISOString(),
        trace: '🔧 [Tool: Gmail] Authenticating with Gmail API...\n⏳ Validating email address...\n⏳ Composing message...',
      },
      {
        role: 'ai',
        type: 'tool',
        status: 'success',
        content: '[Tool: Gmail] Email sent successfully.',
        timestamp: new Date(Date.now() - 171000).toISOString(),
        trace: '✅ [Tool: Gmail] Authentication successful\n✅ [Tool: Gmail] Email validated\n✅ [Tool: Gmail] Message sent successfully\n📊 Message ID: msg_12345\n📧 Delivery confirmed to: admin@example.com',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'success',
        content: 'Email sent successfully.\n\n📧 **Send Result**\n- To: admin@example.com\n- Subject: Test Email\n- Message ID: msg_12345\n- Delivery Status: ✅ Sent',
        timestamp: new Date(Date.now() - 170000).toISOString(),
        trace: '✅ Tool execution completed successfully\n✅ Processing results\n✅ Generating response',
      },
      {
        role: 'user',
        content: 'Please send the same email to another address: user@example.com',
        timestamp: new Date(Date.now() - 165000).toISOString(),
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'pending',
        content: 'Processing email send to user@example.com. Executing Gmail tool...',
        timestamp: new Date(Date.now() - 162000).toISOString(),
        trace: '🧠 Processing second email request\n🔧 Selected tool: Gmail\n⏳ Preparing message for user@example.com...',
      },
      {
        role: 'ai',
        type: 'tool',
        status: 'pending',
        content: '[Tool: Gmail] Executing email send...',
        timestamp: new Date(Date.now() - 160000).toISOString(),
        trace: '🔧 [Tool: Gmail] Authenticating with Gmail API...\n⏳ Building message...',
      },
      {
        role: 'ai',
        type: 'tool',
        status: 'error',
        content: '[Tool: Gmail] An error occurred.',
        timestamp: new Date(Date.now() - 158000).toISOString(),
        trace: '❌ [Tool: Gmail] API rate limit exceeded\n⚠️ Error: Too many requests in a short period\n📊 Rate limit: 10 requests per minute\n⏳ Retry after: 45 seconds\n\nError Details:\n- Error Code: RATE_LIMIT_EXCEEDED\n- Reason: Too many requests sent in a short time\n- Solution: Retry after 45 seconds',
      },
      {
        role: 'ai',
        type: 'dione',
        status: 'error',
        content: 'Email send failed.\n\n❌ **Error Information**\n- Cause: Gmail tool reached rate limit\n- Message: Too many requests in short period\n- Solution: Retry after 45 seconds',
        timestamp: new Date(Date.now() - 157000).toISOString(),
        trace: '⚠️ Tool execution failed\n❌ Error: RATE_LIMIT_EXCEEDED\n💡 Suggestion: Implement exponential backoff retry strategy',
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
              content: 'Message received. Processing...',
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
              title: `New Chat ${newChatId}`,
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
        version: 6,
        partialize: (state) => ({
          chatSessions: state.chatSessions,
          currentChatId: state.currentChatId,
        }),
        migrate: (persistedState: any, version: number) => {
          // Always reset to initial chats when version changes to load new sample data
          if (version < 6) {
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
