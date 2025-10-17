import { useState, useRef, useEffect } from 'react'
import './ChatPanel.css'

function ChatPanel({
  chatSessions,
  currentChatId,
  currentMessages,
  onSendMessage,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  theme,
  onToggleTheme
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

  const formatDateCompact = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return '今'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`

    return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
  }

  const getDioneIcon = (message) => {
    const messageType = message.type || 'dione' // Default to 'dione' if not specified
    const messageStatus = message.status || 'success' // Default to 'success' if not specified

    let iconPath = ''

    if (messageType === 'tool') {
      if (messageStatus === 'error') {
        // Tool error - use tool_error.png (same for both themes)
        iconPath = '/sample_assets/dione/tool_error.png'
      } else {
        // Tool success
        iconPath = theme === 'dark'
          ? '/sample_assets/dione/tool_dark.png'
          : '/sample_assets/dione/tool_light.png'
      }
    } else if (messageType === 'thinking') {
      // Thinking (usually success state)
      iconPath = theme === 'dark'
        ? '/sample_assets/dione/dione_thinking_dark.png'
        : '/sample_assets/dione/dione_thinking_light.png'
    } else {
      // Dione type (normal AI response)
      if (messageStatus === 'error') {
        iconPath = theme === 'dark'
          ? '/sample_assets/dione/dione_error_dark.png'
          : '/sample_assets/dione/dione_error_light.png'
      } else {
        iconPath = theme === 'dark'
          ? '/sample_assets/dione/dione_dark.png'
          : '/sample_assets/dione/dione_light.png'
      }
    }

    return iconPath
  }

  const getMessageLabel = (message) => {
    if (message.role === 'user') return 'User'

    const messageType = message.type || 'dione'

    switch (messageType) {
      case 'tool':
        return 'TOOL'
      case 'thinking':
        return 'THINKING'
      case 'dione':
      default:
        return 'DIONE'
    }
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
              {/* Compact view (shown when sidebar is collapsed) */}
              <div className="chat-history-compact">
                <div className="chat-compact-time">{formatDateCompact(chat.createdAt)}</div>
                <div className="chat-compact-icon">💬</div>
                <div className="chat-compact-count">{chat.messages.length}</div>
              </div>

              {/* Expanded view (shown when sidebar is hovered) */}
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
          <h2>チャット</h2>
          <button
            className="theme-toggle-button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="chat-messages">
          {currentMessages.map((message, index) => (
            <div key={index} className={`message ${message.role} ${message.role === 'ai' ? `message-${message.type || 'dione'}` : ''} ${message.role === 'ai' ? `message-${message.status || 'success'}` : ''}`}>
              {message.role === 'ai' && (
                <img
                  src={getDioneIcon(message)}
                  alt="Dione"
                  className="message-avatar"
                  onError={(e) => {
                    // Fallback to default dark icon if image fails to load
                    e.target.src = '/sample_assets/dione/dione_dark.png'
                  }}
                />
              )}
              <div className="message-bubble">
                <div className="message-role">{getMessageLabel(message)}</div>
                <div className="message-content">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Dioneに指示してください"
            className="chat-input"
          />
          <button type="submit" className="chat-send-button">送信</button>
        </form>
      </div>
    </div>
  )
}

export default ChatPanel
