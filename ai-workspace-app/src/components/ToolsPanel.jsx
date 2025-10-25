import { useState } from 'react'
import { FiSearch, FiToggleLeft, FiToggleRight, FiSettings, FiTrash2, FiPlus } from 'react-icons/fi'
import Button from './ui/Button'
import './ToolsPanel.css'

function ToolsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedToolConfig, setSelectedToolConfig] = useState(null)
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Google Search',
      description: 'Google検索APIを使用したWeb検索',
      category: '検索',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 2,
      name: 'Bing Search',
      description: 'Bing Search APIを使用したWeb検索',
      category: '検索',
      enabled: true,
      type: 'builtin',
    },
    {
      id: 3,
      name: 'Amazon S3',
      description: 'AWS S3バケットへのアクセスとファイル操作',
      category: 'クラウドストレージ',
      enabled: false,
      type: 'addon',
    },
    {
      id: 4,
      name: 'BigQuery',
      description: 'Google BigQueryへの接続とデータ分析',
      category: 'データベース',
      enabled: false,
      type: 'addon',
    },
  ])
  const [activeTab, setActiveTab] = useState('list')

  const categories = ['すべて', ...new Set(tools.map((t) => t.category))]
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = []
    }
    acc[tool.category].push(tool)
    return acc
  }, {})

  const handleToggleTool = (toolId) => {
    setTools(tools.map((t) => (t.id === toolId ? { ...t, enabled: !t.enabled } : t)))
  }

  const handleDeleteTool = (toolId) => {
    setTools(tools.filter((t) => t.id !== toolId))
  }

  return (
    <div className="tools-panel">
      {activeTab === 'list' && (
        <>
          {/* Search Bar */}
          <div className="tools-search">
            <FiSearch size={20} />
            <input
              type="text"
              placeholder="ツールを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="tools-search-input"
            />
          </div>

          {/* Tools List */}
          <div className="tools-list">
            {Object.entries(groupedTools).length === 0 ? (
              <div className="tools-empty">
                <p>ツールが見つかりません</p>
              </div>
            ) : (
              Object.entries(groupedTools).map(([category, categoryTools]) => (
                <div key={category} className="tools-category">
                  <h3 className="tools-category-title">{category}</h3>
                  <div className="tools-category-items">
                    {categoryTools.map((tool) => (
                      <div key={tool.id} className="tool-item">
                        <div className="tool-item-content">
                          <h4 className="tool-name">{tool.name}</h4>
                          <p className="tool-description">{tool.description}</p>
                          {tool.type === 'addon' && <span className="tool-badge">アドオン</span>}
                        </div>
                        <div className="tool-actions">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTool(tool.id)}
                            title={tool.enabled ? '無効にする' : '有効にする'}
                            animated={false}
                          >
                            {tool.enabled ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="設定"
                            onClick={() => setSelectedToolConfig(tool)}
                            animated={false}
                          >
                            <FiSettings size={24} />
                          </Button>
                          {tool.type === 'addon' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTool(tool.id)}
                              title="削除"
                              animated={false}
                            >
                              <FiTrash2 size={24} />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'add' && (
        <div className="tools-add-form">
          <h3>新しいツールを追加</h3>
          <form>
            <div className="form-group">
              <label>ツール名</label>
              <input type="text" placeholder="例: My API Tool" />
            </div>
            <div className="form-group">
              <label>説明</label>
              <textarea placeholder="ツールの説明を入力してください..." rows="4" />
            </div>
            <div className="form-group">
              <label>ツールタイプ</label>
              <select>
                <option>API</option>
                <option>データベース</option>
                <option>MCP</option>
                <option>その他</option>
              </select>
            </div>
            <div className="form-actions">
              <Button variant="primary">ツールを追加</Button>
            </div>
          </form>
        </div>
      )}

      {selectedToolConfig && (
        <div className="tool-config-modal-overlay" onClick={() => setSelectedToolConfig(null)}>
          <div className="tool-config-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tool-config-header">
              <h3>{selectedToolConfig.name} - 設定</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedToolConfig(null)} animated={false}>
                ×
              </Button>
            </div>
            <div className="tool-config-content">
              <div className="config-section">
                <h4>基本設定</h4>
                <div className="form-group">
                  <label>有効/無効</label>
                  <div className="config-toggle">
                    <input
                      type="checkbox"
                      defaultChecked={selectedToolConfig.enabled}
                      onChange={(e) => {
                        setTools(
                          tools.map((t) =>
                            t.id === selectedToolConfig.id ? { ...t, enabled: e.target.checked } : t
                          )
                        )
                        setSelectedToolConfig({ ...selectedToolConfig, enabled: e.target.checked })
                      }}
                    />
                    <span>{selectedToolConfig.enabled ? '有効' : '無効'}</span>
                  </div>
                </div>
              </div>

              <div className="config-section">
                <h4>詳細設定</h4>
                <div className="form-group">
                  <label>APIキー（例）</label>
                  <input type="password" placeholder="APIキーを入力..." />
                </div>
                <div className="form-group">
                  <label>タイムアウト（秒）</label>
                  <input type="number" placeholder="30" defaultValue="30" />
                </div>
              </div>

              <div className="config-actions">
                <Button
                  variant="primary"
                  onClick={() => {
                    setTools(tools.map((t) => (t.id === selectedToolConfig.id ? selectedToolConfig : t)))
                    setSelectedToolConfig(null)
                  }}
                >
                  保存
                </Button>
                <Button variant="ghost" onClick={() => setSelectedToolConfig(null)} animated={false}>
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ToolsPanel
