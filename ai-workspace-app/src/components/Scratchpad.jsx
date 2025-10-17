import { useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
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
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [controllerPosition, setControllerPosition] = useState(null)
  const editorRef = useRef(null)

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

  const handleEditorContextMenu = (e) => {
    e.preventDefault() // Prevent default context menu
    const rect = e.currentTarget.getBoundingClientRect()
    setControllerPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleCloseController = () => {
    setControllerPosition(null)
  }

  const handleToggleMode = () => {
    setIsPreviewMode(!isPreviewMode)
    setControllerPosition(null)
  }

  const handleDirectionAction = (direction) => {
    // Placeholder actions for directional buttons
    console.log(`Action for direction: ${direction}`)
    setControllerPosition(null)
  }

  return (
    <div className="scratchpad">
      {/* Header */}
      <div className="scratchpad-header">
        <div className="scratchpad-title-section">
          <h2>Scratchpad</h2>
          <span className="scratchpad-subtitle">AIが作成するワークスペース</span>
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

      {/* Editor / Preview */}
      <div className="scratchpad-content" ref={editorRef}>
        {/* Version Control Inside Content */}
        <div className="version-control-inline">
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

        {isPreviewMode ? (
          <div className="scratchpad-preview" onContextMenu={handleEditorContextMenu}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[rehypeHighlight]}
            >
              {currentTab?.content || '*Markdown content will appear here...*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            className="scratchpad-editor"
            value={currentTab?.content || ''}
            onChange={handleEditorChange}
            onContextMenu={handleEditorContextMenu}
            placeholder="AIがここに内容を生成します..."
          />
        )}

        {/* Circular Controller */}
        {controllerPosition && (
          <>
            <div className="controller-overlay" onClick={handleCloseController} />
            <div
              className="circular-controller"
              style={{
                left: `${controllerPosition.x}px`,
                top: `${controllerPosition.y}px`
              }}
            >
              {/* Center Button */}
              <button
                className="controller-center"
                onClick={handleToggleMode}
                title={isPreviewMode ? '編集モードに切り替え' : 'プレビューモードに切り替え'}
              >
                {isPreviewMode ? '✏️' : '👁️'}
              </button>

              {/* Directional Buttons */}
              <button
                className="controller-button controller-top"
                onClick={() => handleDirectionAction('top')}
                title="上"
              >
                ⬆️
              </button>
              <button
                className="controller-button controller-right"
                onClick={() => handleDirectionAction('right')}
                title="右"
              >
                ➡️
              </button>
              <button
                className="controller-button controller-bottom"
                onClick={() => handleDirectionAction('bottom')}
                title="下"
              >
                ⬇️
              </button>
              <button
                className="controller-button controller-left"
                onClick={() => handleDirectionAction('left')}
                title="左"
              >
                ⬅️
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Scratchpad
