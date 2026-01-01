import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BiLinkExternal } from 'react-icons/bi'
import { FiArrowUpLeft, FiDownload } from 'react-icons/fi'
import { getFileIcon } from '../utils/fileTypeDetector'
import FilePreview from './FilePreview'
import Button from './ui/Button'
import './DocumentPanel.css'

function DocumentPanel({
  documents,
  libraries,
  onUploadLibrary,
  onDeleteLibrary,
  onDeleteDocument,
  onAddToScratchpad,
}) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [prevDocCount, setPrevDocCount] = useState(0)
  const [animatingDocId, setAnimatingDocId] = useState(null)
  const [pendingDocId, setPendingDocId] = useState(null)
  const [prevLibCount, setPrevLibCount] = useState(0)
  const [animatingLibId, setAnimatingLibId] = useState(null)
  const [pendingLibId, setPendingLibId] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      onUploadLibrary(file)
    }
  }

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
    setSelectedItem(null)
  }

  const handleAddToScratchpad = (item) => {
    if (onAddToScratchpad) {
      // Detect file type from name extension or tags
      const fileExtension = item.name.split('.').pop()?.toLowerCase()
      const fileType = item.tags?.fileType || `file/${fileExtension}`

      onAddToScratchpad({
        title: item.name,
        content: item.content || '',
        fileType: fileType,
        fileName: item.name,
        filePath: item.filePath,
      })
    }
  }

  const handleDragStart = (e, item) => {
    e.dataTransfer.effectAllowed = 'copy'
    const fileExtension = item.name.split('.').pop()?.toLowerCase()
    const fileType = item.tags?.fileType || `file/${fileExtension}`

    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        type: 'document',
        title: item.name,
        content: item.content || '',
        fileType: fileType,
        fileName: item.name,
        filePath: item.filePath,
      })
    )
  }

  // Detect new documents and libraries
  const newDocId =
    documents.length > prevDocCount && !animatingDocId
      ? documents[documents.length - 1]?.id
      : animatingDocId
  const newLibId =
    libraries.length > prevLibCount && !animatingLibId
      ? libraries[libraries.length - 1]?.id
      : animatingLibId

  // Animation variants for new items
  const newItemVariants = {
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
        opacity: { type: 'tween', duration: 0.25, ease: 'easeOut' },
        y: { type: 'tween', duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
        scale: { type: 'tween', duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
        boxShadow: { duration: 0.5, delay: 0.1, times: [0, 0.3, 0.7, 1], ease: 'easeOut' },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      y: -20,
      transition: {
        opacity: { type: 'tween', duration: 0.4, ease: 'easeOut' },
        scale: { type: 'tween', duration: 0.4, ease: 'easeOut' },
        y: { type: 'tween', duration: 0.4, ease: 'easeOut' },
      },
    },
  }

  // Handle new documents - queue them if animation is running
  useEffect(() => {
    if (documents.length > prevDocCount) {
      const newDocId = documents[documents.length - 1]?.id

      if (!animatingDocId) {
        // No animation running, start immediately
        setAnimatingDocId(newDocId)
        setPendingDocId(null)
      } else {
        // Animation running, queue this for later
        setPendingDocId(newDocId)
      }

      setPrevDocCount(documents.length)
    } else if (documents.length < prevDocCount) {
      // Document deleted
      setPrevDocCount(documents.length)
      setAnimatingDocId(null)
      setPendingDocId(null)
    }
  }, [documents.length])

  // When current document animation finishes, start pending animation
  useEffect(() => {
    if (!animatingDocId) return

    const timer = setTimeout(() => {
      if (pendingDocId) {
        // Start animating the pending document
        setAnimatingDocId(pendingDocId)
        setPendingDocId(null)
      } else {
        // No pending, just clear
        setAnimatingDocId(null)
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [animatingDocId, pendingDocId])

  // Handle new libraries - queue them if animation is running
  useEffect(() => {
    if (libraries.length > prevLibCount) {
      const newLibId = libraries[libraries.length - 1]?.id

      if (!animatingLibId) {
        // No animation running, start immediately
        setAnimatingLibId(newLibId)
        setPendingLibId(null)
      } else {
        // Animation running, queue this for later
        setPendingLibId(newLibId)
      }

      setPrevLibCount(libraries.length)
    } else if (libraries.length < prevLibCount) {
      // Library deleted
      setPrevLibCount(libraries.length)
      setAnimatingLibId(null)
      setPendingLibId(null)
    }
  }, [libraries.length])

  // When current library animation finishes, start pending animation
  useEffect(() => {
    if (!animatingLibId) return

    const timer = setTimeout(() => {
      if (pendingLibId) {
        // Start animating the pending library
        setAnimatingLibId(pendingLibId)
        setPendingLibId(null)
      } else {
        // No pending, just clear
        setAnimatingLibId(null)
      }
    }, 30)

    return () => clearTimeout(timer)
  }, [animatingLibId, pendingLibId])

  return (
    <div className="document-panel">
      <div className="panel-header">
        <h2>Library</h2>
        <a
          href="https://portal.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="portal-link"
          title="Go to Portal"
        >
          <BiLinkExternal />
        </a>
      </div>

      <div className="document-content">
        {/* Dione Knowledge */}
        <div className="document-section">
          <div className="list-header">
            <h3>Dione Knowledge</h3>
          </div>
          <motion.div className="document-list">
            <AnimatePresence>
              {documents.map((doc) => {
                const IconComponent = getFileIcon(doc.name)
                const isNewDoc = doc.id === newDocId
                return (
                  <motion.div
                    key={doc.id}
                    className="document-item"
                    initial={isNewDoc ? newItemVariants.initial : false}
                    animate={isNewDoc ? newItemVariants.animate : { opacity: 1, y: 0, scale: 1 }}
                    exit={newItemVariants.exit}
                    draggable
                    onDragStart={(e) => handleDragStart(e, doc)}
                  >
                    <div className="document-item-main">
                      <div className="document-item-content" onClick={() => handleItemClick(doc)}>
                        <span className="document-icon">
                          <IconComponent />
                        </span>
                        <span className="document-name">{doc.name}</span>
                      </div>
                      <div className="document-actions">
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddToScratchpad(doc)
                          }}
                          title="Add to Dione Workspace"
                        >
                          <FiArrowUpLeft size={16} />
                        </Button>
                        <Button
                          variant="icon"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Download functionality
                            const blob = new Blob([doc.content || ''], { type: 'text/plain' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = doc.name
                            document.body.appendChild(a)
                            a.click()
                            document.body.removeChild(a)
                            URL.revokeObjectURL(url)
                          }}
                          title="Download"
                        >
                          <FiDownload size={18} />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteDocument(doc.id)
                          }}
                          title="Delete"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                    <div className="document-item-details">
                      {doc.filePath && (
                        <div className="document-filepath">
                          <span className="detail-label">Path:</span> {doc.filePath}
                        </div>
                      )}
                      {doc.tags && Object.keys(doc.tags).length > 0 && (
                        <div className="document-tags">
                          {Object.entries(doc.tags).map(([key, value]) => (
                            <span key={key} className="tag">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Uploaded Documents */}
        <div className="document-section library-section-wrapper">
          <div className="list-header">
            <h3>Uploaded Documents</h3>
          </div>
          <motion.div className="library-list">
            <AnimatePresence>
              {libraries.map((lib) => {
                const IconComponent = getFileIcon(lib.name)
                const isNewLib = lib.id === newLibId
                return (
                  <motion.div
                    key={lib.id}
                    className="library-item"
                    initial={isNewLib ? newItemVariants.initial : false}
                    animate={isNewLib ? newItemVariants.animate : { opacity: 1, y: 0, scale: 1 }}
                    exit={newItemVariants.exit}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lib)}
                  >
                    <div className="library-item-content" onClick={() => handleItemClick(lib)}>
                      <span className="library-icon">
                        <IconComponent />
                      </span>
                      <span className="library-name">{lib.name}</span>
                    </div>
                    <div className="library-item-actions">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToScratchpad(lib)
                        }}
                        title="Add to Dione Workspace"
                      >
                        <FiArrowUpLeft size={16} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteLibrary(lib.id)
                        }}
                        title="Delete"
                      >
                        ×
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            <label
              className="upload-button-bottom"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
              <Button
                variant="upload"
                size="lg"
                onClick={(e) =>
                  e.target.closest('label').querySelector('input[type="file"]').click()
                }
                style={{ width: '100%' }}
              >
                +
              </Button>
            </label>
          </motion.div>
        </div>
      </div>

      {showPreview && selectedItem && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{selectedItem.name}</h3>
              <Button variant="ghost" size="sm" onClick={closePreview}>
                ×
              </Button>
            </div>
            <div className="preview-body">
              <FilePreview item={selectedItem} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentPanel
