import { useState } from 'react'
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

  return (
    <div className="document-panel">
      <div className="panel-header">
        <h2>ライブラリ</h2>
      </div>

      <div className="document-content">
        {/* 関連するアプリ登録ドキュメント */}
        <div className="document-section">
          <div className="list-header">
            <h3>関連するアプリ登録ドキュメント</h3>
          </div>
          <div className="document-list">
            {documents.map((doc) => {
              const IconComponent = getFileIcon(doc.name)
              return (
                <div
                  key={doc.id}
                  className="document-item"
                >
                  <div className="document-item-main">
                    <div className="document-item-content" onClick={() => handleItemClick(doc)}>
                      <span className="document-icon">
                        <IconComponent />
                      </span>
                      <span className="document-name">{doc.name}</span>
                    </div>
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
                </div>
              )
            })}
          </div>
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
          <div className="library-list">
            {libraries.map((lib) => {
              const IconComponent = getFileIcon(lib.name)
              return (
                <div
                  key={lib.id}
                  className="library-item"
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
                </div>
              )
            })}
          </div>
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
