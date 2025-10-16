import { useState } from 'react'
import './DocumentPanel.css'

function DocumentPanel({ documents, libraries, onUploadLibrary }) {
  const [activeTab, setActiveTab] = useState('documents')
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
      <div className="document-tabs">
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          ドキュメント
        </button>
        <button
          className={`tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          ライブラリ
        </button>
      </div>

      <div className="document-content">
        {activeTab === 'documents' && (
          <div className="document-list">
            <div className="list-header">
              <h3>ベクトル検索で収集</h3>
            </div>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="document-item"
                onClick={() => handleItemClick(doc)}
              >
                <span className="document-icon">📄</span>
                <span className="document-name">{doc.name}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="library-list">
            <div className="list-header">
              <h3>アップロードしたファイル</h3>
              <label className="upload-button">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                + アップロード
              </label>
            </div>
            {libraries.map((lib) => (
              <div
                key={lib.id}
                className="library-item"
                onClick={() => handleItemClick(lib)}
              >
                <span className="library-icon">📚</span>
                <span className="library-name">{lib.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPreview && selectedItem && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>{selectedItem.name}</h3>
              <button className="close-button" onClick={closePreview}>×</button>
            </div>
            <div className="preview-body">
              <pre>{selectedItem.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentPanel
