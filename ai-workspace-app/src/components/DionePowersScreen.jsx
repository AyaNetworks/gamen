import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiPlus, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi'
import Button from './ui/Button'
import './DionePowersScreen.css'

// Library Selection Modal Component
function LibrarySelectionModal({ selectionType, items, onSelect, onClose, theme }) {
  const [selectedIds, setSelectedIds] = useState([])

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(items.map(item => item.id))
    }
  }

  const getTypeLabel = () => {
    if (selectionType === 'artifacts') return 'ワークスペースアーティファクト'
    if (selectionType === 'sessions') return 'ライブラリドキュメント'
    if (selectionType === 'knowledge') return 'ナレッジベース'
    return 'コンテキストを選択'
  }

  return (
    <motion.div
      className="context-modal"
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="context-modal-header">
        <h3>{getTypeLabel()}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          animated={false}
        >
          <FiX size={20} />
        </Button>
      </div>
      <div className="context-modal-content">
        {items.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            利用可能なアイテムがありません
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(100,108,255,0.2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === items.length}
                  onChange={handleSelectAll}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                  すべて選択 ({selectedIds.length}/{items.length})
                </span>
              </label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {items.map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '10px',
                    background: 'rgba(50,50,80,0.3)',
                    border: '1px solid rgba(100,108,255,0.2)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => handleSelect(item.id)}
                    style={{ width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.95)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                      {selectionType === 'artifacts' && `${item.type} • ${item.size}`}
                      {selectionType === 'sessions' && `${new Date(item.uploadedAt).toLocaleDateString('ja-JP')}`}
                      {selectionType === 'knowledge' && `${item.category}`}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid rgba(100,108,255,0.15)', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          onClick={onClose}
          animated={false}
        >
          キャンセル
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            if (selectedIds.length > 0) {
              onSelect(selectedIds)
            }
          }}
          disabled={selectedIds.length === 0}
          animated={false}
        >
          選択 ({selectedIds.length})
        </Button>
      </div>
    </motion.div>
  )
}

function DionePowersScreen({
  onClose,
  theme,
  currentChatHistory,
  currentArtifact,
  source = 'chat',
  documents = [],           // Real documents from App.jsx
  libraries = [],           // Real libraries from App.jsx
  scratchpadTabs = []       // Real artifacts from App.jsx
}) {
  // source can be 'chat' (from ChatPanel) or 'artifact' (from Scratchpad)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [dioneState, setDioneState] = useState('idle') // idle, thinking, listening
  const [showLibrarySelectionModal, setShowLibrarySelectionModal] = useState(false)
  const [librarySelectionType, setLibrarySelectionType] = useState(null) // 'artifacts' | 'sessions' | 'knowledge'
  const [attachedContext, setAttachedContext] = useState({
    chatHistory: true, // Always include chat history
    currentArtifact: currentArtifact ? true : false,
    artifacts: [], // Additional artifacts from workspace
    sessions: [], // Session files from Library
    knowledge: [], // Dione knowledge from Library
    uploadedFiles: [],
  })
  const [artifactInfo] = useState(currentArtifact ? {
    title: currentArtifact.title || 'タイトルなしのアーティファクト',
    content: currentArtifact.content || '',
    contentPreview: currentArtifact.content ? currentArtifact.content.substring(0, 100) + '...' : 'コンテンツなし'
  } : null)
  const [systemPrompt, setSystemPrompt] = useState('Dioneのパーソナリティプロフィールを構築しています...\n\n私たちが話し合う中で、あなたの役割、チーム、好み、そして仕事のやり方について学びます。これが私があなたをどのようにサポートするかを形作ります。')
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState(systemPrompt)
  const [showContextModal, setShowContextModal] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const promptTextareaRef = useRef(null)

  const availableContexts = [
    // Direct uploads
    { id: 'file', label: 'ファイルをアップロード', description: '新しいファイルを添付', category: 'アップロード' },
    // Workspace and Library sources
    { id: 'workspace-artifacts', label: 'ワークスペースアーティファクト', description: `${scratchpadTabs.length}個のアーティファクトから選択`, category: 'ライブラリ' },
    { id: 'session-files', label: 'ライブラリドキュメント', description: `${libraries.length}個のドキュメントから選択`, category: 'ライブラリ' },
    { id: 'dione-knowledge', label: 'ナレッジベース', description: `${documents.length}個のナレッジアイテムから選択`, category: 'ライブラリ' },
  ]

  // Handle prompt edit mode
  const handleEditPrompt = () => {
    setIsEditingPrompt(true)
    setEditingPrompt(systemPrompt)
  }

  const handleSavePrompt = () => {
    setSystemPrompt(editingPrompt)
    setIsEditingPrompt(false)
  }

  const handleCancelEdit = () => {
    setIsEditingPrompt(false)
    setEditingPrompt(systemPrompt)
  }

  // Use real data from props instead of mock data
  const realWorkspaceArtifacts = scratchpadTabs.map((tab, idx) => ({
    id: `tab-${tab.id}`,
    name: tab.title,
    type: tab.fileType || 'document',
    content: tab.content,
    size: `${Math.ceil(tab.content.length / 1024)}KB`,
  }))

  const realLibraries = libraries.map((lib) => ({
    id: `lib-${lib.id}`,
    name: lib.name,
    type: lib.type,
    content: lib.content,
    filePath: lib.filePath,
    uploadedAt: lib.tags?.uploadedAt || new Date().toISOString(),
  }))

  const realDocuments = documents.map((doc) => ({
    id: `doc-${doc.id}`,
    name: doc.name,
    type: doc.type,
    content: doc.content,
    category: doc.tags?.category || 'その他',
  }))

  // Handle context selection
  const handleAddContext = (contextType) => {
    // Map context types to handler
    if (contextType === 'file') {
      // Trigger file input
      document.getElementById('file-input-dione')?.click()
    } else if (contextType === 'url') {
      // Show URL input
      const url = prompt('URLを入力してください:')
      if (url) {
        setAttachedContext({
          ...attachedContext,
          uploadedFiles: [...attachedContext.uploadedFiles, { type: 'url', value: url }],
        })
        setShowContextModal(false)
      }
    } else if (contextType === 'notes') {
      // Show notes input
      const notes = prompt('メモを入力してください:')
      if (notes) {
        setAttachedContext({
          ...attachedContext,
          uploadedFiles: [...attachedContext.uploadedFiles, { type: 'notes', value: notes }],
        })
        setShowContextModal(false)
      }
    } else if (contextType === 'workspace-artifacts') {
      // Close context modal and open library selection modal
      setShowContextModal(false)
      setLibrarySelectionType('artifacts')
      setShowLibrarySelectionModal(true)
    } else if (contextType === 'session-files') {
      // Close context modal and open library selection modal
      setShowContextModal(false)
      setLibrarySelectionType('sessions')
      setShowLibrarySelectionModal(true)
    } else if (contextType === 'dione-knowledge') {
      // Close context modal and open library selection modal
      setShowContextModal(false)
      setLibrarySelectionType('knowledge')
      setShowLibrarySelectionModal(true)
    }
  }

  // Handle library selection
  const handleSelectLibraryItems = (selectedIds) => {
    if (librarySelectionType === 'artifacts') {
      const selected = realWorkspaceArtifacts.filter(a => selectedIds.includes(a.id))
      setAttachedContext({
        ...attachedContext,
        artifacts: [...attachedContext.artifacts, ...selected],
      })
    } else if (librarySelectionType === 'sessions') {
      const selected = realLibraries.filter(l => selectedIds.includes(l.id))
      setAttachedContext({
        ...attachedContext,
        sessions: [...attachedContext.sessions, ...selected],
      })
    } else if (librarySelectionType === 'knowledge') {
      const selected = realDocuments.filter(d => selectedIds.includes(d.id))
      setAttachedContext({
        ...attachedContext,
        knowledge: [...attachedContext.knowledge, ...selected],
      })
    }
    setShowLibrarySelectionModal(false)
    setLibrarySelectionType(null)
  }

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
                {/* Chat History - Always shown */}
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

                {/* Current Artifact */}
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

                {/* Workspace Artifacts */}
                {attachedContext.artifacts.map((artifact) => (
                  <div key={artifact.id} className="context-item artifact">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="context-label">{artifact.name}</span>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                        {artifact.type} • {artifact.size}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() =>
                        setAttachedContext({
                          ...attachedContext,
                          artifacts: attachedContext.artifacts.filter((a) => a.id !== artifact.id),
                        })
                      }
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                ))}

                {/* Session Files */}
                {attachedContext.sessions.map((session) => (
                  <div key={session.id} className="context-item session">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="context-label">{session.name}</span>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                        {session.date}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() =>
                        setAttachedContext({
                          ...attachedContext,
                          sessions: attachedContext.sessions.filter((s) => s.id !== session.id),
                        })
                      }
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                ))}

                {/* Dione Knowledge */}
                {attachedContext.knowledge.map((item) => (
                  <div key={item.id} className="context-item knowledge">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="context-label">{item.name}</span>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                        {item.category}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() =>
                        setAttachedContext({
                          ...attachedContext,
                          knowledge: attachedContext.knowledge.filter((k) => k.id !== item.id),
                        })
                      }
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                ))}

                {/* Uploaded Files */}
                {attachedContext.uploadedFiles.map((file, idx) => (
                  <div key={`${file.type}-${idx}`} className="context-item uploaded">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className="context-label">
                        {file.type === 'file' ? '📄' : file.type === 'url' ? '🔗' : '📝'} {file.value}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      animated={false}
                      onClick={() =>
                        setAttachedContext({
                          ...attachedContext,
                          uploadedFiles: attachedContext.uploadedFiles.filter((f, i) => i !== idx),
                        })
                      }
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              <button
                className="add-context-btn"
                onClick={() => setShowContextModal(true)}
              >
                <FiPlus size={16} />
                コンテキストをもっと追加
              </button>
            </div>

            {/* System Prompt Display - Title changes based on source */}
            <div className="essence-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3>{source === 'chat' ? 'ガイドライン' : 'Dioneプロフィール'}</h3>
                {!isEditingPrompt && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditPrompt}
                    title="編集"
                    animated={false}
                  >
                    <FiEdit2 size={16} />
                  </Button>
                )}
              </div>
              {isEditingPrompt ? (
                <div>
                  <textarea
                    ref={promptTextareaRef}
                    value={editingPrompt}
                    onChange={(e) => setEditingPrompt(e.target.value)}
                    className="prompt-textarea"
                    style={{
                      width: '100%',
                      height: '120px',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(100, 108, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                      resize: 'none',
                      marginBottom: '10px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSavePrompt}
                      animated={false}
                    >
                      <FiCheck size={16} />
                      保存
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      animated={false}
                    >
                      キャンセル
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="essence-content">
                  {systemPrompt}
                </div>
              )}
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

        {/* Library Selection Modal */}
        {showLibrarySelectionModal && (
          <div className="context-modal-overlay" onClick={() => {
            setShowLibrarySelectionModal(false)
            setLibrarySelectionType(null)
          }}>
            <LibrarySelectionModal
              selectionType={librarySelectionType}
              items={
                librarySelectionType === 'artifacts' ? realWorkspaceArtifacts :
                librarySelectionType === 'sessions' ? realLibraries :
                librarySelectionType === 'knowledge' ? realDocuments :
                []
              }
              onSelect={handleSelectLibraryItems}
              onClose={() => {
                setShowLibrarySelectionModal(false)
                setLibrarySelectionType(null)
              }}
              theme={theme}
            />
          </div>
        )}

        {/* Context Modal */}
        {showContextModal && (
          <div className="context-modal-overlay" onClick={() => setShowContextModal(false)}>
            <motion.div
              className="context-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="context-modal-header">
                <h3>コンテキストを追加</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowContextModal(false)}
                  animated={false}
                >
                  <FiX size={20} />
                </Button>
              </div>
              <div className="context-modal-content">
                {/* Group contexts by category */}
                {['アップロード', 'ライブラリ'].map((category) => (
                  <div key={category} style={{ marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '600', color: 'rgba(100, 150, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {category}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {availableContexts
                        .filter((c) => c.category === category)
                        .map((context) => (
                          <button
                            key={context.id}
                            className="context-option"
                            onClick={() => handleAddContext(context.id)}
                          >
                            <div className="context-option-content">
                              <h4>{context.label}</h4>
                              <p>{context.description}</p>
                            </div>
                            <FiPlus size={20} />
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          id="file-input-dione"
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setAttachedContext({
                ...attachedContext,
                uploadedFiles: [...attachedContext.uploadedFiles, { type: 'file', value: file.name }],
              })
              setShowContextModal(false)
            }
          }}
        />
      </motion.div>
    </div>,
    document.body
  )
}

export default DionePowersScreen
