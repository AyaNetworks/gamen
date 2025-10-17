import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import Scratchpad from './components/Scratchpad'
import DocumentPanel from './components/DocumentPanel'
import './App.css'

function App() {
  const [chatSessions, setChatSessions] = useState([
    {
      id: 1,
      title: '新しいチャット',
      messages: [],
      createdAt: new Date().toISOString()
    }
  ])
  const [currentChatId, setCurrentChatId] = useState(1)
  const [scratchpadContent, setScratchpadContent] = useState('')
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'React Documentation.md',
      type: 'document',
      content: '# React Documentation\n\nReact is a **JavaScript library** for building user interfaces.\n\n## Key Features\n\n- Component-Based\n- Declarative\n- Learn Once, Write Anywhere\n\n```javascript\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n```'
    },
    {
      id: 2,
      name: 'API Reference.md',
      type: 'document',
      content: '# API Reference\n\n## Endpoints\n\n### GET /api/users\n\nReturns a list of users.\n\n**Response:**\n```json\n{\n  "users": [\n    { "id": 1, "name": "John" }\n  ]\n}\n```'
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
        const newMessages = [...chat.messages, { role: 'user', content: userMessage }]

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
        setScratchpadContent(prev => prev + '\n' + '// AI generated content\n' + userMessage)
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
              messages: [...chat.messages, { role: 'ai', content: aiResponse }]
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

  return (
    <div className="app-container">
      <ChatPanel
        chatSessions={chatSessions}
        currentChatId={currentChatId}
        currentMessages={currentChat?.messages || []}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <Scratchpad content={scratchpadContent} onChange={setScratchpadContent} />
      <DocumentPanel
        documents={documents}
        libraries={libraries}
        onUploadLibrary={handleUploadLibrary}
      />
    </div>
  )
}

export default App
