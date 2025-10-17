import { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

function ChatPanel({
  chatSessions,
  currentChatId,
  currentMessages,
  onSendMessage,
  onNewChat,
  onSelectChat,
  onDeleteChat
}) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '今'
    if (diffMins < 60) return `${diffMins}分前`
    if (diffHours < 24) return `${diffHours}時間前`
    if (diffDays < 7) return `${diffDays}日前`

    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="chat-panel">
      {/* Chat History Sidebar */}
      <div className="chat-history-sidebar">
        <div className="chat-history-header">
          <h3>チャット履歴</h3>
          <button className="new-chat-button" onClick={onNewChat} title="新しいチャット">
            +
          </button>
        </div>
        <div className="chat-history-list">
          {chatSessions.map((chat) => (
            <div
              key={chat.id}
              className={`chat-history-item ${chat.id === currentChatId ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="chat-history-content">
                <div className="chat-history-title">{chat.title}</div>
                <div className="chat-history-meta">
                  <span className="chat-message-count">{chat.messages.length}件</span>
                  <span className="chat-timestamp">{formatDate(chat.createdAt)}</span>
                </div>
              </div>
              <button
                className="chat-delete-button"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteChat(chat.id)
                }}
                title="削除"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <h2>AI Chat</h2>
        </div>
        <div className="chat-messages">
          {currentMessages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-role">{message.role === 'user' ? 'User' : 'AI'}</div>
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="メッセージを入力..."
            className="chat-input"
          />
          <button type="submit" className="chat-send-button">送信</button>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel
