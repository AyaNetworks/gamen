import { useState } from 'react'
import ChatPanel from './components/ChatPanel'
import Scratchpad from './components/Scratchpad'
import DocumentPanel from './components/DocumentPanel'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [scratchpadContent, setScratchpadContent] = useState('')
  const [documents, setDocuments] = useState([
    { id: 1, name: 'React Documentation', type: 'document', content: 'React is a JavaScript library for building user interfaces.' },
    { id: 2, name: 'API Reference', type: 'document', content: 'API endpoints and usage guide for the application.' },
  ])
  const [libraries, setLibraries] = useState([
    { id: 1, name: 'utility-functions.js', type: 'library', content: 'export const formatDate = (date) => {\n  return new Date(date).toLocaleDateString();\n}' },
  ])

  const handleSendMessage = (userMessage) => {
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

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

      setMessages([...newMessages, { role: 'ai', content: aiResponse }])
    }, 500)
  }

  const handleUploadLibrary = (file) => {
    const newLibrary = {
      id: libraries.length + 1,
      name: file.name,
      type: 'library',
      content: `// Uploaded file: ${file.name}\n// File content would be here`
    }
    setLibraries([...libraries, newLibrary])
  }

  return (
    <div className="app-container">
      <ChatPanel messages={messages} onSendMessage={handleSendMessage} />
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
