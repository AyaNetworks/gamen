import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { FiDownload, FiRotateCcw, FiRotateCw } from 'react-icons/fi'
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
  const [prevTabCount, setPrevTabCount] = useState(0)
  const [animatingTabId, setAnimatingTabId] = useState(null)
  const [pendingAnimationId, setPendingAnimationId] = useState(null)
  const [shouldAnimateNewTabBtn, setShouldAnimateNewTabBtn] = useState(false)
  const editorRef = useRef(null)
  const previewRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: previewRef })

  // Detect new tab during render OR use animating tab
  const newTabId =
    tabs.length > prevTabCount && !animatingTabId
      ? currentTabId
      : animatingTabId

  // Plus button pulsing glow + scale bounce animation
  const plusButtonVariants = {
    normal: {
      scale: 1,
      boxShadow: '0 0 10px rgba(100, 108, 255, 0.3)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    animate: {
      scale: [1, 1.15, 1.05, 1],
      boxShadow: [
        '0 0 10px rgba(100, 108, 255, 0.3)',
        '0 0 30px rgba(100, 108, 255, 1)',
        '0 0 25px rgba(100, 108, 255, 0.8)',
        '0 0 15px rgba(100, 108, 255, 0.5)',
      ],
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  }

  // Animation variants (same as chat)
  const newTabVariants = {
    initial: {
      opacity: 0,
      y: 40,
      scale: 0.5,
      boxShadow: '0 0 0px rgba(100, 108, 255, 0)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      boxShadow: [
        '0 0 0px rgba(100, 108, 255, 0)',
        '0 0 30px rgba(100, 108, 255, 0.9)',
        '0 0 15px rgba(100, 108, 255, 0.4)',
        '0 0 0px rgba(100, 108, 255, 0)',
      ],
      transition: {
        opacity: {
          type: 'tween',
          duration: 0.25,
          ease: 'easeOut',
        },
        y: {
          type: 'tween',
          duration: 0.35,
          ease: [0.34, 1.56, 0.64, 1],
        },
        scale: {
          type: 'tween',
          duration: 0.35,
          ease: [0.34, 1.56, 0.64, 1],
        },
        boxShadow: {
          duration: 0.5,
          delay: 0.1,
          times: [0, 0.3, 0.7, 1],
          ease: 'easeOut',
        },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -20,
      transition: {
        opacity: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
        scale: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
        y: {
          type: 'tween',
          duration: 0.4,
          ease: 'easeOut',
        },
      },
    },
  }

  // Handle new tabs - queue them if animation is running
  useEffect(() => {
    if (tabs.length > prevTabCount) {
      const newTabId = currentTabId

      if (!animatingTabId) {
        // No animation running, start immediately
        setAnimatingTabId(newTabId)
        setPendingAnimationId(null)
      } else {
        // Animation running, queue this for later
        setPendingAnimationId(newTabId)
      }

      setPrevTabCount(tabs.length)
    } else if (tabs.length < prevTabCount) {
      // Tab deleted
      setPrevTabCount(tabs.length)
      setAnimatingTabId(null)
      setPendingAnimationId(null)
    }
  }, [tabs.length])

  // When current animation finishes, start pending animation
  useEffect(() => {
    if (!animatingTabId) return

    const timer = setTimeout(() => {
      if (pendingAnimationId) {
        // Start animating the pending tab
        setAnimatingTabId(pendingAnimationId)
        setPendingAnimationId(null)
      } else {
        // No pending, just clear
        setAnimatingTabId(null)
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [animatingTabId, pendingAnimationId])

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

  const handleDownload = () => {
    if (!currentTab) return

    // Create blob with the content
    const content = currentTab.content || ''
    const filename = `${currentTab.title || 'untitled'}.md`
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })

    // Create download link
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    // Trigger download
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="scratchpad">
      {/* Header */}
      <div className="scratchpad-header">
        <div className="scratchpad-title-section">
          <h2>Dione Workspaces</h2>
          <span className="scratchpad-subtitle">Dioneと作業するワークスペース</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="scratchpad-tabs">
        <div className="tabs-list">
          <AnimatePresence>
            {tabs.map((tab) => {
              const isNewTab = tab.id === newTabId
              return (
                <motion.div
                  key={tab.id}
                  className={`tab ${tab.id === currentTabId ? 'active' : ''}`}
                  onClick={() => onSelectTab(tab.id)}
                  initial={
                    isNewTab
                      ? newTabVariants.initial
                      : false
                  }
                  animate={
                    isNewTab
                      ? newTabVariants.animate
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={newTabVariants.exit}
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
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        <motion.button
          className="new-tab-button"
          onClick={() => {
            setShouldAnimateNewTabBtn(true)
            onNewTab()
          }}
          title="新しいタブ"
          variants={plusButtonVariants}
          initial="normal"
          animate={shouldAnimateNewTabBtn ? 'animate' : 'normal'}
          onAnimationComplete={() => setShouldAnimateNewTabBtn(false)}
        >
          +
        </motion.button>
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
            <FiRotateCcw size={18} />
          </button>
          <button
            className={`version-button ${!canRedo ? 'disabled' : ''}`}
            onClick={onRedo}
            disabled={!canRedo}
            title="やり直す (Redo)"
          >
            <FiRotateCw size={18} />
          </button>
          <button
            className="version-button download-button"
            onClick={handleDownload}
            title="ダウンロード (Download)"
          >
            <FiDownload size={18} />
          </button>
        </div>

        {isPreviewMode ? (
          <div className="scratchpad-preview" ref={previewRef} onContextMenu={handleEditorContextMenu}>
            {/* Scroll Progress Indicator */}
            <motion.div
              className="scroll-progress-indicator"
              style={{
                scaleX: scrollYProgress,
              }}
            />
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
            placeholder="Dioneがここに内容を生成します..."
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
