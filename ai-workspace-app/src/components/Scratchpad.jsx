import { useState } from 'react'
import './Scratchpad.css'

function Scratchpad({
  tabs,
  currentTabId,
  currentTab,
  onUpdate,
  onUndo,
  onRedo,
  onNewTab,
  onSelectTab,
  onCloseTab,
  onRenameTab
}) {
  const [editingTabId, setEditingTabId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')

  const handleEditorChange = (e) => {
    onUpdate(e.target.value)
  }

  const handleTabDoubleClick = (tab) => {
    setEditingTabId(tab.id)
    setEditingTitle(tab.title)
  }

  const handleTitleChange = (e) => {
    setEditingTitle(e.target.value)
  }

  const handleTitleSubmit = () => {
    if (editingTitle.trim()) {
      onRenameTab(editingTabId, editingTitle.trim())
    }
    setEditingTabId(null)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    } else if (e.key === 'Escape') {
      setEditingTabId(null)
    }
  }

  const canUndo = currentTab && currentTab.historyIndex > 0
  const canRedo = currentTab && currentTab.historyIndex < currentTab.history.length - 1

  return (
    <div className="scratchpad">
      {/* Header with version control */}
      <div className="scratchpad-header">
        <div className="scratchpad-title-section">
          <h2>Scratchpad</h2>
          <span className="scratchpad-subtitle">AIが作成するワークスペース</span>
        </div>
        <div className="version-control">
          <button
            className={`version-button ${!canUndo ? 'disabled' : ''}`}
            onClick={onUndo}
            disabled={!canUndo}
            title="元に戻す (Undo)"
          >
            ↶
          </button>
          <button
            className={`version-button ${!canRedo ? 'disabled' : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="やり直す (Redo)"
          >
            ↷
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="scratchpad-tabs">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${tab.id === currentTabId ? 'active' : ''}`}
              onClick={() => onSelectTab(tab.id)}
            >
              {editingTabId === tab.id ? (
                <input
                  className="tab-title-input"
                  value={editingTitle}
                  onChange={handleTitleChange}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleTitleKeyDown}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span
                    className="tab-title"
                    onDoubleClick={() => handleTabDoubleClick(tab)}
                  >
                    {tab.title}
                  </span>
                  {tabs.length > 1 && (
                    <button
                      className="tab-close"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCloseTab(tab.id)
                      }}
                      title="閉じる"
                    >
                      ×
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <button className="new-tab-button" onClick={onNewTab} title="新しいタブ">
          +
        </button>
      </div>

      {/* Editor */}
      <textarea
        className="scratchpad-editor"
        value={currentTab?.content || ''}
        onChange={handleEditorChange}
        placeholder="AIがここに内容を生成します..."
      />
    </div>
  )
}

export default Scratchpad
