import { useState, useRef, useEffect } from 'react'
import { FiPaperclip, FiSun, FiMoon, FiMessageSquare, FiZap, FiTool, FiUser, FiStar, FiCheckSquare } from 'react-icons/fi'
import MessageDetailModal from './MessageDetailModal'
import ConfigurationModal from './ConfigurationModal'
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
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [openConfigModal, setOpenConfigModal] = useState(null) // 'dione', 'tool', 'task', or null
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentMessages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() || attachedFiles.length > 0) {
      onSendMessage(inputValue, attachedFiles)
      setInputValue('')
      setAttachedFiles([])
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const fileData = files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
      }))
      setAttachedFiles([...attachedFiles, ...fileData])
    }
  }

  const handleRemoveFile = (index) => {
    const newFiles = [...attachedFiles]
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview)
    }
    newFiles.splice(index, 1)
    setAttachedFiles(newFiles)
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.startsWith('video/')) return '🎥'
    if (fileType.startsWith('audio/')) return '🎵'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊'
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📊'
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return '📦'
    return '📎'
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
    if (message.role === 'user') return null // No label for user messages

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

  const getMessageTypeIcon = (message) => {
    if (message.role === 'user') return null // No icon for user messages

    const messageType = message.type || 'dione'

    switch (messageType) {
      case 'tool':
        return <FiTool size={16} />
      case 'thinking':
        return <FiZap size={16} />
      case 'dione':
      default:
        return <FiMessageSquare size={16} />
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ''

    const date = new Date(timestamp)
    const now = new Date()

    // Check if the message is from today
    const isToday = date.toDateString() === now.toDateString()

    // Format time as HH:MM
    const timeString = date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    if (isToday) {
      return timeString
    } else {
      // Show date and time for older messages
      const dateString = date.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric'
      })
      return `${dateString} ${timeString}`
    }
  }

  const handleMessageClick = (message) => {
    // Only show modal for AI messages that have detailed info
    if (message.role === 'ai' && (message.trace || message.traceback || message.toolArgs || message.toolResults)) {
      setSelectedMessage(message)
    }
  }

  const handleCloseModal = () => {
    setSelectedMessage(null)
  }

  const renderAttachments = (attachments) => {
    if (!attachments || attachments.length === 0) return null

    return (
      <div className="message-attachments">
        {attachments.map((file, index) => (
          <div key={index} className="message-attachment">
            {file.preview ? (
              <img src={file.preview} alt={file.name} className="message-attachment-image" />
            ) : (
              <div className="message-attachment-file">
                <div className="message-attachment-icon">{getFileIcon(file.type)}</div>
                <div className="message-attachment-info">
                  <div className="message-attachment-name">{file.name}</div>
                  <div className="message-attachment-size">{formatFileSize(file.size)}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )
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
                <div className="chat-compact-icon"><FiMessageSquare size={20} /></div>
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
          <div className="chat-header-buttons">
            <button
              className="config-button dione-config-button"
              onClick={() => setOpenConfigModal('dione')}
              title="Dione設定"
            >
              <FiUser size={20} />
            </button>
            <button
              className="config-button tool-config-button"
              onClick={() => setOpenConfigModal('tool')}
              title="ツール設定"
            >
              <FiStar size={20} />
            </button>
            <button
              className="config-button task-config-button"
              onClick={() => setOpenConfigModal('task')}
              title="タスク設定"
            >
              <FiCheckSquare size={20} />
            </button>
            <button
              className="theme-toggle-button"
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>
        </div>
        <div className="chat-messages">
          {currentMessages.map((message, index) => {
            const hasDetails = message.role === 'ai' && (message.trace || message.traceback || message.toolArgs || message.toolResults)
            return (
              <div
                key={index}
                className={`message ${message.role} ${message.role === 'ai' ? `message-${message.type || 'dione'}` : ''} ${message.role === 'ai' ? `message-${message.status || 'success'}` : ''} ${hasDetails ? 'message-clickable' : ''}`}
                onClick={() => handleMessageClick(message)}
              >
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
                <div className="message-content-wrapper">
                  <div className="message-bubble">
                    {getMessageLabel(message) && (
                      <div className="message-role">
                        <span className="message-type-icon">{getMessageTypeIcon(message)}</span>
                        <span>{getMessageLabel(message)}</span>
                      </div>
                    )}
                    {message.content && (
                      <div className="message-content">{message.content}</div>
                    )}
                    {renderAttachments(message.attachments)}
                  </div>
                  <div className="message-timestamp">{formatTimestamp(message.timestamp)}</div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSubmit}>
          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="attached-files-preview">
              {attachedFiles.map((file, index) => (
                <div key={index} className="attached-file-item">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="attached-file-image" />
                  ) : (
                    <div className="attached-file-icon">{getFileIcon(file.type)}</div>
                  )}
                  <div className="attached-file-info">
                    <div className="attached-file-name">{file.name}</div>
                    <div className="attached-file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <button
                    type="button"
                    className="attached-file-remove"
                    onClick={() => handleRemoveFile(index)}
                    title="削除"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="chat-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="chat-attach-button"
              onClick={handleAttachClick}
              title="ファイルを添付"
            >
              <FiPaperclip size={20} />
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Dioneと何をしますか？"
              className="chat-input"
            />
            <button type="submit" className="chat-send-button">送信</button>
          </div>
        </form>
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={handleCloseModal}
          theme={theme}
        />
      )}

      {openConfigModal && (
        <ConfigurationModal
          configType={openConfigModal}
          onClose={() => setOpenConfigModal(null)}
          theme={theme}
        />
      )}
    </div>
  )
}

export default ChatPanel
