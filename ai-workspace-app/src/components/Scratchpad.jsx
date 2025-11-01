import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiCopy,
  FiDownload,
  FiEdit2,
  FiEye,
  FiMoreVertical,
  FiPaperclip,
  FiRotateCcw,
  FiRotateCw,
  FiX,
} from 'react-icons/fi'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import 'highlight.js/styles/github-dark.css'
import PublishNotification from './PublishNotification'
import DionePowersScreen from './DionePowersScreen'
import StatsPanel from './StatsPanel'
import Button from './ui/Button'
import { useThemeStore } from '../store'
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
  onRenameTab,
  onAddDocument,
  onAttachToChat,
  documents = [],         // From App.jsx
  libraries = [],         // From App.jsx
}) {
  const [editingTabId, setEditingTabId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const [controllerPosition, setControllerPosition] = useState(null)
  const [prevTabCount, setPrevTabCount] = useState(0)
  const [animatingTabId, setAnimatingTabId] = useState(null)
  const [pendingAnimationId, setPendingAnimationId] = useState(null)
  const [shouldAnimateNewTabBtn, setShouldAnimateNewTabBtn] = useState(false)
  const [tabPublishStates, setTabPublishStates] = useState({
    2: true, // セグメント分析ノート is published by default
  })
  const [showNotification, setShowNotification] = useState(false)
  const [notificationIsPublished, setNotificationIsPublished] = useState(false)
  const [showArtifactMenu, setShowArtifactMenu] = useState(false)
  const [copiedMessage, setCopiedMessage] = useState(false)
  const [attachmentNotification, setAttachmentNotification] = useState(false)
  const [showDionePowersScreen, setShowDionePowersScreen] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const editorRef = useRef(null)
  const previewRef = useRef(null)
  const artifactMenuRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: previewRef })

  // Close artifact menu when clicking outside
  useEffect(() => {
    if (!showArtifactMenu) return

    const handleClickOutside = (event) => {
      if (artifactMenuRef.current && !artifactMenuRef.current.contains(event.target)) {
        setShowArtifactMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showArtifactMenu])

  // Detect new tab during render OR use animating tab
  const newTabId = tabs.length > prevTabCount && !animatingTabId ? currentTabId : animatingTabId

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
      y: e.clientY - rect.top,
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
    const currentTabIndex = tabs.findIndex((tab) => tab.id === currentTabId)

    switch (direction) {
      case 'left':
        // Navigate to previous tab
        if (currentTabIndex > 0) {
          onSelectTab(tabs[currentTabIndex - 1].id)
        }
        break
      case 'right':
        // Navigate to next tab
        if (currentTabIndex < tabs.length - 1) {
          onSelectTab(tabs[currentTabIndex + 1].id)
        }
        break
      case 'bottom':
        // Attach current tab to chat
        if (currentTab && onAttachToChat) {
          onAttachToChat({
            title: currentTab.title,
            content: currentTab.content,
          })
          // Show notification
          setAttachmentNotification(true)
          setTimeout(() => setAttachmentNotification(false), 3000)
        }
        break
      case 'top':
        // Open Dione Personality Configuration Screen with current artifact
        if (currentTab) {
          setShowDionePowersScreen(true)
        }
        break
      default:
        break
    }

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

    // Close menu after download
    setShowArtifactMenu(false)
  }

  const handleCopyContent = async () => {
    if (!currentTab) return

    try {
      await navigator.clipboard.writeText(currentTab.content || '')
      setCopiedMessage(true)
      setTimeout(() => {
        setCopiedMessage(false)
      }, 2000)
      setShowArtifactMenu(false)
    } catch (err) {
      console.error('Failed to copy content:', err)
    }
  }

  const handlePublishToggle = (tabId, isPublished) => {
    setTabPublishStates((prev) => ({
      ...prev,
      [tabId]: isPublished,
    }))

    // Show notification
    setNotificationIsPublished(isPublished)
    setShowNotification(true)

    // In a real app, this would call an API to update the publish state
    // await api.updateTabPublishState(tabId, isPublished)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    try {
      const data = e.dataTransfer.getData('application/json')
      if (data) {
        const document = JSON.parse(data)
        if (document.type === 'document' && onAddDocument) {
          // Add document as new tab
          onAddDocument(document)
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
  }

  const renderFilePreview = () => {
    if (!currentTab) {
      return <p style={{ padding: '2rem', color: '#888' }}>*No content to display...*</p>
    }

    const fileType = currentTab.fileType || 'file/md'
    const content = currentTab.content || ''

    // PDF files
    if (fileType === 'application/pdf' || fileType === 'file/pdf') {
      return (
        <iframe
          src={content || currentTab.filePath}
          className="file-preview-iframe"
          title={currentTab.title}
        />
      )
    }

    // HTML files
    if (fileType === 'text/html' || fileType === 'file/html' || fileType === 'file/htm') {
      return (
        <iframe
          srcDoc={content}
          className="file-preview-iframe"
          title={currentTab.title}
          sandbox="allow-same-origin"
        />
      )
    }

    // Image files
    if (
      fileType?.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileType?.split('/')[1])
    ) {
      return (
        <div className="file-preview-image-container">
          <img
            src={content || currentTab.filePath}
            alt={currentTab.title}
            className="file-preview-image"
          />
        </div>
      )
    }

    // CSV files
    if (fileType === 'text/csv' || fileType === 'file/csv') {
      try {
        const rows = content.split('\n').map((row) => row.split(','))
        return (
          <div className="file-preview-csv">
            <table className="csv-table">
              <thead>
                <tr>
                  {rows[0]?.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      } catch (error) {
        return <pre className="file-preview-text">{content}</pre>
      }
    }

    // Code files (JSON, JavaScript, Python, etc.)
    const codeExtensions = [
      'json',
      'js',
      'jsx',
      'ts',
      'tsx',
      'py',
      'java',
      'cpp',
      'c',
      'css',
      'scss',
      'xml',
      'yaml',
      'yml',
    ]
    const extension = fileType?.split('/')[1]
    if (codeExtensions.includes(extension)) {
      return (
        <pre className="file-preview-code">
          <code>{content || '*No content*'}</code>
        </pre>
      )
    }

    // Markdown files (default)
    if (
      fileType === 'text/markdown' ||
      fileType === 'file/md' ||
      fileType === 'file/markdown' ||
      !fileType
    ) {
      return (
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} rehypePlugins={[rehypeHighlight]}>
          {content || '*Markdown content will appear here...*'}
        </ReactMarkdown>
      )
    }

    // Plain text fallback
    return <pre className="file-preview-text">{content || '*No content*'}</pre>
  }

  return (
    <div className="scratchpad" onDragOver={handleDragOver} onDrop={handleDrop}>
      {/* Header */}
      <div className="scratchpad-header">
        <div className="scratchpad-title-section">
          <h2>Dione Workspaces</h2>
          <span className="scratchpad-subtitle">
            An AI driven operational platform by Eisuke Izawa.
          </span>
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
                  initial={isNewTab ? newTabVariants.initial : false}
                  animate={isNewTab ? newTabVariants.animate : { opacity: 1, y: 0, scale: 1 }}
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
                      <span className="tab-title" onDoubleClick={() => handleTabDoubleClick(tab)}>
                        {tab.title}
                      </span>
                      {tabs.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCloseTab(tab.id)
                          }}
                          title="Close"
                        >
                          ×
                        </Button>
                      )}
                    </>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
        <motion.div
          variants={plusButtonVariants}
          initial="normal"
          animate={shouldAnimateNewTabBtn ? 'animate' : 'normal'}
          onAnimationComplete={() => setShouldAnimateNewTabBtn(false)}
        >
          <Button
            variant="surface"
            size="md"
            onClick={() => {
              setShouldAnimateNewTabBtn(true)
              onNewTab()
            }}
            title="New Tab"
            animated={false}
            className="new-tab-button"
          >
            +
          </Button>
        </motion.div>
      </div>

      {/* Editor / Preview */}
      <div className="scratchpad-content" ref={editorRef}>
        {/* Version Control Inside Content */}
        <div className="version-control-inline">
          <Button
            variant="ghost"
            size="md"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo"
          >
            <FiRotateCcw size={18} />
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo"
          >
            <FiRotateCw size={18} />
          </Button>
          {/* Artifact Menu Dropdown */}
          <div className="artifact-menu-wrapper" ref={artifactMenuRef}>
            <Button
              variant="surface"
              size="md"
              onClick={(e) => {
                e.stopPropagation()
                setShowArtifactMenu(!showArtifactMenu)
              }}
              title="アーティファクトメニュー"
              animated={false}
            >
              <FiMoreVertical size={18} />
            </Button>

            <AnimatePresence>
              {showArtifactMenu && (
                <motion.div
                  className="artifact-menu"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <button
                    className="artifact-menu-item"
                    onClick={handleDownload}
                    type="button"
                  >
                    <FiDownload size={16} />
                    <span>ダウンロード</span>
                  </button>
                  <button
                    className="artifact-menu-item"
                    onClick={handleCopyContent}
                    type="button"
                  >
                    <FiCopy size={16} />
                    <span>{copiedMessage ? 'Copied' : 'Copy'}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {isPreviewMode ? (
          <div
            className="scratchpad-preview"
            ref={previewRef}
            onContextMenu={handleEditorContextMenu}
          >
            {/* Scroll Progress Indicator */}
            <motion.div
              className="scroll-progress-indicator"
              style={{
                scaleX: scrollYProgress,
              }}
            />
            {renderFilePreview()}
          </div>
        ) : (
          <textarea
            className="scratchpad-editor"
            value={currentTab?.content || ''}
            onChange={handleEditorChange}
            onContextMenu={handleEditorContextMenu}
            placeholder="Dione generates content here..."
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
                top: `${controllerPosition.y}px`,
              }}
            >
              {/* Center Button */}
              <Button
                variant="circular-center"
                onClick={handleToggleMode}
                title={isPreviewMode ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
                className="controller-center"
              >
                {isPreviewMode ? <FiEdit2 size={18} /> : <FiEye size={18} />}
              </Button>

              {/* Directional Buttons */}
              <Button
                variant="circular"
                onClick={() => handleDirectionAction('top')}
                title="Dione"
                className="controller-button controller-top"
              >
                <img
                  src="/sample_assets/dione/Dione-logo.png"
                  alt="Dione"
                  className="dione-logo-button"
                />
              </Button>
              <Button
                variant="circular"
                onClick={() => handleDirectionAction('right')}
                title="Right"
                className="controller-button controller-right"
              >
                <FiChevronRight size={24} />
              </Button>
              <Button
                variant="circular"
                onClick={() => handleDirectionAction('bottom')}
                title="Attach Document"
                className="controller-button controller-bottom"
              >
                <FiPaperclip size={24} />
              </Button>
              <Button
                variant="circular"
                onClick={() => handleDirectionAction('left')}
                title="Left"
                className="controller-button controller-left"
              >
                <FiChevronLeft size={24} />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Stats Panel */}
      <StatsPanel
        content={currentTab?.content || ''}
        isPublished={tabPublishStates[currentTabId] || false}
        onPublishToggle={handlePublishToggle}
        tabId={currentTabId}
      />

      {/* Publish Notification */}
      <PublishNotification
        isOpen={showNotification}
        isPublished={notificationIsPublished}
        tabId={currentTabId}
        onClose={() => setShowNotification(false)}
      />

      {/* Attachment Notification */}
      <AnimatePresence>
        {attachmentNotification && (
          <motion.div
            className="attachment-notification"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            📎 {currentTab?.title} has been added to chat
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dione Powers Screen - Opened from artifact controller */}
      {showDionePowersScreen && (
        <DionePowersScreen
          onClose={() => setShowDionePowersScreen(false)}
          theme={theme}
          currentChatHistory={null}
          currentArtifact={currentTab}
          source="artifact"
          documents={documents}
          libraries={libraries}
          scratchpadTabs={tabs}
        />
      )}
    </div>
  )
}

export default Scratchpad
