import { useState } from 'react'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import ChatPanel from './components/ChatPanel'
import Scratchpad from './components/Scratchpad'
import DocumentPanel from './components/DocumentPanel'
import './App.css'

function App() {
  const [theme, setTheme] = useState('dark') // 'light' or 'dark'
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: 'Dioneメッセージタイプテスト',
      messages: [
        { role: 'user', content: '通常のDione回答をテストします', timestamp: new Date(Date.now() - 300000).toISOString() },
        { role: 'ai', type: 'dione', status: 'success', content: 'こちらが通常のDioneの回答です。すべてが正常に動作しています。', timestamp: new Date(Date.now() - 290000).toISOString() },
        { role: 'user', content: 'Dioneエラーを見せてください', timestamp: new Date(Date.now() - 240000).toISOString() },
        { role: 'ai', type: 'dione', status: 'error', content: 'エラーが発生しました。処理を完了できませんでした。', timestamp: new Date(Date.now() - 230000).toISOString() },
        { role: 'user', content: '思考プロセスを見せてください', timestamp: new Date(Date.now() - 180000).toISOString() },
        { role: 'ai', type: 'thinking', status: 'success', content: '考えています... 最適なアプローチを検討中です。複数の可能性を分析しています。', timestamp: new Date(Date.now() - 170000).toISOString() },
        { role: 'user', content: 'ツールを使用してください', timestamp: new Date(Date.now() - 120000).toISOString() },
        { role: 'ai', type: 'tool', status: 'success', content: 'ファイルシステムを検索しています... 3つのファイルが見つかりました。', timestamp: new Date(Date.now() - 110000).toISOString() },
        { role: 'user', content: 'ツールエラーを見せてください', timestamp: new Date(Date.now() - 60000).toISOString() },
        { role: 'ai', type: 'tool', status: 'error', content: 'ツールの実行に失敗しました。APIエンドポイントに接続できません。', timestamp: new Date(Date.now() - 50000).toISOString() },
      ],
      createdAt: new Date().toISOString()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState(1)
  const [scratchpadTabs, setScratchpadTabs] = useState([
    {
      id: 1,
      title: 'Untitled 1',
      content: '',
      history: [''],
      historyIndex: 0
    }
  ])
  const [currentScratchpadTabId, setCurrentScratchpadTabId] = useState(1)
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'React Documentation.md',
      type: 'document',
      content: '# React Documentation\n\nReact is a **JavaScript library** for building user interfaces.\n\n## Key Features\n\n- Component-Based\n- Declarative\n- Learn Once, Write Anywhere\n\n```javascript\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```',
      filePath: '/docs/react/getting-started.md',
      tags: { category: 'tutorial', framework: 'react', level: 'beginner' }
    },
    {
      id: 2,
      name: 'API Reference.md',
      type: 'document',
      content: '# API Reference\n\n## Endpoints\n\n### GET /api/users\n\nReturns a list of users.\n\n**Response:**\n```json\n{\n  "users": [\n    { "id": 1, "name": "John" }\n  ]\n}\n```',
      filePath: '/docs/api/reference.md',
      tags: { category: 'reference', type: 'api', version: 'v1' }
    },
  ])
  const [libraries, setLibraries] = useState([
    {
      id: 1,
      name: 'utility-functions.js',
      type: 'library',
      content: 'export const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n}\n\nexport const formatCurrency = (amount) => {\n  return new Intl.NumberFormat("ja-JP", {\n    style: "currency",\n    currency: "JPY"\n  }).format(amount);\n}'
    },
    {
      id: 2,
      name: '22365_3_Prompt Engineering_v7 (1).pdf',
      type: 'library',
      content: '',
      file: null,
      filePath: '/sample_assets/22365_3_Prompt Engineering_v7 (1).pdf'
    },
    {
      id: 3,
      name: 'template.pptx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/sample_assets/template.pptx'
    },
    {
      id: 4,
      name: '４コマ.pptx',
      type: 'library',
      content: '',
      file: null,
      filePath: '/sample_assets/４コマ.pptx'
    },
    {
      id: 5,
      name: 'laughing-man_mark_01.png',
      type: 'library',
      content: '',
      file: null,
      filePath: '/sample_assets/laughing-man_mark_01.png'
    },
  ])

  const currentChat = chatSessions.find(chat => chat.id === currentChatId)

  const handleSendMessage = (userMessage) => {
    const updatedSessions = chatSessions.map(chat => {
      if (chat.id === currentChatId) {
        const newMessages = [...chat.messages, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }]

        // Update title if this is the first message
        const title = chat.messages.length === 0
          ? userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : '')
          : chat.title

        return { ...chat, messages: newMessages, title }
      }
      return chat
    })

    setChatSessions(updatedSessions)

    // Simple AI response logic
    setTimeout(() => {
      let aiResponse = ''
      const lowerMessage = userMessage.toLowerCase()

      if (lowerMessage.includes('スクラッチパッド') || lowerMessage.includes('scratchpad')) {
        aiResponse = 'スクラッチパッドを更新しました。'
        handleScratchpadUpdate(
          scratchpadTabs.find(tab => tab.id === currentScratchpadTabId)?.content +
          '\n// AI generated content\n' + userMessage
        )
      } else if (lowerMessage.includes('こんにちは') || lowerMessage.includes('hello')) {
        aiResponse = 'こんにちは！どのようにお手伝いできますか？'
      } else {
        aiResponse = 'ご質問ありがとうございます。シンプルなAIとして、基本的な応答のみ可能です。'
      }

      setChatSessions(prevSessions =>
        prevSessions.map(chat => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, { role: 'ai', type: 'dione', status: 'success', content: aiResponse, timestamp: new Date().toISOString() }]
            }
          }
          return chat
        })
      )
    }, 500)
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: '新しいチャット',
      messages: [],
      createdAt: new Date().toISOString()
    }
    setChatSessions([newChat, ...chatSessions])
    setCurrentChatId(newChat.id)
  }

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId)
  }

  const handleDeleteChat = (chatId) => {
    const filteredSessions = chatSessions.filter(chat => chat.id !== chatId)

    if (filteredSessions.length === 0) {
      // Create a new empty chat if all are deleted
      const newChat = {
        id: Date.now(),
        title: '新しいチャット',
        messages: [],
        createdAt: new Date().toISOString()
      }
      setChatSessions([newChat])
      setCurrentChatId(newChat.id)
    } else {
      setChatSessions(filteredSessions)
      if (currentChatId === chatId) {
        setCurrentChatId(filteredSessions[0].id)
      }
    }
  }

  // Scratchpad handlers
  const handleScratchpadUpdate = (newContent) => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1)
          newHistory.push(newContent)
          return {
            ...tab,
            content: newContent,
            history: newHistory,
            historyIndex: newHistory.length - 1
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadUndo = () => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex > 0) {
          const newIndex = tab.historyIndex - 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex
          }
        }
        return tab
      })
    )
  }

  const handleScratchpadRedo = () => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab => {
        if (tab.id === currentScratchpadTabId && tab.historyIndex < tab.history.length - 1) {
          const newIndex = tab.historyIndex + 1
          return {
            ...tab,
            content: tab.history[newIndex],
            historyIndex: newIndex
          }
        }
        return tab
      })
    )
  }

  const handleNewScratchpadTab = () => {
    const newTab = {
      id: Date.now(),
      title: `Untitled ${scratchpadTabs.length + 1}`,
      content: '',
      history: [''],
      historyIndex: 0
    }
    setScratchpadTabs([...scratchpadTabs, newTab])
    setCurrentScratchpadTabId(newTab.id)
  }

  const handleSelectScratchpadTab = (tabId) => {
    setCurrentScratchpadTabId(tabId)
  }

  const handleCloseScratchpadTab = (tabId) => {
    const filteredTabs = scratchpadTabs.filter(tab => tab.id !== tabId)

    if (filteredTabs.length === 0) {
      const newTab = {
        id: Date.now(),
        title: 'Untitled 1',
        content: '',
        history: [''],
        historyIndex: 0
      }
      setScratchpadTabs([newTab])
      setCurrentScratchpadTabId(newTab.id)
    } else {
      setScratchpadTabs(filteredTabs)
      if (currentScratchpadTabId === tabId) {
        setCurrentScratchpadTabId(filteredTabs[0].id)
      }
    }
  }

  const handleRenameScratchpadTab = (tabId, newTitle) => {
    setScratchpadTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title: newTitle } : tab
      )
    )
  }

  const handleUploadLibrary = (file) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: e.target.result,
        file: file
      }
      setLibraries([...libraries, newLibrary])
    }

    // Read as text for most files, but handle binary files differently
    const fileType = file.name.split('.').pop().toLowerCase()
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType)) {
      // For binary files, store the file object directly
      const newLibrary = {
        id: Date.now(),
        name: file.name,
        type: 'library',
        content: '',
        file: file
      }
      setLibraries([...libraries, newLibrary])
    } else {
      reader.readAsText(file)
    }
  }

  const handleDeleteLibrary = (libraryId) => {
    setLibraries(libraries.filter(lib => lib.id !== libraryId))
  }

  const handleDeleteDocument = (documentId) => {
    setDocuments(documents.filter(doc => doc.id !== documentId))
  }

  const currentScratchpadTab = scratchpadTabs.find(tab => tab.id === currentScratchpadTabId)

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={`app-container ${theme}-theme`}>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <ChatPanel
            chatSessions={chatSessions}
            currentChatId={currentChatId}
            currentMessages={currentChat?.messages || []}
            onSendMessage={handleSendMessage}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={50} minSize={30}>
          <Scratchpad
            tabs={scratchpadTabs}
            currentTabId={currentScratchpadTabId}
            currentTab={currentScratchpadTab}
            onUpdate={handleScratchpadUpdate}
            onUndo={handleScratchpadUndo}
            onRedo={handleScratchpadRedo}
            onNewTab={handleNewScratchpadTab}
            onSelectTab={handleSelectScratchpadTab}
            onCloseTab={handleCloseScratchpadTab}
            onRenameTab={handleRenameScratchpadTab}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={25} minSize={15} maxSize={40}>
          <DocumentPanel
            documents={documents}
            libraries={libraries}
            onUploadLibrary={handleUploadLibrary}
            onDeleteLibrary={handleDeleteLibrary}
            onDeleteDocument={handleDeleteDocument}
          />
        </Panel>
      </PanelGroup>
    </div>
  )
}

export default App
