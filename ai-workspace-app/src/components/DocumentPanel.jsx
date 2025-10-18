import { useState } from 'react'
import { motion } from 'framer-motion'
import { BiLinkExternal } from 'react-icons/bi'
import { FiDownload } from 'react-icons/fi'
import FilePreview from './FilePreview'
import { getFileIcon } from '../utils/fileTypeDetector'
import './DocumentPanel.css'

function DocumentPanel({ documents, libraries, onUploadLibrary, onDeleteLibrary, onDeleteDocument }) {
  const [selectedItem, setSelectedItem] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <div className="document-panel">
      <div className="panel-header">
        <h2>ライブラリ</h2>
        <a
          href="https://portal.example.com"
          target="_blank"
          rel="noopener noreferrer"
          className="portal-link"
          title="Portalへ移動"
        >
          <BiLinkExternal />
        </a>
      </div>

      <div className="document-content">
        {/* Dioneナレッジ */}
        <div className="document-section">
          <div className="list-header">
            <h3>Dioneナレッジ</h3>
          </div>
          <motion.div
            className="document-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {documents.map((doc) => {
              const IconComponent = getFileIcon(doc.name)
              return (
                <motion.div
                  key={doc.id}
                  className="document-item"
                  variants={itemVariants}
                >
                  <div className="document-item-main">
                    <div className="document-item-content" onClick={() => handleItemClick(doc)}>
                      <span className="document-icon">
                        <IconComponent />
                      </span>
                      <span className="document-name">{doc.name}</span>
                    </div>
                    <div className="document-actions">
                      <button
                        className="document-download-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          // ダウンロード機能
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
                        title="ダウンロード"
                      >
                        <FiDownload size={18} />
                      </button>
                      <button
                        className="document-delete-button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteDocument(doc.id)
                        }}
                        title="削除"
                      >
                        ×
                      </button>
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
          </motion.div>
        </div>

        {/* アップロードしたドキュメント */}
        <div className="document-section">
          <div className="list-header">
            <h3>アップロードしたドキュメント</h3>
            <label className="upload-button">
              <input
                type="file"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              + アップロード
            </label>
          </div>
          <motion.div
            className="library-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {libraries.map((lib) => {
              const IconComponent = getFileIcon(lib.name)
              return (
                <motion.div
                  key={lib.id}
                  className="library-item"
                  variants={itemVariants}
                >
                  <div className="library-item-content" onClick={() => handleItemClick(lib)}>
                    <span className="library-icon">
                      <IconComponent />
                    </span>
                    <span className="library-name">{lib.name}</span>
                  </div>
                  <button
                    className="library-delete-button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLibrary(lib.id)
                    }}
                    title="削除"
                  >
                    ×
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {showPreview && selectedItem && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{selectedItem.name}</h3>
              <button className="close-button" onClick={closePreview}>×</button>
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
