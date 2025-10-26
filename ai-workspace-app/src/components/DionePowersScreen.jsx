import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi'
import Button from './ui/Button'
import './DionePowersScreen.css'

function DionePowersScreen({ onClose, theme, currentChatHistory, currentArtifact, source = 'chat' }) {
  // source can be 'chat' (from ChatPanel) or 'artifact' (from Scratchpad)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [dioneState, setDioneState] = useState('idle') // idle, thinking, listening
  const [attachedContext, setAttachedContext] = useState({
    chatHistory: currentChatHistory ? true : false,
    currentArtifact: currentArtifact ? true : false,
    uploadedFiles: [],
  })
  const [artifactInfo] = useState(currentArtifact ? {
    title: currentArtifact.title || 'タイトルなしのアーティファクト',
    content: currentArtifact.content || '',
    contentPreview: currentArtifact.content ? currentArtifact.content.substring(0, 100) + '...' : 'コンテンツなし'
  } : null)
  const [systemPrompt, setSystemPrompt] = useState('Dioneのパーソナリティプロフィールを構築しています...\n\n私たちが話し合う中で、あなたの役割、チーム、好み、そして仕事のやり方について学びます。これが私があなたをどのようにサポートするかを形作ります。')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [inputValue])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setDioneState('thinking')

    // Simulate Dione response (will be replaced with actual API call)
    setTimeout(() => {
      const dioneMessage = {
        id: Date.now() + 1,
        role: 'dione',
        content: `ご共有ありがとうございます。${inputValue.slice(0, 30)}...について取り組まれていることが理解できました。

あなたの状況をより良く理解するために、いくつかお尋ねしたいことがあります：
1. 現在のあなたの役割とチーム構成は何ですか？
2. 直面している主な課題や痛点は何ですか？
3. この分野でのあなたにとって成功とはどのような形ですか？

教えていただければ、より良くあなたをサポートできます。`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, dioneMessage])
      setDioneState('idle')
    }, 1500)
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getDioneAvatar = () => {
    const basePath = '/sample_assets/dione/'
    const isDark = theme === 'dark'

    if (dioneState === 'thinking') {
      return isDark ? `${basePath}dione_thinking_dark.png` : `${basePath}dione_thinking_light.png`
    }
    return isDark ? `${basePath}dione_dark.png` : `${basePath}dione_light.png`
  }

  return createPortal(
    <div className={`dione-powers-overlay ${theme}-theme`}>
      <motion.div
        className="dione-powers-monitor"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Monitor Bezel Header */}
        <div className="monitor-header">
          <h1 className="monitor-title">ガイドラインの作成</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            title="閉じる"
            animated={false}
          >
            <FiX size={24} />
          </Button>
        </div>

        {/* Main Content */}
        <div className="monitor-content">
          {/* Left: Dione Avatar & Context */}
          <div className="dione-sidebar">
            <div className="avatar-container">
              <img
                src={getDioneAvatar()}
                alt="Dione"
                className={`dione-avatar ${dioneState === 'thinking' ? 'thinking' : ''}`}
              />
              <div className="avatar-status">
                <span className={`status-indicator ${dioneState}`}></span>
                <span className="status-text">
                  {dioneState === 'thinking' ? 'Dioneが考え中です...' : '聞く準備ができています'}
                </span>
              </div>
            </div>

            {/* Context Panel */}
            <div className="context-panel">
              <h3>添付されたコンテキスト</h3>
              <div className="context-list">
                {attachedContext.chatHistory && (
                  <div className="context-item chat-history">
                    <span className="context-label">チャット履歴</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() => setAttachedContext({ ...attachedContext, chatHistory: false })}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                )}
                {attachedContext.currentArtifact && artifactInfo && (
                  <div className="context-item artifact">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="context-label">{artifactInfo.title}</span>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {artifactInfo.contentPreview}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() => setAttachedContext({ ...attachedContext, currentArtifact: false })}
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                )}
              </div>

              <button className="add-context-btn">
                <FiPlus size={16} />
                コンテキストをもっと追加
              </button>
            </div>

            {/* System Prompt Display - Title changes based on source */}
            <div className="essence-panel">
              <h3>{source === 'chat' ? 'ガイドライン' : 'Dioneプロフィール'}</h3>
              <div className="essence-content">
                {systemPrompt}
              </div>
            </div>
          </div>

          {/* Right: Conversation */}
          <div className="conversation-area">
            {/* Messages */}
            <div className="conversation-history">
              {messages.length === 0 ? (
                <div className="welcome-message">
                  <h2>Dioneパーソナリティ設定へようこそ</h2>
                  <p>
                    あなたユニークな状況、チーム構成、好みを理解するためにここにいます。
                    私たちの会話を通じて、あなたをより良くサポートする方法を学び、あなたのニーズに合わせてパーソナリティを形作ります。
                  </p>
                  {attachedContext.currentArtifact && artifactInfo && (
                    <p style={{ color: 'rgba(100, 108, 255, 0.8)', fontSize: '13px' }}>
                      📎 アーティファクトを読み込みました: <strong>{artifactInfo.title}</strong>
                    </p>
                  )}
                  <p>
                    まず、現在のプロジェクト、役割、または直面している課題についてお話しください。
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.role}`}>
                    <div className="message-content">{msg.content}</div>
                    <span className="message-time">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-area">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="あなたの状況、役割、チーム構成、または課題についてお話しください... (Ctrl+Enterで送信)"
                className="message-input"
                rows="1"
              />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                animated={false}
              >
                送信
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  )
}

export default DionePowersScreen
